import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";

const Body = z.object({ mnemonic: z.string().max(2000) });

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kanjiId = Number(id);
  if (!Number.isInteger(kanjiId)) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  const body = Body.safeParse(await req.json().catch(() => null));
  if (!body.success) return NextResponse.json({ error: "Bad body" }, { status: 400 });

  await db.kanji.update({ where: { id: kanjiId }, data: { mnemonic: body.data.mnemonic || null } });
  return NextResponse.json({ ok: true });
}
