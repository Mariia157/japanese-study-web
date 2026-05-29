import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { LOCALE_COOKIE } from "@/lib/i18n-shared";

const Body = z.object({ locale: z.union([z.literal("en"), z.literal("uk")]) });

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Bad locale" }, { status: 400 });
  const c = await cookies();
  c.set(LOCALE_COOKIE, parsed.data.locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return NextResponse.json({ ok: true });
}
