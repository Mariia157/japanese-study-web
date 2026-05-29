import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { ReadingExerciseView } from "@/components/reading/ReadingExerciseView";
import { getCurrentLevel } from "@/lib/level";

export const dynamic = "force-dynamic";

export default async function ReadingPage() {
  const level = await getCurrentLevel();
  const items = await db.readingExercise.findMany({
    where: { jlptLevel: level },
    orderBy: { id: "asc" },
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Reading</h1>
        <p className="text-sm text-muted mt-1">N{level} reading exercises ({items.length}). Change level in the navbar.</p>
      </header>

      {items.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No reading exercises at this level yet.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <ReadingExerciseView
              key={it.id}
              title={it.title}
              text={it.text}
              english={it.english}
              questions={JSON.parse(it.questions)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
