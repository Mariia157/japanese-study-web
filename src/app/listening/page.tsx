import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { ExercisePreviewCard } from "@/components/ExercisePreviewCard";
import { getCurrentLevel } from "@/lib/level";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function ListeningPage() {
  const level = await getCurrentLevel();
  const t = await getT();
  const locale = await getLocale();
  const items = await db.listeningExercise.findMany({
    where: { jlptLevel: level },
    orderBy: { id: "asc" },
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">{t("listening.title")}</h1>
        <p className="text-sm text-muted mt-1">{t("listening.summary", { level, count: items.length })}</p>
      </header>

      {items.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">{t("listening.empty")}</CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((it) => (
            <ExercisePreviewCard
              key={it.id}
              href={`/listening/${it.id}`}
              title={pickL(locale, it.title, it.titleUk)}
              imageUrl={it.imageUrl}
              badge={`N${it.jlptLevel}`}
              startLabel={t("listening.start_exercise")}
            />
          ))}
        </div>
      )}
    </div>
  );
}
