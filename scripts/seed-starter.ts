// Minimal N5 starter dataset so the app is usable out of the box without external datasets.
// Run: npm run seed
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

const RADICALS = [
  { character: "人", meaning: "person" },
  { character: "口", meaning: "mouth" },
  { character: "日", meaning: "sun/day" },
  { character: "月", meaning: "moon/month" },
  { character: "水", meaning: "water" },
  { character: "木", meaning: "tree" },
  { character: "火", meaning: "fire" },
  { character: "山", meaning: "mountain" },
  { character: "目", meaning: "eye" },
  { character: "手", meaning: "hand" },
  { character: "心", meaning: "heart" },
  { character: "言", meaning: "speech" },
  { character: "金", meaning: "metal/gold" },
  { character: "車", meaning: "vehicle" },
  { character: "門", meaning: "gate" },
];

type KanjiRow = {
  character: string;
  meanings: string[];
  on: string[];
  kun: string[];
  jlptLevel: number;
  strokes: number;
  mnemonic?: string;
  radicals?: string[];
};

const KANJI: KanjiRow[] = [
  { character: "一", meanings: ["one"], on: ["イチ", "イツ"], kun: ["ひと"], jlptLevel: 5, strokes: 1, mnemonic: "A single horizontal line — one." },
  { character: "二", meanings: ["two"], on: ["ニ"], kun: ["ふた"], jlptLevel: 5, strokes: 2, mnemonic: "Two parallel lines — two." },
  { character: "三", meanings: ["three"], on: ["サン"], kun: ["み"], jlptLevel: 5, strokes: 3, mnemonic: "Three lines stacked — three." },
  { character: "四", meanings: ["four"], on: ["シ"], kun: ["よ", "よん"], jlptLevel: 5, strokes: 5, mnemonic: "A box with two legs inside — like a four-legged stool." },
  { character: "五", meanings: ["five"], on: ["ゴ"], kun: ["いつ"], jlptLevel: 5, strokes: 4, mnemonic: "A spool of thread spinning between two hands — five." },
  { character: "六", meanings: ["six"], on: ["ロク"], kun: ["むっ"], jlptLevel: 5, strokes: 4, mnemonic: "A tent with two pegs — six." },
  { character: "七", meanings: ["seven"], on: ["シチ"], kun: ["なな"], jlptLevel: 5, strokes: 2, mnemonic: "A bent knife — sword strikes seven times." },
  { character: "八", meanings: ["eight"], on: ["ハチ"], kun: ["や"], jlptLevel: 5, strokes: 2, mnemonic: "Two strokes pointing outward like rays — eight." },
  { character: "九", meanings: ["nine"], on: ["キュウ", "ク"], kun: ["ここの"], jlptLevel: 5, strokes: 2, mnemonic: "A hook reaching up to ten — almost there, nine." },
  { character: "十", meanings: ["ten"], on: ["ジュウ"], kun: ["とお"], jlptLevel: 5, strokes: 2, mnemonic: "A perfect cross — ten." },
  { character: "日", meanings: ["sun", "day"], on: ["ニチ", "ジツ"], kun: ["ひ", "か"], jlptLevel: 5, strokes: 4, mnemonic: "A box with a line — picture of the sun.", radicals: ["日"] },
  { character: "月", meanings: ["moon", "month"], on: ["ゲツ", "ガツ"], kun: ["つき"], jlptLevel: 5, strokes: 4, mnemonic: "A crescent moon with shading lines.", radicals: ["月"] },
  { character: "火", meanings: ["fire"], on: ["カ"], kun: ["ひ"], jlptLevel: 5, strokes: 4, mnemonic: "A person with sparks flying out — fire!", radicals: ["火"] },
  { character: "水", meanings: ["water"], on: ["スイ"], kun: ["みず"], jlptLevel: 5, strokes: 4, mnemonic: "Water splashing in three directions.", radicals: ["水"] },
  { character: "木", meanings: ["tree", "wood"], on: ["モク", "ボク"], kun: ["き"], jlptLevel: 5, strokes: 4, mnemonic: "A tree with trunk, branches, and roots.", radicals: ["木"] },
  { character: "山", meanings: ["mountain"], on: ["サン"], kun: ["やま"], jlptLevel: 5, strokes: 3, mnemonic: "Three peaks side by side.", radicals: ["山"] },
  { character: "川", meanings: ["river"], on: ["セン"], kun: ["かわ"], jlptLevel: 5, strokes: 3, mnemonic: "Three vertical streams of water." },
  { character: "人", meanings: ["person"], on: ["ジン", "ニン"], kun: ["ひと"], jlptLevel: 5, strokes: 2, mnemonic: "A walking person with two legs.", radicals: ["人"] },
  { character: "口", meanings: ["mouth"], on: ["コウ"], kun: ["くち"], jlptLevel: 5, strokes: 3, mnemonic: "An open mouth — a square hole.", radicals: ["口"] },
  { character: "目", meanings: ["eye"], on: ["モク"], kun: ["め"], jlptLevel: 5, strokes: 5, mnemonic: "An eye turned 90° — pupil inside.", radicals: ["目"] },
  { character: "手", meanings: ["hand"], on: ["シュ"], kun: ["て"], jlptLevel: 5, strokes: 4, mnemonic: "A hand with five fingers, slightly stylized.", radicals: ["手"] },
  { character: "私", meanings: ["I", "private"], on: ["シ"], kun: ["わたし"], jlptLevel: 5, strokes: 7, mnemonic: "A grain of rice (禾) I keep private for myself." },
  { character: "今", meanings: ["now"], on: ["コン"], kun: ["いま"], jlptLevel: 5, strokes: 4, mnemonic: "A roof over the present moment." },
  { character: "本", meanings: ["book", "origin"], on: ["ホン"], kun: ["もと"], jlptLevel: 5, strokes: 5, mnemonic: "A tree (木) with a line at its base — the origin/root.", radicals: ["木"] },
  { character: "年", meanings: ["year"], on: ["ネン"], kun: ["とし"], jlptLevel: 5, strokes: 6, mnemonic: "A person bent over rice harvested once a year." },
  { character: "学", meanings: ["study"], on: ["ガク"], kun: ["まな"], jlptLevel: 5, strokes: 8, mnemonic: "A child (子) under a roof of stars (学) — studying." },
  { character: "生", meanings: ["life", "birth"], on: ["セイ"], kun: ["い", "う"], jlptLevel: 5, strokes: 5, mnemonic: "A plant sprouting from the earth — life." },
  { character: "先", meanings: ["before", "ahead"], on: ["セン"], kun: ["さき"], jlptLevel: 5, strokes: 6, mnemonic: "A person (儿) with a foot stepping ahead." },
  { character: "行", meanings: ["go"], on: ["コウ"], kun: ["い", "ゆ"], jlptLevel: 5, strokes: 6, mnemonic: "A crossroads where people go in different directions." },
  { character: "見", meanings: ["see"], on: ["ケン"], kun: ["み"], jlptLevel: 5, strokes: 7, mnemonic: "An eye (目) with legs (儿) walking to see things.", radicals: ["目"] },
];

