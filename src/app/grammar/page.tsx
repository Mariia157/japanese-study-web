import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { ChevronRight, GraduationCap, BookOpen } from "lucide-react";
import { getCurrentLevel } from "@/lib/level";

export const dynamic = "force-dynamic";

export default async function GrammarPage() {
  const level = await getCurrentLevel();
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
      <header>
        <h1 className="text-3xl font-semibold">Grammar</h1>
        <p className="text-sm text-muted mt-1">
          Showing N{level}. Complete each section&apos;s topics, then run the section review quiz to mix all points together with new questions.
        </p>
      </header>

      {sections.length === 0 && orphans.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No grammar at this level yet. Run <code className="font-mono text-xs px-1 py-0.5 bg-primary-soft rounded">npm run seed:genki</code>.
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
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-primary" />
                        <CardTitle>{s.title}</CardTitle>
                      </div>
                      {s.summary && <CardDescription>{s.summary}</CardDescription>}
                    </div>
                    {s.reviews.length > 0 && (
                      <Link href={`/grammar/section/${s.slug}`}>
                        <Button variant={sectionComplete ? "primary" : "soft"} size="sm">
                          {sectionComplete ? "Section review" : "Preview review"}
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted">{learned} / {total} topics learned</span>
                    <span className="font-mono text-muted">{pct}%</span>
                  </div>
                  <Progress value={pct} />
                  <div className="grid sm:grid-cols-2 gap-2 mt-2">
                    {s.points.map((p) => (
                      <Link key={p.id} href={`/grammar/${p.slug}`}>
                        <div
                          className={
                            "flex items-center justify-between gap-2 px-3 py-2 rounded-lg border transition-colors " +
                            (learnedSet.has(p.id)
                              ? "border-emerald-200 bg-emerald-50/40 hover:border-emerald-400"
                              : "border-border bg-background hover:border-primary hover:bg-primary-soft")
                          }
                        >
                          <span className="flex items-center gap-2 min-w-0">
                            <BookOpen className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-sm font-medium truncate">{p.title}</span>
                          </span>
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
                <CardTitle>Other grammar points</CardTitle>
                <CardDescription>Topics not assigned to a section.</CardDescription>
              </CardHeader>
              <CardBody className="grid sm:grid-cols-2 gap-2">
                {orphans.map((p) => (
                  <Link key={p.id} href={`/grammar/${p.slug}`}>
                    <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors">
                      <span className="text-sm font-medium truncate">{p.title}</span>
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
