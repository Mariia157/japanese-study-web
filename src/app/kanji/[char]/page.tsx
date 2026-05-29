import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { MnemonicEditor } from "@/components/kanji/MnemonicEditor";
import { InQueueBadge } from "@/components/InQueueBadge";
import { BackButton } from "@/components/BackButton";
import { createCardIfMissing } from "@/lib/srs/queue";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function KanjiDetail({ params }: { params: Promise<{ char: string }> }) {
  const { char: encoded } = await params;
  const char = decodeURIComponent(encoded);
  const t = await getT();
  const locale = await getLocale();
  const kanji = await db.kanji.findUnique({
    where: { character: char },
    include: { radicals: { include: { radical: true } } },
  });
  if (!kanji) notFound();

  const cardBefore = await db.srsCard.findUnique({
    where: { itemType_itemId: { itemType: "kanji", itemId: kanji.id } },
  });
  const isNew = !cardBefore;
  await createCardIfMissing("kanji", kanji.id);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <BackButton label={t("common.back")} />
      <Card>
        <CardBody className="flex flex-col sm:flex-row items-center sm:items-start gap-6 py-8">
          <div className="text-center">
            <div className="jp text-8xl font-medium text-primary">{kanji.character}</div>
            <div className="text-xs text-muted mt-2">{t("kanji.strokes_meta", { level: kanji.jlptLevel, strokes: kanji.strokeCount || "?" })}</div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-xl font-semibold">{(JSON.parse(pickL(locale, kanji.meanings, kanji.meaningsUk)) as string[]).join(", ")}</h1>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted mb-1">{t("kanji.on_readings")}</div>
                <div className="jp">{(JSON.parse(kanji.onReadings) as string[]).join("、 ") || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted mb-1">{t("kanji.kun_readings")}</div>
                <div className="jp">{(JSON.parse(kanji.kunReadings) as string[]).join("、 ") || "—"}</div>
              </div>
            </div>
            <InQueueBadge added={isNew} addedLabel={t("common.added_to_deck")} inDeckLabel={t("common.in_your_deck")} />
          </div>
        </CardBody>
      </Card>

      {kanji.radicals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{t("kanji.radicals")}</CardTitle>
          </CardHeader>
          <CardBody>
            <div className="flex flex-wrap gap-2">
              {kanji.radicals.map((r) => (
                <div
                  key={r.radicalId}
                  className="px-3 py-1.5 bg-primary-soft rounded-md text-sm"
                >
                  <span className="jp font-medium mr-1">{r.radical.character}</span>
                  <span className="text-muted text-xs">{pickL(locale, r.radical.meaning, r.radical.meaningUk)}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{t("kanji.mnemonic")}</CardTitle>
        </CardHeader>
        <CardBody>
          <MnemonicEditor kanjiId={kanji.id} initial={pickL(locale, kanji.mnemonic, kanji.mnemonicUk) ?? ""} />
        </CardBody>
      </Card>
    </div>
  );
}
