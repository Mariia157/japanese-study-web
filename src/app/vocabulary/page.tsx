import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { Furigana } from "@/components/Furigana";
import { getCurrentLevel } from "@/lib/level";
import { Check } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function VocabPage() {
  const level = await getCurrentLevel();
  const words = await db.vocabulary.findMany({
    where: { jlptLevel: level },
    orderBy: { id: "asc" },
    take: 200,
  });
  const inQueue = await db.srsCard.findMany({
    where: { itemType: "vocab", itemId: { in: words.map((w) => w.id) } },
    select: { itemId: true, state: true },
  });
  const queueMap = new Map(inQueue.map((c) => [c.itemId, c.state]));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Vocabulary</h1>
        <p className="text-sm text-muted mt-1">
          Showing N{level} words ({words.length}). Click a word to study it — it&apos;ll be added to your review deck automatically.
        </p>
      </header>
      {words.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No words at this level yet. Run <code className="font-mono text-xs px-1 py-0.5 bg-primary-soft rounded">npm run seed</code>
            {" "}or <code className="font-mono text-xs px-1 py-0.5 bg-primary-soft rounded">npm run seed:genki</code>.
          </CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {words.map((w) => {
            const state = queueMap.get(w.id);
            const stateColor =
              state === "review"
                ? "bg-emerald-100 text-emerald-700"
                : state === "learning"
                ? "bg-amber-100 text-amber-700"
                : "bg-violet-100 text-violet-700";
            const stateLabel = state === "review" ? "learned" : state === "learning" ? "learning" : "in deck";
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
                      {(JSON.parse(w.meanings) as string[]).join(", ")}
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
