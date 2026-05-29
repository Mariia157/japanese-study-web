import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { QuizBlock, type Ex } from "@/components/grammar/QuizBlock";
import { BackButton } from "@/components/BackButton";
import { GraduationCap } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SectionReview({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const section = await db.grammarSection.findUnique({
    where: { slug },
    include: {
      points: { orderBy: { order: "asc" } },
      reviews: true,
    },
  });
  if (!section) notFound();

  // Section review uses the dedicated SectionReview pool (new questions not seen in lesson practice).
  const exercises: Ex[] = section.reviews.map((r) => ({
    id: r.id,
    type: r.type as Ex["type"],
    prompt: r.prompt,
    choices: JSON.parse(r.choices),
    answer: r.answer,
    explanation: r.explanation,
  }));

  const learnedIds = await db.srsCard.findMany({
    where: { itemType: "grammar", itemId: { in: section.points.map((p) => p.id) }, state: "review" },
    select: { itemId: true },
  });
  const learnedCount = learnedIds.length;
  const totalPoints = section.points.length;
  const unlocked = totalPoints > 0 && learnedCount === totalPoints;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton />
      <header className="space-y-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-primary" />
          <h1 className="text-3xl font-semibold">{section.title}</h1>
        </div>
        <p className="text-sm text-muted">
          Section review — {exercises.length} new questions mixing all {totalPoints} topics in this section.
          {!unlocked && ` (${totalPoints - learnedCount} topics still need to reach the review state to officially complete this section.)`}
        </p>
      </header>

      {!unlocked && (
        <Card className="border-amber-200 bg-amber-50">
          <CardBody className="text-sm text-amber-900">
            <p className="font-medium">Preview mode</p>
            <p className="text-amber-800 mt-1">
              You can practice the section review now, but it&apos;s designed to be taken after all topics in this section are learned (reached review state in SRS).
              Currently {learnedCount}/{totalPoints} learned.
            </p>
          </CardBody>
        </Card>
      )}

      {exercises.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No section review questions yet. Run <code className="font-mono text-xs px-1 py-0.5 bg-primary-soft rounded">npm run seed:genki</code> to populate them.
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Mixed review quiz</CardTitle>
            <CardDescription>Questions are new — they don&apos;t repeat what you saw in individual lessons.</CardDescription>
          </CardHeader>
          <CardBody>
            <QuizBlock exercises={exercises} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
