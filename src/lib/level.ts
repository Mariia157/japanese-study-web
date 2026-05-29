import { cookies } from "next/headers";

export const LEVEL_COOKIE = "jlpt-level";

export async function getCurrentLevel(): Promise<number> {
  const c = await cookies();
  const lvl = Number(c.get(LEVEL_COOKIE)?.value);
  return [1, 2, 3, 4, 5].includes(lvl) ? lvl : 5;
}