type VocabRow = { word: string; reading: string; meanings: string[]; pos: string[]; jlpt: number; usesKanji?: string[] };

const VOCAB: VocabRow[] = [
  { word: "こんにちは", reading: "こんにちは", meanings: ["hello", "good afternoon"], pos: ["expression"], jlpt: 5 },
  { word: "ありがとう", reading: "ありがとう", meanings: ["thank you"], pos: ["expression"], jlpt: 5 },
  { word: "おはよう", reading: "おはよう", meanings: ["good morning"], pos: ["expression"], jlpt: 5 },
  { word: "さようなら", reading: "さようなら", meanings: ["goodbye"], pos: ["expression"], jlpt: 5 },
  { word: "はい", reading: "はい", meanings: ["yes"], pos: ["interjection"], jlpt: 5 },
  { word: "いいえ", reading: "いいえ", meanings: ["no"], pos: ["interjection"], jlpt: 5 },
  { word: "私", reading: "わたし", meanings: ["I", "me"], pos: ["pronoun"], jlpt: 5, usesKanji: ["私"] },
  { word: "あなた", reading: "あなた", meanings: ["you"], pos: ["pronoun"], jlpt: 5 },
  { word: "学生", reading: "がくせい", meanings: ["student"], pos: ["noun"], jlpt: 5, usesKanji: ["学", "生"] },
  { word: "先生", reading: "せんせい", meanings: ["teacher"], pos: ["noun"], jlpt: 5, usesKanji: ["先", "生"] },
  { word: "本", reading: "ほん", meanings: ["book"], pos: ["noun"], jlpt: 5, usesKanji: ["本"] },
  { word: "水", reading: "みず", meanings: ["water"], pos: ["noun"], jlpt: 5, usesKanji: ["水"] },
  { word: "日本", reading: "にほん", meanings: ["Japan"], pos: ["noun"], jlpt: 5, usesKanji: ["日", "本"] },
  { word: "今日", reading: "きょう", meanings: ["today"], pos: ["noun"], jlpt: 5, usesKanji: ["今", "日"] },
  { word: "山", reading: "やま", meanings: ["mountain"], pos: ["noun"], jlpt: 5, usesKanji: ["山"] },
  { word: "川", reading: "かわ", meanings: ["river"], pos: ["noun"], jlpt: 5, usesKanji: ["川"] },
  { word: "目", reading: "め", meanings: ["eye"], pos: ["noun"], jlpt: 5, usesKanji: ["目"] },
  { word: "口", reading: "くち", meanings: ["mouth"], pos: ["noun"], jlpt: 5, usesKanji: ["口"] },
  { word: "手", reading: "て", meanings: ["hand"], pos: ["noun"], jlpt: 5, usesKanji: ["手"] },
  { word: "人", reading: "ひと", meanings: ["person"], pos: ["noun"], jlpt: 5, usesKanji: ["人"] },
  { word: "食べる", reading: "たべる", meanings: ["to eat"], pos: ["ichidan verb"], jlpt: 5 },
  { word: "飲む", reading: "のむ", meanings: ["to drink"], pos: ["godan verb"], jlpt: 5 },
  { word: "行く", reading: "いく", meanings: ["to go"], pos: ["godan verb"], jlpt: 5, usesKanji: ["行"] },
  { word: "来る", reading: "くる", meanings: ["to come"], pos: ["irregular verb"], jlpt: 5 },
  { word: "見る", reading: "みる", meanings: ["to see", "to watch"], pos: ["ichidan verb"], jlpt: 5, usesKanji: ["見"] },
  { word: "大きい", reading: "おおきい", meanings: ["big"], pos: ["i-adjective"], jlpt: 5 },
  { word: "小さい", reading: "ちいさい", meanings: ["small"], pos: ["i-adjective"], jlpt: 5 },
  { word: "良い", reading: "いい", meanings: ["good"], pos: ["i-adjective"], jlpt: 5 },
  { word: "新しい", reading: "あたらしい", meanings: ["new"], pos: ["i-adjective"], jlpt: 5 },
  { word: "古い", reading: "ふるい", meanings: ["old"], pos: ["i-adjective"], jlpt: 5 },
];

