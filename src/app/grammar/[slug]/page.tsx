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
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function GrammarDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getT();
  const locale = await getLocale();
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
      <BackButton label={t("common.back")} />
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted">N{point.jlptLevel}{point.source ? ` · ${point.source}` : ""}</div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-4xl font-bold tracking-tight">{pickL(locale, point.title, point.titleUk)}</h1>
          <InQueueBadge added={isNew} addedLabel={t("common.added_to_deck")} inDeckLabel={t("common.in_your_deck")} />
        </div>
      </header>

      <Card>
        <CardHeader><CardTitle>{t("grammar.explanation")}</CardTitle></CardHeader>
        <CardBody className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{point.explanation}</ReactMarkdown>
        </CardBody>
      </Card>

      {examples.length > 0 && (
        <Card>
          <CardHeader><CardTitle>{t("grammar.examples")}</CardTitle></CardHeader>
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
              <div className="font-semibold text-lg">{t("grammar.ready_to_practice")}</div>
              <p className="text-sm text-muted">{t("grammar.ready_desc", { count: point.exercises.length })}</p>
            </div>
            <Link href={`/grammar/${point.slug}/practice`}>
              <Button size="lg">{t("grammar.start_practice")} →</Button>
            </Link>
          </CardBody>
        </Card>
      )}
    </div>
  );
}
