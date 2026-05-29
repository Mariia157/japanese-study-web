import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { AddToStudyButton } from "@/components/AddToStudyButton";
import { MnemonicEditor } from "@/components/kanji/MnemonicEditor";

export const dynamic = "force-dynamic";

export default async function KanjiDetail({ params }: { params: Promise<{ char: string }> }) {
  const { char: encoded } = await params;
  const char = decodeURIComponent(encoded);
  const kanji = await db.kanji.findUnique({
    where: { character: char },
    include: { radicals: { include: { radical: true } } },
  });
  if (!kanji) notFound();

  const card = await db.srsCard.findUnique({
    where: { itemType_itemId: { itemType: "kanji", itemId: kanji.id } },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-center sm:items-start gap-6 py-8">
          <div className="text-center">
            <div className="jp text-8xl font-medium text-primary">{kanji.character}</div>
            <div className="text-xs text-muted mt-2">N{kanji.jlptLevel} · {kanji.strokeCount || "?"} strokes</div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-xl font-semibold">{(JSON.parse(kanji.meanings) as string[]).join(", ")}</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted mb-1">On readings</div>
                <div className="jp">{(JSON.parse(kanji.onReadings) as string[]).join("、 ") || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted mb-1">Kun readings</div>
                <div className="jp">{(JSON.parse(kanji.kunReadings) as string[]).join("、 ") || "—"}</div>
              </div>
            </div>
            <AddToStudyButton itemType="kanji" itemId={kanji.id} inQueue={!!card} size="md" />
          </div>
        </CardBody>
      </Card>

      {kanji.radicals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Radicals</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {kanji.radicals.map((r) => (
                <div
                  key={r.radicalId}
                  className="px-3 py-1.5 bg-primary-soft rounded-md text-sm"
                >
                  <span className="jp font-medium mr-1">{r.radical.character}</span>
                  <span className="text-muted text-xs">{r.radical.meaning}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Mnemonic</CardTitle>
        </CardHeader>
        <CardBody>
          <MnemonicEditor kanjiId={kanji.id} initial={kanji.mnemonic ?? ""} />
        </CardBody>
      </Card>
    </div>
  );
}
