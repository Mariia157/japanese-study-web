import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { AddToStudyButton } from "@/components/AddToStudyButton";
import { QuizBlock } from "@/components/grammar/QuizBlock";

export const dynamic = "force-dynamic";

export default async function GrammarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const point = await db.grammarPoint.findUnique({
    where: { slug },
    include: { exercises: true },
  });
  if (!point) notFound();

  const examples = JSON.parse(point.examples) as { jp: string; en: string; note?: string }[];
  const card = await db.srsCard.findUnique({
    where: { itemType_itemId: { itemType: "grammar", itemId: point.id } },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted">N{point.jlptLevel}{point.source ? ` · ${point.source}` : ""}</div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold">{point.title}</h1>
          <AddToStudyButton itemType="grammar" itemId={point.id} inQueue={!!card} size="md" />
        </div>
      </header>

      <Card>
        <CardHeader><CardTitle>Explanation</CardTitle></CardHeader>
        <CardBody className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{point.explanation}</ReactMarkdown>
        </CardBody>
      </Card>

      {examples.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Examples</CardTitle></CardHeader>
          <CardBody className="space-y-2">
            {examples.map((ex, i) => (
              <div key={i} className="px-3 py-2 bg-primary-soft rounded-lg">
                <div className="jp text-base">{ex.jp}</div>
                <div className="text-sm text-muted mt-0.5">{ex.en}</div>
                {ex.note && <div className="text-xs text-muted italic mt-1">{ex.note}</div>}
              </div>
            ))}
          </CardBody>
        </Card>
      )}

      {point.exercises.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Practice ({point.exercises.length})</CardTitle></CardHeader>
          <CardBody>
            <QuizBlock
              exercises={point.exercises.map((e) => ({
                id: e.id,
                type: e.type as "mcq" | "fill" | "translate",
                prompt: e.prompt,
                choices: JSON.parse(e.choices),
                answer: e.answer,
                explanation: e.explanation,
              }))}
            />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
