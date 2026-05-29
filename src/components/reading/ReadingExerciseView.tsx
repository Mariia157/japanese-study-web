"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = { q: string; choices: string[]; answer: string };

export function ReadingExerciseView({
  title,
  text,
  english,
  questions,
}: {
  title: string;
  text: string;
  english: string;
  questions: Question[];
}) {
  const [showTrans, setShowTrans] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="jp text-base whitespace-pre-wrap leading-relaxed bg-primary-soft px-4 py-3 rounded-lg">
          {text}
        </div>
        <Button variant="soft" size="sm" onClick={() => setShowTrans((s) => !s)}>
          {showTrans ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showTrans ? "Hide translation" : "Show translation"}
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
            Check answers
          </Button>
        ) : (
          <div className="text-sm font-medium">
            Score: {questions.filter((q, i) => answers[i] === q.answer).length} / {questions.length}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
