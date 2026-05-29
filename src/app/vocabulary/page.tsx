import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { AddToStudyButton } from "@/components/AddToStudyButton";
import { Furigana } from "@/components/Furigana";
import { getCurrentLevel } from "@/lib/level";

export const dynamic = "force-dynamic";

export default async function VocabPage() {
  const level = await getCurrentLevel();
  const words = await db.vocabulary.findMany({
    where: { jlptLevel: level },
    orderBy: { id: "asc" },
    take: 200,
  });
  const studied = await db.srsCard.findMany({
    where: { itemType: "vocab", itemId: { in: words.map((w) => w.id) } },
    select: { itemId: true },
  });
  const studiedSet = new Set(studied.map((c) => c.itemId));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Vocabulary</h1>
        <p className="text-sm text-muted mt-1">Showing N{level} words ({words.length}). Change level in the navbar.</p>
      </header>
      {words.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No words at this level yet. Run <code className="font-mono text-xs px-1 py-0.5 bg-primary-soft rounded">npm run seed</code>
            {" "}or import Genki content.
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-2">
          {words.map((w) => (
            <Card key={w.id}>
              <CardBody className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0 flex-1">
                  <Furigana
                    word={w.word}
                    reading={w.reading}
                    size="lg"
                    className="text-xl font-medium"
                  />
                  <div className="text-sm text-muted truncate mt-1">
                    {(JSON.parse(w.meanings) as string[]).join(", ")}
                  </div>
                </div>
                <AddToStudyButton itemType="vocab" itemId={w.id} inQueue={studiedSet.has(w.id)} />
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
