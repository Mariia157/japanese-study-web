import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { ChevronRight } from "lucide-react";
import { getCurrentLevel } from "@/lib/level";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";
import { PageHeader } from "@/components/PageHeader";

export const dynamic = "force-dynamic";

export default async function GrammarPage() {
  const level = await getCurrentLevel();
  const t = await getT();
  const locale = await getLocale();
  const sections = await db.grammarSection.findMany({
    where: { jlptLevel: level },
    orderBy: { order: "asc" },
    include: {
      points: { orderBy: { order: "asc" } },
      reviews: { select: { id: true } },
    },
  });
  const orphans = await db.grammarPoint.findMany({
    where: { jlptLevel: level, sectionId: null },
    orderBy: { id: "asc" },
  });

  // Mastery info for section progress
  const pointIds = sections.flatMap((s) => s.points.map((p) => p.id));
  const learnedCards = await db.srsCard.findMany({
    where: { itemType: "grammar", itemId: { in: pointIds }, state: "review" },
    select: { itemId: true },
  });
  const learnedSet = new Set(learnedCards.map((c) => c.itemId));

  return (
    <div className="space-y-6">
      <PageHeader kanji="文" eyebrow={`N${level}`} title={t("grammar.title")} />
      <p className="text-sm text-muted -mt-2">{t("grammar.subtitle", { level })}</p>

      {sections.length === 0 && orphans.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            {t("grammar.no_content")}
          </CardBody>
        </Card>
      ) : (
        <div className="space-y-4">
          {sections.map((s) => {
            const total = s.points.length;
            const learned = s.points.filter((p) => learnedSet.has(p.id)).length;
            const pct = total === 0 ? 0 : Math.round((learned / total) * 100);
            const sectionComplete = total > 0 && learned === total;
            return (
              <Card key={s.id}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-3">
                    <div className="min-w-0">
                      <CardTitle>{pickL(locale, s.title, s.titleUk)}</CardTitle>
                      {(pickL(locale, s.summary, s.summaryUk)) && <CardDescription>{pickL(locale, s.summary, s.summaryUk)}</CardDescription>}
                    </div>
                    {s.reviews.length > 0 && (
                      <Link href={`/grammar/section/${s.slug}`}>
                        <Button variant={sectionComplete ? "primary" : "soft"} size="sm">
                          {sectionComplete ? t("grammar.section_review") : t("grammar.preview_review")}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">{t("grammar.topics_learned", { learned, total })}</span>
                    <span className="font-mono text-muted">{pct}%</span>
                  </div>
                  <Progress value={pct} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    {s.points.map((p) => (
                      <Link key={p.id} href={`/grammar/${p.slug}`} className="min-w-0">
                        <div
                          className={
                            "flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors " +
                            (learnedSet.has(p.id)
                              ? "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400"
                              : "border-border bg-background hover:border-primary hover:bg-primary-soft")
                          }
                        >
                          <span className="text-sm font-medium truncate">{pickL(locale, p.title, p.titleUk)}</span>
                          <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}

          {orphans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{t("grammar.other_points")}</CardTitle>
                <CardDescription>{t("grammar.other_points_desc")}</CardDescription>
              </CardHeader>
              <CardBody className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {orphans.map((p) => (
                  <Link key={p.id} href={`/grammar/${p.slug}`} className="min-w-0">
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors">
                      <span className="text-sm font-medium truncate">{pickL(locale, p.title, p.titleUk)}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-muted shrink-0" />
                    </div>
                  </Link>
                ))}
              </CardBody>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
