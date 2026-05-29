import Image from "next/image";
import Link from "next/link";
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-stretch gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/torii.png" alt="Nihongo SRS" width={36} height={36} priority />
          <span className="hidden sm:inline">Nihongo SRS</span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex items-center px-3 py-1.5 text-sm text-muted hover:text-foreground hover:bg-vermilion-soft transition-colors whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
          <PracticeMenu practiceLabel={t("nav.practice")} listeningLabel={t("nav.listening")} readingLabel={t("nav.reading")} />
        </nav>
        <div className="flex-1" />
        <Link
          href="/stats"
          className="hidden sm:inline-flex items-center px-3 text-sm text-muted hover:text-foreground hover:bg-vermilion-soft transition-colors"
        >
          {t("nav.stats")}
        </Link>
        <Scoreboard locale={locale} level={level} />
      </div>
    </header>
  );
}

async function Scoreboard({ locale, level }: { locale: "en" | "uk"; level: number }) {
  let streak = 0;
  let xp = 0;
  try {
    const { getStats } = await import("@/lib/xp");
    const s = await getStats();
    streak = s.streakDays;
    xp = s.xp;
  } catch {
    // db not ready
  }
  return (
    <div className="flex items-stretch divide-x divide-border border-l border-r border-border">
      <LevelSwitcher current={level} />
      <StatItem value={xp.toLocaleString()} label="XP" color="indigo" />
      <StatItem value={String(streak)} label="Streak" color="vermilion" />
      <LocaleSwitcher current={locale} />
    </div>
  );
}

function StatItem({ value, label, color }: { value: string; label: string; color: "indigo" | "vermilion" | "ochre" | "pine" }) {
  const txt = color === "indigo" ? "text-indigo" : color === "vermilion" ? "text-vermilion" : color === "ochre" ? "text-ochre" : "text-pine";
  return (
    <div className="px-4 flex flex-col items-center justify-center min-w-[64px]">
      <span className={`serif text-2xl font-bold leading-none tabular-nums ${txt}`}>{value}</span>
      <span className="text-[8px] uppercase tracking-[0.2em] text-muted mt-1 font-bold">{label}</span>
    </div>
  );
}
