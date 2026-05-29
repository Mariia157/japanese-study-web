"use client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = [5, 4, 3, 2, 1] as const;

export function LevelSwitcher({ current }: { current: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [level, setLevel] = useState(current);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setLevel(current), [current]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  async function pick(l: number) {
    setLevel(l);
    setOpen(false);
    await fetch("/api/level", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ level: l }),
    });
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-semibold bg-primary-soft text-primary hover:bg-primary-soft-2 transition-colors"
      >
        N{level}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1.5 w-32 rounded-lg border border-border bg-background shadow-lg p-1 z-50">
          {LEVELS.map((l) => (
            <button
              key={l}
              onClick={() => pick(l)}
              className={cn(
                "w-full text-left px-2.5 py-1.5 rounded text-sm transition-colors",
                l === level
                  ? "bg-primary text-white"
                  : "hover:bg-primary-soft text-foreground"
              )}
            >
              N{l} <span className="text-xs opacity-70 ml-1">{describe(l)}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function describe(l: number): string {
  return l === 5 ? "beginner" : l === 4 ? "elementary" : l === 3 ? "intermediate" : l === 2 ? "upper-int." : "advanced";
}
