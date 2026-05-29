"use client";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const LEVELS = [5, 4, 3, 2, 1] as const;

export function LevelSwitcher({ current }: { current: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [level, setLevel] = useState(current);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => setLevel(current), [current]);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const updatePos = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    };
    updatePos();
    window.addEventListener("scroll", updatePos, true);
    window.addEventListener("resize", updatePos);
    return () => {
      window.removeEventListener("scroll", updatePos, true);
      window.removeEventListener("resize", updatePos);
    };
  }, [open]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node;
      if (buttonRef.current?.contains(t)) return;
      if (menuRef.current?.contains(t)) return;
      setOpen(false);
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
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-1 h-8 px-3 rounded-md text-sm font-semibold bg-primary-soft text-primary hover:bg-primary-soft-2 transition-colors"
      >
        N{level}
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {mounted && open && coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, right: coords.right, zIndex: 100 }}
            className="w-36 rounded-lg border border-border bg-background shadow-xl p-1"
          >
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
          </div>,
          document.body
        )}
    </>
  );
}

function describe(l: number): string {
  return l === 5 ? "beginner" : l === 4 ? "elementary" : l === 3 ? "intermediate" : l === 2 ? "upper-int." : "advanced";
}
