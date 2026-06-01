// More N5 content: the two remaining core N5 kanji (車, 休) plus a large batch
// of common N5 vocabulary (colors, body, time words, question words, adverbs,
// everyday verbs/adjectives, household & travel nouns).
// Idempotent. Run: npm run seed:n5:more
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type KanjiRow = {
  character: string; meanings: string[]; on: string[]; kun: string[];
  jlptLevel: number; strokes: number; mnemonic?: string; radicals?: string[];
};

const KANJI: KanjiRow[] = [
  { character: "車", meanings: ["car", "vehicle"], on: ["シャ"], kun: ["くるま"], jlptLevel: 5, strokes: 7, mnemonic: "A cart seen from above — axle through the wheels and a cargo bed.", radicals: ["車"] },
  { character: "休", meanings: ["rest", "holiday"], on: ["キュウ"], kun: ["やす"], jlptLevel: 5, strokes: 6, mnemonic: "A person (亻) leaning against a tree (木) — taking a rest.", radicals: ["人", "木"] },
];

type V = { word: string; reading: string; meanings: string[]; pos: string; jlpt: number; usesKanji?: string[] };

const VOCAB: V[] = [
  // colors
  { word: "色", reading: "いろ", meanings: ["color"], pos: "noun", jlpt: 5 },
  { word: "赤い", reading: "あかい", meanings: ["red"], pos: "i-adjective", jlpt: 5 },
  { word: "青い", reading: "あおい", meanings: ["blue"], pos: "i-adjective", jlpt: 5 },
  { word: "黒い", reading: "くろい", meanings: ["black"], pos: "i-adjective", jlpt: 5 },
  { word: "黄色い", reading: "きいろい", meanings: ["yellow"], pos: "i-adjective", jlpt: 5 },
  // body
  { word: "足", reading: "あし", meanings: ["foot", "leg"], pos: "noun", jlpt: 5 },
  { word: "耳", reading: "みみ", meanings: ["ear"], pos: "noun", jlpt: 5 },
  { word: "鼻", reading: "はな", meanings: ["nose"], pos: "noun", jlpt: 5 },
  { word: "顔", reading: "かお", meanings: ["face"], pos: "noun", jlpt: 5 },
  { word: "体", reading: "からだ", meanings: ["body"], pos: "noun", jlpt: 5 },
  { word: "歯", reading: "は", meanings: ["tooth"], pos: "noun", jlpt: 5 },
  // time words
  { word: "今朝", reading: "けさ", meanings: ["this morning"], pos: "noun", jlpt: 5, usesKanji: ["今"] },
  { word: "今晩", reading: "こんばん", meanings: ["tonight", "this evening"], pos: "noun", jlpt: 5, usesKanji: ["今"] },
  { word: "来週", reading: "らいしゅう", meanings: ["next week"], pos: "noun", jlpt: 5, usesKanji: ["来", "週"] },
  { word: "先週", reading: "せんしゅう", meanings: ["last week"], pos: "noun", jlpt: 5, usesKanji: ["先", "週"] },
  { word: "来月", reading: "らいげつ", meanings: ["next month"], pos: "noun", jlpt: 5, usesKanji: ["来", "月"] },
  { word: "先月", reading: "せんげつ", meanings: ["last month"], pos: "noun", jlpt: 5, usesKanji: ["先", "月"] },
  { word: "来年", reading: "らいねん", meanings: ["next year"], pos: "noun", jlpt: 5, usesKanji: ["来", "年"] },
  { word: "去年", reading: "きょねん", meanings: ["last year"], pos: "noun", jlpt: 5, usesKanji: ["年"] },
  { word: "今年", reading: "ことし", meanings: ["this year"], pos: "noun", jlpt: 5, usesKanji: ["今", "年"] },
  { word: "毎晩", reading: "まいばん", meanings: ["every night"], pos: "noun", jlpt: 5, usesKanji: ["毎"] },
  { word: "時々", reading: "ときどき", meanings: ["sometimes"], pos: "adverb", jlpt: 5, usesKanji: ["時"] },
  // question words & demonstratives
  { word: "誰", reading: "だれ", meanings: ["who"], pos: "pronoun", jlpt: 5 },
  { word: "どこ", reading: "どこ", meanings: ["where"], pos: "pronoun", jlpt: 5 },
  { word: "いつ", reading: "いつ", meanings: ["when"], pos: "adverb", jlpt: 5 },
  { word: "どうして", reading: "どうして", meanings: ["why"], pos: "adverb", jlpt: 5 },
  { word: "いくら", reading: "いくら", meanings: ["how much"], pos: "adverb", jlpt: 5 },
  { word: "これ", reading: "これ", meanings: ["this one"], pos: "pronoun", jlpt: 5 },
  { word: "それ", reading: "それ", meanings: ["that one"], pos: "pronoun", jlpt: 5 },
  { word: "あれ", reading: "あれ", meanings: ["that one over there"], pos: "pronoun", jlpt: 5 },
  { word: "どれ", reading: "どれ", meanings: ["which one"], pos: "pronoun", jlpt: 5 },
  { word: "ここ", reading: "ここ", meanings: ["here"], pos: "pronoun", jlpt: 5 },
  { word: "そこ", reading: "そこ", meanings: ["there"], pos: "pronoun", jlpt: 5 },
  { word: "あそこ", reading: "あそこ", meanings: ["over there"], pos: "pronoun", jlpt: 5 },
  // adverbs
  { word: "とても", reading: "とても", meanings: ["very"], pos: "adverb", jlpt: 5 },
  { word: "たくさん", reading: "たくさん", meanings: ["a lot", "many"], pos: "adverb", jlpt: 5 },
  { word: "少し", reading: "すこし", meanings: ["a little"], pos: "adverb", jlpt: 5 },
  { word: "いつも", reading: "いつも", meanings: ["always"], pos: "adverb", jlpt: 5 },
  { word: "すぐ", reading: "すぐ", meanings: ["soon", "immediately"], pos: "adverb", jlpt: 5 },
  { word: "ちょっと", reading: "ちょっと", meanings: ["a little", "a moment"], pos: "adverb", jlpt: 5 },
  { word: "まだ", reading: "まだ", meanings: ["still", "not yet"], pos: "adverb", jlpt: 5 },
  { word: "もう", reading: "もう", meanings: ["already", "soon"], pos: "adverb", jlpt: 5 },
  { word: "あまり", reading: "あまり", meanings: ["(not) very", "(not) much"], pos: "adverb", jlpt: 5 },
  // verbs
  { word: "休む", reading: "やすむ", meanings: ["to rest", "to take a day off"], pos: "godan verb", jlpt: 5, usesKanji: ["休"] },
  { word: "遊ぶ", reading: "あそぶ", meanings: ["to play", "to have fun"], pos: "godan verb", jlpt: 5 },
  { word: "歌う", reading: "うたう", meanings: ["to sing"], pos: "godan verb", jlpt: 5 },
  { word: "乗る", reading: "のる", meanings: ["to ride", "to board"], pos: "godan verb", jlpt: 5 },
  { word: "持つ", reading: "もつ", meanings: ["to hold", "to have"], pos: "godan verb", jlpt: 5 },
  { word: "取る", reading: "とる", meanings: ["to take", "to pick up"], pos: "godan verb", jlpt: 5 },
  { word: "貸す", reading: "かす", meanings: ["to lend"], pos: "godan verb", jlpt: 5 },
  { word: "借りる", reading: "かりる", meanings: ["to borrow"], pos: "ichidan verb", jlpt: 5 },
  { word: "着る", reading: "きる", meanings: ["to wear", "to put on"], pos: "ichidan verb", jlpt: 5 },
  { word: "洗う", reading: "あらう", meanings: ["to wash"], pos: "godan verb", jlpt: 5 },
  { word: "死ぬ", reading: "しぬ", meanings: ["to die"], pos: "godan verb", jlpt: 5 },
  // adjectives
  { word: "重い", reading: "おもい", meanings: ["heavy"], pos: "i-adjective", jlpt: 5 },
  { word: "軽い", reading: "かるい", meanings: ["light (in weight)"], pos: "i-adjective", jlpt: 5 },
  { word: "近い", reading: "ちかい", meanings: ["near", "close"], pos: "i-adjective", jlpt: 5 },
  { word: "遠い", reading: "とおい", meanings: ["far"], pos: "i-adjective", jlpt: 5 },
  { word: "明るい", reading: "あかるい", meanings: ["bright", "cheerful"], pos: "i-adjective", jlpt: 5 },
  { word: "暗い", reading: "くらい", meanings: ["dark", "gloomy"], pos: "i-adjective", jlpt: 5 },
  { word: "甘い", reading: "あまい", meanings: ["sweet"], pos: "i-adjective", jlpt: 5 },
  { word: "辛い", reading: "からい", meanings: ["spicy", "hot"], pos: "i-adjective", jlpt: 5 },
  { word: "短い", reading: "みじかい", meanings: ["short"], pos: "i-adjective", jlpt: 5 },
  { word: "美味しい", reading: "おいしい", meanings: ["delicious", "tasty"], pos: "i-adjective", jlpt: 5 },
  { word: "汚い", reading: "きたない", meanings: ["dirty"], pos: "i-adjective", jlpt: 5 },
  { word: "冷たい", reading: "つめたい", meanings: ["cold (to the touch)"], pos: "i-adjective", jlpt: 5 },
  { word: "多い", reading: "おおい", meanings: ["many", "much"], pos: "i-adjective", jlpt: 5 },
  { word: "少ない", reading: "すくない", meanings: ["few", "little"], pos: "i-adjective", jlpt: 5 },
  { word: "早い", reading: "はやい", meanings: ["early"], pos: "i-adjective", jlpt: 5 },
  // household & travel nouns
  { word: "部屋", reading: "へや", meanings: ["room"], pos: "noun", jlpt: 5 },
  { word: "窓", reading: "まど", meanings: ["window"], pos: "noun", jlpt: 5 },
  { word: "服", reading: "ふく", meanings: ["clothes"], pos: "noun", jlpt: 5 },
  { word: "帽子", reading: "ぼうし", meanings: ["hat", "cap"], pos: "noun", jlpt: 5 },
  { word: "辞書", reading: "じしょ", meanings: ["dictionary"], pos: "noun", jlpt: 5, usesKanji: ["書"] },
  { word: "手紙", reading: "てがみ", meanings: ["letter"], pos: "noun", jlpt: 5, usesKanji: ["手"] },
  { word: "切符", reading: "きっぷ", meanings: ["ticket"], pos: "noun", jlpt: 5 },
  { word: "地図", reading: "ちず", meanings: ["map"], pos: "noun", jlpt: 5 },
  { word: "飛行機", reading: "ひこうき", meanings: ["airplane"], pos: "noun", jlpt: 5, usesKanji: ["行"] },
  { word: "バス", reading: "バス", meanings: ["bus"], pos: "noun", jlpt: 5 },
  { word: "お弁当", reading: "おべんとう", meanings: ["boxed lunch", "bento"], pos: "noun", jlpt: 5 },
  { word: "牛乳", reading: "ぎゅうにゅう", meanings: ["milk"], pos: "noun", jlpt: 5 },
  { word: "塩", reading: "しお", meanings: ["salt"], pos: "noun", jlpt: 5 },
  { word: "砂糖", reading: "さとう", meanings: ["sugar"], pos: "noun", jlpt: 5 },
  { word: "雪", reading: "ゆき", meanings: ["snow"], pos: "noun", jlpt: 5 },
  { word: "鳥", reading: "とり", meanings: ["bird"], pos: "noun", jlpt: 5 },
  { word: "言葉", reading: "ことば", meanings: ["word", "language"], pos: "noun", jlpt: 5 },
  { word: "質問", reading: "しつもん", meanings: ["question"], pos: "noun", jlpt: 5 },
  { word: "教室", reading: "きょうしつ", meanings: ["classroom"], pos: "noun", jlpt: 5 },
  { word: "飲み物", reading: "のみもの", meanings: ["drink", "beverage"], pos: "noun", jlpt: 5, usesKanji: ["飲"] },
  { word: "食べ物", reading: "たべもの", meanings: ["food"], pos: "noun", jlpt: 5, usesKanji: ["食"] },
];

