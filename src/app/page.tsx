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
      <header className="relative">
        <div className="flex items-stretch gap-4 sm:gap-6">
          <div className="flex items-center justify-center bg-vermilion text-white px-4 sm:px-6 py-4 jp serif text-5xl sm:text-6xl shrink-0">学</div>
          <div className="flex-1 flex flex-col justify-between py-2 min-w-0">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold">
              <span className="tag-red">N{data.jlpt}</span>
              <span className="text-muted">— {t("home.welcome")} —</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">{t("home.title")}</h1>
          </div>
          <div className="self-end pb-1">
            <Link href="/review">
              <Button size="lg">{t("home.start_review", { count: startCount })}</Button>
            </Link>
          </div>
        </div>
        <div className="wave-band mt-4" />
      </header>

      {/* Ukiyo-e color-block tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile
          eyebrow={t("home.streak")}
          number={String(streakDays)}
          unit={t(streakDays === 1 ? "home.streak_days" : "home.streak_days_pl", { n: "" }).trim()}
          subtitle={nextMilestoneLabel(streakDays, t)}
          progress={streakMilestonePct(streakDays)}
          color="vermilion"
        />
        <StatTile
          eyebrow={t("home.xp")}
          number={data.stats.xp.toLocaleString()}
          unit="XP"
          subtitle={t("home.level_xp_progress", { level, current, needed })}
          progress={(current / needed) * 100}
          color="indigo"
        />
        <StatTile
          eyebrow={t("home.reviews_due")}
          number={data.dueCount.toString()}
          subtitle={t("home.reviews_breakdown", { newCount: data.newCount, learningCount: data.learningCount })}
          progress={data.dueCount === 0 ? 0 : 100}
          color="ochre"
        />
        <StatTile
          eyebrow={t("home.daily_goal")}
          number={String(data.todayReviews)}
          unit={`/ ${data.stats.dailyGoal}`}
          subtitle={t("home.to_go", { n: Math.max(0, data.stats.dailyGoal - data.todayReviews) })}
          progress={goalPct}
          color="pine"
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
                <Button>{t("common.start")} →</Button>
              </Link>
            )}
          </div>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <TypePill label={t("home.cat.vocabulary")} count={data.dueByType.vocab} href="/vocabulary" />
            <TypePill label={t("home.cat.kanji")} count={data.dueByType.kanji} href="/kanji" />
            <TypePill label={t("home.cat.grammar")} count={data.dueByType.grammar} href="/grammar" />
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

type StatColor = "vermilion" | "indigo" | "ochre" | "pine";

function StatTile({
  eyebrow,
  number,
  unit,
  subtitle,
  progress,
  color,
}: {
  eyebrow: string;
  number: string;
  unit?: string;
  subtitle?: string;
  progress: number;
  color: StatColor;
}) {
  const palette: Record<StatColor, { bg: string; bar: string; barBg: string; sub: string; band: string }> = {
    vermilion: { bg: "bg-vermilion text-white", bar: "bg-white", barBg: "bg-white/25", sub: "text-white/80", band: "bg-indigo" },
    indigo:    { bg: "bg-indigo text-white",     bar: "bg-ochre", barBg: "bg-white/20", sub: "text-white/75", band: "bg-vermilion" },
    ochre:     { bg: "bg-ochre text-foreground", bar: "bg-indigo", barBg: "bg-foreground/15", sub: "text-foreground/70", band: "bg-vermilion" },
    pine:      { bg: "bg-pine text-white",       bar: "bg-ochre", barBg: "bg-white/20", sub: "text-white/75", band: "bg-vermilion" },
  };
  const p = palette[color];
  return (
    <div className={`relative flex flex-col`}>
      <div className={`h-2 ${p.band}`} />
      <div className={`p-5 flex flex-col gap-3 flex-1 ${p.bg}`}>
        <div className={`text-[10px] uppercase tracking-[0.2em] font-bold ${p.sub}`}>{eyebrow}</div>
        <div className="flex items-baseline gap-2">
          <span className="text-6xl serif leading-none tracking-tight">{number}</span>
          {unit && <span className={`text-sm font-medium ${p.sub}`}>{unit}</span>}
        </div>
        <p className={`text-xs leading-snug min-h-[2.4em] ${p.sub}`}>{subtitle ?? ""}</p>
        <div className="mt-auto">
          <Progress value={progress} barClassName={p.bar} emptyClassName={p.barBg} />
        </div>
      </div>
    </div>
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
          <div className="px-3 py-1.5 rounded-md bg-navy text-white">
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
          <ProgressRow t={t} label={t("home.cat.grammar")} data={progress.grammar} />
          <ProgressRow t={t} label={t("home.cat.vocabulary")} data={progress.vocab} />
          <ProgressRow t={t} label={t("home.cat.kanji")} data={progress.kanji} />
        </div>
      </CardBody>
    </Card>
  );
}

function ProgressRow({ t, label, data }: { t: T; label: string; data: CategoryProgress }) {
  const pct = data.total === 0 ? 0 : Math.round((data.learned / data.total) * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted font-mono">
          {t("home.progress_row", { learned: data.learned, learning: data.learning, total: data.total })}
        </span>
      </div>
      <Progress value={pct} />
    </div>
  );
}

function TypePill({ label, count, href }: { label: string; count: number; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-3 py-2.5 rounded-md border border-border hover:border-primary hover:bg-primary-soft transition-colors"
    >
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
