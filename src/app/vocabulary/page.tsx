import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { Furigana } from "@/components/Furigana";
import { getCurrentLevel } from "@/lib/level";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";
import type { StringKey } from "@/lib/i18n";
import { Check, Clock, Languages, Activity, Tag, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/PageHeader";

export const dynamic = "force-dynamic";

type Cat = "all" | "latest" | "nouns" | "verbs" | "adjectives" | "other";

const CATEGORIES: { key: Cat; tkey: StringKey; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "all", tkey: "vocab.cat.all", icon: Tag },
  { key: "latest", tkey: "vocab.cat.latest", icon: Clock },
  { key: "nouns", tkey: "vocab.cat.nouns", icon: Languages },
  { key: "verbs", tkey: "vocab.cat.verbs", icon: Activity },
  { key: "adjectives", tkey: "vocab.cat.adjectives", icon: Tag },
  { key: "other", tkey: "vocab.cat.other", icon: MoreHorizontal },
];

function classify(posList: string[]): Cat {
  const joined = posList.join(" ").toLowerCase();
  if (joined.includes("verb")) return "verbs";
  if (joined.includes("adjective")) return "adjectives";
  if (joined.includes("noun")) return "nouns";
  return "other";
}

function isValidCat(s: string | undefined): s is Cat {
  return ["all", "latest", "nouns", "verbs", "adjectives", "other"].includes(s ?? "");
}

export default async function VocabPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const sp = await searchParams;
  const cat: Cat = isValidCat(sp.cat) ? sp.cat : "all";
  const level = await getCurrentLevel();
  const t = await getT();
  const locale = await getLocale();

  // Fetch all level words first; we'll filter / sort in memory (volume is small).
  const all = await db.vocabulary.findMany({
    where: { jlptLevel: level },
    orderBy: cat === "latest" ? { createdAt: "desc" } : { id: "asc" },
    take: cat === "latest" ? 60 : 500,
  });

  const filtered = all.filter((w) => {
    if (cat === "all" || cat === "latest") return true;
    const pos = JSON.parse(w.partOfSpeech) as string[];
    return classify(pos) === cat;
  });

  // Counts per category for the tab labels (across the entire level).
  const counts = await computeCounts(level);

  const inQueue = await db.srsCard.findMany({
    where: { itemType: "vocab", itemId: { in: filtered.map((w) => w.id) } },
    select: { itemId: true, state: true },
  });
  const queueMap = new Map(inQueue.map((c) => [c.itemId, c.state]));

  return (
    <div className="space-y-4">
      <PageHeader kanji="語" eyebrow={`N${level}`} title={t("vocab.title")} />
      <p className="text-sm text-muted -mt-2">{t("vocab.summary", { level, shown: filtered.length, total: counts.all })}</p>

      <div className="flex items-center gap-1 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((c) => {
          const Icon = c.icon;
          const count = counts[c.key];
          const active = cat === c.key;
          return (
            <Link
              key={c.key}
              href={c.key === "all" ? "/vocabulary" : `/vocabulary?cat=${c.key}`}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 h-9 rounded-md text-sm font-medium border whitespace-nowrap transition-colors",
                active
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-background text-muted hover:text-foreground hover:border-primary"
              )}
            >
              <Icon className="w-4 h-4" />
              {t(c.tkey)}
              <span className={cn("text-xs font-mono", active ? "text-primary/80" : "text-muted")}>
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            {t("vocab.empty_cat", { level })}
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((w) => {
            const state = queueMap.get(w.id);
            const stateColor =
              state === "review"
                ? "bg-emerald-100 text-emerald-700"
                : state === "learning"
                ? "bg-amber-100 text-amber-700"
                : "bg-primary-soft text-primary";
            const stateLabel = state === "review" ? t("common.learned") : state === "learning" ? t("common.learning") : t("common.in_deck");
            return (
              <Link key={w.id} href={`/vocabulary/${w.id}`}>
                <Card className="h-full hover:border-primary transition-colors relative">
                  {state && (
                    <span
                      className={
                        "absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide font-medium " +
                        stateColor
                      }
                    >
                      <Check className="w-2.5 h-2.5" />
                      {stateLabel}
                    </span>
                  )}
                  <CardBody className="flex flex-col gap-2 py-4 min-h-[112px]">
                    <Furigana
                      word={w.word}
                      reading={w.reading}
                      size="lg"
                      className="text-xl font-medium leading-tight"
                    />
                    <div className="text-sm text-muted line-clamp-2 mt-auto">
                      {(JSON.parse(pickL(locale, w.meanings, w.meaningsUk)) as string[]).join(", ")}
                    </div>
                  </CardBody>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

async function computeCounts(jlptLevel: number): Promise<Record<Cat, number>> {
  const all = await db.vocabulary.findMany({
    where: { jlptLevel },
    select: { partOfSpeech: true },
  });
  const counts: Record<Cat, number> = { all: all.length, latest: Math.min(all.length, 60), nouns: 0, verbs: 0, adjectives: 0, other: 0 };
  for (const w of all) {
    const pos = JSON.parse(w.partOfSpeech) as string[];
    counts[classify(pos)]++;
  }
  return counts;
}
