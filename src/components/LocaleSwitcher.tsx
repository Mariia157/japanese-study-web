"use client";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { LOCALES, type Locale } from "@/lib/i18n-shared";

export function LocaleSwitcher({ current }: { current: Locale }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

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

  async function pick(l: Locale) {
    setOpen(false);
    await fetch("/api/locale", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: l }),
    });
    router.refresh();
  }

  const currentMeta = LOCALES.find((l) => l.code === current) ?? LOCALES[0];

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((s) => !s)}
        className="px-4 flex flex-col items-center justify-center hover:bg-pine-soft transition-colors min-w-[60px]"
      >
        <span className="serif text-2xl font-bold leading-none text-pine">{currentMeta.flag}</span>
        <span className="text-[8px] uppercase tracking-[0.2em] text-muted mt-1 font-bold">Lang</span>
      </button>
      {mounted && open && coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, right: coords.right, zIndex: 100 }}
            className="w-44 border border-border bg-surface p-1"
          >
            {LOCALES.map((l) => (
              <button
                key={l.code}
                onClick={() => pick(l.code)}
                className={cn(
                  "w-full text-left px-3 py-2 text-sm flex items-baseline gap-2 transition-colors",
                  l.code === current
                    ? "bg-pine text-white font-bold"
                    : "hover:bg-pine-soft"
                )}
              >
                <span className="serif text-lg font-bold">{l.flag}</span>
                <span>{l.label}</span>
              </button>
            ))}
          </div>,
          document.body
        )}
    </>
  );
}
