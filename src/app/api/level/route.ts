import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { LEVEL_COOKIE } from "@/lib/level";

const Body = z.object({ level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad level" }, { status: 400 });
  const c = await cookies();
  c.set(LEVEL_COOKIE, String(parsed.data.level), {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return NextResponse.json({ ok: true });
}
