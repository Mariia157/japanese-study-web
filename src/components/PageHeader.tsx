// Ukiyo-e page header: big kanji slab + bold title + decorative wave band.
export function PageHeader({
  kanji,
  eyebrow,
  title,
  right,
}: {
  kanji: string;
  eyebrow?: string;
  title: string;
  right?: React.ReactNode;
}) {
  return (
    <header className="relative">
      <div className="flex flex-wrap lg:flex-nowrap items-stretch gap-4 sm:gap-6">
        {/* Vermilion slab with white kanji */}
        <div className="flex items-center justify-center bg-vermilion text-white px-4 sm:px-6 py-4 jp serif text-5xl sm:text-6xl shrink-0">
          {kanji}
        </div>
        <div className="flex-1 flex flex-col justify-between py-2 min-w-0">
          {eyebrow && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-[0.12em] sm:tracking-[0.2em] text-indigo font-bold">
              <span className="tag-red">{eyebrow}</span>
              <span className="text-muted">— {kanji} —</span>
            </div>
          )}
          <h1 className="text-[clamp(1.5rem,7.6vw,1.875rem)] sm:text-5xl font-bold tracking-tight text-foreground leading-[1.05]">{title}</h1>
        </div>
        {right && <div className="w-full lg:w-auto lg:self-end pb-1">{right}</div>}
      </div>
      <div className="wave-band mt-4" />
    </header>
  );
}
