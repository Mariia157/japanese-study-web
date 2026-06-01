"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as wanakana from "wanakana";
import { Button } from "@/components/ui/Button";
import { Check, X, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "@/lib/i18n-shared";

export type Ex = {
  id: number;
  type: "mcq" | "fill" | "arrange" | "translate";
  prompt: string;
  choices: string[];
  answer: string;
  explanation?: string | null;
};

export type QuizLabels = {
  progress: string; score: string; next: string; check: string; restart: string; reset: string;
  correct: string; answer: string; quizComplete: string;
  pctPerfect: string; pctGreat: string; pctKeep: string;
  arrangeToForm: string; arrangeHint: string;
  placeholderTranslate: string; placeholderAnswer: string;
  romajiHintPre: string; romajiHintMid: string;
};

const DEFAULT_LABELS: QuizLabels = {
  progress: "Question {i} / {total}", score: "Score: {score}", next: "Next", check: "Check",
  restart: "Restart", reset: "Reset", correct: "Correct!", answer: "Answer",
  quizComplete: "Quiz complete — {score}/{total} correct",
  pctPerfect: "{pct}% — Perfect!", pctGreat: "{pct}% — Great job!", pctKeep: "{pct}% — Keep practicing!",
  arrangeToForm: "Arrange to form:", arrangeHint: "Click tokens below to assemble the sentence",
  placeholderTranslate: "Type Japanese (romaji auto-converts)", placeholderAnswer: "Type the answer…",
  romajiHintPre: "Type romaji like", romajiHintMid: "and it auto-converts to",
};

export function QuizBlock({ exercises, labels = DEFAULT_LABELS, onComplete }: { exercises: Ex[]; labels?: QuizLabels; onComplete?: (correct: number, total: number) => void }) {
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  if (exercises.length === 0) return null;

  function next(correct: boolean) {
    const newScore = score + (correct ? 1 : 0);
    setScore(newScore);
    if (i < exercises.length - 1) {
      setI(i + 1);
    } else {
      setCompleted(true);
      onComplete?.(newScore, exercises.length);
    }
  }

  function restart() {
    setI(0);
    setScore(0);
    setCompleted(false);
  }

  if (completed) {
    const pct = Math.round((score / exercises.length) * 100);
    const pctTmpl = score === exercises.length ? labels.pctPerfect : score >= exercises.length * 0.7 ? labels.pctGreat : labels.pctKeep;
    return (
      <div className="text-center py-8 space-y-2">
        <div className="text-3xl">{score === exercises.length ? "🎉" : score >= exercises.length * 0.7 ? "👏" : "💪"}</div>
        <p className="text-lg font-medium">{format(labels.quizComplete, { score, total: exercises.length })}</p>
        <p className="text-sm text-muted">{format(pctTmpl, { pct })}</p>
        <Button variant="soft" size="sm" onClick={restart} className="mt-3">
          <RotateCcw className="w-4 h-4" />
          {labels.restart}
        </Button>
      </div>
    );
  }

  const ex = exercises[i];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{format(labels.progress, { i: i + 1, total: exercises.length })}</span>
        <span className="text-muted">{format(labels.score, { score })}</span>
      </div>
      <div className="h-1 w-full bg-primary-soft rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${((i + 1) / exercises.length) * 100}%` }} />
      </div>
      <ExerciseView key={ex.id} ex={ex} labels={labels} onAnswer={next} />
    </div>
  );
}

function ExerciseView({ ex, labels, onAnswer }: { ex: Ex; labels: QuizLabels; onAnswer: (correct: boolean) => void }) {
  if (ex.type === "mcq") return <McqEx ex={ex} labels={labels} onAnswer={onAnswer} />;
  if (ex.type === "arrange") return <ArrangeEx ex={ex} labels={labels} onAnswer={onAnswer} />;
  return <TextEx ex={ex} labels={labels} onAnswer={onAnswer} />;
}

