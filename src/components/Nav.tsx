import Image from "next/image";
import Link from "next/link";
import { Flame } from "lucide-react";
import { getCurrentLevel } from "@/lib/level";
import { getT, getLocale } from "@/lib/i18n";
import { LevelSwitcher } from "@/components/LevelSwitcher";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { PracticeMenu } from "@/components/PracticeMenu";

export async function Nav() {
  const [level, locale, t] = await Promise.all([getCurrentLevel(), getLocale(), getT()]);
  const links = [
    { href: "/", label: t("nav.home") },
    { href: "/grammar", label: t("nav.grammar") },
    { href: "/vocabulary", label: t("nav.vocab_short") },
  ];
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/carp.png" alt="Nihongo SRS" width={36} height={36} className="rounded-full" priority />
          <span className="hidden sm:inline">Nihongo SRS</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-primary-soft transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
          <PracticeMenu practiceLabel={t("nav.practice")} listeningLabel={t("nav.listening")} readingLabel={t("nav.reading")} />
        </nav>
        <div className="flex-1" />
        <Link
          href="/stats"
          className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-md text-sm text-muted hover:text-foreground hover:bg-primary-soft transition-colors"
        >
          {t("nav.stats")}
        </Link>
        <LocaleSwitcher current={locale} />
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
      <div className="hidden sm:inline-flex items-center h-8 px-3 rounded-md bg-primary-soft text-primary text-sm font-semibold">
        {xp} XP
      </div>
      <div className="inline-flex items-center gap-1 h-8 px-3 rounded-md bg-accent text-white text-sm font-semibold">
        <Flame className="w-3.5 h-3.5" />
        {streak}
      </div>
    </div>
  );
}
