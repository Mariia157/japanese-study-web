import { describe, expect, it } from "vitest";
import { newCard, schedule } from "./sm2";

const now = new Date("2026-01-01T00:00:00Z");

describe("SM-2 schedule", () => {
  it("creates a fresh card due now", () => {
    const c = newCard(now);
    expect(c.state).toBe("new");
    expect(c.intervalDays).toBe(0);
    expect(c.repetitions).toBe(0);
    expect(c.easeFactor).toBe(2.5);
  });

  it("grade 1 resets repetitions to 0 and interval to 1", () => {
    const c = newCard(now);
    const after = schedule({ ...c, repetitions: 4, intervalDays: 30 }, 1, now);
    expect(after.repetitions).toBe(0);
    expect(after.intervalDays).toBe(1);
    expect(after.state).toBe("learning");
  });

  it("grade 3 (Good) gives 1d → 6d → ~15d progression", () => {
    let c = newCard(now);
    c = schedule(c, 3, now); // rep 1 → 1d
    expect(c.intervalDays).toBe(1);
    c = schedule(c, 3, now); // rep 2 → 6d
    expect(c.intervalDays).toBe(6);
    c = schedule(c, 3, now); // rep 3 → 6 * EF
    expect(c.intervalDays).toBeGreaterThanOrEqual(14);
    expect(c.intervalDays).toBeLessThanOrEqual(17);
    expect(c.state).toBe("review");
  });

  it("ease factor never drops below 1.3", () => {
    let c = newCard(now);
    for (let i = 0; i < 30; i++) c = schedule(c, 1, now);
    expect(c.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("grade 4 (Easy) extends interval further than Good", () => {
    let cGood = newCard(now);
    let cEasy = newCard(now);
    cGood = schedule(cGood, 3, now);
    cGood = schedule(cGood, 3, now);
    cEasy = schedule(cEasy, 3, now);
    cEasy = schedule(cEasy, 4, now);
    expect(cEasy.intervalDays).toBeGreaterThan(cGood.intervalDays);
  });

  it("grade 2 (Hard) shortens interval relative to Good", () => {
    let cGood = newCard(now);
    let cHard = newCard(now);
    cGood = schedule(cGood, 3, now);
    cGood = schedule(cGood, 3, now);
    cGood = schedule(cGood, 3, now);
    cHard = schedule(cHard, 3, now);
    cHard = schedule(cHard, 3, now);
    cHard = schedule(cHard, 2, now);
    expect(cHard.intervalDays).toBeLessThan(cGood.intervalDays);
  });
});
