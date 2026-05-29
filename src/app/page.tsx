import Link from "next/link";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { Furigana } from "@/components/Furigana";
import { db } from "@/lib/db";
import { getStats, xpToNextLevel } from "@/lib/xp";
import { getReviewQueue } from "@/lib/srs/queue";
import { getCurrentLevel } from "@/lib/level";
import { getT, getLocale, type T } from "@/lib/i18n";
import { pickL, type Locale } from "@/lib/i18n-shared";
import { Flame, Sparkles, Target, Calendar, ArrowRight, BookOpen, Languages, FileText, Trophy } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const now = new Date();
  const jlpt = await getCurrentLevel();
  const [stats, dueCount, newCount, learningCount, todayReviews, dueByType, queuePreview, levelProgress] = await Promise.all([
    getStats(),
    db.srsCard.count({ where: { dueAt: { lte: now }, state: { in: ["learning", "review"] } } }),
    db.srsCard.count({ where: { state: "new" } }),
    db.srsCard.count({ where: { state: "learning" } }),
    countReviewsToday(),
    countDueByType(now),
    getReviewQueue(6),
    countLevelProgress(jlpt),
  ]);
  const totals = await contentTotals();
  return { stats, dueCount, newCount, learningCount, todayReviews, totals, dueByType, queuePreview, jlpt, levelProgress };
}

async function countLevelProgress(jlpt: number) {
  const [vocabIds, kanjiIds, grammarIds] = await Promise.all([
    db.vocabulary.findMany({ where: { jlptLevel: jlpt }, select: { id: true } }),
    db.kanji.findMany({ where: { jlptLevel: jlpt }, select: { id: true } }),
    db.grammarPoint.findMany({ where: { jlptLevel: jlpt }, select: { id: true } }),
  ]);
  const counts = async (itemType: "vocab" | "kanji" | "grammar", ids: number[]) => {
    if (ids.length === 0) return { learned: 0, learning: 0, total: 0 };
    const [learned, learning] = await Promise.all([
      db.srsCard.count({ where: { itemType, itemId: { in: ids }, state: "review" } }),
      db.srsCard.count({ where: { itemType, itemId: { in: ids }, state: { in: ["learning", "new"] } } }),
    ]);
    return { learned, learning, total: ids.length };
  };
  const [vocab, kanji, grammar] = await Promise.all([
    counts("vocab", vocabIds.map((r) => r.id)),
    counts("kanji", kanjiIds.map((r) => r.id)),
    counts("grammar", grammarIds.map((r) => r.id)),
  ]);
  return { vocab, kanji, grammar };
}

