"use client";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Headphones, FileText, ChevronDown, GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { href: "/listening", label: "Listening", icon: Headphones, jp: "聴解" },
  { href: "/reading", label: "Reading", icon: FileText, jp: "読解" },
];

export function PracticeMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const updatePos = () => {
      const rect = buttonRef.current!.getBoundingClientRect();
      setCoords({ top: rect.bottom + 6, left: rect.left });
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

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setOpen((s) => !s)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-primary-soft transition-colors whitespace-nowrap"
      >
        <GraduationCap className="w-4 h-4" />
        <span className="hidden md:inline">Practice</span>
        <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {mounted && open && coords &&
        createPortal(
          <div
            ref={menuRef}
            style={{ position: "fixed", top: coords.top, left: coords.left, zIndex: 100 }}
            className="w-48 rounded-lg border border-border bg-background shadow-xl p-1"
          >
            {ITEMS.map((it) => {
              const Icon = it.icon;
              return (
                <Link
                  key={it.href}
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 px-2.5 py-2 rounded text-sm hover:bg-primary-soft text-foreground transition-colors"
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="flex-1">{it.label}</span>
                  <span className="jp text-xs text-muted">{it.jp}</span>
                </Link>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