const GRAMMAR = [
  {
    title: "X は Y です — basic identification",
    slug: "n5-wa-desu",
    jlptLevel: 5,
    source: "starter",
    explanation: `**X は Y です** is the most basic sentence pattern: "X is Y."

- **は** marks the topic (pronounced "wa", not "ha", in this role).
- **です** is the polite copula (≈ "is/am/are"). Its plain form is **だ**.

Negative: **X は Y じゃないです** / **じゃありません**.
Past: **X は Y でした**. Past negative: **X は Y じゃなかったです**.`,
    examples: JSON.stringify([
      { jp: "私は学生です。", en: "I am a student." },
      { jp: "これは本です。", en: "This is a book." },
      { jp: "田中さんは先生じゃないです。", en: "Tanaka-san is not a teacher." },
    ]),
    exercises: [
      { type: "mcq", prompt: "私___学生です。", choices: ["は", "が", "を", "に"], answer: "は", explanation: "は marks the topic." },
      { type: "mcq", prompt: "Past form: 田中さんは学生___。", choices: ["です", "でした", "じゃない", "ました"], answer: "でした", explanation: "でした is the past of です." },
      { type: "translate", prompt: "I am a teacher.", choices: "[]", answer: "私は先生です", explanation: "私 (I) + は (topic) + 先生 (teacher) + です." },
    ],
  },
  {
    title: "Particle を — direct object",
    slug: "n5-wo-particle",
    jlptLevel: 5,
    source: "starter",
    explanation: `**を** marks the direct object of a verb.

Pattern: **[noun] を [verb]**

It is written with the kana を (pronounced "o") but only used as this particle — never as part of a word.`,
    examples: JSON.stringify([
      { jp: "水を飲みます。", en: "I drink water." },
      { jp: "本を読みます。", en: "I read a book." },
      { jp: "テレビを見ます。", en: "I watch TV." },
    ]),
    exercises: [
      { type: "mcq", prompt: "水___飲みます。", choices: ["は", "を", "が", "で"], answer: "を", explanation: "を marks the direct object." },
      { type: "translate", prompt: "I eat sushi.", choices: "[]", answer: "寿司を食べます", explanation: "寿司 (sushi) を (object) 食べます (eat)." },
    ],
  },
  {
    title: "Particle に — destination & time",
    slug: "n5-ni-particle",
    jlptLevel: 5,
    source: "starter",
    explanation: `**に** has two common N5 uses:

1. **Direction / destination** with verbs of motion: 学校**に**行きます (I go to school)
2. **Specific time point**: 七時**に**起きます (I wake up at 7)`,
    examples: JSON.stringify([
      { jp: "東京に行きます。", en: "I go to Tokyo." },
      { jp: "九時に来ます。", en: "I come at 9." },
    ]),
    exercises: [
      { type: "mcq", prompt: "学校___行きます。", choices: ["に", "を", "は", "が"], answer: "に", explanation: "に marks destination with motion verbs." },
    ],
  },
  {
    title: "い-adjectives — basic conjugation",
    slug: "n5-i-adjectives",
    jlptLevel: 5,
    source: "starter",
    explanation: `い-adjectives end in **い** (e.g. 大きい, 新しい).

- **Present positive**: 大きいです
- **Present negative**: 大きくないです (drop い, add くない)
- **Past positive**: 大きかったです (drop い, add かった)
- **Past negative**: 大きくなかったです

**Exception**: いい (good) conjugates as よい → よくない, よかった.`,
    examples: JSON.stringify([
      { jp: "この本は新しいです。", en: "This book is new." },
      { jp: "あの山は大きくないです。", en: "That mountain is not big." },
      { jp: "昨日は寒かったです。", en: "Yesterday was cold." },
    ]),
    exercises: [
      { type: "mcq", prompt: "Negative of 大きい:", choices: ["大きじゃない", "大きくない", "大きないです", "大きいない"], answer: "大きくない", explanation: "Drop い, add くない." },
      { type: "mcq", prompt: "Past of いい (good):", choices: ["いかった", "よかった", "いいかった", "いくない"], answer: "よかった", explanation: "いい uses よ-stem for past forms." },
    ],
  },
  {
    title: "Verb groups & polite ます-form",
    slug: "n5-masu-form",
    jlptLevel: 5,
    source: "starter",
    explanation: `Japanese verbs fall into 3 groups:

1. **Ichidan (る-verbs)**: stem + ます → 食べる → 食べます
2. **Godan (う-verbs)**: change final う-row to い-row, then add ます → 飲む → 飲みます
3. **Irregular**: する → します, 来る → 来ます

Negative ます-form: replace ます with ません. Past: ました. Past negative: ませんでした.`,
    examples: JSON.stringify([
      { jp: "毎日水を飲みます。", en: "I drink water every day." },
      { jp: "明日来ません。", en: "I will not come tomorrow." },
      { jp: "昨日テレビを見ました。", en: "I watched TV yesterday." },
    ]),
    exercises: [
      { type: "mcq", prompt: "Polite of 行く:", choices: ["行きます", "行ます", "行るます", "行います"], answer: "行きます", explanation: "Godan verb: く → き + ます." },
      { type: "mcq", prompt: "Polite of 食べる:", choices: ["食べます", "食べります", "食べいます", "食びます"], answer: "食べます", explanation: "Ichidan verb: drop る, add ます." },
    ],
  },
];