async function countDueByType(now: Date) {
  const types = ["vocab", "kanji", "grammar"] as const;
  const out: Record<string, number> = { vocab: 0, kanji: 0, grammar: 0 };
  for (const t of types) {
    out[t] = await db.srsCard.count({
      where: { itemType: t, OR: [{ state: "new" }, { dueAt: { lte: now }, state: { in: ["learning", "review"] } }] },
    });
  }
  return out;
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
  const t = await getT();
  const locale = await getLocale();
  const { current, needed, level } = xpToNextLevel(data.stats.xp);
  const goalPct = Math.min(100, Math.round((data.todayReviews / data.stats.dailyGoal) * 100));
  const streakDays = data.stats.streakDays;
  const startCount = data.dueCount + Math.min(data.newCount, 10);

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-end gap-3 justify-between">
        <div>
          <p className="text-sm text-muted">{t("home.welcome")}</p>
          <h1 className="text-3xl font-semibold">{t("home.title")}</h1>
        </div>
        <Link href="/review">
          <Button size="lg">
            <Sparkles className="w-4 h-4" />
            {t("home.start_review", { count: startCount })}
          </Button>
        </Link>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Flame className="w-4 h-4" />}
          label={t("home.streak")}
          value={t(streakDays === 1 ? "home.streak_days" : "home.streak_days_pl", { n: streakDays })}
          subtitle={nextMilestoneLabel(streakDays, t)}
          footer={<Progress value={streakMilestonePct(streakDays)} barClassName="bg-white" className="bg-white/25" />}
          accent
        />
        <StatCard
          icon={<Sparkles className="w-4 h-4" />}
          label={t("home.xp")}
          value={data.stats.xp.toLocaleString()}
          subtitle={t("home.level_xp_progress", { level, current, needed })}
          footer={<Progress value={(current / needed) * 100} />}
        />
        <StatCard
          icon={<Calendar className="w-4 h-4" />}
          label={t("home.reviews_due")}
          value={data.dueCount.toString()}
          subtitle={t("home.reviews_breakdown", { newCount: data.newCount, learningCount: data.learningCount })}
          footer={<Progress value={data.dueCount === 0 ? 0 : 100} />}
        />
        <StatCard
          icon={<Target className="w-4 h-4" />}
          label={t("home.daily_goal")}
          value={`${data.todayReviews}/${data.stats.dailyGoal}`}
          subtitle={t("home.to_go", { n: Math.max(0, data.stats.dailyGoal - data.todayReviews) })}
          footer={<Progress value={goalPct} />}
        />
      </div>

      <LevelProgressSection
        t={t}
        jlpt={data.jlpt}
        xp={data.stats.xp}
        xpLevel={level}
        xpCurrent={current}
        xpNeeded={needed}
        progress={data.levelProgress}
      />

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>{t("home.review_queue")}</CardTitle>
              <CardDescription>
                {data.queuePreview.length > 0
                  ? t("home.cards_ready", { n: startCount })
                  : t("home.open_to_add")}
              </CardDescription>
            </div>
            {data.queuePreview.length > 0 && (
              <Link href="/review">
                <Button>
                  <Sparkles className="w-4 h-4" />
                  {t("common.start")}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <TypePill icon={<Languages className="w-4 h-4" />} label={t("home.cat.vocabulary")} count={data.dueByType.vocab} href="/vocabulary" />
            <TypePill icon={<FileText className="w-4 h-4" />} label={t("home.cat.kanji")} count={data.dueByType.kanji} href="/kanji" />
            <TypePill icon={<BookOpen className="w-4 h-4" />} label={t("home.cat.grammar")} count={data.dueByType.grammar} href="/grammar" />
          </div>

          {data.queuePreview.length > 0 ? (
            <div>
              <div className="text-xs uppercase tracking-wide text-muted mb-2">{t("home.up_next")}</div>
              <div className="grid gap-2">
                {data.queuePreview.map((q) => (
                  <QueuePreviewRow key={q.cardId} item={q} t={t} locale={locale} />
                ))}
              </div>
            </div>
          ) : (
            <div className="px-4 py-6 rounded-lg bg-primary-soft text-sm text-center">
              <p className="font-medium text-foreground">{t("home.deck_empty")}</p>
              <p className="text-muted mt-1">{t("home.browse_to_add")}</p>
            </div>
          )}
        </CardBody>
      </Card>

      {data.totals.vocab === 0 && data.totals.kanji === 0 && data.totals.grammar === 0 && (
        <Card className="border-amber-200 bg-amber-50">
          <CardBody className="text-sm">
            <p className="font-medium text-amber-900">{t("home.no_content_title")}</p>
            <p className="text-amber-800 mt-1">{t("home.no_content_body")}</p>
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
    <Card className={"h-full " + (accent ? "bg-streak-gradient text-white border-0" : "")}>
      <div className="grid grid-rows-[auto_auto_auto_1fr_auto] h-full p-4 gap-1.5">
        <div className={"flex items-center gap-1.5 text-xs " + (accent ? "text-white/90" : "text-muted")}>
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-2xl font-semibold leading-tight">{value}</div>
        <p className={"text-xs min-h-[1rem] " + (accent ? "text-white/80" : "text-muted")}>{subtitle ?? " "}</p>
        <div />
        <div className="pt-1">{footer ?? <div className="h-2" />}</div>
      </div>
    </Card>
  );
}

function nextMilestoneLabel(streak: number, t: T): string {
  const next = STREAK_MILESTONES.find((m) => m > streak);
  if (!next) return t("home.all_milestones");
  return t("home.next_milestone", { n: next });
}

function streakMilestonePct(streak: number): number {
  const next = STREAK_MILESTONES.find((m) => m > streak);
  if (!next) return 100;
  const prev = [0, ...STREAK_MILESTONES].filter((m) => m <= streak).pop() ?? 0;
  return Math.round(((streak - prev) / (next - prev)) * 100);
}

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100, 200, 365];

type CategoryProgress = { learned: number; learning: number; total: number };

function LevelProgressSection({
  t,
  jlpt,
  xp,
  xpLevel,
  xpCurrent,
  xpNeeded,
  progress,
}: {
  t: T;
  jlpt: number;
  xp: number;
  xpLevel: number;
  xpCurrent: number;
  xpNeeded: number;
  progress: { vocab: CategoryProgress; kanji: CategoryProgress; grammar: CategoryProgress };
}) {
  const totalAll = progress.vocab.total + progress.kanji.total + progress.grammar.total;
  const learnedAll = progress.vocab.learned + progress.kanji.learned + progress.grammar.learned;
  const overallPct = totalAll === 0 ? 0 : Math.round((learnedAll / totalAll) * 100);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle>{t("home.your_progress", { level: jlpt })}</CardTitle>
            <CardDescription>
              {totalAll > 0
                ? t("home.progress_summary", { learned: learnedAll, total: totalAll, pct: overallPct })
                : t("home.switch_level_hint")}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-koi-gradient text-white">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-medium">{t("home.level_label", { n: xpLevel })}</span>
          </div>
        </div>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">{t("home.xp_to_next")}</span>
            <span className="font-mono text-muted">{t("home.xp_total", { current: xpCurrent, needed: xpNeeded, total: xp.toLocaleString() })}</span>
          </div>
          <Progress value={xpNeeded === 0 ? 0 : (xpCurrent / xpNeeded) * 100} />
        </div>
        <div className="space-y-3">
          <ProgressRow t={t} icon={<BookOpen className="w-4 h-4" />} label={t("home.cat.grammar")} data={progress.grammar} />
          <ProgressRow t={t} icon={<Languages className="w-4 h-4" />} label={t("home.cat.vocabulary")} data={progress.vocab} />
          <ProgressRow t={t} icon={<FileText className="w-4 h-4" />} label={t("home.cat.kanji")} data={progress.kanji} />
        </div>
      </CardBody>
    </Card>
  );
}

