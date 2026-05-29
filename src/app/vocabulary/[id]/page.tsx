import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { createCardIfMissing } from "@/lib/srs/queue";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Furigana } from "@/components/Furigana";
import { InQueueBadge } from "@/components/InQueueBadge";

export const dynamic = "force-dynamic";

export default async function VocabDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();

  const word = await db.vocabulary.findUnique({
    where: { id },
    include: {
      kanji: { include: { kanji: true } },
      examples: { include: { example: true }, take: 5 },
    },
  });
  if (!word) notFound();

  // Auto-add to SRS queue when opened for study
  const cardBefore = await db.srsCard.findUnique({
    where: { itemType_itemId: { itemType: "vocab", itemId: id } },
  });
  const isNew = !cardBefore;
  await createCardIfMissing("vocab", id);

  const meanings = JSON.parse(word.meanings) as string[];
  const pos = JSON.parse(word.partOfSpeech) as string[];

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted">
          N{word.jlptLevel}{word.source ? ` · ${word.source}` : ""} · {pos.join(", ") || "vocabulary"}
        </div>
        <div className="flex items-start justify-between gap-3">
          <Furigana word={word.word} reading={word.reading} size="xl" className="text-5xl font-medium" />
          <InQueueBadge added={isNew} />
        </div>
        <div className="text-lg text-muted">{meanings.join(", ")}</div>
      </header>

      {word.kanji.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Kanji used</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-wrap gap-2">
            {word.kanji.map((k) => (
              <Link
                key={k.kanjiId}
                href={`/kanji/${encodeURIComponent(k.kanji.character)}`}
                className="px-3 py-2 bg-primary-soft rounded-lg hover:bg-primary-soft-2 transition-colors"
              >
                <span className="jp text-2xl font-medium text-primary mr-2">{k.kanji.character}</span>
                <span className="text-sm text-muted">{(JSON.parse(k.kanji.meanings) as string[])[0]}</span>
              </Link>
            ))}
          </CardBody>
        </Card>
      )}

      {word.examples.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Examples</CardTitle>
          </CardHeader>
          <CardBody className="space-y-2">
            {word.examples.map((e) => (
              <div key={e.exampleId} className="px-3 py-2 bg-primary-soft rounded-lg">
                <div className="jp text-base">{e.example.japanese}</div>
                <div className="text-sm text-muted mt-0.5">{e.example.english}</div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
}
