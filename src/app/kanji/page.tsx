import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { getCurrentLevel } from "@/lib/level";
import { getT, getLocale } from "@/lib/i18n";
import { pickL } from "@/lib/i18n-shared";

export const dynamic = "force-dynamic";

export default async function KanjiPage() {
  const level = await getCurrentLevel();
  const t = await getT();
  const locale = await getLocale();
  const kanji = await db.kanji.findMany({
    where: { jlptLevel: level },
    orderBy: { id: "asc" },
    take: 300,
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">{t("kanji.title")}</h1>
        <p className="text-sm text-muted mt-1">{t("kanji.summary", { level, count: kanji.length })}</p>
      </header>
      {kanji.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">{t("kanji.empty")}</CardBody>
        </Card>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {kanji.map((k) => (
            <Link key={k.id} href={`/kanji/${encodeURIComponent(k.character)}`}>
              <Card className="hover:border-primary transition-colors h-full">
                <CardBody className="flex flex-col items-center gap-1 py-4">
                  <span className="jp text-4xl font-medium text-primary">{k.character}</span>
                  <span className="text-xs text-muted text-center line-clamp-1">
                    {(JSON.parse(pickL(locale, k.meanings, k.meaningsUk)) as string[])[0]}
                  </span>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
