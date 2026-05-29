import { db } from "@/lib/db";
import type { Grade } from "@/lib/srs/sm2";

export async function getStats() {
  const s = await db.userStats.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });
  return s;
}

export function xpForGrade(grade: Grade): number {
  switch (grade) {
    case 1: return 0;
    case 2: return 1;
    case 3: return 2;
    case 4: return 3;
  }
}

const HALF_DAY_MS = 12 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export async function recordReview(grade: Grade): Promise<{ xpGained: number; streak: number; newAchievements: string[] }> {
  const now = new Date();
  const s = await getStats();

  const gained = xpForGrade(grade);
  let streak = s.streakDays;
  let lastStudyDate: Date = now;

  if (!s.lastStudyDate) {
    streak = 1;
  } else {
    const last = s.lastStudyDate;
    const sameDay = isSameDay(last, now);
    const within36h = now.getTime() - last.getTime() <= DAY_MS + HALF_DAY_MS;
    if (sameDay) {
      // no streak change
    } else if (within36h) {
      streak += 1;
    } else {
      streak = 1;
    }
  }

  const newXp = s.xp + gained;
  await db.userStats.update({
    where: { id: 1 },
    data: { xp: newXp, streakDays: streak, lastStudyDate },
  });

  const newAchievements = await unlockAchievements({ xp: newXp, streak });

  return { xpGained: gained, streak, newAchievements };
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function levelFromXp(xp: number): number {
  return Math.floor(Math.sqrt(xp / 50));
}

export function xpToNextLevel(xp: number): { current: number; needed: number; level: number } {
  const level = levelFromXp(xp);
  const currentBase = level * level * 50;
  const nextBase = (level + 1) * (level + 1) * 50;
  return { current: xp - currentBase, needed: nextBase - currentBase, level };
}

const ACHIEVEMENT_DEFS = [
  { key: "first-review", title: "First Step", description: "Complete your first review", check: (c: Ctx) => c.totalReviews >= 1 },
  { key: "ten-reviews", title: "Getting Started", description: "Complete 10 reviews", check: (c: Ctx) => c.totalReviews >= 10 },
  { key: "hundred-reviews", title: "Centurion", description: "Complete 100 reviews", check: (c: Ctx) => c.totalReviews >= 100 },
  { key: "streak-3", title: "On a Roll", description: "3-day streak", check: (c: Ctx) => c.streak >= 3 },
  { key: "streak-7", title: "Week Warrior", description: "7-day streak", check: (c: Ctx) => c.streak >= 7 },
  { key: "streak-30", title: "Dedicated", description: "30-day streak", check: (c: Ctx) => c.streak >= 30 },
  { key: "level-5", title: "Apprentice", description: "Reach level 5", check: (c: Ctx) => levelFromXp(c.xp) >= 5 },
  { key: "level-10", title: "Adept", description: "Reach level 10", check: (c: Ctx) => levelFromXp(c.xp) >= 10 },
];

type Ctx = { xp: number; streak: number; totalReviews: number };

async function unlockAchievements(p: { xp: number; streak: number }): Promise<string[]> {
  const totalReviews = await db.reviewLog.count();
  const ctx: Ctx = { ...p, totalReviews };

  const unlocked: string[] = [];
  for (const def of ACHIEVEMENT_DEFS) {
    const existing = await db.achievement.findUnique({ where: { key: def.key } });
    if (existing?.unlockedAt) continue;
    if (def.check(ctx)) {
      await db.achievement.upsert({
        where: { key: def.key },
        update: { unlockedAt: new Date() },
        create: { key: def.key, title: def.title, description: def.description, unlockedAt: new Date() },
      });
      unlocked.push(def.title);
    } else if (!existing) {
      await db.achievement.create({
        data: { key: def.key, title: def.title, description: def.description },
      });
    }
  }
  return unlocked;
}

export { ACHIEVEMENT_DEFS };
