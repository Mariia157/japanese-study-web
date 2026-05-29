import { db } from "@/lib/db";

export type QueueItem = {
  cardId: number;
  itemType: "kanji" | "vocab" | "grammar";
  itemId: number;
  state: "new" | "learning" | "review" | "suspended";
  dueAt: Date;
  payload: Record<string, unknown>;
};

const NEW_PER_DAY_DEFAULT = 10;

export async function getReviewQueue(limit = 30): Promise<QueueItem[]> {
  const now = new Date();
  // Pull due cards (not suspended). Mix learning/review first, then top up with new.
  const due = await db.srsCard.findMany({
    where: { dueAt: { lte: now }, state: { in: ["learning", "review"] } },
    orderBy: { dueAt: "asc" },
    take: limit,
  });

  const newSlots = Math.max(0, NEW_PER_DAY_DEFAULT - (await newReviewedToday()));
  const news = newSlots > 0
    ? await db.srsCard.findMany({
        where: { state: "new" },
        orderBy: { id: "asc" },
        take: newSlots,
      })
    : [];

  const all = [...due, ...news];
  const payloads = await loadPayloads(all);
  return all.map((c) => ({
    cardId: c.id,
    itemType: c.itemType as QueueItem["itemType"],
    itemId: c.itemId,
    state: c.state as QueueItem["state"],
    dueAt: c.dueAt,
    payload: payloads.get(`${c.itemType}:${c.itemId}`) ?? {},
  }));
}

async function newReviewedToday(): Promise<number> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  return db.reviewLog.count({
    where: {
      reviewedAt: { gte: start },
      prevInterval: 0,
    },
  });
}

async function loadPayloads(cards: { itemType: string; itemId: number }[]) {
  const byType: Record<string, number[]> = {};
  for (const c of cards) (byType[c.itemType] ??= []).push(c.itemId);

  const payloads = new Map<string, Record<string, unknown>>();

  if (byType.vocab?.length) {
    const items = await db.vocabulary.findMany({ where: { id: { in: byType.vocab } } });
    for (const v of items)
      payloads.set(`vocab:${v.id}`, {
        word: v.word,
        reading: v.reading,
        meanings: JSON.parse(v.meanings),
        partOfSpeech: JSON.parse(v.partOfSpeech),
        jlptLevel: v.jlptLevel,
      });
  }
  if (byType.kanji?.length) {
    const items = await db.kanji.findMany({ where: { id: { in: byType.kanji } } });
    for (const k of items)
      payloads.set(`kanji:${k.id}`, {
        character: k.character,
        meanings: JSON.parse(k.meanings),
        onReadings: JSON.parse(k.onReadings),
        kunReadings: JSON.parse(k.kunReadings),
        jlptLevel: k.jlptLevel,
        mnemonic: k.mnemonic,
      });
  }
  if (byType.grammar?.length) {
    const items = await db.grammarPoint.findMany({ where: { id: { in: byType.grammar } } });
    for (const g of items)
      payloads.set(`grammar:${g.id}`, {
        title: g.title,
        jlptLevel: g.jlptLevel,
        slug: g.slug,
        examples: JSON.parse(g.examples),
      });
  }
  return payloads;
}

export async function ensureCardsExist(): Promise<void> {
  // Lazily create SrsCard rows for any content that doesn't have one yet.
  // Called from listing pages when user clicks "Add to study queue".
}

export async function createCardIfMissing(
  itemType: QueueItem["itemType"],
  itemId: number
): Promise<number> {
  const existing = await db.srsCard.findUnique({ where: { itemType_itemId: { itemType, itemId } } });
  if (existing) return existing.id;
  const created = await db.srsCard.create({
    data: {
      itemType,
      itemId,
      easeFactor: 2.5,
      intervalDays: 0,
      repetitions: 0,
      state: "new",
      dueAt: new Date(),
    },
  });
  return created.id;
}
