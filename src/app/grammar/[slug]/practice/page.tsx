import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { QuizBlock, type Ex, type QuizLabels } from "@/components/grammar/QuizBlock";
import { BackButton } from "@/components/BackButton";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function GrammarPractice({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getT();
  const locale = await getLocale();
  const point = await db.grammarPoint.findUnique({
    where: { slug },
    include: { exercises: true },
  });
  if (!point) notFound();

  const exercises: Ex[] = point.exercises.map((e) => ({
    id: e.id,
    type: e.type as Ex["type"],
    prompt: pickL(locale, e.prompt, e.promptUk),
    choices: JSON.parse(e.choices),
    answer: e.answer,
    explanation: pickL(locale, e.explanation, e.explanationUk),
  }));

  const labels: QuizLabels = {
    progress: t("practice.progress"), score: t("practice.score"), next: t("common.next"),
    check: t("common.check"), restart: t("common.restart"), reset: t("common.reset"),
    correct: t("common.correct"), answer: t("common.answer"), quizComplete: t("practice.quiz_complete"),
    pctPerfect: t("practice.pct_perfect"), pctGreat: t("practice.pct_great"), pctKeep: t("practice.pct_keep"),
    arrangeToForm: t("practice.arrange_to_form"), arrangeHint: t("practice.arrange_hint"),
    placeholderTranslate: t("practice.placeholder_translate"), placeholderAnswer: t("practice.placeholder_answer"),
    romajiHintPre: t("practice.romaji_hint_pre"), romajiHintMid: t("practice.romaji_hint_mid"),
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton label={t("common.back")} />
      <header className="space-y-2">
        <div className="text-xs uppercase tracking-wide text-muted">N{point.jlptLevel}{point.source ? ` · ${point.source}` : ""} · {t("practice.title_suffix")}</div>
        <h1 className="text-4xl font-bold tracking-tight">{pickL(locale, point.title, point.titleUk)}</h1>
      </header>

      {exercises.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">{t("practice.no_questions")}</CardBody>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t("practice.questions_title", { count: exercises.length })}</CardTitle>
            <CardDescription>{t("practice.questions_desc")}</CardDescription>
          </CardHeader>
          <CardBody>
            <QuizBlock exercises={exercises} labels={labels} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}
