// More curated vocabulary, filling gaps across N5/N4/N3 in the same category
// taxonomy as the existing sets (noun / godan verb / ichidan verb / i-adjective
// / na-adjective / pronoun / adverb). No duplicates with existing entries.
// Idempotent. Run: npm run seed:vocab:more
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type V = { word: string; reading: string; meanings: string[]; pos: string; jlpt: number; usesKanji?: string[] };

const VOCAB: V[] = [
  // ===== N5 — seasons, nature, sensory, people =====
  { word: "春", reading: "はる", meanings: ["spring"], pos: "noun", jlpt: 5 },
  { word: "夏", reading: "なつ", meanings: ["summer"], pos: "noun", jlpt: 5 },
  { word: "秋", reading: "あき", meanings: ["autumn", "fall"], pos: "noun", jlpt: 5 },
  { word: "冬", reading: "ふゆ", meanings: ["winter"], pos: "noun", jlpt: 5 },
  { word: "風", reading: "かぜ", meanings: ["wind"], pos: "noun", jlpt: 5 },
  { word: "海", reading: "うみ", meanings: ["sea", "ocean"], pos: "noun", jlpt: 5 },
  { word: "空気", reading: "くうき", meanings: ["air"], pos: "noun", jlpt: 5, usesKanji: ["空", "気"] },
  { word: "声", reading: "こえ", meanings: ["voice"], pos: "noun", jlpt: 5 },
  { word: "音", reading: "おと", meanings: ["sound"], pos: "noun", jlpt: 5 },
  { word: "味", reading: "あじ", meanings: ["taste", "flavor"], pos: "noun", jlpt: 5 },
  { word: "形", reading: "かたち", meanings: ["shape", "form"], pos: "noun", jlpt: 5 },
  { word: "動物", reading: "どうぶつ", meanings: ["animal"], pos: "noun", jlpt: 5 },
  { word: "牛", reading: "うし", meanings: ["cow"], pos: "noun", jlpt: 5 },
  { word: "馬", reading: "うま", meanings: ["horse"], pos: "noun", jlpt: 5 },
  { word: "自分", reading: "じぶん", meanings: ["oneself"], pos: "pronoun", jlpt: 5, usesKanji: ["分"] },
  { word: "皆", reading: "みんな", meanings: ["everyone", "all"], pos: "pronoun", jlpt: 5 },
  { word: "大人", reading: "おとな", meanings: ["adult"], pos: "noun", jlpt: 5, usesKanji: ["大", "人"] },
  { word: "両親", reading: "りょうしん", meanings: ["parents"], pos: "noun", jlpt: 5 },
  { word: "兄弟", reading: "きょうだい", meanings: ["siblings", "brothers"], pos: "noun", jlpt: 5, usesKanji: ["兄", "弟"] },
  { word: "姉妹", reading: "しまい", meanings: ["sisters"], pos: "noun", jlpt: 5 },

  // ===== N4 — verbs =====
  { word: "集める", reading: "あつめる", meanings: ["to collect", "to gather (something)"], pos: "ichidan verb", jlpt: 4 },
  { word: "集まる", reading: "あつまる", meanings: ["to gather (intransitive)"], pos: "godan verb", jlpt: 4 },
  { word: "育てる", reading: "そだてる", meanings: ["to raise", "to bring up"], pos: "ichidan verb", jlpt: 4 },
  { word: "育つ", reading: "そだつ", meanings: ["to grow up"], pos: "godan verb", jlpt: 4 },
  { word: "植える", reading: "うえる", meanings: ["to plant"], pos: "ichidan verb", jlpt: 4 },
  { word: "倒れる", reading: "たおれる", meanings: ["to fall over", "to collapse"], pos: "ichidan verb", jlpt: 4 },
  { word: "込む", reading: "こむ", meanings: ["to be crowded"], pos: "godan verb", jlpt: 4 },
  { word: "連れる", reading: "つれる", meanings: ["to take (a person) along"], pos: "ichidan verb", jlpt: 4 },
  { word: "迎える", reading: "むかえる", meanings: ["to go to meet", "to welcome"], pos: "ichidan verb", jlpt: 4 },
  { word: "別れる", reading: "わかれる", meanings: ["to separate", "to part"], pos: "ichidan verb", jlpt: 4 },
  { word: "慣れる", reading: "なれる", meanings: ["to get used to"], pos: "ichidan verb", jlpt: 4 },
  { word: "比較する", reading: "ひかくする", meanings: ["to compare"], pos: "irregular verb", jlpt: 4 },
  // ===== N4 — nouns =====
  { word: "計画", reading: "けいかく", meanings: ["plan"], pos: "noun", jlpt: 4 },
  { word: "工事", reading: "こうじ", meanings: ["construction work"], pos: "noun", jlpt: 4 },
  { word: "機械", reading: "きかい", meanings: ["machine"], pos: "noun", jlpt: 4 },
  { word: "道具", reading: "どうぐ", meanings: ["tool"], pos: "noun", jlpt: 4 },
  { word: "材料", reading: "ざいりょう", meanings: ["material", "ingredients"], pos: "noun", jlpt: 4 },
  { word: "製品", reading: "せいひん", meanings: ["product"], pos: "noun", jlpt: 4 },
  { word: "商品", reading: "しょうひん", meanings: ["goods", "merchandise"], pos: "noun", jlpt: 4 },
  { word: "値段", reading: "ねだん", meanings: ["price"], pos: "noun", jlpt: 4 },
  { word: "客", reading: "きゃく", meanings: ["guest", "customer"], pos: "noun", jlpt: 4 },
  { word: "店員", reading: "てんいん", meanings: ["shop clerk"], pos: "noun", jlpt: 4, usesKanji: ["店"] },
  { word: "規則", reading: "きそく", meanings: ["rule", "regulation"], pos: "noun", jlpt: 4 },
  { word: "習慣", reading: "しゅうかん", meanings: ["habit", "custom"], pos: "noun", jlpt: 4 },
  { word: "小説", reading: "しょうせつ", meanings: ["novel"], pos: "noun", jlpt: 4, usesKanji: ["小"] },
  { word: "漫画", reading: "まんが", meanings: ["comic", "manga"], pos: "noun", jlpt: 4 },
  { word: "物語", reading: "ものがたり", meanings: ["story", "tale"], pos: "noun", jlpt: 4, usesKanji: ["語"] },
  // ===== N4 — adjectives =====
  { word: "美しい", reading: "うつくしい", meanings: ["beautiful"], pos: "i-adjective", jlpt: 4 },
  { word: "苦しい", reading: "くるしい", meanings: ["painful", "difficult"], pos: "i-adjective", jlpt: 4 },
  { word: "眠い", reading: "ねむい", meanings: ["sleepy"], pos: "i-adjective", jlpt: 4 },
  { word: "細かい", reading: "こまかい", meanings: ["fine", "detailed"], pos: "i-adjective", jlpt: 4 },
  { word: "硬い", reading: "かたい", meanings: ["hard", "stiff"], pos: "i-adjective", jlpt: 4 },
  { word: "柔らかい", reading: "やわらかい", meanings: ["soft"], pos: "i-adjective", jlpt: 4 },
  { word: "丁寧", reading: "ていねい", meanings: ["polite", "careful"], pos: "na-adjective", jlpt: 4 },
  { word: "真面目", reading: "まじめ", meanings: ["serious", "diligent"], pos: "na-adjective", jlpt: 4 },
  { word: "失礼", reading: "しつれい", meanings: ["rude", "impolite"], pos: "na-adjective", jlpt: 4 },
  { word: "残念", reading: "ざんねん", meanings: ["regrettable", "a pity"], pos: "na-adjective", jlpt: 4 },
  { word: "急", reading: "きゅう", meanings: ["sudden", "urgent"], pos: "na-adjective", jlpt: 4 },
  // ===== N4 — adverbs =====
  { word: "必ず", reading: "かならず", meanings: ["without fail", "certainly"], pos: "adverb", jlpt: 4 },
  { word: "多分", reading: "たぶん", meanings: ["probably", "maybe"], pos: "adverb", jlpt: 4, usesKanji: ["分"] },
  { word: "例えば", reading: "たとえば", meanings: ["for example"], pos: "adverb", jlpt: 4 },
  { word: "特に", reading: "とくに", meanings: ["especially", "particularly"], pos: "adverb", jlpt: 4 },

  // ===== N3 — verbs =====
  { word: "含む", reading: "ふくむ", meanings: ["to contain", "to include"], pos: "godan verb", jlpt: 3 },
  { word: "異なる", reading: "ことなる", meanings: ["to differ", "to be different"], pos: "godan verb", jlpt: 3 },
  { word: "認める", reading: "みとめる", meanings: ["to recognize", "to admit"], pos: "ichidan verb", jlpt: 3 },
  { word: "求める", reading: "もとめる", meanings: ["to seek", "to demand"], pos: "ichidan verb", jlpt: 3 },
  { word: "与える", reading: "あたえる", meanings: ["to give", "to grant"], pos: "ichidan verb", jlpt: 3 },
  { word: "加える", reading: "くわえる", meanings: ["to add"], pos: "ichidan verb", jlpt: 3 },
  { word: "述べる", reading: "のべる", meanings: ["to state", "to express"], pos: "ichidan verb", jlpt: 3 },
  { word: "示す", reading: "しめす", meanings: ["to show", "to indicate"], pos: "godan verb", jlpt: 3 },
  { word: "防ぐ", reading: "ふせぐ", meanings: ["to prevent", "to protect against"], pos: "godan verb", jlpt: 3 },
  { word: "避ける", reading: "さける", meanings: ["to avoid"], pos: "ichidan verb", jlpt: 3 },
  // ===== N3 — nouns =====
  { word: "政府", reading: "せいふ", meanings: ["government"], pos: "noun", jlpt: 3 },
  { word: "制度", reading: "せいど", meanings: ["system", "institution"], pos: "noun", jlpt: 3 },
  { word: "状況", reading: "じょうきょう", meanings: ["situation", "circumstances"], pos: "noun", jlpt: 3 },
  { word: "状態", reading: "じょうたい", meanings: ["state", "condition"], pos: "noun", jlpt: 3 },
  { word: "条件", reading: "じょうけん", meanings: ["condition", "terms"], pos: "noun", jlpt: 3 },
  { word: "関係", reading: "かんけい", meanings: ["relationship", "connection"], pos: "noun", jlpt: 3 },
  { word: "価値", reading: "かち", meanings: ["value", "worth"], pos: "noun", jlpt: 3 },
  { word: "利益", reading: "りえき", meanings: ["profit", "benefit"], pos: "noun", jlpt: 3 },
  { word: "責任", reading: "せきにん", meanings: ["responsibility"], pos: "noun", jlpt: 3 },
  { word: "能力", reading: "のうりょく", meanings: ["ability", "capability"], pos: "noun", jlpt: 3 },
  { word: "知識", reading: "ちしき", meanings: ["knowledge"], pos: "noun", jlpt: 3 },
  { word: "技術", reading: "ぎじゅつ", meanings: ["technology", "skill"], pos: "noun", jlpt: 3 },
  { word: "方法", reading: "ほうほう", meanings: ["method", "way"], pos: "noun", jlpt: 3 },
  { word: "手段", reading: "しゅだん", meanings: ["means", "measure"], pos: "noun", jlpt: 3, usesKanji: ["手"] },
  { word: "特徴", reading: "とくちょう", meanings: ["characteristic", "feature"], pos: "noun", jlpt: 3 },
  // ===== N3 — adjectives =====
  { word: "主要", reading: "しゅよう", meanings: ["main", "principal"], pos: "na-adjective", jlpt: 3 },
  { word: "適切", reading: "てきせつ", meanings: ["appropriate", "proper"], pos: "na-adjective", jlpt: 3 },
  { word: "十分", reading: "じゅうぶん", meanings: ["enough", "sufficient"], pos: "na-adjective", jlpt: 3, usesKanji: ["分"] },
  { word: "重大", reading: "じゅうだい", meanings: ["serious", "grave"], pos: "na-adjective", jlpt: 3, usesKanji: ["大"] },
  // ===== N3 — adverbs =====
  { word: "実は", reading: "じつは", meanings: ["actually", "in fact"], pos: "adverb", jlpt: 3 },
  { word: "結局", reading: "けっきょく", meanings: ["after all", "in the end"], pos: "adverb", jlpt: 3 },
  { word: "一方", reading: "いっぽう", meanings: ["on the other hand"], pos: "adverb", jlpt: 3 },
];

async function main() {
  console.log("Seeding more vocabulary (N5/N4/N3)…");
  let n = 0;
  for (const v of VOCAB) {
    const created = await db.vocabulary.upsert({
      where: { word_reading: { word: v.word, reading: v.reading } },
      update: {
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify([v.pos]),
        jlptLevel: v.jlpt,
      },
      create: {
        word: v.word, reading: v.reading,
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify([v.pos]),
        jlptLevel: v.jlpt, source: "curated",
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
    n++;
  }
  console.log(`  ✓ ${n} words added/updated.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
