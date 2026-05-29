import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { InQueueBadge } from "@/components/InQueueBadge";
import { BackButton } from "@/components/BackButton";
import { createCardIfMissing } from "@/lib/srs/queue";
import { Sparkles, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function GrammarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const point = await db.grammarPoint.findUnique({
    where: { slug },
    include: { exercises: { select: { id: true } } },
  });
  if (!point) notFound();

  const examples = JSON.parse(point.examples) as { jp: string; en: string; note?: string }[];
  const cardBefore = await db.srsCard.findUnique({
    where: { itemType_itemId: { itemType: "grammar", itemId: point.id } },
  });
  const isNew = !cardBefore;
  await createCardIfMissing("grammar", point.id);

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <BackButton />
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted">N{point.jlptLevel}{point.source ? ` · ${point.source}` : ""}</div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold">{point.title}</h1>
          <InQueueBadge added={isNew} />
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
          <CardBody className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 py-5">
            <div>
              <div className="font-semibold text-lg">Ready to practice?</div>
              <p className="text-sm text-muted">{point.exercises.length} questions: multiple choice, fill-in, arrange tokens, and translate to Japanese.</p>
            </div>
            <Link href={`/grammar/${point.slug}/practice`}>
              <Button size="lg">
                <Sparkles className="w-4 h-4" />
                Start practice
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
