"use client";
import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Play, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = { q: string; choices: string[]; answer: string };

export function ListeningExercise({
  title,
  transcript,
  english,
  audioUrl,
  questions,
}: {
  title: string;
  transcript: string;
  english: string;
  audioUrl?: string | null;
  questions: Question[];
}) {
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [checked, setChecked] = useState(false);

  function play() {
    if (audioUrl && typeof window !== "undefined") {
      new Audio(audioUrl).play().catch(() => speakFallback(transcript));
    } else {
      speakFallback(transcript);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardBody className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button onClick={play}><Play className="w-4 h-4" />Play</Button>
          <Button variant="soft" onClick={() => setShowTranscript((s) => !s)}>
            {showTranscript ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </Button>
        </div>
        {showTranscript && (
          <div className="text-sm space-y-1 bg-primary-soft px-3 py-2 rounded-lg">
            <div className="jp">{transcript}</div>
            <div className="text-muted">{english}</div>
          </div>
        )}
        <div className="space-y-3">
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

function speakFallback(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  u.rate = 0.95;
  window.speechSynthesis.speak(u);
}
