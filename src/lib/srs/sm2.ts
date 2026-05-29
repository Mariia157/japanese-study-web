export type Grade = 1 | 2 | 3 | 4;

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  dueAt: Date;
  state: "new" | "learning" | "review" | "suspended";
}

const MIN_EF = 1.3;
const DAY_MS = 24 * 60 * 60 * 1000;

const gradeToQ: Record<Grade, number> = { 1: 0, 2: 3, 3: 4, 4: 5 };

export function schedule(card: SrsState, grade: Grade, now: Date): SrsState {
  const q = gradeToQ[grade];
  const newEF = Math.max(
    MIN_EF,
    card.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
  );

  if (grade === 1) {
    return {
      easeFactor: newEF,
      intervalDays: 1,
      repetitions: 0,
      dueAt: addDays(now, 1),
      state: "learning",
    };
  }

  const reps = card.repetitions + 1;
  let intervalDays: number;
  if (reps === 1) intervalDays = 1;
  else if (reps === 2) intervalDays = 6;
  else intervalDays = Math.round(card.intervalDays * newEF);

  if (grade === 2) intervalDays = Math.max(1, Math.round(intervalDays * 0.6));
  if (grade === 4) intervalDays = Math.round(intervalDays * 1.3);

  return {
    easeFactor: newEF,
    intervalDays,
    repetitions: reps,
    dueAt: addDays(now, intervalDays),
    state: reps >= 2 ? "review" : "learning",
  };
}

export function newCard(now: Date): SrsState {
  return {
    easeFactor: 2.5,
    intervalDays: 0,
    repetitions: 0,
    dueAt: now,
    state: "new",
  };
}

function addDays(d: Date, days: number): Date {
  return new Date(d.getTime() + days * DAY_MS);
}
