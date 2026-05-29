import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { schedule, type Grade } from "@/lib/srs/sm2";
import { recordReview } from "@/lib/xp";

const Body = z.object({
  cardId: z.number().int().positive(),
  grade: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const { cardId, grade } = parsed.data;

  const card = await db.srsCard.findUnique({ where: { id: cardId } });
  if (!card) return NextResponse.json({ error: "Card not found" }, { status: 404 });

  const now = new Date();
  const prevInterval = card.intervalDays;
  const next = schedule(
    {
      easeFactor: card.easeFactor,
      intervalDays: card.intervalDays,
      repetitions: card.repetitions,
      dueAt: card.dueAt,
      state: card.state as "new" | "learning" | "review" | "suspended",
    },
    grade as Grade,
    now
  );

  await db.srsCard.update({
    where: { id: cardId },
    data: {
      easeFactor: next.easeFactor,
      intervalDays: next.intervalDays,
      repetitions: next.repetitions,
      dueAt: next.dueAt,
      lastReviewedAt: now,
      state: next.state,
    },
  });
  await db.reviewLog.create({
    data: { cardId, grade, prevInterval, newInterval: next.intervalDays },
  });

  const xp = await recordReview(grade as Grade);
  return NextResponse.json({ next, ...xp });
}
