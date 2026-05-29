"use client";
import { useEffect, useState } from "react";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Sparkles, Volume2 } from "lucide-react";
import { Furigana } from "@/components/Furigana";

type Item = {
  cardId: number;
  itemType: "kanji" | "vocab" | "grammar";
  itemId: number;
  state: string;
  payload: Record<string, unknown>;
};

export function ReviewSession({ initial }: { initial: Item[] }) {
  const [queue, setQueue] = useState<Item[]>(initial);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [xpToast, setXpToast] = useState<string | null>(null);

  const current = queue[0];

  useEffect(() => {
    if (!xpToast) return;
    const t = setTimeout(() => setXpToast(null), 1800);
    return () => clearTimeout(t);
  }, [xpToast]);

  async function grade(g: 1 | 2 | 3 | 4) {
    if (!current) return;
    const res = await fetch("/api/srs/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cardId: current.cardId, grade: g }),
    });
    const data = await res.json();
    if (data.xpGained > 0) setXpToast(`+${data.xpGained} XP`);
    if (data.newAchievements?.length) {
      setXpToast(`🏆 ${data.newAchievements[0]}`);
    }
    setQueue((q) => q.slice(1));
    setRevealed(false);
    setDone((d) => d + 1);
  }

  if (!current) {
    return (
      <Card>
        <CardBody className="text-center py-16 space-y-3">
          <div className="text-5xl">🎉</div>
          <h2 className="text-xl font-semibold">All done!</h2>
          <p className="text-muted text-sm">
            You reviewed {done} card{done === 1 ? "" : "s"} this session.
          </p>
          <a href="/">
            <Button variant="soft" className="mt-2">Back home</Button>
          </a>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="space-y-4 relative">
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{done + queue.length} total · {done} done</span>
        <span className="uppercase tracking-wide font-medium text-primary">
          {current.itemType}
        </span>
      </div>
      <CardFace item={current} revealed={revealed} />
      {!revealed ? (
        <Button size="lg" className="w-full" onClick={() => setRevealed(true)}>
          Show answer
        </Button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          <Button variant="danger" onClick={() => grade(1)}>Again</Button>
          <Button variant="outline" onClick={() => grade(2)}>Hard</Button>
          <Button onClick={() => grade(3)}>Good</Button>
          <Button variant="success" onClick={() => grade(4)}>Easy</Button>
        </div>
      )}
      {xpToast && (
        <div className="fixed bottom-6 right-6 px-4 py-2 rounded-md bg-accent text-white text-sm font-medium animate-pop flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {xpToast}
        </div>
      )}
    </div>
  );
}

function CardFace({ item, revealed }: { item: Item; revealed: boolean }) {
  const p = item.payload as Record<string, unknown>;
  return (
    <Card className="min-h-[280px]">
      <CardBody className="flex flex-col items-center justify-center gap-4 py-12 text-center">
        {item.itemType === "vocab" && (
          <>
            {revealed ? (
              <Furigana
                word={String(p.word)}
                reading={String(p.reading)}
                size="xl"
                className="text-5xl font-medium"
              />
            ) : (
              <div className="jp text-5xl font-medium">{String(p.word)}</div>
            )}
            {revealed && (
              <>
                <div className="text-base">{(p.meanings as string[])?.join(", ")}</div>
                <SpeakButton text={String(p.word)} />
              </>
            )}
          </>
        )}
        {item.itemType === "kanji" && (
          <>
            <div className="jp text-7xl font-medium text-primary">{String(p.character)}</div>
            {revealed && (
              <div className="space-y-2">
                <div className="text-lg font-medium">{(p.meanings as string[])?.join(", ")}</div>
                <div className="text-sm text-muted">
                  <span className="font-medium">On:</span> {(p.onReadings as string[])?.join(", ") || "—"}{" · "}
                  <span className="font-medium">Kun:</span> {(p.kunReadings as string[])?.join(", ") || "—"}
                </div>
                {p.mnemonic ? (
                  <div className="mt-3 px-4 py-2 bg-primary-soft rounded-lg text-sm text-foreground max-w-md">
                    💡 {String(p.mnemonic)}
                  </div>
                ) : null}
              </div>
            )}
          </>
        )}
        {item.itemType === "grammar" && (
          <>
            <div className="text-2xl font-semibold">{String(p.title)}</div>
            {revealed && Array.isArray(p.examples) && (
              <div className="space-y-2 max-w-md">
                {(p.examples as { jp: string; en: string }[]).slice(0, 2).map((ex, i) => (
                  <div key={i} className="text-left text-sm bg-primary-soft px-3 py-2 rounded">
                    <div className="jp">{ex.jp}</div>
                    <div className="text-muted">{ex.en}</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {!revealed && (
          <p className="text-xs text-muted">
            {item.itemType === "kanji" ? "Recall meaning + readings" :
             item.itemType === "vocab" ? "Recall reading + meaning" :
             "Recall the grammar pattern"}
          </p>
        )}
      </CardBody>
    </Card>
  );
}

function SpeakButton({ text }: { text: string }) {
  function speak() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ja-JP";
    utter.rate = 0.9;
    window.speechSynthesis.speak(utter);
  }
  return (
    <button
      onClick={speak}
      className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover"
    >
      <Volume2 className="w-3.5 h-3.5" />
      Listen
    </button>
  );
}
