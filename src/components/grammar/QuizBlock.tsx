"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Ex = {
  id: number;
  type: "mcq" | "fill" | "translate";
  prompt: string;
  choices: string[];
  answer: string;
  explanation?: string | null;
};

export function QuizBlock({ exercises }: { exercises: Ex[] }) {
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  if (exercises.length === 0) return null;
  const ex = exercises[i];
  if (!ex) {
    return (
      <div className="text-center py-8 space-y-2">
        <div className="text-2xl">🎉</div>
        <p className="font-medium">Quiz complete — {score}/{exercises.length} correct</p>
        <Button variant="soft" size="sm" onClick={() => { setI(0); setScore(0); setInput(""); setChecked(false); }}>
          Restart
        </Button>
      </div>
    );
  }

  const isCorrect = input.trim().toLowerCase() === ex.answer.trim().toLowerCase();

  function next() {
    if (checked && isCorrect) setScore((s) => s + 1);
    setI((x) => x + 1);
    setInput("");
    setChecked(false);
  }

  return (
    <div className="space-y-3">
      <div className="text-xs text-muted">Question {i + 1} / {exercises.length}</div>
      <div className="text-base jp">{ex.prompt}</div>

      {ex.type === "mcq" ? (
        <div className="grid sm:grid-cols-2 gap-2">
          {ex.choices.map((c) => (
            <button
              key={c}
              disabled={checked}
              onClick={() => { setInput(c); setChecked(true); }}
              className={cn(
                "px-3 py-2 rounded-lg border text-left jp text-sm transition-colors",
                checked && c === ex.answer && "border-success bg-emerald-50",
                checked && c === input && c !== ex.answer && "border-danger bg-red-50",
                !checked && "border-border hover:border-primary hover:bg-primary-soft"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      ) : (
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={checked}
          placeholder="Type your answer…"
          className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary jp"
        />
      )}

      {checked && (
        <div className={cn(
          "flex items-start gap-2 text-sm px-3 py-2 rounded-lg",
          isCorrect ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"
        )}>
          {isCorrect ? <Check className="w-4 h-4 mt-0.5" /> : <X className="w-4 h-4 mt-0.5" />}
          <div>
            <div className="font-medium">{isCorrect ? "Correct!" : `Answer: ${ex.answer}`}</div>
            {ex.explanation && <div className="text-xs mt-1 opacity-80">{ex.explanation}</div>}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        {!checked && ex.type !== "mcq" && (
          <Button onClick={() => setChecked(true)} disabled={!input.trim()}>Check</Button>
        )}
        {checked && (
          <Button variant="primary" onClick={next}>{i < exercises.length - 1 ? "Next" : "Finish"}</Button>
        )}
      </div>
    </div>
  );
}
