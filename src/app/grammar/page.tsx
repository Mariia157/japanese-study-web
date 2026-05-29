import Link from "next/link";
import { db } from "@/lib/db";
import { Card, CardBody } from "@/components/ui/Card";
import { ChevronRight } from "lucide-react";
import { getCurrentLevel } from "@/lib/level";

export const dynamic = "force-dynamic";

export default async function GrammarPage() {
  const level = await getCurrentLevel();
  const points = await db.grammarPoint.findMany({
    where: { jlptLevel: level },
    orderBy: { id: "asc" },
  });

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-3xl font-semibold">Grammar</h1>
        <p className="text-sm text-muted mt-1">Showing N{level} grammar points ({points.length}). Change level in the navbar.</p>
      </header>
      {points.length === 0 ? (
        <Card>
          <CardBody className="py-12 text-center text-muted">
            No grammar at this level yet.
          </CardBody>
        </Card>
      ) : (
        <div className="grid gap-2">
          {points.map((g) => (
            <Link key={g.id} href={`/grammar/${g.slug}`}>
              <Card className="hover:border-primary transition-colors">
                <CardBody className="flex items-center justify-between py-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{g.title}</div>
                    {g.source && <div className="text-xs text-muted">{g.source}</div>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted" />
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