function ProgressRow({ t, icon, label, data }: { t: T; icon: React.ReactNode; label: string; data: CategoryProgress }) {
  const pct = data.total === 0 ? 0 : Math.round((data.learned / data.total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="text-primary">{icon}</span>
          {label}
        </span>
        <span className="text-xs text-muted font-mono">
          {t("home.progress_row", { learned: data.learned, learning: data.learning, total: data.total })}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

function TypePill({ icon, label, count, href }: { icon: React.ReactNode; label: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border hover:border-primary hover:bg-primary-soft transition-colors"
    >
      <span className="text-primary">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
      <span className="ml-auto text-xs font-mono text-muted">{count}</span>
    </Link>
  );
}

type PreviewItem = {
  cardId: number;
  itemType: "vocab" | "kanji" | "grammar";
  itemId: number;
  state: string;
  payload: Record<string, unknown>;
};

function QueuePreviewRow({ item, t, locale }: { item: PreviewItem; t: T; locale: Locale }) {
  const p = item.payload;
  const meanings = pickL(locale, p.meanings as string[], (p.meaningsUk as string[]) ?? null);
  const title = pickL(locale, p.title as string, (p.titleUk as string) ?? null);
  const stateLabel = item.state === "new" ? t("common.in_deck") : item.state === "learning" ? t("common.learning") : t("common.learned");
  const stateColor = item.state === "new" ? "bg-primary-soft text-primary" : item.state === "learning" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-background">
      {item.itemType === "vocab" && (
        <Furigana word={String(p.word)} reading={String(p.reading)} size="md" className="text-base font-medium" />
      )}
      {item.itemType === "kanji" && (
        <span className="jp text-2xl font-medium text-primary">{String(p.character)}</span>
      )}
      {item.itemType === "grammar" && (
        <span className="font-medium text-sm">{String(title)}</span>
      )}
      <span className="text-xs text-muted truncate flex-1 min-w-0">
        {item.itemType === "vocab" && meanings?.join(", ")}
        {item.itemType === "kanji" && meanings?.join(", ")}
        {item.itemType === "grammar" && `N${p.jlptLevel}`}
      </span>
      <span className={"text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium " + stateColor}>
        {stateLabel}
      </span>
    </div>
  );
}