function McqEx({ ex, labels, onAnswer }: { ex: Ex; labels: QuizLabels; onAnswer: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<string | null>(null);
  const correct = picked === ex.answer;
  return (
    <div className="space-y-3">
      <div className="text-base jp">{ex.prompt}</div>
      <div className="grid sm:grid-cols-2 gap-2">
        {ex.choices.map((c) => (
          <button
            key={c}
            disabled={picked !== null}
            onClick={() => setPicked(c)}
            className={cn(
              "px-3 py-2 rounded-lg border text-left jp text-sm transition-colors",
              picked !== null && c === ex.answer && "border-success bg-emerald-50",
              picked !== null && c === picked && c !== ex.answer && "border-danger bg-red-50",
              picked === null && "border-border hover:border-primary hover:bg-primary-soft"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {picked !== null && (
        <>
          <FeedbackBlock correct={correct} answer={ex.answer} explanation={ex.explanation} labels={labels} />
          <Button onClick={() => onAnswer(correct)}>{labels.next}</Button>
        </>
      )}
    </div>
  );
}

function TextEx({ ex, labels, onAnswer }: { ex: Ex; labels: QuizLabels; onAnswer: (correct: boolean) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const el = inputRef.current;
    wanakana.bind(el, { IMEMode: "toHiragana" });
    return () => {
      try { wanakana.unbind(el); } catch { /* noop */ }
    };
  }, []);

  const checked = submitted !== null;
  const correct = checked && normalize(submitted!) === normalize(ex.answer);

  function check() {
    // Read the live DOM value — wanakana mutates it, and an uncontrolled input keeps it in sync.
    const raw = inputRef.current?.value ?? "";
    if (!raw.trim()) return;
    setSubmitted(raw);
  }

  return (
    <div className="space-y-3">
      <div className="text-base jp">{ex.prompt}</div>
      <input
        ref={inputRef}
        defaultValue=""
        onKeyDown={(e) => {
          if (e.key === "Enter" && !checked) check();
          else if (e.key === "Enter" && checked) onAnswer(correct);
        }}
        readOnly={checked}
        placeholder={ex.type === "translate" ? labels.placeholderTranslate : labels.placeholderAnswer}
        className="w-full px-3 py-2 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary jp text-base"
      />
      <p className="text-[11px] text-muted">{labels.romajiHintPre} <code className="px-1 py-0.5 bg-primary-soft rounded font-mono text-[10px]">watashi</code> {labels.romajiHintMid} <code className="px-1 py-0.5 bg-primary-soft rounded font-mono text-[10px]">わたし</code>.</p>
      {checked && <FeedbackBlock correct={correct} answer={ex.answer} explanation={ex.explanation} labels={labels} />}
      <div className="flex gap-2">
        {!checked ? (
          <Button onClick={check}>{labels.check}</Button>
        ) : (
          <Button onClick={() => onAnswer(correct)}>{labels.next}</Button>
        )}
      </div>
    </div>
  );
}

function ArrangeEx({ ex, labels, onAnswer }: { ex: Ex; labels: QuizLabels; onAnswer: (correct: boolean) => void }) {
  // choices are the (shuffled) tokens. answer is the correct sequence joined.
  // We treat answer as the string the assembled tokens should produce when joined without spaces.
  const initialPool = useMemo(() => shuffle(ex.choices), [ex.choices, ex.id]);
  const [pool, setPool] = useState<string[]>(initialPool);
  const [picked, setPicked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);

  const assembled = picked.join("");
  const correct = assembled === ex.answer;

  function pickToken(idx: number) {
    if (checked) return;
    const tok = pool[idx];
    setPicked([...picked, tok]);
    setPool(pool.filter((_, i) => i !== idx));
  }
  function unpickToken(idx: number) {
    if (checked) return;
    const tok = picked[idx];
    setPicked(picked.filter((_, i) => i !== idx));
    setPool([...pool, tok]);
  }
  function reset() {
    if (checked) return;
    setPool(shuffle(ex.choices));
    setPicked([]);
  }

  return (
    <div className="space-y-3">
      <div className="text-base text-muted">{labels.arrangeToForm} <span className="text-foreground font-medium">{ex.prompt}</span></div>
      <div className="min-h-[3rem] p-3 rounded-lg border-2 border-dashed border-primary-soft-2 bg-primary-soft/40 flex flex-wrap items-center gap-1.5 jp">
        {picked.length === 0 ? (
          <span className="text-xs text-muted italic">{labels.arrangeHint}</span>
        ) : (
          picked.map((tok, i) => (
            <button
              key={i}
              disabled={checked}
              onClick={() => unpickToken(i)}
              className="px-2.5 py-1 rounded-md bg-primary text-white text-base font-medium hover:bg-primary-hover disabled:opacity-80"
            >
              {tok}
            </button>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {pool.map((tok, i) => (
          <button
            key={i}
            disabled={checked}
            onClick={() => pickToken(i)}
            className="px-2.5 py-1 rounded-md border border-border bg-background hover:border-primary hover:bg-primary-soft jp text-base font-medium"
          >
            {tok}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        {!checked ? (
          <>
            <Button onClick={() => setChecked(true)} disabled={pool.length > 0}>{labels.check}</Button>
            <Button variant="ghost" size="md" onClick={reset}>
              <RotateCcw className="w-4 h-4" />
              {labels.reset}
            </Button>
          </>
        ) : (
          <Button onClick={() => onAnswer(correct)}>{labels.next}</Button>
        )}
      </div>
      {checked && <FeedbackBlock correct={correct} answer={ex.answer} explanation={ex.explanation} labels={labels} />}
    </div>
  );
}

function FeedbackBlock({ correct, answer, explanation, labels }: { correct: boolean; answer: string; explanation?: string | null; labels: QuizLabels }) {
  return (
    <div className={cn(
      "flex items-start gap-2 text-sm px-3 py-2 rounded-lg",
      correct ? "bg-emerald-50 text-emerald-900" : "bg-red-50 text-red-900"
    )}>
      {correct ? <Check className="w-4 h-4 mt-0.5 shrink-0" /> : <X className="w-4 h-4 mt-0.5 shrink-0" />}
      <div className="min-w-0">
        <div className="font-medium">{correct ? labels.correct : <span>{labels.answer}: <span className="jp">{answer}</span></span>}</div>
        {explanation && <div className="text-xs mt-1 opacity-80">{explanation}</div>}
      </div>
    </div>
  );
}

function normalize(s: string): string {
  return s.trim().replace(/\s+/g, "").toLowerCase();
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  // deterministic shuffle by index — avoids hydration mismatch (no Math.random in seeds)
  // light Fisher-Yates with index-based pseudo-random
  let seed = a.length * 7919;
  for (let i = a.length - 1; i > 0; i--) {
    seed = (seed * 9301 + 49297) % 233280;
    const j = Math.floor((seed / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
