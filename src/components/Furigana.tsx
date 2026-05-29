// Renders Japanese with furigana over kanji segments using <ruby>.
// Two forms:
//   <Furigana word="食べる" reading="たべる" /> — pairs by aligning kana suffix/prefix to the reading.
//   <FuriganaText pairs={[{t:"私",r:"わたし"},{t:"は"},...]} /> — explicit segments.

const KANA = /^[぀-ゟ゠-ヿー]+$/;
const KANJI = /^[一-龯々]+$/;

type Segment = { t: string; r?: string };

export function splitWithReading(word: string, reading: string): Segment[] {
  // No kanji at all → no ruby needed.
  if (!/[一-龯々]/.test(word)) return [{ t: word }];

  // Tokenize word into runs of kanji / kana.
  const runs: { kind: "kanji" | "kana"; chars: string }[] = [];
  for (const ch of word) {
    const kind = KANJI.test(ch) ? "kanji" : KANA.test(ch) ? "kana" : "kanji";
    const last = runs[runs.length - 1];
    if (last && last.kind === kind) last.chars += ch;
    else runs.push({ kind, chars: ch });
  }

  // Walk reading and runs together. Kana runs must match the reading verbatim;
  // kanji runs consume everything up to the next kana run match (or end).
  let i = 0;
  const out: Segment[] = [];
  for (let r = 0; r < runs.length; r++) {
    const run = runs[r];
    if (run.kind === "kana") {
      if (reading.startsWith(run.chars, i)) {
        out.push({ t: run.chars });
        i += run.chars.length;
      } else {
        // misalignment — fall back to whole-word ruby
        return [{ t: word, r: reading }];
      }
    } else {
      // kanji: find next kana run to bound it
      const nextKana = runs.slice(r + 1).find((x) => x.kind === "kana");
      let end: number;
      if (nextKana) {
        const idx = reading.indexOf(nextKana.chars, i + 1);
        if (idx < 0) return [{ t: word, r: reading }];
        end = idx;
      } else {
        end = reading.length;
      }
      out.push({ t: run.chars, r: reading.slice(i, end) });
      i = end;
    }
  }
  return out;
}

export function Furigana({
  word,
  reading,
  className,
  size = "md",
}: {
  word: string;
  reading?: string | null;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  if (!reading || word === reading || !/[一-龯々]/.test(word)) {
    return <span className={"jp " + (className ?? "")}>{word}</span>;
  }
  const segs = splitWithReading(word, reading);
  const rtSize =
    size === "xl" ? "text-sm" : size === "lg" ? "text-xs" : size === "md" ? "text-[10px]" : "text-[9px]";
  return (
    <ruby className={"jp " + (className ?? "")}>
      {segs.map((s, i) => (
        <span key={i} className="inline-block">
          {s.t}
          <rt className={"text-muted font-normal leading-none " + rtSize}>{s.r ?? ""}</rt>
        </span>
      ))}
    </ruby>
  );
}

// Renders pre-segmented Japanese text (sentence).
export function FuriganaText({ pairs, className }: { pairs: Segment[]; className?: string }) {
  return (
    <ruby className={"jp " + (className ?? "")}>
      {pairs.map((s, i) => (
        <span key={i} className="inline-block">
          {s.t}
          <rt className="text-muted font-normal leading-none text-[10px]">{s.r ?? ""}</rt>
        </span>
      ))}
    </ruby>
  );
}
