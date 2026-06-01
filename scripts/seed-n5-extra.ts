// Extra N5 kanji + vocabulary to round out the JLPT N5 set.
// The starter seed ships 30 kanji; this adds the rest of the common ~80-kanji N5 list
// (numbers/money, time, position, directions, family, nature, places, verbs) with
// mnemonics, radical links, and vocabulary that uses them.
// Idempotent: safe to re-run. Run: npm run seed:n5
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

// New radicals needed by the kanji below (starter already has 人口日月水木火山目手心言金車門).
const RADICALS = [
  { character: "女", meaning: "woman" },
  { character: "子", meaning: "child" },
  { character: "田", meaning: "rice field" },
  { character: "大", meaning: "big" },
  { character: "小", meaning: "small" },
  { character: "土", meaning: "earth/ground" },
  { character: "雨", meaning: "rain" },
  { character: "力", meaning: "power" },
  { character: "立", meaning: "stand" },
  { character: "食", meaning: "eat/food" },
  { character: "寸", meaning: "inch/measure" },
  { character: "白", meaning: "white" },
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
  // --- numbers & money ---
  { character: "百", meanings: ["hundred"], on: ["ヒャク"], kun: [], jlptLevel: 5, strokes: 6, mnemonic: "A 'one' (一) on top of 'white' (白) — one hundred is the first big white milestone." },
  { character: "千", meanings: ["thousand"], on: ["セン"], kun: ["ち"], jlptLevel: 5, strokes: 3, mnemonic: "A person (ノ) striding over ten (十) — a thousand steps." },
  { character: "万", meanings: ["ten thousand"], on: ["マン", "バン"], kun: [], jlptLevel: 5, strokes: 3, mnemonic: "A swirl that goes on and on — ten thousand things." },
  { character: "円", meanings: ["yen", "circle"], on: ["エン"], kun: ["まる"], jlptLevel: 5, strokes: 4, mnemonic: "A round frame holding coins — the yen." },
  // --- time / calendar ---
  { character: "時", meanings: ["time", "hour"], on: ["ジ"], kun: ["とき"], jlptLevel: 5, strokes: 10, mnemonic: "The sun (日) at the temple (寺) tells the hour.", radicals: ["日"] },
  { character: "分", meanings: ["minute", "part", "understand"], on: ["ブン", "フン"], kun: ["わ"], jlptLevel: 5, strokes: 4, mnemonic: "A sword (刀) splitting (八) something into minutes/parts." },
  { character: "半", meanings: ["half"], on: ["ハン"], kun: ["なか"], jlptLevel: 5, strokes: 5, mnemonic: "A cow split down the middle — half." },
  { character: "金", meanings: ["gold", "money", "Friday"], on: ["キン", "コン"], kun: ["かね"], jlptLevel: 5, strokes: 8, mnemonic: "Nuggets under a roof in the earth — gold.", radicals: ["金"] },
  { character: "土", meanings: ["earth", "soil", "Saturday"], on: ["ド", "ト"], kun: ["つち"], jlptLevel: 5, strokes: 3, mnemonic: "A seedling pushing up through the ground.", radicals: ["土"] },
  { character: "週", meanings: ["week"], on: ["シュウ"], kun: [], jlptLevel: 5, strokes: 11, mnemonic: "Going around (辶) a full circuit — one week." },
  { character: "間", meanings: ["interval", "between"], on: ["カン", "ケン"], kun: ["あいだ", "ま"], jlptLevel: 5, strokes: 12, mnemonic: "The sun (日) seen through a gate (門) — the gap between.", radicals: ["門", "日"] },
  { character: "毎", meanings: ["every"], on: ["マイ"], kun: [], jlptLevel: 5, strokes: 6, mnemonic: "A mother (母-like) doing the same thing every day." },
  { character: "午", meanings: ["noon"], on: ["ゴ"], kun: [], jlptLevel: 5, strokes: 4, mnemonic: "A stake in the ground at high noon when the shadow is shortest." },
  { character: "何", meanings: ["what"], on: ["カ"], kun: ["なに", "なん"], jlptLevel: 5, strokes: 7, mnemonic: "A person (亻) carrying something — 'what is that?'", radicals: ["人"] },
  { character: "名", meanings: ["name"], on: ["メイ", "ミョウ"], kun: ["な"], jlptLevel: 5, strokes: 6, mnemonic: "In the evening (夕) you call out a mouth's (口) name.", radicals: ["口"] },
  // --- position ---
  { character: "上", meanings: ["up", "above"], on: ["ジョウ"], kun: ["うえ", "あ", "のぼ"], jlptLevel: 5, strokes: 3, mnemonic: "A mark above the line — up." },
  { character: "下", meanings: ["down", "below"], on: ["カ", "ゲ"], kun: ["した", "さ", "くだ"], jlptLevel: 5, strokes: 3, mnemonic: "A mark below the line — down." },
  { character: "中", meanings: ["middle", "inside"], on: ["チュウ"], kun: ["なか"], jlptLevel: 5, strokes: 4, mnemonic: "A line straight through the center of a box.", radicals: ["口"] },
  { character: "外", meanings: ["outside"], on: ["ガイ", "ゲ"], kun: ["そと", "ほか"], jlptLevel: 5, strokes: 5, mnemonic: "Evening (夕) fortune-telling (卜) is done outside." },
  { character: "左", meanings: ["left"], on: ["サ"], kun: ["ひだり"], jlptLevel: 5, strokes: 5, mnemonic: "A hand holding a carpenter's ruler — the left hand." },
  { character: "右", meanings: ["right"], on: ["ウ", "ユウ"], kun: ["みぎ"], jlptLevel: 5, strokes: 5, mnemonic: "A hand reaching to the mouth (口) to eat — the right hand.", radicals: ["口"] },
  { character: "前", meanings: ["before", "front"], on: ["ゼン"], kun: ["まえ"], jlptLevel: 5, strokes: 9, mnemonic: "A boat with a moon and knife — moving forward, in front." },
  { character: "後", meanings: ["after", "behind"], on: ["ゴ", "コウ"], kun: ["あと", "うし", "のち"], jlptLevel: 5, strokes: 9, mnemonic: "A small step trailing behind on the road — after." },
  // --- directions ---
  { character: "東", meanings: ["east"], on: ["トウ"], kun: ["ひがし"], jlptLevel: 5, strokes: 8, mnemonic: "The sun (日) rising behind a tree (木) — the east.", radicals: ["日", "木"] },
  { character: "西", meanings: ["west"], on: ["セイ", "サイ"], kun: ["にし"], jlptLevel: 5, strokes: 6, mnemonic: "The sun setting into a basket on the horizon — the west." },
  { character: "南", meanings: ["south"], on: ["ナン"], kun: ["みなみ"], jlptLevel: 5, strokes: 9, mnemonic: "A warm tent facing the sun — the south." },
  { character: "北", meanings: ["north"], on: ["ホク"], kun: ["きた"], jlptLevel: 5, strokes: 5, mnemonic: "Two people sitting back to back, away from the cold north." },
  // --- family / people ---
  { character: "男", meanings: ["man", "male"], on: ["ダン", "ナン"], kun: ["おとこ"], jlptLevel: 5, strokes: 7, mnemonic: "Power (力) in the rice field (田) — the man works the land.", radicals: ["田", "力"] },
  { character: "女", meanings: ["woman", "female"], on: ["ジョ", "ニョ"], kun: ["おんな"], jlptLevel: 5, strokes: 3, mnemonic: "A graceful figure seated — a woman.", radicals: ["女"] },
  { character: "子", meanings: ["child"], on: ["シ", "ス"], kun: ["こ"], jlptLevel: 5, strokes: 3, mnemonic: "A baby with outstretched arms wrapped in a blanket.", radicals: ["子"] },
  { character: "父", meanings: ["father"], on: ["フ"], kun: ["ちち"], jlptLevel: 5, strokes: 4, mnemonic: "Two crossed hands holding an axe — the father provides." },
  { character: "母", meanings: ["mother"], on: ["ボ"], kun: ["はは"], jlptLevel: 5, strokes: 5, mnemonic: "A figure with two dots — a nursing mother." },
  { character: "兄", meanings: ["older brother"], on: ["キョウ", "ケイ"], kun: ["あに"], jlptLevel: 5, strokes: 5, mnemonic: "A mouth (口) on legs (儿) — the big brother who gives orders.", radicals: ["口"] },
  { character: "弟", meanings: ["younger brother"], on: ["テイ", "ダイ"], kun: ["おとうと"], jlptLevel: 5, strokes: 7, mnemonic: "A spinning top bound with string — the little brother who plays." },
  { character: "友", meanings: ["friend"], on: ["ユウ"], kun: ["とも"], jlptLevel: 5, strokes: 4, mnemonic: "Two hands reaching out to each other — friends.", radicals: ["手"] },
  // --- size / quality adjective kanji ---
  { character: "大", meanings: ["big", "large"], on: ["ダイ", "タイ"], kun: ["おお"], jlptLevel: 5, strokes: 3, mnemonic: "A person stretching arms and legs out wide — big.", radicals: ["大"] },
  { character: "小", meanings: ["small", "little"], on: ["ショウ"], kun: ["ちい", "こ", "お"], jlptLevel: 5, strokes: 3, mnemonic: "A tiny seed split into smaller bits — small.", radicals: ["小"] },
  { character: "高", meanings: ["high", "expensive"], on: ["コウ"], kun: ["たか"], jlptLevel: 5, strokes: 10, mnemonic: "A tall watchtower with a roof — high.", radicals: ["口"] },
  { character: "安", meanings: ["cheap", "safe", "peaceful"], on: ["アン"], kun: ["やす"], jlptLevel: 5, strokes: 6, mnemonic: "A woman (女) safe under a roof — peaceful and cheap.", radicals: ["女"] },
  { character: "新", meanings: ["new"], on: ["シン"], kun: ["あたら", "あら"], jlptLevel: 5, strokes: 13, mnemonic: "An axe (斤) cutting a standing (立) tree (木) for fresh, new wood.", radicals: ["立", "木"] },
  { character: "古", meanings: ["old"], on: ["コ"], kun: ["ふる"], jlptLevel: 5, strokes: 5, mnemonic: "Ten (十) mouths (口) have told this story — it's old.", radicals: ["口"] },
  { character: "長", meanings: ["long", "chief"], on: ["チョウ"], kun: ["なが"], jlptLevel: 5, strokes: 8, mnemonic: "Long flowing hair on an elder — long, and the chief." },
  { character: "白", meanings: ["white"], on: ["ハク", "ビャク"], kun: ["しろ", "しら"], jlptLevel: 5, strokes: 5, mnemonic: "A single ray (ノ) of sun (日) — blinding white.", radicals: ["白"] },
  // --- nature ---
  { character: "田", meanings: ["rice field"], on: ["デン"], kun: ["た"], jlptLevel: 5, strokes: 5, mnemonic: "A field divided into four paddies — rice field.", radicals: ["田"] },
  { character: "雨", meanings: ["rain"], on: ["ウ"], kun: ["あめ"], jlptLevel: 5, strokes: 8, mnemonic: "Drops falling inside a window frame — rain.", radicals: ["雨"] },
  { character: "天", meanings: ["heaven", "sky"], on: ["テン"], kun: ["あま"], jlptLevel: 5, strokes: 4, mnemonic: "A line above a big (大) person — the heavens above.", radicals: ["大"] },
  { character: "空", meanings: ["sky", "empty"], on: ["クウ"], kun: ["そら", "あ", "から"], jlptLevel: 5, strokes: 8, mnemonic: "A hole (穴) above the work (工) — the empty sky." },
  { character: "気", meanings: ["spirit", "air", "energy"], on: ["キ", "ケ"], kun: [], jlptLevel: 5, strokes: 6, mnemonic: "Steam/vapor rising — the air, one's spirit." },
  { character: "花", meanings: ["flower"], on: ["カ"], kun: ["はな"], jlptLevel: 5, strokes: 7, mnemonic: "Grass (艹) that changes (化) into a blossom — a flower." },
  // --- places / transport ---
  { character: "電", meanings: ["electricity"], on: ["デン"], kun: [], jlptLevel: 5, strokes: 13, mnemonic: "Rain (雨) plus a lightning bolt — electricity.", radicals: ["雨"] },
  { character: "道", meanings: ["road", "way"], on: ["ドウ"], kun: ["みち"], jlptLevel: 5, strokes: 12, mnemonic: "A head (首) moving (辶) along the road." },
  { character: "駅", meanings: ["station"], on: ["エキ"], kun: [], jlptLevel: 5, strokes: 14, mnemonic: "A horse (馬) measured (尺) — where the old post horses stopped: the station." },
  { character: "店", meanings: ["shop", "store"], on: ["テン"], kun: ["みせ"], jlptLevel: 5, strokes: 8, mnemonic: "A building (广) for fortune-telling (占) goods — a shop.", radicals: ["口"] },
  { character: "校", meanings: ["school"], on: ["コウ"], kun: [], jlptLevel: 5, strokes: 10, mnemonic: "A tree (木) where people mingle (交) — the school.", radicals: ["木"] },
  { character: "国", meanings: ["country"], on: ["コク"], kun: ["くに"], jlptLevel: 5, strokes: 8, mnemonic: "A jewel (玉) enclosed by borders (囗) — the country.", radicals: ["口"] },
  // --- language / words ---
  { character: "語", meanings: ["language", "word"], on: ["ゴ"], kun: ["かた"], jlptLevel: 5, strokes: 14, mnemonic: "Speech (言) of five (五) mouths (口) — language.", radicals: ["言", "口"] },
  { character: "文", meanings: ["sentence", "writing"], on: ["ブン", "モン"], kun: ["ふみ"], jlptLevel: 5, strokes: 4, mnemonic: "Crossed brush strokes — writing, a sentence." },
  { character: "字", meanings: ["character", "letter"], on: ["ジ"], kun: ["あざ"], jlptLevel: 5, strokes: 6, mnemonic: "A child (子) under a roof learning to write characters.", radicals: ["子"] },
  // --- common verbs ---
  { character: "食", meanings: ["eat", "food"], on: ["ショク"], kun: ["た", "く"], jlptLevel: 5, strokes: 9, mnemonic: "A roof over good things gathered to eat.", radicals: ["食"] },
  { character: "飲", meanings: ["drink"], on: ["イン"], kun: ["の"], jlptLevel: 5, strokes: 12, mnemonic: "Food (食) plus a yawning mouth (欠) — to drink.", radicals: ["食"] },
  { character: "聞", meanings: ["hear", "ask"], on: ["ブン", "モン"], kun: ["き"], jlptLevel: 5, strokes: 14, mnemonic: "An ear (耳) at the gate (門) — listening.", radicals: ["門"] },
  { character: "読", meanings: ["read"], on: ["ドク", "トク"], kun: ["よ"], jlptLevel: 5, strokes: 14, mnemonic: "Speaking (言) while selling (売) — reading aloud.", radicals: ["言"] },
  { character: "書", meanings: ["write"], on: ["ショ"], kun: ["か"], jlptLevel: 5, strokes: 10, mnemonic: "A brush (聿) writing on a tablet — to write." },
  { character: "話", meanings: ["talk", "story"], on: ["ワ"], kun: ["はな", "はなし"], jlptLevel: 5, strokes: 13, mnemonic: "Speech (言) from a lively tongue (舌) — to talk.", radicals: ["言"] },
  { character: "買", meanings: ["buy"], on: ["バイ"], kun: ["か"], jlptLevel: 5, strokes: 12, mnemonic: "A net (罒) over a shell (貝) of money — to buy.", radicals: ["目"] },
  { character: "来", meanings: ["come"], on: ["ライ"], kun: ["く", "き", "こ"], jlptLevel: 5, strokes: 7, mnemonic: "A tree with two people coming toward it.", radicals: ["木"] },
  { character: "出", meanings: ["exit", "leave", "put out"], on: ["シュツ"], kun: ["で", "だ"], jlptLevel: 5, strokes: 5, mnemonic: "A sprout pushing up out of the ground, twice — coming out." },
  { character: "入", meanings: ["enter", "put in"], on: ["ニュウ"], kun: ["はい", "い"], jlptLevel: 5, strokes: 2, mnemonic: "An arrow pointing inward — to enter." },
  { character: "立", meanings: ["stand"], on: ["リツ"], kun: ["た"], jlptLevel: 5, strokes: 5, mnemonic: "A person standing firmly on the ground.", radicals: ["立"] },
  { character: "会", meanings: ["meet", "association"], on: ["カイ", "エ"], kun: ["あ"], jlptLevel: 5, strokes: 6, mnemonic: "A roof (人) over people gathering to meet.", radicals: ["人"] },
  { character: "社", meanings: ["company", "shrine"], on: ["シャ"], kun: ["やしろ"], jlptLevel: 5, strokes: 7, mnemonic: "An altar (示) by the earth (土) — a shrine, a company." },
];

