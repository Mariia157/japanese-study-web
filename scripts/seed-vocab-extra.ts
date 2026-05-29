// Extra hand-curated vocabulary on top of the starter and Genki sets.
// Adds ~150 more N5/N4 words across common categories.
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type V = { word: string; reading: string; meanings: string[]; pos: string; jlpt: number };

const VOCAB: V[] = [
  // === N5: family ===
  { word: "母", reading: "はは", meanings: ["my mother"], pos: "noun", jlpt: 5 },
  { word: "父", reading: "ちち", meanings: ["my father"], pos: "noun", jlpt: 5 },
  { word: "兄", reading: "あに", meanings: ["my older brother"], pos: "noun", jlpt: 5 },
  { word: "姉", reading: "あね", meanings: ["my older sister"], pos: "noun", jlpt: 5 },
  { word: "弟", reading: "おとうと", meanings: ["my younger brother"], pos: "noun", jlpt: 5 },
  { word: "妹", reading: "いもうと", meanings: ["my younger sister"], pos: "noun", jlpt: 5 },
  { word: "お母さん", reading: "おかあさん", meanings: ["someone's mother"], pos: "noun", jlpt: 5 },
  { word: "お父さん", reading: "おとうさん", meanings: ["someone's father"], pos: "noun", jlpt: 5 },
  { word: "家族", reading: "かぞく", meanings: ["family"], pos: "noun", jlpt: 5 },
  { word: "子供", reading: "こども", meanings: ["child"], pos: "noun", jlpt: 5 },
  // === N5: time ===
  { word: "朝", reading: "あさ", meanings: ["morning"], pos: "noun", jlpt: 5 },
  { word: "昼", reading: "ひる", meanings: ["noon", "daytime"], pos: "noun", jlpt: 5 },
  { word: "夜", reading: "よる", meanings: ["night"], pos: "noun", jlpt: 5 },
  { word: "今日", reading: "きょう", meanings: ["today"], pos: "noun", jlpt: 5 },
  { word: "明日", reading: "あした", meanings: ["tomorrow"], pos: "noun", jlpt: 5 },
  { word: "昨日", reading: "きのう", meanings: ["yesterday"], pos: "noun", jlpt: 5 },
  { word: "毎日", reading: "まいにち", meanings: ["every day"], pos: "noun", jlpt: 5 },
  { word: "週", reading: "しゅう", meanings: ["week"], pos: "noun", jlpt: 5 },
  { word: "月曜日", reading: "げつようび", meanings: ["Monday"], pos: "noun", jlpt: 5 },
  { word: "火曜日", reading: "かようび", meanings: ["Tuesday"], pos: "noun", jlpt: 5 },
  { word: "水曜日", reading: "すいようび", meanings: ["Wednesday"], pos: "noun", jlpt: 5 },
  { word: "木曜日", reading: "もくようび", meanings: ["Thursday"], pos: "noun", jlpt: 5 },
  { word: "金曜日", reading: "きんようび", meanings: ["Friday"], pos: "noun", jlpt: 5 },
  { word: "土曜日", reading: "どようび", meanings: ["Saturday"], pos: "noun", jlpt: 5 },
  { word: "日曜日", reading: "にちようび", meanings: ["Sunday"], pos: "noun", jlpt: 5 },
  // === N5: places ===
  { word: "家", reading: "いえ", meanings: ["house", "home"], pos: "noun", jlpt: 5 },
  { word: "学校", reading: "がっこう", meanings: ["school"], pos: "noun", jlpt: 5 },
  { word: "大学", reading: "だいがく", meanings: ["university"], pos: "noun", jlpt: 5 },
  { word: "図書館", reading: "としょかん", meanings: ["library"], pos: "noun", jlpt: 5 },
  { word: "店", reading: "みせ", meanings: ["shop"], pos: "noun", jlpt: 5 },
  { word: "病院", reading: "びょういん", meanings: ["hospital"], pos: "noun", jlpt: 5 },
  { word: "駅", reading: "えき", meanings: ["station"], pos: "noun", jlpt: 5 },
  { word: "公園", reading: "こうえん", meanings: ["park"], pos: "noun", jlpt: 5 },
  { word: "銀行", reading: "ぎんこう", meanings: ["bank"], pos: "noun", jlpt: 5 },
  { word: "郵便局", reading: "ゆうびんきょく", meanings: ["post office"], pos: "noun", jlpt: 5 },
  // === N5: common items ===
  { word: "電話", reading: "でんわ", meanings: ["telephone"], pos: "noun", jlpt: 5 },
  { word: "テレビ", reading: "テレビ", meanings: ["TV"], pos: "noun", jlpt: 5 },
  { word: "ラジオ", reading: "ラジオ", meanings: ["radio"], pos: "noun", jlpt: 5 },
  { word: "車", reading: "くるま", meanings: ["car"], pos: "noun", jlpt: 5 },
  { word: "電車", reading: "でんしゃ", meanings: ["train"], pos: "noun", jlpt: 5 },
  { word: "自転車", reading: "じてんしゃ", meanings: ["bicycle"], pos: "noun", jlpt: 5 },
  { word: "鉛筆", reading: "えんぴつ", meanings: ["pencil"], pos: "noun", jlpt: 5 },
  { word: "ペン", reading: "ペン", meanings: ["pen"], pos: "noun", jlpt: 5 },
  { word: "ノート", reading: "ノート", meanings: ["notebook"], pos: "noun", jlpt: 5 },
  { word: "椅子", reading: "いす", meanings: ["chair"], pos: "noun", jlpt: 5 },
  { word: "机", reading: "つくえ", meanings: ["desk"], pos: "noun", jlpt: 5 },
  // === N5: food ===
  { word: "ご飯", reading: "ごはん", meanings: ["rice", "meal"], pos: "noun", jlpt: 5 },
  { word: "肉", reading: "にく", meanings: ["meat"], pos: "noun", jlpt: 5 },
  { word: "魚", reading: "さかな", meanings: ["fish"], pos: "noun", jlpt: 5 },
  { word: "野菜", reading: "やさい", meanings: ["vegetable"], pos: "noun", jlpt: 5 },
  { word: "果物", reading: "くだもの", meanings: ["fruit"], pos: "noun", jlpt: 5 },
  { word: "パン", reading: "パン", meanings: ["bread"], pos: "noun", jlpt: 5 },
  { word: "卵", reading: "たまご", meanings: ["egg"], pos: "noun", jlpt: 5 },
  { word: "コーヒー", reading: "コーヒー", meanings: ["coffee"], pos: "noun", jlpt: 5 },
  { word: "お茶", reading: "おちゃ", meanings: ["tea"], pos: "noun", jlpt: 5 },
  { word: "ジュース", reading: "ジュース", meanings: ["juice"], pos: "noun", jlpt: 5 },
  { word: "ビール", reading: "ビール", meanings: ["beer"], pos: "noun", jlpt: 5 },
  { word: "お酒", reading: "おさけ", meanings: ["alcohol", "sake"], pos: "noun", jlpt: 5 },
  { word: "寿司", reading: "すし", meanings: ["sushi"], pos: "noun", jlpt: 5 },
  { word: "ラーメン", reading: "ラーメン", meanings: ["ramen"], pos: "noun", jlpt: 5 },
  // === N5: verbs ===
  { word: "買う", reading: "かう", meanings: ["to buy"], pos: "godan verb", jlpt: 5 },
  { word: "売る", reading: "うる", meanings: ["to sell"], pos: "godan verb", jlpt: 5 },
  { word: "作る", reading: "つくる", meanings: ["to make"], pos: "godan verb", jlpt: 5 },
  { word: "使う", reading: "つかう", meanings: ["to use"], pos: "godan verb", jlpt: 5 },
  { word: "立つ", reading: "たつ", meanings: ["to stand"], pos: "godan verb", jlpt: 5 },
  { word: "座る", reading: "すわる", meanings: ["to sit"], pos: "godan verb", jlpt: 5 },
  { word: "歩く", reading: "あるく", meanings: ["to walk"], pos: "godan verb", jlpt: 5 },
  { word: "走る", reading: "はしる", meanings: ["to run"], pos: "godan verb", jlpt: 5 },
  { word: "泳ぐ", reading: "およぐ", meanings: ["to swim"], pos: "godan verb", jlpt: 5 },
  { word: "出る", reading: "でる", meanings: ["to leave", "to exit"], pos: "ichidan verb", jlpt: 5 },
  { word: "入る", reading: "はいる", meanings: ["to enter"], pos: "godan verb", jlpt: 5 },
  { word: "帰る", reading: "かえる", meanings: ["to return home"], pos: "godan verb", jlpt: 5 },
  { word: "覚える", reading: "おぼえる", meanings: ["to remember", "to memorize"], pos: "ichidan verb", jlpt: 5 },
  { word: "忘れる", reading: "わすれる", meanings: ["to forget"], pos: "ichidan verb", jlpt: 5 },
  { word: "教える", reading: "おしえる", meanings: ["to teach"], pos: "ichidan verb", jlpt: 5 },
  { word: "習う", reading: "ならう", meanings: ["to learn (from someone)"], pos: "godan verb", jlpt: 5 },
  // === N5: adjectives ===
  { word: "暑い", reading: "あつい", meanings: ["hot (weather)"], pos: "i-adjective", jlpt: 5 },
  { word: "寒い", reading: "さむい", meanings: ["cold (weather)"], pos: "i-adjective", jlpt: 5 },
  { word: "暖かい", reading: "あたたかい", meanings: ["warm"], pos: "i-adjective", jlpt: 5 },
  { word: "涼しい", reading: "すずしい", meanings: ["cool"], pos: "i-adjective", jlpt: 5 },
  { word: "難しい", reading: "むずかしい", meanings: ["difficult"], pos: "i-adjective", jlpt: 5 },
  { word: "易しい", reading: "やさしい", meanings: ["easy"], pos: "i-adjective", jlpt: 5 },
  { word: "速い", reading: "はやい", meanings: ["fast"], pos: "i-adjective", jlpt: 5 },
  { word: "遅い", reading: "おそい", meanings: ["slow", "late"], pos: "i-adjective", jlpt: 5 },
  { word: "忙しい", reading: "いそがしい", meanings: ["busy"], pos: "i-adjective", jlpt: 5 },
  { word: "楽しい", reading: "たのしい", meanings: ["fun"], pos: "i-adjective", jlpt: 5 },
  { word: "うれしい", reading: "うれしい", meanings: ["happy"], pos: "i-adjective", jlpt: 5 },
  { word: "悲しい", reading: "かなしい", meanings: ["sad"], pos: "i-adjective", jlpt: 5 },
  { word: "元気", reading: "げんき", meanings: ["healthy", "energetic"], pos: "na-adjective", jlpt: 5 },
  { word: "便利", reading: "べんり", meanings: ["convenient"], pos: "na-adjective", jlpt: 5 },
  { word: "親切", reading: "しんせつ", meanings: ["kind"], pos: "na-adjective", jlpt: 5 },
  { word: "有名", reading: "ゆうめい", meanings: ["famous"], pos: "na-adjective", jlpt: 5 },
  // === N5: numbers and counters ===
  { word: "一つ", reading: "ひとつ", meanings: ["one (thing)"], pos: "counter", jlpt: 5 },
  { word: "二つ", reading: "ふたつ", meanings: ["two (things)"], pos: "counter", jlpt: 5 },
  { word: "三つ", reading: "みっつ", meanings: ["three (things)"], pos: "counter", jlpt: 5 },
  { word: "百", reading: "ひゃく", meanings: ["hundred"], pos: "numeric", jlpt: 5 },
  { word: "千", reading: "せん", meanings: ["thousand"], pos: "numeric", jlpt: 5 },
  { word: "万", reading: "まん", meanings: ["ten thousand"], pos: "numeric", jlpt: 5 },
  // === N4: more advanced verbs ===
  { word: "考える", reading: "かんがえる", meanings: ["to think", "to consider"], pos: "ichidan verb", jlpt: 4 },
  { word: "決める", reading: "きめる", meanings: ["to decide"], pos: "ichidan verb", jlpt: 4 },
  { word: "調べる", reading: "しらべる", meanings: ["to investigate", "to look up"], pos: "ichidan verb", jlpt: 4 },
  { word: "比べる", reading: "くらべる", meanings: ["to compare"], pos: "ichidan verb", jlpt: 4 },
  { word: "始める", reading: "はじめる", meanings: ["to start (something)"], pos: "ichidan verb", jlpt: 4 },
  { word: "始まる", reading: "はじまる", meanings: ["(something) starts"], pos: "godan verb", jlpt: 4 },
  { word: "終わる", reading: "おわる", meanings: ["to end"], pos: "godan verb", jlpt: 4 },
  { word: "続ける", reading: "つづける", meanings: ["to continue (something)"], pos: "ichidan verb", jlpt: 4 },
  { word: "続く", reading: "つづく", meanings: ["(something) continues"], pos: "godan verb", jlpt: 4 },
  { word: "感じる", reading: "かんじる", meanings: ["to feel"], pos: "ichidan verb", jlpt: 4 },
  { word: "信じる", reading: "しんじる", meanings: ["to believe"], pos: "ichidan verb", jlpt: 4 },
  { word: "答える", reading: "こたえる", meanings: ["to answer"], pos: "ichidan verb", jlpt: 4 },
  { word: "頼む", reading: "たのむ", meanings: ["to ask (a favor)"], pos: "godan verb", jlpt: 4 },
  { word: "急ぐ", reading: "いそぐ", meanings: ["to hurry"], pos: "godan verb", jlpt: 4 },
  { word: "送る", reading: "おくる", meanings: ["to send"], pos: "godan verb", jlpt: 4 },
  { word: "受ける", reading: "うける", meanings: ["to receive", "to take (a test)"], pos: "ichidan verb", jlpt: 4 },
  // === N4: more adjectives ===
  { word: "重要", reading: "じゅうよう", meanings: ["important"], pos: "na-adjective", jlpt: 4 },
  { word: "必要", reading: "ひつよう", meanings: ["necessary"], pos: "na-adjective", jlpt: 4 },
  { word: "可能", reading: "かのう", meanings: ["possible"], pos: "na-adjective", jlpt: 4 },
  { word: "不便", reading: "ふべん", meanings: ["inconvenient"], pos: "na-adjective", jlpt: 4 },
  { word: "簡単", reading: "かんたん", meanings: ["simple"], pos: "na-adjective", jlpt: 4 },
  { word: "複雑", reading: "ふくざつ", meanings: ["complex"], pos: "na-adjective", jlpt: 4 },
  { word: "安全", reading: "あんぜん", meanings: ["safe"], pos: "na-adjective", jlpt: 4 },
  { word: "危険", reading: "きけん", meanings: ["dangerous"], pos: "na-adjective", jlpt: 4 },
  { word: "正しい", reading: "ただしい", meanings: ["correct"], pos: "i-adjective", jlpt: 4 },
  { word: "若い", reading: "わかい", meanings: ["young"], pos: "i-adjective", jlpt: 4 },
  { word: "強い", reading: "つよい", meanings: ["strong"], pos: "i-adjective", jlpt: 4 },
  { word: "弱い", reading: "よわい", meanings: ["weak"], pos: "i-adjective", jlpt: 4 },
  { word: "深い", reading: "ふかい", meanings: ["deep"], pos: "i-adjective", jlpt: 4 },
  { word: "浅い", reading: "あさい", meanings: ["shallow"], pos: "i-adjective", jlpt: 4 },
  { word: "広い", reading: "ひろい", meanings: ["wide", "spacious"], pos: "i-adjective", jlpt: 4 },
  { word: "狭い", reading: "せまい", meanings: ["narrow", "cramped"], pos: "i-adjective", jlpt: 4 },
  // === N4: useful nouns ===
  { word: "経験", reading: "けいけん", meanings: ["experience"], pos: "noun", jlpt: 4 },
  { word: "意味", reading: "いみ", meanings: ["meaning"], pos: "noun", jlpt: 4 },
  { word: "理由", reading: "りゆう", meanings: ["reason"], pos: "noun", jlpt: 4 },
  { word: "問題", reading: "もんだい", meanings: ["problem", "question"], pos: "noun", jlpt: 4 },
  { word: "答え", reading: "こたえ", meanings: ["answer"], pos: "noun", jlpt: 4 },
  { word: "気持ち", reading: "きもち", meanings: ["feeling", "mood"], pos: "noun", jlpt: 4 },
  { word: "予定", reading: "よてい", meanings: ["plan", "schedule"], pos: "noun", jlpt: 4 },
  { word: "場所", reading: "ばしょ", meanings: ["place"], pos: "noun", jlpt: 4 },
  { word: "番組", reading: "ばんぐみ", meanings: ["TV program"], pos: "noun", jlpt: 4 },
  { word: "経済", reading: "けいざい", meanings: ["economy"], pos: "noun", jlpt: 4 },
  { word: "政治", reading: "せいじ", meanings: ["politics"], pos: "noun", jlpt: 4 },
  { word: "文化", reading: "ぶんか", meanings: ["culture"], pos: "noun", jlpt: 4 },
  { word: "歴史", reading: "れきし", meanings: ["history"], pos: "noun", jlpt: 4 },
];

async function main() {
  console.log("Seeding extra vocabulary…");
  let n = 0;
  for (const v of VOCAB) {
    await db.vocabulary.upsert({
      where: { word_reading: { word: v.word, reading: v.reading } },
      update: { jlptLevel: v.jlpt },
      create: {
        word: v.word, reading: v.reading,
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify([v.pos]),
        jlptLevel: v.jlpt,
        source: "curated",
      },
    });
    n++;
  }
  console.log(`  ✓ ${n} words added/updated.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
