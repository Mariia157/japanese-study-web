import { NextResponse } from "next/server";
import { getReviewQueue } from "@/lib/srs/queue";

export async function GET() {
  try {
    const queue = await getReviewQueue(30);
    return NextResponse.json({ queue });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
