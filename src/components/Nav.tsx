import Link from "next/link";
import { Flame, BookOpen, Languages, Sparkles, Home as HomeIcon, BarChart3 } from "lucide-react";
import { getCurrentLevel } from "@/lib/level";
import { LevelSwitcher } from "@/components/LevelSwitcher";
import { PracticeMenu } from "@/components/PracticeMenu";

const links = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/grammar", label: "Grammar", icon: BookOpen },
  { href: "/vocabulary", label: "Vocabulary", icon: Languages },
];

export async function Nav() {
  const level = await getCurrentLevel();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="grid place-items-center w-8 h-8 rounded-lg bg-primary text-white text-sm jp">日</span>
          <span className="hidden sm:inline">Nihongo SRS</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-primary-soft transition-colors whitespace-nowrap"
              >
                <Icon className="w-4 h-4" />
                <span className="hidden md:inline">{l.label}</span>
              </Link>
            );
          })}
          <PracticeMenu />
        </nav>
        <div className="flex-1" />
        <Link
          href="/stats"
          className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-md text-muted hover:text-foreground hover:bg-primary-soft transition-colors"
          title="Stats"
        >
          <BarChart3 className="w-4 h-4" />
        </Link>
        <LevelSwitcher current={level} />
        <StreakBadge />
      </div>
    </header>
  );
}

async function StreakBadge() {
  let streak = 0;
  let xp = 0;
  try {
    const { getStats } = await import("@/lib/xp");
    const s = await getStats();
    streak = s.streakDays;
    xp = s.xp;
  } catch {
    // db not yet ready
  }
  return (
    <div className="flex items-center gap-2">
      <div className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-primary-soft text-primary font-medium">
        <Sparkles className="w-3.5 h-3.5" />
        {xp} XP
      </div>
      <div className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-medium">
        <Flame className="w-3.5 h-3.5" />
        {streak}
      </div>
    </div>
  );
}
