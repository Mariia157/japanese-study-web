"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = { q: string; choices: string[]; answer: string };

export function ReadingExerciseView({
  title,
  text,
  english,
  questions,
  showLabel = "Show translation",
  hideLabel = "Hide translation",
  checkLabel = "Check answers",
  scoreTpl = "Score: {score} / {total}",
  startLabel = "Start exercise",
  collapseLabel = "Collapse",
  embedded = false,
}: {
  title: string;
  text: string;
  english: string;
  questions: Question[];
  showLabel?: string;
  hideLabel?: string;
  checkLabel?: string;
  scoreTpl?: string;
  startLabel?: string;
  collapseLabel?: string;
  embedded?: boolean;
}) {
  const [open, setOpen] = useState(embedded);
  const [showTrans, setShowTrans] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  const body = (
    <div className="space-y-3 flex-1 flex flex-col">
      <div className={cn(
        "jp text-base whitespace-pre-wrap leading-relaxed bg-primary-soft px-4 py-3 rounded-lg",
        !open && !embedded && "line-clamp-3"
      )}>
        {text}
      </div>
      {!embedded && (
        <Button
          size="md"
          variant={open ? "soft" : "primary"}
          onClick={() => setOpen((v) => !v)}
          className="w-full sm:w-auto"
        >
          {open ? collapseLabel : startLabel}
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      )}
      {open && (
        <>
          <Button variant="soft" size="sm" onClick={() => setShowTrans((s) => !s)}>
            {showTrans ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showTrans ? hideLabel : showLabel}
          </Button>
          {showTrans && (
            <div className="text-sm text-muted whitespace-pre-wrap leading-relaxed">{english}</div>
          )}
          <div className="space-y-3 pt-2">
            {questions.map((q, i) => (
              <div key={i} className="space-y-2">
                <div className="text-sm font-medium">{i + 1}. {q.q}</div>
                <div className="grid sm:grid-cols-2 gap-2">
                  {q.choices.map((c) => (
                    <button
                      key={c}
                      disabled={checked}
                      onClick={() => setAnswers((a) => ({ ...a, [i]: c }))}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-left text-sm transition-colors jp",
                        checked && c === q.answer && "border-success bg-emerald-50",
                        checked && c === answers[i] && c !== q.answer && "border-danger bg-red-50",
                        !checked && answers[i] === c && "border-primary bg-primary-soft",
                        !checked && answers[i] !== c && "border-border hover:border-primary",
                      )}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {!checked ? (
            <Button onClick={() => setChecked(true)} disabled={Object.keys(answers).length < questions.length}>
              {checkLabel}
            </Button>
          ) : (
            <div className="text-sm font-medium">
              {scoreTpl
                .replace("{score}", String(questions.filter((q, i) => answers[i] === q.answer).length))
                .replace("{total}", String(questions.length))}
            </div>
          )}
        </>
      )}
    </div>
  );

  if (embedded) return body;
  return (
    <Card className="min-h-[260px] flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      <CardBody className="flex-1 flex flex-col">{body}</CardBody>
    </Card>
  );
}