async function main() {
  console.log("Seeding more N5 kanji + vocabulary…");

  for (const k of KANJI) {
    const created = await db.kanji.upsert({
      where: { character: k.character },
      update: {
        meanings: JSON.stringify(k.meanings), onReadings: JSON.stringify(k.on),
        kunReadings: JSON.stringify(k.kun), jlptLevel: k.jlptLevel,
        strokeCount: k.strokes, mnemonic: k.mnemonic ?? null,
      },
      create: {
        character: k.character, meanings: JSON.stringify(k.meanings),
        onReadings: JSON.stringify(k.on), kunReadings: JSON.stringify(k.kun),
        jlptLevel: k.jlptLevel, strokeCount: k.strokes, mnemonic: k.mnemonic ?? null,
      },
    });
    for (const rc of k.radicals ?? []) {
      const r = await db.radical.findUnique({ where: { character: rc } });
      if (!r) continue;
      await db.kanjiRadical.upsert({
        where: { kanjiId_radicalId: { kanjiId: created.id, radicalId: r.id } },
        update: {}, create: { kanjiId: created.id, radicalId: r.id },
      });
    }
  }
  console.log(`  ✓ ${KANJI.length} kanji added/updated`);

  let vn = 0;
  for (const v of VOCAB) {
    const created = await db.vocabulary.upsert({
      where: { word_reading: { word: v.word, reading: v.reading } },
      update: {
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify([v.pos]), jlptLevel: v.jlpt,
      },
      create: {
        word: v.word, reading: v.reading, meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify([v.pos]), jlptLevel: v.jlpt, source: "n5-more",
      },
    });
    for (const kc of v.usesKanji ?? []) {
      const k = await db.kanji.findUnique({ where: { character: kc } });
      if (!k) continue;
      await db.vocabularyKanji.upsert({
        where: { vocabularyId_kanjiId: { vocabularyId: created.id, kanjiId: k.id } },
        update: {}, create: { vocabularyId: created.id, kanjiId: k.id },
      });
    }
    vn++;
  }
  console.log(`  ✓ ${vn} vocabulary added/updated`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
