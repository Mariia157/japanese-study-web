// Import Genki 1 or 2 PDF (textbook + workbook) into the DB.
//
// Usage:
//   npm run seed:genki -- --book=1 --textbook=<path> [--workbook=<path>]
//   npm run seed:genki -- --book=2 --textbook=<path> [--workbook=<path>]
//
// Genki PDFs are commercial — files are NOT bundled with this repo. The user
// must provide their own copies. The parser extracts:
//   - Lesson boundaries (第N課 / "Lesson N")
//   - Vocabulary lists (kanji/kana headword, reading, English meaning)
//   - Grammar point titles (e.g. "1. X は Y です") with the explanatory text
//     that follows up to the next numbered point
//
// This is heuristic — Genki layouts vary across pages and the answer key is
// loaded separately by import-genki-answers.ts. After running this script,
// review /grammar/<level>/* and edit anything that didn't parse cleanly.

import fs from "node:fs";
import path from "node:path";
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

function arg(name: string): string | undefined {
  const m = process.argv.find((a) => a.startsWith(`--${name}=`));
  return m?.slice(name.length + 3);
}

async function extractText(pdfPath: string): Promise<string> {
  const { PDFParse } = await import("pdf-parse");
  const buf = fs.readFileSync(pdfPath);
  const parser = new PDFParse({ data: new Uint8Array(buf) });
  const out = await parser.getText();
  await parser.destroy();
  return out.text ?? out.pages?.map((p: { text: string }) => p.text).join("\n") ?? "";
}

function parseLessons(text: string, bookStart: number): Map<number, string> {
  // Find "第N課" or "Lesson N" markers. Returns map of lessonNum → text body.
  const lines = text.split(/\r?\n/);
  const lessons = new Map<number, string[]>();
  let current = bookStart;
  for (const line of lines) {
    const m = line.match(/第\s*(\d+)\s*課|^Lesson\s+(\d+)/i);
    if (m) {
      const n = Number(m[1] ?? m[2]);
      if (n >= bookStart && n < bookStart + 12) {
        current = n;
        if (!lessons.has(n)) lessons.set(n, []);
        continue;
      }
    }
    if (!lessons.has(current)) lessons.set(current, []);
    lessons.get(current)!.push(line);
  }
  const out = new Map<number, string>();
  for (const [k, v] of lessons) out.set(k, v.join("\n"));
  return out;
}

function parseVocab(lessonText: string, jlptLevel: number, lesson: number) {
  // Heuristic: lines like "たべる  食べる  to eat" or "本 ほん book" — kanji/kana, reading, meaning
  const out: { word: string; reading: string; meanings: string[]; pos: string[]; source: string }[] = [];
  const lines = lessonText.split(/\r?\n/);
  const reJp = /^[぀-ゟ゠-ヿ一-龯々ー]+/;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.length < 2) continue;
    const parts = line.split(/\s+/);
    if (parts.length < 2 || !reJp.test(parts[0])) continue;
    const jpHead = parts[0];
    const second = parts[1];
    const isReading = /^[぀-ゟ゠-ヿ]+$/.test(second);
    const reading = isReading ? second : jpHead;
    const word = jpHead;
    const meaning = parts.slice(isReading ? 2 : 1).join(" ").trim();
    if (!meaning || meaning.length < 2) continue;
    if (/[一-龯぀-ゟ]/.test(meaning)) continue; // skip if meaning contains JP — likely not a vocab line
    out.push({
      word,
      reading,
      meanings: [meaning],
      pos: [],
      source: `genki-L${lesson}`,
    });
  }
  // Dedup by word+reading
  const seen = new Set<string>();
  return out.filter((v) => {
    const k = `${v.word}|${v.reading}`;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  }).map((v) => ({ ...v, jlptLevel }));
}

function parseGrammarPoints(lessonText: string, lesson: number, jlptLevel: number) {
  // Heuristic: numbered headings inside a Grammar section. Capture title and following paragraph(s).
  const out: { title: string; slug: string; explanation: string; source: string; jlptLevel: number }[] = [];
  const grammarIdx = lessonText.search(/Grammar/i);
  if (grammarIdx < 0) return out;
  const body = lessonText.slice(grammarIdx);
  // Match "1. Some Title" through "2. ..."
  const re = /(?:^|\n)\s*(\d+)\.\s+([^\n]+)\n([\s\S]+?)(?=\n\s*\d+\.\s+[^\n]+\n|\n\s*第|\Z)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(body)) !== null) {
    const num = m[1];
    const title = m[2].trim();
    const explanation = m[3].trim().slice(0, 2500);
    if (title.length < 3 || title.length > 120) continue;
    out.push({
      title: `L${lesson}.${num} ${title}`,
      slug: `genki-l${lesson}-${num}-${slugify(title)}`,
      explanation,
      source: `genki-L${lesson}`,
      jlptLevel,
    });
  }
  return out;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "item";
}

async function main() {
  const book = Number(arg("book") ?? "1");
  const tb = arg("textbook");
  const wb = arg("workbook");
  if (book !== 1 && book !== 2) {
    console.error("Specify --book=1 or --book=2");
    process.exit(1);
  }
  if (!tb || !fs.existsSync(tb)) {
    console.error(`--textbook=<path> required and must exist. Got: ${tb}`);
    process.exit(1);
  }

  const jlptLevel = book === 1 ? 5 : 4;
  const bookStart = book === 1 ? 1 : 13;
  console.log(`Importing Genki ${book} from ${path.basename(tb)} (N${jlptLevel}, lessons ${bookStart}-${bookStart + 11})…`);

  const text = await extractText(tb);
  const lessons = parseLessons(text, bookStart);
  console.log(`  Found ${lessons.size} lessons`);

  let vocabAdded = 0;
  let grammarAdded = 0;

  for (const [lessonNum, lessonText] of lessons) {
    const vocab = parseVocab(lessonText, jlptLevel, lessonNum);
    for (const v of vocab) {
      try {
        await db.vocabulary.upsert({
          where: { word_reading: { word: v.word, reading: v.reading } },
          update: { source: v.source, jlptLevel: v.jlptLevel },
          create: {
            word: v.word,
            reading: v.reading,
            meanings: JSON.stringify(v.meanings),
            partOfSpeech: JSON.stringify(v.pos),
            jlptLevel: v.jlptLevel,
            source: v.source,
          },
        });
        vocabAdded++;
      } catch {
        // skip
      }
    }
    const grammar = parseGrammarPoints(lessonText, lessonNum, jlptLevel);
    for (const g of grammar) {
      try {
        await db.grammarPoint.upsert({
          where: { slug: g.slug },
          update: { title: g.title, explanation: g.explanation, source: g.source, jlptLevel: g.jlptLevel },
          create: {
            title: g.title,
            slug: g.slug,
            jlptLevel: g.jlptLevel,
            source: g.source,
            explanation: g.explanation,
            examples: "[]",
          },
        });
        grammarAdded++;
      } catch {
        // skip
      }
    }
    console.log(`  L${lessonNum}: ${vocab.length} vocab, ${grammar.length} grammar`);
  }

  if (wb && fs.existsSync(wb)) {
    console.log(`Workbook PDF detected (${path.basename(wb)}) — exercises parser is a placeholder. Run import-genki-answers.ts to seed answers when you have a structured list.`);
  }

  console.log(`Done. Added ~${vocabAdded} vocab rows, ~${grammarAdded} grammar points.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
