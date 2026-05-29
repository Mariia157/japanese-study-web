import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { BackButton } from "@/components/BackButton";
import { ReadingExerciseView } from "@/components/reading/ReadingExerciseView";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function ReadingDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const id = Number(idStr);
  if (!Number.isInteger(id)) notFound();

  const t = await getT();
  const locale = await getLocale();
  const item = await db.readingExercise.findUnique({ where: { id } });
  if (!item) notFound();

  const title = pickL(locale, item.title, item.titleUk);
  const english = pickL(locale, item.english, item.englishUk);
  const questions = JSON.parse(pickL(locale, item.questions, item.questionsUk));

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton label={t("common.back")} />
      <div className="text-xs uppercase tracking-wide text-muted">N{item.jlptLevel}</div>
      <h1 className="text-4xl font-bold tracking-tight">{title}</h1>

      {item.imageUrl && (
        <div className="relative w-full h-64 sm:h-80 rounded-xl overflow-hidden border border-border bg-primary-soft">
          <Image
            src={item.imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 800px"
            className="object-cover"
            unoptimized
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("reading.title")}</CardTitle>
        </CardHeader>
        <CardBody>
          <ReadingExerciseView
            title=""
            text={item.text}
            english={english}
            questions={questions}
            showLabel={t("reading.show_translation")}
            hideLabel={t("reading.hide_translation")}
            checkLabel={t("listening.check_answers")}
            scoreTpl={t("listening.score_label", { score: "{score}", total: "{total}" })}
            startLabel={t("listening.start_exercise")}
            collapseLabel={t("listening.collapse")}
            embedded
          />
        </CardBody>
      </Card>
    </div>
  );
}