const LISTENING = [
  {
    jlptLevel: 5,
    title: "Self-introduction",
    transcript: "はじめまして。田中です。学生です。よろしくお願いします。",
    english: "Nice to meet you. I'm Tanaka. I'm a student. Please treat me well.",
    questions: JSON.stringify([
      { q: "What is the speaker's name?", choices: ["Tanaka", "Suzuki", "Sato", "Yamada"], answer: "Tanaka" },
      { q: "What is the speaker's occupation?", choices: ["Teacher", "Student", "Doctor", "Engineer"], answer: "Student" },
    ]),
  },
  {
    jlptLevel: 5,
    title: "Ordering at a restaurant",
    transcript: "すみません。水をください。それから、ラーメンをお願いします。",
    english: "Excuse me. Water please. And ramen please.",
    questions: JSON.stringify([
      { q: "What does the speaker order to drink?", choices: ["Tea", "Water", "Beer", "Coffee"], answer: "Water" },
      { q: "What food does the speaker order?", choices: ["Sushi", "Ramen", "Udon", "Curry"], answer: "Ramen" },
    ]),
  },
];

const READING = [
  {
    jlptLevel: 5,
    title: "My morning",
    text: "私は毎日七時に起きます。それから、水を飲みます。ご飯を食べます。八時に学校に行きます。",
    english: "I wake up at 7 every day. Then I drink water. I eat rice. I go to school at 8.",
    questions: JSON.stringify([
      { q: "What time does the writer wake up?", choices: ["6", "7", "8", "9"], answer: "7" },
      { q: "What does the writer drink in the morning?", choices: ["Tea", "Water", "Coffee", "Milk"], answer: "Water" },
      { q: "What time does the writer go to school?", choices: ["7", "8", "9", "10"], answer: "8" },
    ]),
  },
];

