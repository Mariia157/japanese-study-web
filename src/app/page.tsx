import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { db } from "@/lib/db";
import { getStats, xpToNextLevel } from "@/lib/xp";
import { Flame, Sparkles, Target, Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [stats, dueCount, newCount, learningCount, todayReviews] = await Promise.all([
    getStats(),
    db.srsCard.count({ where: { dueAt: { lte: new Date() }, state: { in: ["learning", "review"] } } }),
    db.srsCard.count({ where: { state: "new" } }),
    db.srsCard.count({ where: { state: "learning" } }),
    countReviewsToday(),
  ]);
  const totals = await contentTotals();
  return { stats, dueCount, newCount, learningCount, todayReviews, totals };
}

async function countReviewsToday() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return db.reviewLog.count({ where: { reviewedAt: { gte: start } } });
}

async function contentTotals() {
  const [vocab, kanji, grammar] = await Promise.all([
    db.vocabulary.count(),
    db.kanji.count(),
    db.grammarPoint.count(),
  ]);
  return { vocab, kanji, grammar };
}

export default async function Home() {
  const data = await getDashboardData();
  const { current, needed, level } = xpToNextLevel(data.stats.xp);
  const goalPct = Math.min(100, Math.round((data.todayReviews / data.stats.dailyGoal) * 100));

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
        <div>
          <p className="text-sm text-muted">Welcome back</p>
          <h1 className="text-3xl font-semibold">Today&apos;s study plan</h1>
        </div>
        <Link href="/review">
          <Button size="lg">
            <Sparkles className="w-4 h-4" />
            Start review ({data.dueCount + Math.min(data.newCount, 10)})
          </Button>
        </Link>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label="Streak"
          value={`${data.stats.streakDays} day${data.stats.streakDays === 1 ? "" : "s"}`}
          subtitle={nextMilestoneLabel(data.stats.streakDays)}
          footer={<Progress value={streakMilestonePct(data.stats.streakDays)} barClassName="bg-white" className="bg-white/25" />}
          accent
        />
        <StatCard
          icon={<Sparkles className="w-4 h-4" />}
          label="XP"
          value={data.stats.xp.toLocaleString()}
          subtitle={`Level ${level} — ${current}/${needed} XP`}
          footer={<Progress value={(current / needed) * 100} />}
        />
        <StatCard
          icon={<Calendar className="w-4 h-4" />}
          label="Reviews due"
          value={data.dueCount.toString()}
          subtitle={`${data.newCount} new · ${data.learningCount} learning`}
          footer={<Progress value={data.dueCount === 0 ? 0 : 100} />}
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label="Daily goal"
          value={`${data.todayReviews}/${data.stats.dailyGoal}`}
          subtitle={`${Math.max(0, data.stats.dailyGoal - data.todayReviews)} to go`}
          footer={<Progress value={goalPct} />}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pick a study area</CardTitle>
          <CardDescription>Jump straight into a topic or take the daily mixed review.</CardDescription>
        </CardHeader>
        <CardBody className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <AreaTile href="/grammar" title="Grammar" subtitle={`${data.totals.grammar} points`} jp="文法" />
          <AreaTile href="/vocabulary" title="Vocabulary" subtitle={`${data.totals.vocab} words`} jp="単語" />
          <AreaTile href="/kanji" title="Kanji" subtitle={`${data.totals.kanji} characters`} jp="漢字" />
          <AreaTile href="/listening" title="Listening" subtitle="Practice ears" jp="聴解" />
          <AreaTile href="/reading" title="Reading" subtitle="Texts & quizzes" jp="読解" />
          <AreaTile href="/stats" title="Stats" subtitle="Track progress" jp="統計" />
        </CardBody>
      </Card>

      {data.totals.vocab === 0 && data.totals.kanji === 0 && data.totals.grammar === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardBody className="text-sm">
            <p className="font-medium text-amber-900">No content yet</p>
            <p className="text-amber-800 mt-1">
              Run <code className="px-1.5 py-0.5 bg-amber-100 rounded font-mono text-xs">npm run seed</code> to load
              starter Japanese content (kana, basic vocab, N5 grammar, common kanji). Then import Genki lessons via{" "}
              <code className="px-1.5 py-0.5 bg-amber-100 rounded font-mono text-xs">npm run seed:genki</code>.
            </p>
          </CardBody>
        </Card>
      )}
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  subtitle,
  footer,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle?: string;
  footer?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <Card className={"h-full " + (accent ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white border-0" : "")}>
      <CardBody className="flex flex-col h-full gap-1.5">
        <div className={"flex items-center gap-1.5 text-xs " + (accent ? "text-white/90" : "text-muted")}>
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-2xl font-semibold">{value}</div>
        {subtitle && <p className={"text-xs " + (accent ? "text-white/80" : "text-muted")}>{subtitle}</p>}
        {footer && <div className="pt-2 mt-auto">{footer}</div>}
      </CardBody>
    </Card>
  );
}

function nextMilestoneLabel(streak: number): string {
  const next = STREAK_MILESTONES.find((m) => m > streak);
  if (!next) return "All milestones reached!";
  return `Next milestone: ${next} days`;
}

function streakMilestonePct(streak: number): number {
  const next = STREAK_MILESTONES.find((m) => m > streak);
  if (!next) return 100;
  const prev = [0, ...STREAK_MILESTONES].filter((m) => m <= streak).pop() ?? 0;
  return Math.round(((streak - prev) / (next - prev)) * 100);
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

function AreaTile({ href, title, subtitle, jp }: { href: string; title: string; subtitle: string; jp: string }) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1 p-4 rounded-lg border border-border bg-background hover:border-primary hover:bg-primary-soft transition-colors"
    >
      <span className="text-2xl jp font-medium text-primary">{jp}</span>
      <span className="font-medium">{title}</span>
      <span className="text-xs text-muted">{subtitle}</span>
    </Link>
  );
}