type VocabRow = { word: string; reading: string; meanings: string[]; pos: string; jlpt: number; usesKanji?: string[] };

const VOCAB: VocabRow[] = [
  // numbers / money
  { word: "円", reading: "えん", meanings: ["yen"], pos: "noun", jlpt: 5, usesKanji: ["円"] },
  { word: "お金", reading: "おかね", meanings: ["money"], pos: "noun", jlpt: 5, usesKanji: ["金"] },
  // time
  { word: "時間", reading: "じかん", meanings: ["time", "hour"], pos: "noun", jlpt: 5, usesKanji: ["時", "間"] },
  { word: "今", reading: "いま", meanings: ["now"], pos: "noun", jlpt: 5, usesKanji: ["今"] },
  { word: "午前", reading: "ごぜん", meanings: ["morning", "a.m."], pos: "noun", jlpt: 5, usesKanji: ["午", "前"] },
  { word: "午後", reading: "ごご", meanings: ["afternoon", "p.m."], pos: "noun", jlpt: 5, usesKanji: ["午", "後"] },
  { word: "半分", reading: "はんぶん", meanings: ["half"], pos: "noun", jlpt: 5, usesKanji: ["半", "分"] },
  { word: "今週", reading: "こんしゅう", meanings: ["this week"], pos: "noun", jlpt: 5, usesKanji: ["今", "週"] },
  { word: "毎週", reading: "まいしゅう", meanings: ["every week"], pos: "noun", jlpt: 5, usesKanji: ["毎", "週"] },
  { word: "毎朝", reading: "まいあさ", meanings: ["every morning"], pos: "noun", jlpt: 5, usesKanji: ["毎"] },
  // position
  { word: "上", reading: "うえ", meanings: ["above", "on top"], pos: "noun", jlpt: 5, usesKanji: ["上"] },
  { word: "下", reading: "した", meanings: ["below", "under"], pos: "noun", jlpt: 5, usesKanji: ["下"] },
  { word: "中", reading: "なか", meanings: ["inside", "middle"], pos: "noun", jlpt: 5, usesKanji: ["中"] },
  { word: "外", reading: "そと", meanings: ["outside"], pos: "noun", jlpt: 5, usesKanji: ["外"] },
  { word: "左", reading: "ひだり", meanings: ["left"], pos: "noun", jlpt: 5, usesKanji: ["左"] },
  { word: "右", reading: "みぎ", meanings: ["right"], pos: "noun", jlpt: 5, usesKanji: ["右"] },
  { word: "前", reading: "まえ", meanings: ["front", "before"], pos: "noun", jlpt: 5, usesKanji: ["前"] },
  { word: "後ろ", reading: "うしろ", meanings: ["behind", "back"], pos: "noun", jlpt: 5, usesKanji: ["後"] },
  // directions
  { word: "東", reading: "ひがし", meanings: ["east"], pos: "noun", jlpt: 5, usesKanji: ["東"] },
  { word: "西", reading: "にし", meanings: ["west"], pos: "noun", jlpt: 5, usesKanji: ["西"] },
  { word: "南", reading: "みなみ", meanings: ["south"], pos: "noun", jlpt: 5, usesKanji: ["南"] },
  { word: "北", reading: "きた", meanings: ["north"], pos: "noun", jlpt: 5, usesKanji: ["北"] },
  // family / people
  { word: "男", reading: "おとこ", meanings: ["man", "male"], pos: "noun", jlpt: 5, usesKanji: ["男"] },
  { word: "女", reading: "おんな", meanings: ["woman", "female"], pos: "noun", jlpt: 5, usesKanji: ["女"] },
  { word: "男の子", reading: "おとこのこ", meanings: ["boy"], pos: "noun", jlpt: 5, usesKanji: ["男", "子"] },
  { word: "女の子", reading: "おんなのこ", meanings: ["girl"], pos: "noun", jlpt: 5, usesKanji: ["女", "子"] },
  { word: "友達", reading: "ともだち", meanings: ["friend"], pos: "noun", jlpt: 5, usesKanji: ["友"] },
  // nature
  { word: "天気", reading: "てんき", meanings: ["weather"], pos: "noun", jlpt: 5, usesKanji: ["天", "気"] },
  { word: "空", reading: "そら", meanings: ["sky"], pos: "noun", jlpt: 5, usesKanji: ["空"] },
  { word: "雨", reading: "あめ", meanings: ["rain"], pos: "noun", jlpt: 5, usesKanji: ["雨"] },
  { word: "花", reading: "はな", meanings: ["flower"], pos: "noun", jlpt: 5, usesKanji: ["花"] },
  { word: "元気", reading: "げんき", meanings: ["healthy", "energetic"], pos: "na-adjective", jlpt: 5, usesKanji: ["気"] },
  // places
  { word: "電気", reading: "でんき", meanings: ["electricity", "light"], pos: "noun", jlpt: 5, usesKanji: ["電", "気"] },
  { word: "道", reading: "みち", meanings: ["road", "way"], pos: "noun", jlpt: 5, usesKanji: ["道"] },
  { word: "外国", reading: "がいこく", meanings: ["foreign country"], pos: "noun", jlpt: 5, usesKanji: ["外", "国"] },
  { word: "外国人", reading: "がいこくじん", meanings: ["foreigner"], pos: "noun", jlpt: 5, usesKanji: ["外", "国", "人"] },
  { word: "高校", reading: "こうこう", meanings: ["high school"], pos: "noun", jlpt: 5, usesKanji: ["高", "校"] },
  // language
  { word: "日本語", reading: "にほんご", meanings: ["Japanese language"], pos: "noun", jlpt: 5, usesKanji: ["日", "本", "語"] },
  { word: "英語", reading: "えいご", meanings: ["English language"], pos: "noun", jlpt: 5, usesKanji: ["語"] },
  { word: "文学", reading: "ぶんがく", meanings: ["literature"], pos: "noun", jlpt: 5, usesKanji: ["文", "学"] },
  { word: "漢字", reading: "かんじ", meanings: ["kanji", "Chinese character"], pos: "noun", jlpt: 5, usesKanji: ["字"] },
  { word: "名前", reading: "なまえ", meanings: ["name"], pos: "noun", jlpt: 5, usesKanji: ["名", "前"] },
  // adjectives using new kanji
  { word: "高い", reading: "たかい", meanings: ["expensive", "tall", "high"], pos: "i-adjective", jlpt: 5, usesKanji: ["高"] },
  { word: "安い", reading: "やすい", meanings: ["cheap"], pos: "i-adjective", jlpt: 5, usesKanji: ["安"] },
  { word: "長い", reading: "ながい", meanings: ["long"], pos: "i-adjective", jlpt: 5, usesKanji: ["長"] },
  { word: "白い", reading: "しろい", meanings: ["white"], pos: "i-adjective", jlpt: 5, usesKanji: ["白"] },
  // verbs using new kanji
  { word: "食べる", reading: "たべる", meanings: ["to eat"], pos: "ichidan verb", jlpt: 5, usesKanji: ["食"] },
  { word: "飲む", reading: "のむ", meanings: ["to drink"], pos: "godan verb", jlpt: 5, usesKanji: ["飲"] },
  { word: "聞く", reading: "きく", meanings: ["to hear", "to ask"], pos: "godan verb", jlpt: 5, usesKanji: ["聞"] },
  { word: "読む", reading: "よむ", meanings: ["to read"], pos: "godan verb", jlpt: 5, usesKanji: ["読"] },
  { word: "書く", reading: "かく", meanings: ["to write"], pos: "godan verb", jlpt: 5, usesKanji: ["書"] },
  { word: "話す", reading: "はなす", meanings: ["to speak", "to talk"], pos: "godan verb", jlpt: 5, usesKanji: ["話"] },
  { word: "買う", reading: "かう", meanings: ["to buy"], pos: "godan verb", jlpt: 5, usesKanji: ["買"] },
  { word: "来る", reading: "くる", meanings: ["to come"], pos: "irregular verb", jlpt: 5, usesKanji: ["来"] },
  { word: "出る", reading: "でる", meanings: ["to leave", "to exit"], pos: "ichidan verb", jlpt: 5, usesKanji: ["出"] },
  { word: "入る", reading: "はいる", meanings: ["to enter"], pos: "godan verb", jlpt: 5, usesKanji: ["入"] },
  { word: "立つ", reading: "たつ", meanings: ["to stand"], pos: "godan verb", jlpt: 5, usesKanji: ["立"] },
  { word: "会う", reading: "あう", meanings: ["to meet"], pos: "godan verb", jlpt: 5, usesKanji: ["会"] },
  { word: "会社", reading: "かいしゃ", meanings: ["company"], pos: "noun", jlpt: 5, usesKanji: ["会", "社"] },
];

async function main() {
  console.log("Seeding extra N5 kanji + vocabulary…");

  for (const r of RADICALS) {
    await db.radical.upsert({ where: { character: r.character }, update: { meaning: r.meaning }, create: r });
  }
  console.log(`  ✓ ${RADICALS.length} radicals ensured`);

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
  console.log(`  ✓ ${KANJI.length} kanji added/updated`);

  let vn = 0;
  for (const v of VOCAB) {
    const created = await db.vocabulary.upsert({
      where: { word_reading: { word: v.word, reading: v.reading } },
      update: {
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify([v.pos]),
        jlptLevel: v.jlpt,
      },
      create: {
        word: v.word,
        reading: v.reading,
        meanings: JSON.stringify(v.meanings),
        partOfSpeech: JSON.stringify([v.pos]),
        jlptLevel: v.jlpt,
        source: "n5-extra",
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
    vn++;
  }
  console.log(`  ✓ ${vn} vocabulary added/updated`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