async function main() {
  console.log("Seeding starter content…");

  // Radicals
  for (const r of RADICALS) {
    await db.radical.upsert({ where: { character: r.character }, update: { meaning: r.meaning }, create: r });
  }
  console.log(`  ✓ ${RADICALS.length} radicals`);

  // Kanji + radicals link
  for (const k of KANJI) {
    const created = await db.kanji.upsert({
      where: { character: k.character },
      update: {
        meanings: JSON.stringify(k.meanings),
        onReadings: JSON.stringify(k.on),
        kunReadings: JSON.stringify(k.kun),
        jlptLevel: k.jlptLevel,
        strokeCount: k.strokes,
        mnemonic: k.mnemonic ?? null,
      },
      create: {
        character: k.character,
        meanings: JSON.stringify(k.meanings),
        onReadings: JSON.stringify(k.on),
        kunReadings: JSON.stringify(k.kun),
        jlptLevel: k.jlptLevel,
        strokeCount: k.strokes,
        mnemonic: k.mnemonic ?? null,
      },
    });
    if (k.radicals) {
      for (const rc of k.radicals) {
        const r = await db.radical.findUnique({ where: { character: rc } });
        if (!r) continue;
        await db.kanjiRadical.upsert({
          where: { kanjiId_radicalId: { kanjiId: created.id, radicalId: r.id } },
          update: {},
          create: { kanjiId: created.id, radicalId: r.id },
        });
      }
    }
  }
  console.log(`  ✓ ${KANJI.length} kanji`);

  // Vocab
  for (const v of VOCAB) {
    const created = await db.vocabulary.upsert({
      where: { word_reading: { word: v.word, reading: v.reading } },
      update: {
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify(v.pos),
        jlptLevel: v.jlpt,
        source: "starter",
      },
      create: {
        word: v.word,
        reading: v.reading,
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify(v.pos),
        jlptLevel: v.jlpt,
        source: "starter",
      },
    });
    if (v.usesKanji) {
      for (const kc of v.usesKanji) {
        const k = await db.kanji.findUnique({ where: { character: kc } });
        if (!k) continue;
        await db.vocabularyKanji.upsert({
          where: { vocabularyId_kanjiId: { vocabularyId: created.id, kanjiId: k.id } },
          update: {},
          create: { vocabularyId: created.id, kanjiId: k.id },
        });
      }
    }
  }
  console.log(`  ✓ ${VOCAB.length} vocabulary`);

  // Grammar
  for (const g of GRAMMAR) {
    const gp = await db.grammarPoint.upsert({
      where: { slug: g.slug },
      update: {
        title: g.title,
        jlptLevel: g.jlptLevel,
        source: g.source,
        explanation: g.explanation,
        examples: g.examples,
      },
      create: {
        title: g.title,
        slug: g.slug,
        jlptLevel: g.jlptLevel,
        source: g.source,
        explanation: g.explanation,
        examples: g.examples,
      },
    });
    await db.grammarExercise.deleteMany({ where: { grammarId: gp.id } });
    for (const ex of g.exercises) {
      await db.grammarExercise.create({
        data: {
          grammarId: gp.id,
          type: ex.type,
          prompt: ex.prompt,
          choices: typeof ex.choices === "string" ? ex.choices : JSON.stringify(ex.choices),
          answer: ex.answer,
          explanation: ex.explanation ?? null,
        },
      });
    }
  }
  console.log(`  ✓ ${GRAMMAR.length} grammar points`);

  // Listening / Reading
  for (const l of LISTENING) {
    const exists = await db.listeningExercise.findFirst({ where: { title: l.title, jlptLevel: l.jlptLevel } });
    if (exists) {
      await db.listeningExercise.update({ where: { id: exists.id }, data: l });
    } else {
      await db.listeningExercise.create({ data: l });
    }
  }
  console.log(`  ✓ ${LISTENING.length} listening exercises`);

  for (const r of READING) {
    const exists = await db.readingExercise.findFirst({ where: { title: r.title, jlptLevel: r.jlptLevel } });
    if (exists) {
      await db.readingExercise.update({ where: { id: exists.id }, data: r });
    } else {
      await db.readingExercise.create({ data: r });
    }
  }
  console.log(`  ✓ ${READING.length} reading exercises`);

  // User stats row
  await db.userStats.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
