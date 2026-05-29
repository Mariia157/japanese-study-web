import { NextResponse } from "next/server";
import { z } from "zod";
import { createCardIfMissing } from "@/lib/srs/queue";

const Body = z.object({
  itemType: z.enum(["kanji", "vocab", "grammar"]),
  itemId: z.number().int().positive(),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  const id = await createCardIfMissing(parsed.data.itemType, parsed.data.itemId);
  return NextResponse.json({ cardId: id });
}
