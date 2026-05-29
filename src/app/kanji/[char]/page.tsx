import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { MnemonicEditor } from "@/components/kanji/MnemonicEditor";
import { InQueueBadge } from "@/components/InQueueBadge";
import { BackButton } from "@/components/BackButton";
import { Furigana } from "@/components/Furigana";
import { createCardIfMissing } from "@/lib/srs/queue";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function KanjiDetail({ params }: { params: Promise<{ char: string }> }) {
  const { char: encoded } = await params;
  const char = decodeURIComponent(encoded);
  const t = await getT();
  const locale = await getLocale();
  const kanji = await db.kanji.findUnique({
    where: { character: char },
    include: {
      radicals: { include: { radical: true } },
      vocabulary: {
        include: { vocabulary: true },
      },
    },
  });
  if (!kanji) notFound();

  const cardBefore = await db.srsCard.findUnique({
    where: { itemType_itemId: { itemType: "kanji", itemId: kanji.id } },
  });
  const isNew = !cardBefore;
  await createCardIfMissing("kanji", kanji.id);

  const meanings = JSON.parse(pickL(locale, kanji.meanings, kanji.meaningsUk)) as string[];
  const onAll = (JSON.parse(kanji.onReadings) as string[]).filter(Boolean);
  const kunAll = (JSON.parse(kanji.kunReadings) as string[]).filter(Boolean);
  const onTop = onAll.slice(0, 2);
  const onRest = onAll.slice(2);
  const kunTop = kunAll.slice(0, 2);
  const kunRest = kunAll.slice(2);

  // Popular combinations — sort by lower JLPT level (more common) then id
  const combos = kanji.vocabulary
    .map((v) => v.vocabulary)
    .sort((a, b) => b.jlptLevel - a.jlptLevel || a.id - b.id)
    .slice(0, 8);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton label={t("common.back")} />

      {/* Hero — large kanji + meanings + readings + combos preview */}
      <section className="border border-border bg-surface">
        <div className="tri-band" />
        <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr]">
          <div className="flex flex-col items-center justify-center py-6 px-4 bg-vermilion text-white border-r border-border">
            <div className="jp serif text-8xl leading-none font-bold">{kanji.character}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] mt-3 text-white/85">
              N{kanji.jlptLevel} · {kanji.strokeCount || "?"} {locale === "uk" ? "рисок" : "strokes"}
            </div>
          </div>
          <div className="p-5 sm:p-6 space-y-4">
            {/* Meanings */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-1">
                {locale === "uk" ? "Значення" : "Meanings"}
              </div>
              <h1 className="serif text-3xl font-bold leading-tight">{meanings.slice(0, 3).join(" · ")}</h1>
              {meanings.length > 3 && (
                <div className="text-sm text-muted mt-1">+ {meanings.slice(3).join(", ")}</div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ReadingBlock label={t("kanji.on_readings")} primary={onTop} rest={onRest} color="indigo" />
              <ReadingBlock label={t("kanji.kun_readings")} primary={kunTop} rest={kunRest} color="pine" />
            </div>

            <InQueueBadge added={isNew} addedLabel={t("common.added_to_deck")} inDeckLabel={t("common.in_your_deck")} />
          </div>
        </div>
      </section>

      {/* Popular combinations */}
      {combos.length > 0 && (
        <section className="border border-border bg-surface">
          <div className="dot-band" />
          <div className="px-5 sm:px-6 pt-5 pb-3 flex items-center justify-between border-b border-border">
            <h2 className="serif text-xl font-bold">
              {locale === "uk" ? "Популярні поєднання" : "Popular combinations"}
            </h2>
            <span className="text-xs text-muted tabular-nums">{combos.length}</span>
          </div>
          <ul className="divide-y divide-border-soft">
            {combos.map((v) => {
              const m = JSON.parse(pickL(locale, v.meanings, v.meaningsUk)) as string[];
              return (
                <li key={v.id}>
                  <Link href={`/vocabulary/${v.id}`} className="flex items-center gap-4 px-5 sm:px-6 py-3 hover:bg-vermilion-soft transition-colors">
                    <Furigana word={v.word} reading={v.reading} size="lg" className="text-xl font-medium shrink-0" />
                    <span className="text-sm text-muted flex-1 truncate">{m.join(", ")}</span>
                    <span className="text-[9px] uppercase tracking-[0.15em] font-bold bg-foreground text-background px-1.5 py-0.5">
                      N{v.jlptLevel}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* Radicals */}
      {kanji.radicals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("kanji.radicals")}</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {kanji.radicals.map((r) => (
                <div key={r.radicalId} className="px-3 py-1.5 bg-indigo-soft text-sm">
                  <span className="jp font-bold mr-1.5">{r.radical.character}</span>
                  <span className="text-muted text-xs">{pickL(locale, r.radical.meaning, r.radical.meaningUk)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Mnemonic */}
      <Card>
        <CardHeader>
          <CardTitle>{t("kanji.mnemonic")}</CardTitle>
        </CardHeader>
        <CardBody>
          <MnemonicEditor kanjiId={kanji.id} initial={pickL(locale, kanji.mnemonic, kanji.mnemonicUk) ?? ""} />
        </CardBody>
      </Card>
    </div>
  );
}

function ReadingBlock({
  label,
  primary,
  rest,
  color,
}: {
  label: string;
  primary: string[];
  rest: string[];
  color: "indigo" | "pine";
}) {
  const txt = color === "indigo" ? "text-indigo" : "text-pine";
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-1.5">{label}</div>
      {primary.length === 0 ? (
        <div className="jp text-muted">—</div>
      ) : (
        <div className="space-y-0.5">
          {primary.map((r, i) => (
            <div key={i} className={`jp serif text-xl font-bold leading-tight ${txt}`}>{r}</div>
          ))}
          {rest.length > 0 && (
            <div className="jp text-xs text-muted mt-1">+ {rest.join("、 ")}</div>
          )}
        </div>
      )}
    </div>
  );
}
