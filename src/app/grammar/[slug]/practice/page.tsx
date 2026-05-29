import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { QuizBlock, type Ex } from "@/components/grammar/QuizBlock";
import { BackButton } from "@/components/BackButton";

export const dynamic = "force-dynamic";

export default async function GrammarPractice({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const point = await db.grammarPoint.findUnique({
    where: { slug },
    include: { exercises: true },
  });
  if (!point) notFound();

  const exercises: Ex[] = point.exercises.map((e) => ({
    id: e.id,
    type: e.type as Ex["type"],
    prompt: e.prompt,
    choices: JSON.parse(e.choices),
    answer: e.answer,
    explanation: e.explanation,
  }));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton />
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted">N{point.jlptLevel}{point.source ? ` · ${point.source}` : ""} · Practice</div>
        <h1 className="text-3xl font-semibold">{point.title}</h1>
      </header>

      {exercises.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No practice questions for this grammar point yet.
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Practice ({exercises.length} questions)</CardTitle>
            <CardDescription>Mix of MCQ, fill-in, arrange-the-tokens, and translate-to-Japanese.</CardDescription>
          </CardHeader>
          <CardBody>
            <QuizBlock exercises={exercises} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
