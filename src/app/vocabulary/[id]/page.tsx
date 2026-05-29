import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createCardIfMissing } from "@/lib/srs/queue";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Furigana } from "@/components/Furigana";
import { InQueueBadge } from "@/components/InQueueBadge";
import { BackButton } from "@/components/BackButton";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function VocabDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();

  const t = await getT();
  const locale = await getLocale();
  const word = await db.vocabulary.findUnique({
    where: { id },
    include: {
      kanji: { include: { kanji: true } },
      examples: { include: { example: true }, take: 8 },
    },
  });
  if (!word) notFound();

  const cardBefore = await db.srsCard.findUnique({
    where: { itemType_itemId: { itemType: "vocab", itemId: id } },
  });
  const isNew = !cardBefore;
  await createCardIfMissing("vocab", id);

  const meanings = JSON.parse(pickL(locale, word.meanings, word.meaningsUk)) as string[];
  const pos = JSON.parse(pickL(locale, word.partOfSpeech, word.partOfSpeechUk)) as string[];

  // Related vocabulary: other words sharing any of the same kanji, excluding this one.
  const usedKanjiIds = word.kanji.map((k) => k.kanjiId);
  const related = usedKanjiIds.length
    ? await db.vocabulary.findMany({
        where: {
          id: { not: word.id },
          kanji: { some: { kanjiId: { in: usedKanjiIds } } },
        },
        take: 6,
      })
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton label={t("common.back")} />

      {/* Hero — word + reading + meta */}
      <section className="border border-border bg-surface">
        <div className="tri-band" />
        <div className="p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-bold">
            <span className="bg-foreground text-background px-1.5 py-0.5">N{word.jlptLevel}</span>
            {word.source && <span className="text-muted">{word.source}</span>}
            {pos.length > 0 && <span className="text-muted">· {pos.join(", ")}</span>}
          </div>
          <div className="flex items-start justify-between gap-3">
            <Furigana word={word.word} reading={word.reading} size="xl" className="text-6xl serif font-bold" />
            <InQueueBadge added={isNew} addedLabel={t("common.added_to_deck")} inDeckLabel={t("common.in_your_deck")} />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted mb-1">
              {locale === "uk" ? "Значення" : "Meaning"}
            </div>
            <p className="serif text-2xl leading-snug">{meanings.join(" · ")}</p>
          </div>
        </div>
      </section>

      {/* Examples */}
      {word.examples.length > 0 && (
        <section className="border border-border bg-surface">
          <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
            <h2 className="serif text-xl font-bold">{t("vocab.detail.examples")}</h2>
          </div>
          <ol className="divide-y divide-border-soft">
            {word.examples.map((e, i) => (
              <li key={e.exampleId} className="px-5 sm:px-6 py-4 flex gap-4">
                <span className="text-xs font-mono tabular-nums text-muted shrink-0 pt-1 w-6">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="jp text-lg leading-relaxed">{e.example.japanese}</div>
                  <div className="text-sm text-muted">{e.example.english}</div>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Kanji used */}
      {word.kanji.length > 0 && (
        <section className="border border-border bg-surface">
          <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
            <h2 className="serif text-xl font-bold">{t("vocab.detail.kanji_used")}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-0 divide-x divide-y divide-border-soft">
            {word.kanji.map((k) => {
              const m = JSON.parse(pickL(locale, k.kanji.meanings, k.kanji.meaningsUk)) as string[];
              const onR = (JSON.parse(k.kanji.onReadings) as string[]).slice(0, 1);
              const kunR = (JSON.parse(k.kanji.kunReadings) as string[]).slice(0, 1);
              return (
                <Link key={k.kanjiId} href={`/kanji/${encodeURIComponent(k.kanji.character)}`} className="p-4 hover:bg-vermilion-soft transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="jp serif text-4xl font-bold text-vermilion leading-none">{k.kanji.character}</span>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{m[0]}</div>
                      <div className="jp text-xs text-muted truncate">
                        {[...onR, ...kunR].filter(Boolean).join("、 ")}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Related vocabulary sharing kanji */}
      {related.length > 0 && (
        <section className="border border-border bg-surface">
          <div className="px-5 sm:px-6 pt-5 pb-3 border-b border-border">
            <h2 className="serif text-xl font-bold">
              {locale === "uk" ? "Пов'язані слова" : "Related words"}
            </h2>
            <p className="text-xs text-muted mt-1">
              {locale === "uk" ? "Інші слова з тими ж кандзі" : "Other words sharing the same kanji"}
            </p>
          </div>
          <ul className="divide-y divide-border-soft">
            {related.map((v) => {
              const m = JSON.parse(pickL(locale, v.meanings, v.meaningsUk)) as string[];
              return (
                <li key={v.id}>
                  <Link href={`/vocabulary/${v.id}`} className="flex items-center gap-4 px-5 sm:px-6 py-3 hover:bg-indigo-soft transition-colors">
                    <Furigana word={v.word} reading={v.reading} size="md" className="text-lg font-medium shrink-0" />
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
    </div>
  );
}
