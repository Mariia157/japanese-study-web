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

      <section className="border border-border bg-surface">
        {/* Decorative dot band */}
        <div className="dot-band" />

        {/* Big hero header: massive number + title + Start CTA */}
        <div className="px-5 sm:px-8 pt-6 pb-5 flex flex-col sm:flex-row gap-4 sm:items-end justify-between border-b border-border">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted mb-1">
              {t("home.review_queue").toUpperCase()}
            </div>
            <div className="flex items-baseline gap-3">
              <span className="serif leading-none text-7xl sm:text-8xl text-indigo font-bold tabular-nums">{startCount}</span>
              <span className="text-sm text-muted leading-tight max-w-[14em] hidden sm:block">
                {data.queuePreview.length > 0
                  ? t("home.cards_ready", { n: startCount })
                  : t("home.open_to_add")}
              </span>
            </div>
          </div>
          {data.queuePreview.length > 0 && (
            <Link href="/review">
              <Button size="lg">{t("common.start")} →</Button>
            </Link>
          )}
        </div>

        {/* Three colored category counters */}
        <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
          <CategoryCounter color="vermilion" label={t("home.cat.vocabulary")} jp="語" count={data.dueByType.vocab} href="/vocabulary" />
          <CategoryCounter color="indigo" label={t("home.cat.kanji")} jp="漢" count={data.dueByType.kanji} href="/kanji" />
          <CategoryCounter color="pine" label={t("home.cat.grammar")} jp="文" count={data.dueByType.grammar} href="/grammar" />
        </div>

        {/* Up next list — newspaper-style numbered entries */}
        {data.queuePreview.length > 0 ? (
          <div className="px-5 sm:px-8 py-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">{t("home.up_next")}</span>
              <div className="rule-line flex-1" />
            </div>
            <ol className="divide-y divide-border-soft">
              {data.queuePreview.map((q, i) => (
                <QueuePreviewRow key={q.cardId} item={q} t={t} locale={locale} index={i + 1} />
              ))}
            </ol>
          </div>
        ) : (
          <div className="px-5 sm:px-8 py-10 text-sm text-center">
            <p className="font-bold text-lg">{t("home.deck_empty")}</p>
            <p className="text-muted mt-2 max-w-md mx-auto">{t("home.browse_to_add")}</p>
          </div>
        )}
      </section>

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
    <section className="border border-border bg-surface">
      {/* Decorative top band: three solid stripes */}
      <div className="tri-band" />

      {/* Title row: huge percentage + section title + level badge */}
      <div className="px-5 sm:px-8 pt-6 pb-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-bold text-muted mb-1">
            {t("home.your_progress", { level: jlpt }).toUpperCase()}
          </div>
          <div className="flex items-baseline gap-4">
            <span className="serif leading-none text-7xl sm:text-8xl text-vermilion font-bold tabular-nums">{overallPct}</span>
            <span className="serif text-4xl text-muted leading-none">%</span>
            <span className="text-sm text-muted leading-tight max-w-[14em] hidden sm:block">
              {totalAll > 0
                ? t("home.progress_summary", { learned: learnedAll, total: totalAll, pct: overallPct })
                : t("home.switch_level_hint")}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 jp">
          <span className="text-xs uppercase tracking-[0.2em] text-muted">{t("home.level_label", { n: "" }).replace(/\s*\d*$/, "").trim()}</span>
          <span className="bg-indigo text-white font-bold text-3xl serif px-4 py-1.5 tabular-nums">{xpLevel}</span>
        </div>
      </div>

      {/* 3 colored category panels */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        <CategoryPanel
          color="indigo"
          label={t("home.cat.grammar")}
          jp="文法"
          data={progress.grammar}
        />
        <CategoryPanel
          color="vermilion"
          label={t("home.cat.vocabulary")}
          jp="語彙"
          data={progress.vocab}
        />
        <CategoryPanel
          color="ochre"
          label={t("home.cat.kanji")}
          jp="漢字"
          data={progress.kanji}
        />
      </div>

      {/* XP footer rail */}
      <div className="px-5 sm:px-8 py-4 border-t border-border bg-foreground text-background flex items-center gap-4">
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-background/70">XP</span>
        <span className="serif text-2xl tabular-nums">{xp.toLocaleString()}</span>
        <span className="text-xs text-background/65 flex-1 hidden sm:block">
          {t("home.xp_total", { current: xpCurrent, needed: xpNeeded, total: xp.toLocaleString() })}
        </span>
        <div className="flex-1 max-w-[20rem]">
          <Progress
            value={xpNeeded === 0 ? 0 : (xpCurrent / xpNeeded) * 100}
            barClassName="bg-ochre"
            emptyClassName="bg-background/20"
          />
        </div>
      </div>
    </section>
  );
}

