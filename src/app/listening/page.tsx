import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { ListeningExercise } from "@/components/listening/ListeningExercise";
import { getCurrentLevel } from "@/lib/level";

export const dynamic = "force-dynamic";

export default async function ListeningPage() {
  const level = await getCurrentLevel();
  const items = await db.listeningExercise.findMany({
    where: { jlptLevel: level },
    orderBy: { id: "asc" },
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Listening</h1>
        <p className="text-sm text-muted mt-1">N{level} audio exercises ({items.length}). Change level in the navbar.</p>
      </header>

      {items.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No listening exercises at this level yet.
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-3">
          {items.map((it) => (
            <ListeningExercise
              key={it.id}
              title={it.title}
              transcript={it.transcript}
              english={it.english}
              audioUrl={it.audioUrl}
              questions={JSON.parse(it.questions)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
