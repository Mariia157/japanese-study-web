import { db } from "@/lib/db";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Progress } from "@/components/ui/Progress";
import { getStats, levelFromXp, ACHIEVEMENT_DEFS, xpToNextLevel } from "@/lib/xp";
import { JLPT_LEVELS } from "@/lib/utils";
import { Trophy, Flame, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

async function getDailyCounts(days = 84) {
  const start = new Date();
  start.setDate(start.getDate() - days + 1);
  start.setHours(0, 0, 0, 0);
  const logs = await db.reviewLog.findMany({
    where: { reviewedAt: { gte: start } },
    select: { reviewedAt: true },
  });
  const map = new Map<string, number>();
  for (const l of logs) {
    const key = ymd(l.reviewedAt);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  const out: { date: string; count: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    out.push({ date: ymd(d), count: map.get(ymd(d)) ?? 0 });
  }
  return out;
}

function ymd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function pad(n: number) { return String(n).padStart(2, "0"); }

async function countLearned(itemType: "kanji" | "vocab" | "grammar", jlptLevel: number) {
  let ids: number[] = [];
  if (itemType === "kanji") ids = (await db.kanji.findMany({ where: { jlptLevel }, select: { id: true } })).map((r) => r.id);
  else if (itemType === "vocab") ids = (await db.vocabulary.findMany({ where: { jlptLevel }, select: { id: true } })).map((r) => r.id);
  else ids = (await db.grammarPoint.findMany({ where: { jlptLevel }, select: { id: true } })).map((r) => r.id);
  if (ids.length === 0) return 0;
  return db.srsCard.count({ where: { itemType, state: "review", itemId: { in: ids } } });
}

async function getLevelProgress() {
  return Promise.all(JLPT_LEVELS.map(async (l) => {
    const [kanjiTotal, kanjiLearned, vocabTotal, vocabLearned, grammarTotal, grammarLearned] = await Promise.all([
      db.kanji.count({ where: { jlptLevel: l } }),
      countLearned("kanji", l),
      db.vocabulary.count({ where: { jlptLevel: l } }),
      countLearned("vocab", l),
      db.grammarPoint.count({ where: { jlptLevel: l } }),
      countLearned("grammar", l),
    ]);
    return { level: l, kanjiTotal, kanjiLearned, vocabTotal, vocabLearned, grammarTotal, grammarLearned };
  }));
}

export default async function StatsPage() {
  const [stats, daily, perLevel, achievements, totalReviews] = await Promise.all([
    getStats(),
    getDailyCounts(),
    getLevelProgress(),
    db.achievement.findMany(),
    db.reviewLog.count(),
  ]);
  const { current, needed, level } = xpToNextLevel(stats.xp);

  const unlockedKeys = new Set(achievements.filter((a) => a.unlockedAt).map((a) => a.key));

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">Stats</h1>
        <p className="text-sm text-muted mt-1">Track your study consistency and JLPT progress.</p>
      </header>

      <div className="grid sm:grid-cols-4 gap-4">
        <StatTile icon={<Flame className="w-4 h-4" />} label="Streak" value={`${stats.streakDays} days`} />
        <StatTile icon={<Sparkles className="w-4 h-4" />} label="XP" value={stats.xp.toLocaleString()} subtitle={`Level ${level}`} />
        <StatTile icon={<Trophy className="w-4 h-4" />} label="Achievements" value={`${unlockedKeys.size} / ${ACHIEVEMENT_DEFS.length}`} />
        <StatTile icon={<Sparkles className="w-4 h-4" />} label="Total reviews" value={totalReviews.toLocaleString()} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity — last 12 weeks</CardTitle>
          <CardDescription>Each cell is a day. Darker = more reviews.</CardDescription>
        </CardHeader>
        <CardBody>
          <Heatmap daily={daily} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JLPT progress</CardTitle>
          <CardDescription>Cards in the &quot;review&quot; state count as learned.</CardDescription>
        </CardHeader>
        <CardBody className="space-y-3">
          {perLevel.map((p) => (
            <div key={p.level} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium">N{p.level}</span>
                <span className="text-muted text-xs">
                  Vocab {p.vocabLearned}/{p.vocabTotal} · Kanji {p.kanjiLearned}/{p.kanjiTotal} · Grammar {p.grammarLearned}/{p.grammarTotal}
                </span>
              </div>
              <Progress
                value={overallPct(p)}
              />
            </div>
          ))}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Level progress</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="text-sm text-muted mb-2">Level {level} — {current}/{needed} XP</div>
          <Progress value={(current / needed) * 100} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Achievements</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {ACHIEVEMENT_DEFS.map((a) => {
              const unlocked = unlockedKeys.has(a.key);
              return (
                <div
                  key={a.key}
                  className={
                    "flex items-start gap-2 p-3 rounded-lg border " +
                    (unlocked ? "border-primary bg-primary-soft" : "border-border bg-background opacity-60")
                  }
                >
                  <Trophy className={"w-4 h-4 mt-0.5 " + (unlocked ? "text-primary" : "text-muted")} />
                  <div className="min-w-0">
                    <div className="font-medium text-sm">{a.title}</div>
                    <div className="text-xs text-muted">{a.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

function StatTile({ icon, label, value, subtitle }: { icon: React.ReactNode; label: string; value: string; subtitle?: string }) {
  return (
    <Card>
      <CardBody className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs text-muted">{icon}<span>{label}</span></div>
        <div className="text-xl font-semibold">{value}</div>
        {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
      </CardBody>
    </Card>
  );
}

function overallPct(p: { vocabLearned: number; vocabTotal: number; kanjiLearned: number; kanjiTotal: number; grammarLearned: number; grammarTotal: number }) {
  const total = p.vocabTotal + p.kanjiTotal + p.grammarTotal;
  const learned = p.vocabLearned + p.kanjiLearned + p.grammarLearned;
  return total === 0 ? 0 : Math.round((learned / total) * 100);
}

function Heatmap({ daily }: { daily: { date: string; count: number }[] }) {
  // 84 days = 12 weeks. Group into 12 cols × 7 rows.
  const weeks: { date: string; count: number }[][] = [];
  for (let i = 0; i < daily.length; i += 7) weeks.push(daily.slice(i, i + 7));
  const max = Math.max(1, ...daily.map((d) => d.count));
  return (
    <div className="flex gap-1 overflow-x-auto">
      {weeks.map((w, i) => (
        <div key={i} className="flex flex-col gap-1">
          {w.map((d) => {
            const v = d.count;
            const intensity = v === 0 ? 0 : v / max;
            const bg = v === 0
              ? "bg-primary-soft"
              : intensity < 0.34
              ? "bg-primary-soft-2"
              : intensity < 0.67
              ? "bg-primary"
              : "bg-navy-2";
            return (
              <div
                key={d.date}
                title={`${d.date}: ${v} review${v === 1 ? "" : "s"}`}
                className={`w-3.5 h-3.5 rounded-sm ${bg}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
