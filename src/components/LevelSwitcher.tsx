"use client";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
    const upd = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, right: window.innerWidth - rect.right });
    };
    upd();
    window.addEventListener("scroll", upd, true);
    window.addEventListener("resize", upd);
    return () => {
      window.removeEventListener("scroll", upd, true);
      window.removeEventListener("resize", upd);
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
        className="px-4 flex flex-col items-center justify-center hover:bg-ochre-soft transition-colors min-w-[68px]"
      >
        <span className="serif text-2xl font-bold leading-none text-ochre tabular-nums">N{level}</span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-muted mt-1 font-bold">Level</span>
      </button>
      {mounted && open && coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, right: coords.right, zIndex: 100 }}
            className="w-40 border border-border bg-surface p-1"
          >
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => pick(l)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm flex items-baseline gap-2 transition-colors",
                  l === level
                    ? "bg-ochre text-foreground font-bold"
                    : "hover:bg-ochre-soft"
                )}
              >
                <span className="serif text-lg font-bold tabular-nums">N{l}</span>
                <span className="text-xs opacity-70">{describe(l)}</span>
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