function CategoryPanel({
  color,
  label,
  jp,
  data,
}: {
  color: "indigo" | "vermilion" | "ochre" | "pine";
  label: string;
  jp: string;
  data: CategoryProgress;
}) {
  const pct = data.total === 0 ? 0 : Math.round((data.learned / data.total) * 100);
  const palette: Record<string, { txt: string; bar: string; barBg: string; jpClr: string }> = {
    indigo:    { txt: "text-indigo",    bar: "bg-indigo",    barBg: "bg-indigo-soft",    jpClr: "text-indigo" },
    vermilion: { txt: "text-vermilion", bar: "bg-vermilion", barBg: "bg-vermilion-soft", jpClr: "text-vermilion" },
    ochre:     { txt: "text-ochre",     bar: "bg-ochre",     barBg: "bg-ochre-soft",     jpClr: "text-ochre" },
    pine:      { txt: "text-pine",      bar: "bg-pine",      barBg: "bg-pine-soft",      jpClr: "text-pine" },
  };
  const p = palette[color];
  return (
    <div className="relative p-5 sm:p-6 flex flex-col gap-3">
      {/* Large vertical kanji on right edge */}
      <span aria-hidden className={`absolute right-2 top-2 jp serif text-6xl leading-none opacity-15 ${p.jpClr}`}>
        {jp}
      </span>
      <div className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">{label}</div>
      <div className="flex items-baseline gap-1.5">
        <span className={`serif text-5xl leading-none font-bold tabular-nums ${p.txt}`}>{data.learned}</span>
        <span className="text-base text-muted">/</span>
        <span className="text-base text-muted tabular-nums">{data.total}</span>
      </div>
      <div className="text-xs text-muted mt-auto pt-2">
        <Progress value={pct} barClassName={p.bar} emptyClassName={p.barBg} />
        <div className="flex justify-between mt-1.5 tabular-nums">
          <span>{pct}%</span>
          <span>
            {data.learning > 0 && `+${data.learning} `}
          </span>
        </div>
      </div>
    </div>
  );
}

function CategoryCounter({
  color,
  label,
  jp,
  count,
  href,
}: {
  color: "indigo" | "vermilion" | "ochre" | "pine";
  label: string;
  jp: string;
  count: number;
  href: string;
}) {
  const palette: Record<string, { txt: string; bgSoft: string; jpClr: string }> = {
    indigo:    { txt: "text-indigo",    bgSoft: "hover:bg-indigo-soft",    jpClr: "text-indigo" },
    vermilion: { txt: "text-vermilion", bgSoft: "hover:bg-vermilion-soft", jpClr: "text-vermilion" },
    ochre:     { txt: "text-ochre",     bgSoft: "hover:bg-ochre-soft",     jpClr: "text-ochre" },
    pine:      { txt: "text-pine",      bgSoft: "hover:bg-pine-soft",      jpClr: "text-pine" },
  };
  const p = palette[color];
  return (
    <Link href={href} className={`relative p-5 flex flex-col gap-1 transition-colors ${p.bgSoft}`}>
      <span aria-hidden className={`absolute right-2 top-1 jp serif text-5xl leading-none opacity-15 ${p.jpClr}`}>{jp}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted">{label}</span>
      <span className={`serif text-4xl font-bold tabular-nums leading-none ${p.txt}`}>{count}</span>
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

function QueuePreviewRow({ item, t, locale, index }: { item: PreviewItem; t: T; locale: Locale; index: number }) {
  const p = item.payload;
  const meanings = pickL(locale, p.meanings as string[], (p.meaningsUk as string[]) ?? null);
  const title = pickL(locale, p.title as string, (p.titleUk as string) ?? null);
  const stateLabel = item.state === "new" ? t("common.in_deck") : item.state === "learning" ? t("common.learning") : t("common.learned");
  const stateColor =
    item.state === "new" ? "bg-vermilion text-white"
    : item.state === "learning" ? "bg-ochre text-foreground"
    : "bg-pine text-white";
  const typeColor =
    item.itemType === "vocab" ? "text-vermilion"
    : item.itemType === "kanji" ? "text-indigo"
    : "text-pine";
  return (
    <li className="flex items-center gap-4 py-3 group">
      <span className="text-xs tabular-nums font-mono text-muted shrink-0 w-7">{String(index).padStart(2, "0")}</span>
      <div className="shrink-0 w-14 flex justify-center">
        {item.itemType === "vocab" && (
          <Furigana word={String(p.word)} reading={String(p.reading)} size="md" className={`text-lg font-medium ${typeColor}`} />
        )}
        {item.itemType === "kanji" && (
          <span className={`jp serif text-3xl font-bold leading-none ${typeColor}`}>{String(p.character)}</span>
        )}
        {item.itemType === "grammar" && (
          <span className={`jp text-2xl font-medium ${typeColor}`}>文</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        {item.itemType === "grammar" && (
          <div className="font-bold text-sm truncate">{String(title)}</div>
        )}
        <div className="text-xs text-muted truncate">
          {item.itemType === "vocab" && meanings?.join(", ")}
          {item.itemType === "kanji" && meanings?.join(", ")}
          {item.itemType === "grammar" && `N${p.jlptLevel}`}
        </div>
      </div>
      <span className={`text-[9px] uppercase tracking-[0.15em] px-1.5 py-0.5 font-bold ${stateColor}`}>
        {stateLabel}
      </span>
    </li>
  );
}
