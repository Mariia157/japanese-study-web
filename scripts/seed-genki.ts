// Curated Genki 1 + Genki 2 structure with:
//   - 7 N5 sections + 6 N4 sections (13 sections total)
//   - 44 grammar points each with 15 exercises (mcq, fill, arrange, translate)
//   - per-section review quiz with new mixed exercises
//
// Run: npm run seed:genki
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

// ===== Helpers =====

type ExDef = { type: "mcq" | "fill" | "arrange" | "translate"; prompt: string; choices: string[]; answer: string; explanation?: string };

function mcq(prompt: string, choices: string[], answer: string, explanation?: string): ExDef {
  return { type: "mcq", prompt, choices, answer, explanation };
}
function fill(prompt: string, answer: string, explanation?: string): ExDef {
  return { type: "fill", prompt, choices: [], answer, explanation };
}
function arrange(prompt: string, tokens: string[], answer: string, explanation?: string): ExDef {
  return { type: "arrange", prompt, choices: tokens, answer, explanation };
}
function tr(prompt: string, answer: string, explanation?: string): ExDef {
  return { type: "translate", prompt, choices: [], answer, explanation };
}

type GP = {
  lesson: number;
  title: string;
  slug: string;
  explanation: string;
  examples: { jp: string; en: string; note?: string }[];
  exercises: ExDef[]; // must be 15
};

type Section = {
  slug: string;
  title: string;
  jlptLevel: number;
  order: number;
  summary: string;
  pointSlugs: string[];
  reviews: ExDef[]; // 8-10 mixed exercises
};

function jlptOfLesson(l: number): number { return l <= 12 ? 5 : 4; }

// ===== Grammar points (44 × 15 exercises each) =====

const POINTS: GP[] = [
  // ============== Lesson 1 ==============
  {
    lesson: 1, title: "XはYです — the basic copula", slug: "genki-l1-1-wa-desu",
    explanation: "**XはYです** = X is Y.\n\n- **は** marks the topic (pronounced `wa`).\n- **です** is the polite copula. Plain form: だ.\n- Negative: XはYじゃないです / Yじゃありません.\n- Past: XはYでした. Past negative: XはYじゃなかったです.",
    examples: [
      { jp: "私は学生です。", en: "I am a student." },
      { jp: "メアリーさんは日本人じゃないです。", en: "Mary is not Japanese." },
      { jp: "田中さんは先生でした。", en: "Tanaka-san was a teacher." },
    ],
    exercises: [
      mcq("私___学生です。", ["は", "が", "を", "に"], "は", "は marks the topic."),
      mcq("Negative form of です:", ["でした", "じゃないです", "じゃありました", "でません"], "じゃないです"),
      mcq("Past form of 学生です:", ["学生だった", "学生でした", "学生じゃない", "学生いました"], "学生でした"),
      mcq("メアリーさん___日本人です。", ["は", "を", "に", "が"], "は"),
      mcq("Plain (dictionary) form of です:", ["だ", "じゃ", "でした", "あり"], "だ"),
      fill("私___学生です。 (Fill the particle)", "は", "Topic marker."),
      fill("田中さんは先生___。 (Past polite copula)", "でした"),
      fill("Mary is not American: メアリーさんはアメリカ人___。", "じゃないです"),
      fill("Type 'I am Tanaka' in hiragana: わたしは___です (your name)", "たなか", "Your name in kana."),
      arrange("I am a student.", ["私", "は", "学生", "です"], "私は学生です"),
      arrange("Tanaka-san is a teacher.", ["田中さん", "は", "先生", "です"], "田中さんは先生です"),
      arrange("Mary is not Japanese.", ["メアリーさん", "は", "日本人", "じゃないです"], "メアリーさんは日本人じゃないです"),
      tr("I am a teacher.", "私は先生です"),
      tr("She is a student.", "彼女は学生です"),
      tr("Tanaka was a student.", "田中さんは学生でした"),
    ],
  },
  {
    lesson: 1, title: "Question particle か", slug: "genki-l1-2-question-ka",
    explanation: "Append **か** to a statement to form a question. In writing, か replaces the question mark.",
    examples: [
      { jp: "メアリーさんは学生ですか。", en: "Are you a student, Mary?" },
      { jp: "今、何時ですか。", en: "What time is it now?" },
      { jp: "田中さんは先生ですか。", en: "Is Tanaka a teacher?" },
    ],
    exercises: [
      mcq("To make a question, add ___ at the end.", ["か", "ね", "よ", "が"], "か"),
      mcq("メアリーさんは学生です___。 (question)", ["か", "は", "ね", "を"], "か"),
      mcq("Polite Japanese questions usually end with:", ["か", "?", "ね", "の"], "か"),
      mcq("Is this a book? これは本です___。", ["か", "ね", "を", "は"], "か"),
      mcq("In casual speech, the question particle か:", ["is always required", "is often dropped", "is replaced with は", "becomes が"], "is often dropped"),
      fill("Is that Tanaka? あの人は田中さんです___。", "か"),
      fill("What time is it? 今、何時です___。", "か"),
      fill("Are you a student? あなたは学生です___。", "か"),
      fill("Type 'is' in hiragana (polite): わたしは__です (student)", "がくせい"),
      arrange("Is Mary a student?", ["メアリーさん", "は", "学生", "ですか"], "メアリーさんは学生ですか"),
      arrange("What time is it now?", ["今", "、", "何時", "ですか"], "今、何時ですか"),
      arrange("Is this a book?", ["これ", "は", "本", "ですか"], "これは本ですか"),
      tr("Is Tanaka a teacher?", "田中さんは先生ですか"),
      tr("Are you American?", "あなたはアメリカ人ですか"),
      tr("Is that a watch?", "あれは時計ですか"),
    ],
  },
  {
    lesson: 1, title: "Noun + の + Noun — modification / possession", slug: "genki-l1-3-no-modifier",
    explanation: "**A の B** links two nouns: A's B, B of A, or A B (category).",
    examples: [
      { jp: "私の本です。", en: "It's my book." },
      { jp: "東京大学の学生です。", en: "I'm a student at the University of Tokyo." },
      { jp: "日本語の先生です。", en: "He's a Japanese-language teacher." },
    ],
    exercises: [
      mcq("私___本です。 (my book)", ["は", "の", "が", "を"], "の"),
      mcq("メアリーさん___友達 (Mary's friend)", ["は", "の", "が", "に"], "の"),
      mcq("Connecting noun + noun:", ["は", "の", "が", "と"], "の"),
      mcq("'Japanese-language teacher' uses:", ["日本語は先生", "日本語の先生", "日本語が先生", "日本語と先生"], "日本語の先生"),
      mcq("Which is correct for 'university student'?", ["大学は学生", "大学の学生", "大学を学生", "大学に学生"], "大学の学生"),
      fill("メアリーさん___友達です。 (Mary's friend)", "の"),
      fill("私___傘です。 (my umbrella)", "の"),
      fill("Type 'student' in hiragana: わたしは__です", "がくせい"),
      fill("田中さん___本です。 (Tanaka's book)", "の"),
      arrange("It's Mary's friend.", ["メアリーさん", "の", "友達", "です"], "メアリーさんの友達です"),
      arrange("I'm a Japanese teacher.", ["私", "は", "日本語", "の", "先生", "です"], "私は日本語の先生です"),
      arrange("This is my book.", ["これ", "は", "私", "の", "本", "です"], "これは私の本です"),
      tr("It is my book.", "私の本です"),
      tr("She is a Tokyo University student.", "彼女は東京大学の学生です"),
      tr("This is Tanaka's umbrella.", "これは田中さんの傘です"),
    ],
  },
  // ============== Lesson 2 ==============
  {
    lesson: 2, title: "これ・それ・あれ — this/that/that over there", slug: "genki-l2-1-kosoado",
    explanation: "- **これ・それ・あれ** stand alone (this/that/that-over-there).\n- **この・その・あの・どの** attach to a noun (this X / that X).\n- **どれ・どの** = which.",
    examples: [
      { jp: "これは何ですか。", en: "What is this?" },
      { jp: "あの人は田中さんです。", en: "That person is Tanaka-san." },
      { jp: "それは私の本です。", en: "That's my book." },
    ],
    exercises: [
      mcq("[Near listener] ___は本ですか。", ["これ", "それ", "あれ", "どれ"], "それ"),
      mcq("[Far from both] ___は何ですか。", ["これ", "それ", "あれ", "どれ"], "あれ"),
      mcq("'This book' (attached form):", ["これ本", "この本", "それ本", "その本"], "この本"),
      mcq("'Which one?'", ["これ", "それ", "どれ", "あの"], "どれ"),
      mcq("Standalone 'this' (near speaker):", ["これ", "この", "それ", "ここ"], "これ"),
      fill("___は何ですか。 (this — near speaker)", "これ"),
      fill("[Pointing at distant object] ___は田中さんの傘です。 (that over there)", "あれ"),
      fill("___本は私のです。 (this book)", "この"),
      fill("Type 'this' in hiragana: __はほんです", "これ"),
      arrange("What is this?", ["これ", "は", "何", "ですか"], "これは何ですか"),
      arrange("That person is Tanaka.", ["あの", "人", "は", "田中さん", "です"], "あの人は田中さんです"),
      arrange("That (near you) is my book.", ["それ", "は", "私", "の", "本", "です"], "それは私の本です"),
      tr("This is a book.", "これは本です"),
      tr("That umbrella (near you) is mine.", "その傘は私のです"),
      tr("Which is your bag?", "どれがあなたの鞄ですか"),
    ],
  },
  {
    lesson: 2, title: "Particle も — also/too", slug: "genki-l2-2-mo",
    explanation: "**も** replaces は or を to mean *also/too*: previous statement extends to include X.",
    examples: [
      { jp: "私は学生です。トムさんも学生です。", en: "I'm a student. Tom is also a student." },
      { jp: "コーヒーを飲みます。お茶も飲みます。", en: "I drink coffee. I drink tea too." },
      { jp: "田中さんも来ます。", en: "Tanaka is coming too." },
    ],
    exercises: [
      mcq("私は学生です。トムさん___学生です。", ["は", "も", "に", "を"], "も", "Use も for 'also'."),
      mcq("お茶___飲みます。 (tea too)", ["も", "は", "を", "に"], "も"),
      mcq("Which particle does も REPLACE?", ["only は", "only を", "は or を", "が"], "は or を"),
      mcq("'Tanaka is coming too.' 田中さん___来ます。", ["は", "も", "が", "に"], "も"),
      mcq("If は marks the topic, what does も mean?", ["the same topic", "an additional topic with same predicate", "a contrast", "a question"], "an additional topic with same predicate"),
      fill("私___学生です。 (I'm a student too)", "も"),
      fill("田中さんは先生です。山田さん___先生です。 (Yamada is too)", "も"),
      fill("Type 'too/also' in hiragana: __", "も"),
      fill("Tea too: お茶___飲みます。", "も"),
      arrange("Tom is also a student.", ["トムさん", "も", "学生", "です"], "トムさんも学生です"),
      arrange("I drink tea too.", ["お茶", "も", "飲みます"], "お茶も飲みます"),
      arrange("Tanaka is also coming.", ["田中さん", "も", "来ます"], "田中さんも来ます"),
      tr("Mary is also a student.", "メアリーさんも学生です"),
      tr("I drink coffee too.", "コーヒーも飲みます"),
      tr("That book is also mine.", "あの本も私のです"),
    ],
  },
];

// To keep this manageable, we'll generate the remaining 38 points programmatically via a template helper.
// Each subsequent point gets 15 exercises derived from its examples + boilerplate patterns.

type Spec = Omit<GP, "exercises"> & { exercises?: ExDef[]; pattern?: string };

const REMAINING: Spec[] = [
  // ============== Lesson 3 ==============
  {
    lesson: 3, title: "Verb conjugation: ます-form (polite present/future)", slug: "genki-l3-1-masu-form",
    explanation: "Three verb groups, polite present:\n1. **Ichidan (る-verbs)**: drop る + ます. 食べる → 食べます\n2. **Godan (う-verbs)**: う-row → い-row + ます. 飲む → 飲みます\n3. **Irregular**: する → します, 来る → 来ます\nNegative: ません. Past: ました. Past negative: ませんでした.",
    examples: [
      { jp: "毎日本を読みます。", en: "I read books every day." },
      { jp: "明日来ません。", en: "I won't come tomorrow." },
      { jp: "昨日テレビを見ました。", en: "I watched TV yesterday." },
    ],
    exercises: [
      mcq("Polite form of 行く:", ["行きます", "行ます", "行るます", "行います"], "行きます"),
      mcq("Polite form of 食べる:", ["食べます", "食べります", "食びます", "食べいます"], "食べます"),
      mcq("Polite form of する:", ["すます", "します", "するます", "せます"], "します"),
      mcq("Polite form of 来る:", ["きます", "くるます", "こます", "きるます"], "きます"),
      mcq("Polite negative of 飲む:", ["飲みません", "飲ません", "飲まない", "飲ありません"], "飲みません"),
      mcq("Past polite of 見る:", ["見ました", "見ました", "見ました", "見ました"], "見ました"),
      mcq("Past negative polite of 食べる:", ["食べませんでした", "食べなかったです", "食べませんかった", "食べないでした"], "食べませんでした"),
      fill("Polite of 読む: 読み___", "ます"),
      fill("Past polite of 行く: 行き___", "ました"),
      fill("Type 'I drink' in hiragana: __みます", "の", "Stem is の (nomi)."),
      arrange("I read books every day.", ["毎日", "本", "を", "読みます"], "毎日本を読みます"),
      arrange("I won't come tomorrow.", ["明日", "来ません"], "明日来ません"),
      arrange("I watched TV yesterday.", ["昨日", "テレビ", "を", "見ました"], "昨日テレビを見ました"),
      tr("I will eat sushi tomorrow.", "明日寿司を食べます"),
      tr("She didn't come yesterday.", "昨日彼女は来ませんでした"),
    ],
  },
  {
    lesson: 3, title: "Particles を, で, に, へ", slug: "genki-l3-2-particles",
    explanation: "- **を** direct object\n- **で** location of action\n- **に** specific time / direction\n- **へ** direction (interchangeable with に for motion)",
    examples: [
      { jp: "カフェでコーヒーを飲みます。", en: "I drink coffee at a cafe." },
      { jp: "九時に学校に行きます。", en: "I go to school at 9." },
      { jp: "東京へ行きます。", en: "I go to Tokyo." },
    ],
    exercises: [
      mcq("図書館___本を読みます。", ["で", "に", "を", "は"], "で", "で = location of action."),
      mcq("七時___起きます。", ["で", "に", "を", "へ"], "に", "に = specific time."),
      mcq("水___飲みます。", ["を", "は", "が", "で"], "を"),
      mcq("学校___行きます。 (direction)", ["を", "に", "で", "は"], "に"),
      mcq("カフェ___お茶を飲みます。", ["で", "に", "を", "は"], "で"),
      mcq("Which is INTERCHANGEABLE with に for motion?", ["を", "で", "へ", "は"], "へ"),
      mcq("'I go home at 5 o'clock.' 五時___うち___帰ります。", ["で・に", "に・に", "に・へ", "に・に or に・へ"], "に・に or に・へ"),
      fill("カフェ___コーヒーを飲みます。 (location)", "で"),
      fill("七時___学校に行きます。 (time)", "に"),
      fill("Type 'water' in hiragana: __ をのみます", "みず"),
      arrange("I drink tea at a cafe.", ["カフェ", "で", "お茶", "を", "飲みます"], "カフェでお茶を飲みます"),
      arrange("I go to school at 9.", ["九時", "に", "学校", "に", "行きます"], "九時に学校に行きます"),
      arrange("I go to Tokyo.", ["東京", "へ", "行きます"], "東京へ行きます"),
      tr("I eat sushi at a restaurant.", "レストランで寿司を食べます"),
      tr("I read a book at the library at 3.", "三時に図書館で本を読みます"),
    ],
  },
  {
    lesson: 3, title: "〜ませんか — invitation", slug: "genki-l3-3-masenka",
    explanation: "Negative ます-form + か = polite invitation (*Won't you...?*). **〜ましょう** = *Let's...*",
    examples: [
      { jp: "一緒に映画を見ませんか。", en: "Would you like to watch a movie together?" },
      { jp: "そろそろ食べましょう。", en: "Let's start eating soon." },
      { jp: "お茶を飲みませんか。", en: "Would you like to drink tea?" },
    ],
    exercises: [
      mcq("Invitation 'Won't you...?' uses:", ["ますか", "ませんか", "ましょうか", "ました"], "ませんか"),
      mcq("'Let's eat.' is:", ["食べますか", "食べませんか", "食べましょう", "食べました"], "食べましょう"),
      mcq("一緒に映画を見___。 (Won't you watch?)", ["ますか", "ませんか", "ましょう", "ません"], "ませんか"),
      mcq("そろそろ___。 (Let's go)", ["行きますか", "行きませんか", "行きましょう", "行きました"], "行きましょう"),
      mcq("お茶を飲み___ (Would you like to drink tea?)", ["ますか", "ませんか", "ましょう", "ました"], "ませんか"),
      fill("一緒に行き___ (Won't you go together?)", "ませんか"),
      fill("そろそろ食べ___ (Let's eat soon)", "ましょう"),
      fill("Type 'together' in hiragana: __ ", "いっしょ"),
      arrange("Won't you drink tea?", ["お茶", "を", "飲みませんか"], "お茶を飲みませんか"),
      arrange("Let's watch a movie.", ["映画", "を", "見ましょう"], "映画を見ましょう"),
      arrange("Won't you go with me?", ["一緒に", "行きませんか"], "一緒に行きませんか"),
      tr("Won't you drink coffee?", "コーヒーを飲みませんか"),
      tr("Let's go to the library.", "図書館に行きましょう"),
      tr("Won't you eat lunch together?", "一緒に昼ご飯を食べませんか"),
      tr("Let's read this book.", "この本を読みましょう"),
    ],
  },
  // ============== Lesson 4 ==============
  {
    lesson: 4, title: "います / あります — existence", slug: "genki-l4-1-iru-aru",
    explanation: "- **います** — animate (people, animals)\n- **あります** — inanimate\nPattern: [Location]に[Thing]があります／います.",
    examples: [
      { jp: "机の上に本があります。", en: "There is a book on the desk." },
      { jp: "公園に猫がいます。", en: "There is a cat in the park." },
      { jp: "教室に学生がいます。", en: "There are students in the classroom." },
    ],
    exercises: [
      mcq("教室に学生___。", ["です", "あります", "います", "ある"], "います", "Students are animate → います."),
      mcq("机の上に本___。", ["います", "あります", "です", "なります"], "あります"),
      mcq("Use いる for:", ["objects", "abstract concepts", "living beings", "places"], "living beings"),
      mcq("Use ある for:", ["people", "animals", "inanimate things", "verbs"], "inanimate things"),
      mcq("Plain form of います:", ["ある", "いる", "する", "なる"], "いる"),
      fill("公園に犬___。 (animals → いる)", "がいます"),
      fill("テーブルの上にりんご___。", "があります"),
      fill("Type 'on top' in hiragana: __ え", "う", "うえ = above/on top."),
      arrange("There is a book on the desk.", ["机", "の", "上", "に", "本", "が", "あります"], "机の上に本があります"),
      arrange("There is a cat in the park.", ["公園", "に", "猫", "が", "います"], "公園に猫がいます"),
      arrange("There are students in the classroom.", ["教室", "に", "学生", "が", "います"], "教室に学生がいます"),
      tr("There is water in the kitchen.", "台所に水があります"),
      tr("There is a dog under the table.", "テーブルの下に犬がいます"),
      tr("There are three books on the desk.", "机の上に本が三冊あります"),
      tr("Tanaka is in the library.", "田中さんは図書館にいます"),
    ],
  },
  {
    lesson: 4, title: "Past tense of nouns/adjectives (です → でした)", slug: "genki-l4-2-past-desu",
    explanation: "- Past polite: **でした** (was/were)\n- Past negative: **じゃなかったです** / **じゃありませんでした**",
    examples: [
      { jp: "昨日は休みでした。", en: "Yesterday was a day off." },
      { jp: "学生じゃなかったです。", en: "I wasn't a student." },
      { jp: "昨日は雨でした。", en: "It rained yesterday." },
    ],
    exercises: [
      mcq("Past of 学生です:", ["学生だった", "学生でした", "学生じゃない", "学生います"], "学生でした"),
      mcq("Past negative of 学生です:", ["学生じゃない", "学生じゃなかったです", "学生でしたない", "学生ません"], "学生じゃなかったです"),
      mcq("Past of 雨です:", ["雨だ", "雨でした", "雨ました", "雨ありました"], "雨でした"),
      mcq("Past of 元気です:", ["元気だった", "元気でした", "元気しました", "元気いました"], "元気でした"),
      mcq("Was busy: 忙しい___ (i-adjective past)", ["でした", "かった", "ました", "なかった"], "かった", "い-adj past = drop い + かった + です."),
      fill("昨日は休み___。 (was)", "でした"),
      fill("学生___。 (was not — short form)", "じゃなかったです"),
      fill("Type 'yesterday' in hiragana: __ ", "きのう"),
      arrange("Yesterday was a holiday.", ["昨日", "は", "休み", "でした"], "昨日は休みでした"),
      arrange("It was raining yesterday.", ["昨日", "は", "雨", "でした"], "昨日は雨でした"),
      arrange("I wasn't a student.", ["私", "は", "学生", "じゃなかったです"], "私は学生じゃなかったです"),
      tr("Yesterday was Monday.", "昨日は月曜日でした"),
      tr("It wasn't a good movie.", "いい映画じゃなかったです"),
      tr("He was a teacher.", "彼は先生でした"),
      tr("It wasn't a difficult test.", "難しいテストじゃなかったです"),
    ],
  },
  // ============== Lesson 5 ==============
  {
    lesson: 5, title: "い-adjectives and な-adjectives", slug: "genki-l5-1-adjectives",
    explanation: "**い-adjectives** (大きい, 新しい): drop い for negative/past (くない, かった). Exception いい → よい-stem.\n**な-adjectives** (静か, きれい): use な to modify nouns; conjugate like nouns with です.",
    examples: [
      { jp: "この本は新しいです。", en: "This book is new." },
      { jp: "あの公園は静かです。", en: "That park is quiet." },
      { jp: "昨日は寒かったです。", en: "Yesterday was cold." },
    ],
    exercises: [
      mcq("Negative of 高い:", ["高じゃない", "高くない", "高ないです", "高いない"], "高くない"),
      mcq("Past of いい (good):", ["いかった", "よかった", "いいかった", "いくない"], "よかった", "Exception — uses よ-stem."),
      mcq("きれい + 花 (na-adj modifying noun):", ["きれい花", "きれいの花", "きれいな花", "きれいい花"], "きれいな花"),
      mcq("Past of 静かです:", ["静かでした", "静かかった", "静くなかった", "静かました"], "静かでした"),
      mcq("Negative present of きれい:", ["きれくないです", "きれいじゃないです", "きれいくないです", "きれいなくないです"], "きれいじゃないです"),
      mcq("Adjective ending in い that is actually a な-adj:", ["新しい", "きれい", "高い", "古い"], "きれい", "Ends in い in writing but is な-adj."),
      mcq("Past negative of 寒い:", ["寒くなかったです", "寒じゃなかったです", "寒くないでした", "寒なかったでした"], "寒くなかったです"),
      fill("Negative of 大きい: 大き___です", "くない"),
      fill("Past of 暑い: 暑___です", "かった"),
      fill("Type 'new' in hiragana: __ あたら__ ", "しい"),
      arrange("This book is new.", ["この", "本", "は", "新しいです"], "この本は新しいです"),
      arrange("That park is quiet.", ["あの", "公園", "は", "静かです"], "あの公園は静かです"),
      arrange("Yesterday was cold.", ["昨日", "は", "寒かったです"], "昨日は寒かったです"),
      tr("This room is small.", "この部屋は小さいです"),
      tr("That movie was interesting.", "あの映画は面白かったです"),
    ],
  },
  {
    lesson: 5, title: "好き / 嫌い + が", slug: "genki-l5-2-suki-kirai",
    explanation: "**好き** (like) and **嫌い** (dislike) are な-adjectives. Object marked with **が**, not を.\nPattern: [Person]は[Thing]が好きです.",
    examples: [
      { jp: "私は寿司が好きです。", en: "I like sushi." },
      { jp: "彼は野菜が嫌いです。", en: "He dislikes vegetables." },
      { jp: "猫が好きです。", en: "I like cats." },
    ],
    exercises: [
      mcq("私は猫___好きです。", ["を", "が", "は", "に"], "が"),
      mcq("好き is a:", ["verb", "い-adjective", "な-adjective", "noun"], "な-adjective"),
      mcq("Object marker with 好き:", ["を", "が", "は", "に"], "が"),
      mcq("Negative of 好き:", ["好きない", "好きじゃないです", "好くないです", "好きません"], "好きじゃないです"),
      mcq("'I really like X' uses:", ["大好き", "好き好き", "好きい", "好きました"], "大好き"),
      fill("彼は野菜___嫌いです。", "が"),
      fill("私は寿司___好きです。", "が"),
      fill("Type 'like' in hiragana: __ き", "す"),
      arrange("I like sushi.", ["私", "は", "寿司", "が", "好きです"], "私は寿司が好きです"),
      arrange("He hates vegetables.", ["彼", "は", "野菜", "が", "嫌いです"], "彼は野菜が嫌いです"),
      arrange("I like cats.", ["私", "は", "猫", "が", "好きです"], "私は猫が好きです"),
      tr("I like Japanese food.", "私は日本料理が好きです"),
      tr("She dislikes coffee.", "彼女はコーヒーが嫌いです"),
      tr("I really like dogs.", "私は犬が大好きです"),
      tr("Do you like tea?", "お茶が好きですか"),
    ],
  },
  // ============== Lesson 6 ==============
  {
    lesson: 6, title: "て-form — formation", slug: "genki-l6-1-te-form",
    explanation: "Te-form formation:\n- Ru-verbs: drop る + て (食べる→食べて)\n- U-verbs: う/つ/る→って, む/ぶ/ぬ→んで, く→いて (exc. 行く→行って), ぐ→いで, す→して\n- Irregular: する→して, くる→きて",
    examples: [
      { jp: "食べる → 食べて", en: "" },
      { jp: "書く → 書いて", en: "" },
      { jp: "行く → 行って (exception)", en: "" },
    ],
    exercises: [
      mcq("て-form of 読む:", ["読みて", "読いて", "読んで", "読って"], "読んで"),
      mcq("て-form of 行く:", ["行いて", "行きて", "行って", "行んで"], "行って", "Exception."),
      mcq("て-form of 話す:", ["話して", "話いて", "話んで", "話って"], "話して"),
      mcq("て-form of 食べる:", ["食べて", "食びて", "食べりて", "食ばて"], "食べて"),
      mcq("て-form of 書く:", ["書きて", "書いて", "書って", "書んで"], "書いて"),
      mcq("て-form of する:", ["して", "すて", "した", "せて"], "して"),
      mcq("て-form of 来る:", ["きて", "くて", "こて", "こうて"], "きて"),
      mcq("て-form of 待つ:", ["待ちて", "待って", "待たて", "待んで"], "待って"),
      mcq("て-form of 飲む:", ["飲みて", "飲んで", "飲って", "飲いて"], "飲んで"),
      mcq("て-form of 泳ぐ:", ["泳いて", "泳いで", "泳ぎて", "泳って"], "泳いで"),
      fill("て-form of 買う: 買___", "って"),
      fill("て-form of 死ぬ: 死___", "んで"),
      fill("Type て-form of 行く in hiragana: いっ___", "て"),
      tr("To go (te-form, hiragana only):", "いって"),
      tr("To drink (te-form, hiragana only):", "のんで"),
    ],
  },
  {
    lesson: 6, title: "〜てください / 〜てもいいです / 〜てはいけません", slug: "genki-l6-2-te-uses",
    explanation: "- **〜てください** — polite request\n- **〜てもいいですか** — permission\n- **〜てはいけません** — prohibition",
    examples: [
      { jp: "ちょっと待ってください。", en: "Please wait a moment." },
      { jp: "ここで写真を撮ってもいいですか。", en: "May I take photos here?" },
      { jp: "ここで食べてはいけません。", en: "You must not eat here." },
    ],
    exercises: [
      mcq("Polite request 'please do X' uses:", ["てください", "てはいけません", "てもいい", "ましょう"], "てください"),
      mcq("Asking permission:", ["てください", "てもいいですか", "てはいけません", "ましょう"], "てもいいですか"),
      mcq("'You must not...' uses:", ["てください", "てもいい", "てはいけません", "なくちゃ"], "てはいけません"),
      mcq("ちょっと待___ください。", ["て", "た", "る", "ます"], "って", "Te-form of 待つ."),
      mcq("写真を撮___もいいですか。", ["て", "た", "る", "ます"], "って"),
      fill("Please read this book: この本を読___ください。", "んで"),
      fill("May I drink water?: 水を飲___もいいですか。", "んで"),
      fill("Type 'please' in hiragana: __ さい", "くだ"),
      arrange("Please wait a moment.", ["ちょっと", "待って", "ください"], "ちょっと待ってください"),
      arrange("May I take a photo here?", ["ここ", "で", "写真", "を", "撮っても", "いいですか"], "ここで写真を撮ってもいいですか"),
      arrange("You must not eat here.", ["ここ", "で", "食べては", "いけません"], "ここで食べてはいけません"),
      tr("Please read this book.", "この本を読んでください"),
      tr("May I drink water?", "水を飲んでもいいですか"),
      tr("You must not smoke here.", "ここでたばこを吸ってはいけません"),
      tr("Please come tomorrow.", "明日来てください"),
    ],
  },
  // ============== Lesson 7 ==============
  {
    lesson: 7, title: "〜ている — progressive and state", slug: "genki-l7-1-teiru",
    explanation: "te-form + いる:\n1. **Progressive** (action verbs): currently doing X\n2. **State** (change verbs): the resulting state (結婚している = is married)",
    examples: [
      { jp: "今、本を読んでいます。", en: "I'm reading a book now." },
      { jp: "彼は結婚しています。", en: "He is married." },
      { jp: "田中さんを知っていますか。", en: "Do you know Tanaka?" },
    ],
    exercises: [
      mcq("I'm eating now: 今、___。", ["食べる", "食べます", "食べています", "食べた"], "食べています"),
      mcq("He is married:", ["結婚します", "結婚しています", "結婚しました", "結婚する"], "結婚しています"),
      mcq("'Do you know X?' uses:", ["知ります", "知っています", "知ます", "知る"], "知っています"),
      mcq("彼女は今、___。 (she's drinking tea)", ["お茶を飲む", "お茶を飲みます", "お茶を飲んでいます", "お茶を飲んだ"], "お茶を飲んでいます"),
      mcq("Casual contraction of 〜ている:", ["〜てう", "〜てる", "〜てい", "〜とる"], "〜てる"),
      mcq("Negative of 知っています ('I don't know'):", ["知ません", "知らないです", "知りません", "知っていません"], "知りません", "Special: 知りません is the standard."),
      fill("She is sleeping now: 今、彼女は寝___。", "ています"),
      fill("He is reading a book: 彼は本を読___。", "んでいます"),
      fill("Type 'now' in hiragana: __ ", "いま"),
      arrange("I'm reading a book now.", ["今", "、", "本", "を", "読んでいます"], "今、本を読んでいます"),
      arrange("He is married.", ["彼", "は", "結婚しています"], "彼は結婚しています"),
      arrange("Do you know Tanaka?", ["田中さん", "を", "知っていますか"], "田中さんを知っていますか"),
      tr("I'm watching TV now.", "今、テレビを見ています"),
      tr("She lives in Tokyo.", "彼女は東京に住んでいます"),
      tr("Do you know that person?", "あの人を知っていますか"),
    ],
  },
  {
    lesson: 7, title: "Connecting actions with て", slug: "genki-l7-2-te-sequence",
    explanation: "Te-form chains sequential actions: *do X and then Y*. Tense determined by the final verb.",
    examples: [
      { jp: "朝起きて、コーヒーを飲んで、学校に行きます。", en: "I wake up, drink coffee, and go to school." },
      { jp: "昨日勉強して、寝ました。", en: "Yesterday I studied and went to sleep." },
      { jp: "朝ご飯を食べて、出かけました。", en: "I ate breakfast and went out." },
    ],
    exercises: [
      mcq("To chain actions, use:", ["て-form", "ます-form", "た-form", "ない-form"], "て-form"),
      mcq("Tense of the chain is determined by:", ["the first verb", "the final verb", "each verb separately", "context"], "the final verb"),
      mcq("起きて、コーヒーを飲___、学校に行きます。", ["で", "んで", "む", "みます"], "んで"),
      mcq("Sequence 'eat and go':", ["食べる、行く", "食べて行きます", "食べに行く", "食べて行ますし"], "食べて行きます"),
      mcq("Past form chain '...went to bed': 勉強___、寝ました。", ["する", "します", "して", "した"], "して"),
      fill("起きて、コーヒーを飲___、学校に行きます。", "んで"),
      fill("勉強___、寝ました。 (te-form of する)", "して"),
      fill("Type 'breakfast' in hiragana: あさ__ ん", "ごは"),
      arrange("I wake up and drink coffee.", ["起きて", "、", "コーヒー", "を", "飲みます"], "起きて、コーヒーを飲みます"),
      arrange("I studied and went to sleep.", ["勉強して", "、", "寝ました"], "勉強して、寝ました"),
      arrange("I ate breakfast and went out.", ["朝ご飯", "を", "食べて", "、", "出かけました"], "朝ご飯を食べて、出かけました"),
      tr("I ate breakfast and went to work.", "朝ご飯を食べて、仕事に行きました"),
      tr("I watched TV and read a book.", "テレビを見て、本を読みました"),
      tr("I went home and slept.", "うちに帰って、寝ました"),
      tr("I will study tonight and sleep early.", "今晩勉強して、早く寝ます"),
    ],
  },
  // ============== Lesson 8 ==============
  {
    lesson: 8, title: "Short forms (plain present)", slug: "genki-l8-1-short-forms-present",
    explanation: "Plain forms are dictionary forms used in casual speech.\n- Ru-verbs negative: drop る + ない (食べない)\n- U-verbs negative: う-row→あ-row+ない (読まない). Exception: ある→ない.\n- Irregular: しない, こない.\nNouns/な-adj: positive だ, negative じゃない.",
    examples: [
      { jp: "明日は学校に行かない。", en: "I'm not going to school tomorrow." },
      { jp: "彼は学生だ。", en: "He's a student. (plain)" },
      { jp: "肉を食べない。", en: "I don't eat meat." },
    ],
    exercises: [
      mcq("Plain negative of 食べる:", ["食べません", "食べない", "食べなかった", "食べるない"], "食べない"),
      mcq("Plain negative of 読む:", ["読みません", "読まない", "読んない", "読みない"], "読まない"),
      mcq("Plain negative of する:", ["しません", "しない", "すない", "さない"], "しない"),
      mcq("Plain negative of 来る:", ["こない", "きない", "きません", "くない"], "こない"),
      mcq("Plain negative of ある:", ["ありない", "ない", "あない", "あらない"], "ない", "Special exception."),
      mcq("Plain present of 学生です:", ["学生だ", "学生", "学生な", "学生し"], "学生だ"),
      mcq("Plain neg of 学生です:", ["学生じゃない", "学生ない", "学生だない", "学生でない"], "学生じゃない"),
      fill("Plain negative of 行く: 行___", "かない"),
      fill("Plain negative of 飲む: 飲___", "まない"),
      fill("Type 'tomorrow' in hiragana: __ た", "あし"),
      arrange("I'm not going to school tomorrow.", ["明日", "は", "学校", "に", "行かない"], "明日は学校に行かない"),
      arrange("I don't eat meat.", ["肉", "を", "食べない"], "肉を食べない"),
      arrange("He's a student. (plain)", ["彼", "は", "学生", "だ"], "彼は学生だ"),
      tr("I don't drink coffee. (plain)", "コーヒーを飲まない"),
      tr("She doesn't come. (plain)", "彼女は来ない"),
    ],
  },
  {
    lesson: 8, title: "〜と思う / 〜と言っていた", slug: "genki-l8-2-to-omou",
    explanation: "Plain form + と + 思う/言う:\n- **〜と思う** I think that...\n- **〜と言っていた** (person) was saying that...",
    examples: [
      { jp: "明日は雨だと思います。", en: "I think it will rain tomorrow." },
      { jp: "田中さんは来ないと言っていました。", en: "Tanaka said he won't come." },
      { jp: "彼は学生だと思います。", en: "I think he is a student." },
    ],
    exercises: [
      mcq("Clause before と思う must be:", ["polite ます", "plain (dictionary)", "te-form", "past"], "plain (dictionary)"),
      mcq("明日は雨___思います。", ["を", "が", "だと", "に"], "だと", "Noun + だ + と."),
      mcq("Tanaka said he won't come:", ["来ないと言いました", "来ないと言っていました", "来なくないです", "来ませんが"], "来ないと言っていました"),
      mcq("'I think she is busy.' 彼女は忙し___思います。", ["いと", "くと", "と", "ですと"], "いと", "い-adj keeps い: 忙しいと."),
      mcq("'I think he's a teacher.' 彼は先生___思います。", ["と", "だと", "でと", "ですと"], "だと"),
      fill("明日は雨___思います。", "だと"),
      fill("田中さんは来___と言っていました。 (plain neg)", "ない"),
      fill("Type 'rain' in hiragana: __ ", "あめ"),
      arrange("I think it will rain tomorrow.", ["明日", "は", "雨", "だと", "思います"], "明日は雨だと思います"),
      arrange("Tanaka said he won't come.", ["田中さん", "は", "来ない", "と", "言っていました"], "田中さんは来ないと言っていました"),
      arrange("I think she's busy.", ["彼女", "は", "忙しい", "と", "思います"], "彼女は忙しいと思います"),
      tr("I think this book is interesting.", "この本は面白いと思います"),
      tr("She said she will come tomorrow.", "彼女は明日来ると言っていました"),
      tr("I think Tanaka is a teacher.", "田中さんは先生だと思います"),
      tr("He said he doesn't like coffee.", "彼はコーヒーが好きじゃないと言っていました"),
    ],
  },
  // ============== Lesson 9 ==============
  {
    lesson: 9, title: "Short past forms", slug: "genki-l9-1-short-past",
    explanation: "Plain past = た-form (same formation as て-form with た/だ).\nRu: 食べた. U: 読んだ, 書いた, 待った, 話した, 行った. Irregular: した, きた.\nNegative: なかった. Nouns/な-adj: だった (positive), じゃなかった (negative).",
    examples: [
      { jp: "昨日テレビを見た。", en: "I watched TV yesterday." },
      { jp: "宿題をしなかった。", en: "I didn't do the homework." },
      { jp: "彼は学生だった。", en: "He was a student." },
    ],
    exercises: [
      mcq("Plain past of 行く:", ["行きた", "行った", "行いた", "行んだ"], "行った"),
      mcq("Plain past of 食べる:", ["食べた", "食べりた", "食びた", "食べんだ"], "食べた"),
      mcq("Plain past of する:", ["した", "すた", "せた", "しった"], "した"),
      mcq("Plain past of 来る:", ["きた", "くた", "こた", "こうた"], "きた"),
      mcq("Plain past negative of 食べる:", ["食べませんでした", "食べなかった", "食べないでした", "食べんかった"], "食べなかった"),
      mcq("Plain past of 学生です:", ["学生でした", "学生だった", "学生いた", "学生あった"], "学生だった"),
      mcq("Plain past of 読む:", ["読みた", "読んだ", "読った", "読いた"], "読んだ"),
      fill("Plain past of 飲む: 飲___", "んだ"),
      fill("Plain past neg of する: し___", "なかった"),
      fill("Type 'TV' in hiragana: __ ビ", "テレ", "テレビ."),
      arrange("I watched TV yesterday.", ["昨日", "テレビ", "を", "見た"], "昨日テレビを見た"),
      arrange("I didn't do the homework.", ["宿題", "を", "しなかった"], "宿題をしなかった"),
      arrange("He was a student.", ["彼", "は", "学生", "だった"], "彼は学生だった"),
      tr("I drank coffee. (plain past)", "コーヒーを飲んだ"),
      tr("She didn't come. (plain past)", "彼女は来なかった"),
    ],
  },
  {
    lesson: 9, title: "〜たり〜たりする — non-exhaustive list of actions", slug: "genki-l9-2-tari",
    explanation: "**〜たり〜たりする** lists representative activities (and other stuff).\nFormation: past plain + り + past plain + り + する.",
    examples: [
      { jp: "週末は本を読んだり、映画を見たりします。", en: "On weekends I do things like read books and watch movies." },
      { jp: "勉強したり、寝たりします。", en: "I do things like study and sleep." },
      { jp: "食べたり、飲んだりしました。", en: "We ate and drank, etc." },
    ],
    exercises: [
      mcq("〜たり〜たり uses ___ form before り:", ["dictionary", "polite", "past plain", "te-form"], "past plain"),
      mcq("読んだ + り = ?", ["読んだり", "読みたり", "読みり", "読みたり"], "読んだり"),
      mcq("Pattern ends with:", ["ます", "する", "なる", "だ"], "する"),
      mcq("週末は本を読んだり、映画を___します。", ["見たり", "見ったり", "見るたり", "見たいり"], "見たり"),
      mcq("Which fits: 食べたり、___りしました。", ["飲んだ", "飲んだ", "飲み", "飲む"], "飲んだ"),
      fill("勉強したり、寝___します。", "たり"),
      fill("食べたり、飲___りしました。", "んだ"),
      fill("Type 'weekend' in hiragana: __ うまつ", "しゅ"),
      arrange("On weekends I read and watch movies.", ["週末", "は", "本", "を", "読んだり", "、", "映画", "を", "見たり", "します"], "週末は本を読んだり、映画を見たりします"),
      arrange("I do things like study and sleep.", ["勉強したり", "、", "寝たり", "します"], "勉強したり、寝たりします"),
      arrange("We ate and drank, etc.", ["食べたり", "、", "飲んだり", "しました"], "食べたり、飲んだりしました"),
      tr("On Sunday I do things like sleep and study.", "日曜日は寝たり、勉強したりします"),
      tr("I read books and listen to music etc.", "本を読んだり、音楽を聞いたりします"),
      tr("In Tokyo we shopped and ate, etc.", "東京で買い物したり、食事したりしました"),
      tr("On vacation I want to swim and read, etc.", "休みには泳いだり、本を読んだりしたいです"),
    ],
  },
  // ============== Lesson 10 ==============
  {
    lesson: 10, title: "Comparisons より / ほうが", slug: "genki-l10-1-comparisons",
    explanation: "**AよりBのほうが [adj]です** — B is more [adj] than A.\nQuestion: **AとB、どちらが[adj]ですか**\n**〜と同じぐらい** about the same as.",
    examples: [
      { jp: "犬より猫のほうが好きです。", en: "I like cats more than dogs." },
      { jp: "東京と大阪、どちらが大きいですか。", en: "Which is bigger, Tokyo or Osaka?" },
      { jp: "コーヒーより紅茶のほうが好きです。", en: "I prefer tea over coffee." },
    ],
    exercises: [
      mcq("Pattern 'B more than A':", ["AよりBが", "AよりBのほうが", "AはBのほうが", "AとBより"], "AよりBのほうが"),
      mcq("Question 'which is more X?':", ["どこ", "どれ", "どちら", "どう"], "どちら"),
      mcq("犬___猫のほうが好きです。", ["は", "より", "が", "と"], "より"),
      mcq("'About the same as':", ["ほど", "より", "と同じぐらい", "ほうが"], "と同じぐらい"),
      mcq("東京と大阪、___大きいですか。", ["どこが", "どれが", "どちらが", "どうが"], "どちらが"),
      fill("犬___猫のほうが好きです。", "より"),
      fill("コーヒーより紅茶___ほうが好きです。", "の"),
      fill("Type 'tea (black/red)' in hiragana: __ ちゃ", "こう"),
      arrange("I like cats more than dogs.", ["犬", "より", "猫", "の", "ほうが", "好きです"], "犬より猫のほうが好きです"),
      arrange("Which is bigger, Tokyo or Osaka?", ["東京", "と", "大阪", "、", "どちらが", "大きいですか"], "東京と大阪、どちらが大きいですか"),
      arrange("I prefer tea over coffee.", ["コーヒー", "より", "紅茶", "の", "ほうが", "好きです"], "コーヒーより紅茶のほうが好きです"),
      tr("Coffee is more delicious than tea.", "お茶よりコーヒーのほうがおいしいです"),
      tr("Which is faster, the train or the bus?", "電車とバス、どちらが速いですか"),
      tr("I'm taller than my older brother.", "兄より私のほうが背が高いです"),
      tr("Sushi is more popular than tempura.", "天ぷらより寿司のほうが人気があります"),
    ],
  },
  {
    lesson: 10, title: "〜たら — conditional", slug: "genki-l10-2-tara",
    explanation: "Past plain + ら → conditional *if/when X happens, then Y*.\nWorks for any tense and even past events ('when X happened, Y').",
    examples: [
      { jp: "雨が降ったら、行きません。", en: "If it rains, I won't go." },
      { jp: "うちに帰ったら、電話します。", en: "When I get home, I'll call." },
      { jp: "時間があったら、来てください。", en: "If you have time, please come." },
    ],
    exercises: [
      mcq("From 行く form 'if go':", ["行きたら", "行ったら", "行きったら", "行くたら"], "行ったら"),
      mcq("〜たら uses the ___ form + ら.", ["dictionary", "past plain", "te-form", "polite"], "past plain"),
      mcq("From 食べる: 'if eat':", ["食べったら", "食べたら", "食べるたら", "食べたいら"], "食べたら"),
      mcq("From する 'if do':", ["したら", "するたら", "しったら", "せたら"], "したら"),
      mcq("From いい 'if good':", ["いかったら", "よかったら", "いいったら", "いったら"], "よかったら", "Exception."),
      fill("雨が降___、行きません。", "ったら", "降った + ら."),
      fill("うちに帰___、電話します。", "ったら"),
      fill("Type 'rain' in hiragana: __ ", "あめ"),
      arrange("If it rains, I won't go.", ["雨", "が", "降ったら", "、", "行きません"], "雨が降ったら、行きません"),
      arrange("When I get home, I'll call.", ["うち", "に", "帰ったら", "、", "電話します"], "うちに帰ったら、電話します"),
      arrange("If you have time, please come.", ["時間", "が", "あったら", "、", "来てください"], "時間があったら、来てください"),
      tr("If you eat, you will feel better.", "食べたら、元気になります"),
      tr("If it's cheap, I'll buy it.", "安かったら、買います"),
      tr("If you come, I'll be happy.", "来たら、嬉しいです"),
      tr("When the test ends, let's go drinking.", "テストが終わったら、飲みに行きましょう"),
    ],
  },
  // ============== Lesson 11 ==============
  {
    lesson: 11, title: "〜たい — want to do", slug: "genki-l11-1-tai",
    explanation: "Verb stem (ます-form minus ます) + **たい** = *want to do*. Inflects like an い-adjective.\nNegative: 〜たくない. Past: 〜たかった. Note: for others use 〜たがる.",
    examples: [
      { jp: "寿司を食べたいです。", en: "I want to eat sushi." },
      { jp: "今日は何もしたくない。", en: "I don't want to do anything today." },
      { jp: "日本に行きたいです。", en: "I want to go to Japan." },
    ],
    exercises: [
      mcq("Want to read: from 読みます:", ["読みたい", "読たい", "読むたい", "読んたい"], "読みたい"),
      mcq("Want to eat: from 食べます:", ["食べたい", "食べいたい", "食べるたい", "食べりたい"], "食べたい"),
      mcq("Want to do (する):", ["したい", "するたい", "せたい", "やりたい"], "したい"),
      mcq("Negative of 食べたい:", ["食べたない", "食べたくない", "食べたいない", "食べないたい"], "食べたくない"),
      mcq("Past of 行きたい:", ["行きたた", "行きたかった", "行きたかったです", "行きました"], "行きたかった"),
      mcq("〜たい conjugates like:", ["a verb", "a noun", "an い-adjective", "a な-adjective"], "an い-adjective"),
      fill("Want to drink: 飲___", "みたい"),
      fill("Don't want to study: 勉強し___ ", "たくない"),
      fill("Type 'sushi' in hiragana: __ し", "す"),
      arrange("I want to eat sushi.", ["寿司", "を", "食べたい", "です"], "寿司を食べたいです"),
      arrange("I don't want to do anything today.", ["今日", "は", "何も", "したくない"], "今日は何もしたくない"),
      arrange("I want to go to Japan.", ["日本", "に", "行きたい", "です"], "日本に行きたいです"),
      tr("I want to drink water.", "水を飲みたいです"),
      tr("I wanted to watch that movie.", "あの映画を見たかったです"),
      tr("I don't want to study today.", "今日は勉強したくないです"),
    ],
  },
  {
    lesson: 11, title: "〜たことがある — have done before", slug: "genki-l11-2-ta-koto-ga-aru",
    explanation: "Past plain + **ことがある** expresses *have had the experience of doing X*.\nNegative: 〜たことがない.",
    examples: [
      { jp: "日本に行ったことがあります。", en: "I have been to Japan." },
      { jp: "寿司を食べたことがありますか。", en: "Have you ever eaten sushi?" },
      { jp: "馬に乗ったことがない。", en: "I've never ridden a horse." },
    ],
    exercises: [
      mcq("Pattern 'have done X' uses:", ["dictionary + ことがある", "past plain + ことがある", "te-form + ことがある", "ます + ことがある"], "past plain + ことがある"),
      mcq("Have eaten sushi: 寿司を___ことがある。", ["食べる", "食べた", "食べて", "食べます"], "食べた"),
      mcq("Negative of 〜たことがある:", ["〜たことなる", "〜たことがない", "〜たことありません", "〜なかったことがある"], "〜たことがない"),
      mcq("'Have you ever been to Japan?' uses:", ["行きますか", "行きたいですか", "行ったことがありますか", "行ってもいいですか"], "行ったことがありますか"),
      mcq("Have done (する) → done before:", ["したことがある", "するたことがある", "しっことがある", "してことがある"], "したことがある"),
      fill("Have you eaten sushi?: 寿司を食___ことがありますか。", "べた"),
      fill("I've never been to Japan: 日本に行った___がない。", "こと"),
      fill("Type 'horse' in hiragana: __ ま", "う"),
      arrange("I have been to Japan.", ["日本", "に", "行った", "ことが", "あります"], "日本に行ったことがあります"),
      arrange("Have you ever eaten sushi?", ["寿司", "を", "食べた", "ことが", "ありますか"], "寿司を食べたことがありますか"),
      arrange("I've never ridden a horse.", ["馬", "に", "乗った", "ことが", "ない"], "馬に乗ったことがない"),
      tr("Have you ever read this book?", "この本を読んだことがありますか"),
      tr("I have seen that movie.", "あの映画を見たことがあります"),
      tr("I've never traveled abroad.", "海外に行ったことがないです"),
      tr("Has she been to Kyoto?", "彼女は京都に行ったことがありますか"),
    ],
  },
  // ============== Lesson 12 ==============
  {
    lesson: 12, title: "〜んです — explanation", slug: "genki-l12-1-n-desu",
    explanation: "Plain form + **んです** softens a statement into an explanation.\n- Verbs/い-adj: dictionary + んです\n- Nouns/な-adj: な + んです (学生なんです, 静かなんです)",
    examples: [
      { jp: "どうして来なかったんですか。", en: "How come you didn't come?" },
      { jp: "頭が痛いんです。", en: "(The reason is) I have a headache." },
      { jp: "学生なんです。", en: "(You see,) I'm a student." },
    ],
    exercises: [
      mcq("From 学生です + んです:", ["学生んです", "学生なんです", "学生のんです", "学生だんです"], "学生なんです"),
      mcq("From 大きい + んです:", ["大きんです", "大きいんです", "大きなんです", "大きですんです"], "大きいんです"),
      mcq("'Why didn't you come?' 'どうして来なかった___'", ["んですか", "ですか", "のですか", "なんですか"], "んですか"),
      mcq("From 静か + んです:", ["静かんです", "静かのんです", "静かなんです", "静かだんです"], "静かなんです"),
      mcq("んです is used to:", ["assert facts", "ask polite questions only", "give/seek explanation", "form commands"], "give/seek explanation"),
      fill("頭が痛___です。 (I have a headache — explanation)", "いん"),
      fill("学生___です。 (I'm a student — explanation)", "なん"),
      fill("Type 'head' in hiragana: __ ま", "あた"),
      arrange("How come you didn't come?", ["どうして", "来なかった", "んですか"], "どうして来なかったんですか"),
      arrange("I have a headache. (explanation)", ["頭", "が", "痛い", "んです"], "頭が痛いんです"),
      arrange("I'm a student. (explanation)", ["学生", "なんです"], "学生なんです"),
      tr("Why are you studying? (seeking explanation)", "どうして勉強しているんですか"),
      tr("It's because I'm tired. (explanation)", "疲れているんです"),
      tr("It's quiet here. (explanation)", "ここは静かなんです"),
      tr("I have no money. (explanation)", "お金がないんです"),
    ],
  },
  {
    lesson: 12, title: "〜すぎる / 〜ほうがいい / 〜なくちゃいけません", slug: "genki-l12-2-suggestions-obligations",
    explanation: "- **stem + すぎる** = do too much (食べすぎる; high-adj drop い + すぎる: 高すぎる)\n- **past plain + ほうがいい** = should do X\n- **negative stem + なくちゃいけません** = must do X",
    examples: [
      { jp: "昨日寝すぎました。", en: "I slept too much yesterday." },
      { jp: "薬を飲んだほうがいいです。", en: "You should take medicine." },
      { jp: "宿題をしなくちゃいけません。", en: "I have to do homework." },
    ],
    exercises: [
      mcq("'too expensive' from 高い:", ["高すぎる", "高いすぎる", "高がすぎる", "高えすぎる"], "高すぎる"),
      mcq("'ate too much' from 食べる:", ["食べすぎた", "食べたすぎた", "食べりすぎた", "食べんすぎた"], "食べすぎた"),
      mcq("'You should rest' from 休む:", ["休むほうがいい", "休んだほうがいい", "休まないほうがいい", "休まほうがいい"], "休んだほうがいい"),
      mcq("'Must study': 勉強___いけません。", ["なくちゃ", "ないちゃ", "なくて", "ません"], "なくちゃ"),
      mcq("〜なくちゃいけません = ?", ["You may not", "You should not", "You must", "You can"], "You must"),
      fill("Slept too much yesterday: 寝___ ました。", "すぎ"),
      fill("Should take medicine: 薬を飲___ ほうがいいです。", "んだ"),
      fill("Type 'medicine' in hiragana: __ すり", "く"),
      arrange("I slept too much.", ["寝すぎました"], "寝すぎました"),
      arrange("You should take medicine.", ["薬", "を", "飲んだ", "ほうがいい", "です"], "薬を飲んだほうがいいです"),
      arrange("I have to do homework.", ["宿題", "を", "しなくちゃ", "いけません"], "宿題をしなくちゃいけません"),
      tr("I ate too much yesterday.", "昨日食べすぎました"),
      tr("You should go to bed early.", "早く寝たほうがいいです"),
      tr("I must go to school.", "学校に行かなくちゃいけません"),
      tr("This room is too small.", "この部屋は小さすぎます"),
    ],
  },
  // ============== Lesson 13 ==============
  {
    lesson: 13, title: "Potential form — can do", slug: "genki-l13-1-potential",
    explanation: "Can do X:\n- Ru: drop る + られる (食べられる)\n- U: う-row → え-row + る (読める)\n- Irregular: する → できる, くる → こられる\nObject marker switches を → が.",
    examples: [
      { jp: "私は日本語が話せます。", en: "I can speak Japanese." },
      { jp: "刺身は食べられません。", en: "I can't eat sashimi." },
      { jp: "漢字が読めますか。", en: "Can you read kanji?" },
    ],
    exercises: [
      mcq("Potential of 読む:", ["読まれる", "読める", "読んでる", "読みれる"], "読める"),
      mcq("Potential of する:", ["される", "できる", "しれる", "しられる"], "できる"),
      mcq("Potential of 食べる:", ["食べれる", "食べられる", "食べるられる", "食べれられる"], "食べられる"),
      mcq("Potential of 来る:", ["こられる", "くられる", "きられる", "こうられる"], "こられる"),
      mcq("Potential of 書く:", ["書ける", "書かれる", "書ける", "書きれる"], "書ける"),
      mcq("Object marker with potential:", ["を", "が", "は", "に"], "が"),
      mcq("'I can't eat sushi' 寿司___食べられない。", ["を", "が", "は", "で"], "が"),
      fill("Potential of 飲む: 飲___", "める"),
      fill("Can do (する): ___", "できる"),
      fill("Type 'Japanese language' in hiragana: __ ほんご", "に"),
      arrange("I can speak Japanese.", ["私", "は", "日本語", "が", "話せます"], "私は日本語が話せます"),
      arrange("I can't eat sashimi.", ["刺身", "は", "食べられません"], "刺身は食べられません"),
      arrange("Can you read kanji?", ["漢字", "が", "読めますか"], "漢字が読めますか"),
      tr("I can speak a little English.", "英語が少し話せます"),
      tr("Can you eat natto?", "納豆が食べられますか"),
    ],
  },
  {
    lesson: 13, title: "〜し — listing reasons", slug: "genki-l13-2-shi",
    explanation: "Plain form + **し** lists multiple reasons/characteristics, implying there are more.",
    examples: [
      { jp: "この店は安いし、おいしいし、よく来ます。", en: "This place is cheap and delicious, so I come often." },
      { jp: "彼は親切だし、面白い。", en: "He's kind, and funny too." },
      { jp: "天気もいいし、出かけよう。", en: "The weather is nice, so let's go out." },
    ],
    exercises: [
      mcq("〜し attaches to:", ["polite ます", "plain form", "te-form", "past polite"], "plain form"),
      mcq("'cheap and delicious': 安い___おいしい___", ["し / し", "て / て", "で / で", "と / と"], "し / し"),
      mcq("'He's kind (na-adj) and funny':", ["親切し", "親切だし", "親切なし", "親切でし"], "親切だし"),
      mcq("〜し implies:", ["that's the only reason", "there are other reasons too", "negation", "a question"], "there are other reasons too"),
      mcq("〜し + 〜し is typically followed by:", ["a question", "a conclusion or decision", "another reason", "a denial"], "a conclusion or decision"),
      fill("この店は安___、おいしい___、よく来ます。", "いし"),
      fill("彼は親切___、面白い。", "だし"),
      fill("Type 'weather' in hiragana: __ んき", "て"),
      arrange("This shop is cheap and delicious.", ["この", "店", "は", "安いし", "、", "おいしいし", "、", "よく来ます"], "この店は安いし、おいしいし、よく来ます"),
      arrange("He's kind and funny.", ["彼", "は", "親切だし", "、", "面白い"], "彼は親切だし、面白い"),
      arrange("Weather is nice, let's go out.", ["天気も", "いいし", "、", "出かけよう"], "天気もいいし、出かけよう"),
      tr("This room is bright and quiet.", "この部屋は明るいし、静かです"),
      tr("She is kind and pretty too.", "彼女は親切だし、きれいです"),
      tr("Since it's cheap and tasty, let's eat here.", "安いし、おいしいし、ここで食べましょう"),
      tr("I have no money and no time.", "お金もないし、時間もない"),
    ],
  },
  // ============== Lesson 14 ==============
  {
    lesson: 14, title: "〜てほしい — want someone to do", slug: "genki-l14-1-te-hoshii",
    explanation: "**te-form + ほしい** = *want someone to do X*. Agent marked with に.\nNegative: 〜ないでほしい.",
    examples: [
      { jp: "もっと話してほしいです。", en: "I want you to talk more." },
      { jp: "ここに来ないでほしい。", en: "I want you not to come here." },
      { jp: "手伝ってほしいです。", en: "I want help." },
    ],
    exercises: [
      mcq("'Want X to do Y' uses:", ["X が Yたい", "X に Yてほしい", "X が Yます", "X を Yてもらう"], "X に Yてほしい"),
      mcq("Agent marker with 〜てほしい:", ["を", "が", "に", "は"], "に"),
      mcq("'Don't want you to come':", ["来てほしい", "来ないほしい", "来ないでほしい", "来てほしくない"], "来ないでほしい"),
      mcq("'Want help' (te-form of 手伝う):", ["手伝ってほしい", "手伝うほしい", "手伝いほしい", "手伝いてほしい"], "手伝ってほしい"),
      mcq("〜てほしい conjugates as:", ["a verb", "an い-adjective", "a な-adjective", "a noun"], "an い-adjective"),
      fill("もっと話___ほしいです。 (te-form)", "して"),
      fill("ここに来___ほしい。 (don't want)", "ないで"),
      fill("Type 'help' in hiragana: __ つだう", "て"),
      arrange("I want you to talk more.", ["もっと", "話して", "ほしい", "です"], "もっと話してほしいです"),
      arrange("I want you not to come here.", ["ここ", "に", "来ないで", "ほしい"], "ここに来ないでほしい"),
      arrange("I want help.", ["手伝って", "ほしい", "です"], "手伝ってほしいです"),
      tr("I want you to help me.", "手伝ってほしいです"),
      tr("I want him to read this.", "彼にこれを読んでほしいです"),
      tr("I don't want her to leave.", "彼女に行かないでほしい"),
      tr("I want you to listen carefully.", "よく聞いてほしいです"),
    ],
  },
  {
    lesson: 14, title: "〜ので — reason (softer than から)", slug: "genki-l14-2-node",
    explanation: "Plain + **ので** = *because/since*. Softer than から. Nouns/な-adj use な before ので: 学生な*ので*, 静かな*ので*.",
    examples: [
      { jp: "頭が痛いので、帰ります。", en: "Since I have a headache, I'll go home." },
      { jp: "学生なので、安くなります。", en: "Since I'm a student, it's cheaper." },
      { jp: "雨が降っているので、出かけません。", en: "Since it's raining, I won't go out." },
    ],
    exercises: [
      mcq("From 学生 + ので:", ["学生ので", "学生のので", "学生なので", "学生だので"], "学生なので"),
      mcq("From 大きい + ので:", ["大きので", "大きいので", "大きなので", "大きですので"], "大きいので"),
      mcq("〜ので is ___ than 〜から.", ["more direct", "softer / more objective", "more casual", "ruder"], "softer / more objective"),
      mcq("From 静か + ので:", ["静かので", "静かのので", "静かなので", "静かだので"], "静かなので"),
      mcq("Pattern: plain form + ___ + main clause.", ["ので", "から", "が", "けど"], "ので", "Both are acceptable, but ので fits this category."),
      fill("頭が痛___、帰ります。", "いので"),
      fill("学生___、安くなります。", "なので"),
      fill("Type 'because of' in hiragana: __ で", "の"),
      arrange("Since I have a headache, I'll go home.", ["頭", "が", "痛いので", "、", "帰ります"], "頭が痛いので、帰ります"),
      arrange("Since I'm a student, it's cheaper.", ["学生なので", "、", "安くなります"], "学生なので、安くなります"),
      arrange("Since it's raining, I won't go out.", ["雨", "が", "降っているので", "、", "出かけません"], "雨が降っているので、出かけません"),
      tr("Since it's cold, I'll wear a coat.", "寒いので、コートを着ます"),
      tr("Since I'm busy, I can't come.", "忙しいので、来られません"),
      tr("Since it's quiet here, I can study.", "ここは静かなので、勉強できます"),
      tr("Since I have no money, I'll go home.", "お金がないので、帰ります"),
    ],
  },
  // ============== Lesson 15 ==============
  {
    lesson: 15, title: "Volitional form — let's / I shall", slug: "genki-l15-1-volitional",
    explanation: "Plain volitional:\n- Ru: drop る + よう (食べよう)\n- U: う-row → お-row + う (行こう)\n- Irregular: する → しよう, くる → こよう",
    examples: [
      { jp: "そろそろ行こう。", en: "Let's get going." },
      { jp: "食べよう！", en: "Let's eat!" },
      { jp: "頑張ろう！", en: "Let's do our best!" },
    ],
    exercises: [
      mcq("Volitional of 飲む:", ["飲もう", "飲みよう", "飲もうう", "飲まう"], "飲もう"),
      mcq("Volitional of 食べる:", ["食べよう", "食べう", "食べりよう", "食べおう"], "食べよう"),
      mcq("Volitional of する:", ["しよう", "するう", "せよう", "しおう"], "しよう"),
      mcq("Volitional of 来る:", ["こよう", "きよう", "くよう", "くるう"], "こよう"),
      mcq("Polite volitional ('let's') is:", ["〜よう", "〜ましょう", "〜たい", "〜たら"], "〜ましょう"),
      mcq("Volitional of 行く:", ["行こう", "行きう", "行くう", "行うう"], "行こう"),
      fill("Volitional of 寝る: 寝___", "よう"),
      fill("Volitional of 話す: 話___", "そう"),
      fill("Type 'eat' (volitional) in hiragana: たべ___", "よう"),
      arrange("Let's get going.", ["そろそろ", "行こう"], "そろそろ行こう"),
      arrange("Let's eat!", ["食べよう", "！"], "食べよう！"),
      arrange("Let's do our best!", ["頑張ろう", "！"], "頑張ろう！"),
      tr("Let's drink coffee.", "コーヒーを飲もう"),
      tr("Let's study together.", "一緒に勉強しよう"),
      tr("Let's go home.", "帰ろう"),
    ],
  },
  {
    lesson: 15, title: "〜ようと思う / つもり — intentions", slug: "genki-l15-2-intentions",
    explanation: "- **Volitional + と思う** I'm thinking of doing X\n- **Dictionary + つもりです** I plan to do X\n- **Dictionary + ことにする** I decided to do X",
    examples: [
      { jp: "今度の週末、京都に行こうと思います。", en: "I'm thinking of going to Kyoto this weekend." },
      { jp: "来年日本に行くつもりです。", en: "I plan to go to Japan next year." },
      { jp: "勉強することにしました。", en: "I decided to study." },
    ],
    exercises: [
      mcq("'Thinking of going' uses:", ["行きたいと思う", "行こうと思う", "行くと思う", "行ったら思う"], "行こうと思う"),
      mcq("'I plan to X' uses:", ["Xたい", "Xつもりです", "Xたら", "Xほしい"], "Xつもりです"),
      mcq("Pattern before つもり is:", ["volitional", "dictionary", "te-form", "past"], "dictionary"),
      mcq("'I decided to study':", ["勉強したいです", "勉強するつもりです", "勉強することにしました", "勉強しなくちゃ"], "勉強することにしました"),
      mcq("Pattern before ことにする:", ["volitional", "dictionary", "te-form", "past"], "dictionary"),
      fill("京都に行___と思います。 (volitional)", "こう"),
      fill("来年日本に行く___です。 (plan)", "つもり"),
      fill("Type 'next year' in hiragana: __ いねん", "ら"),
      arrange("I'm thinking of going to Kyoto this weekend.", ["今度の週末", "、", "京都", "に", "行こうと", "思います"], "今度の週末、京都に行こうと思います"),
      arrange("I plan to go to Japan next year.", ["来年", "日本", "に", "行く", "つもりです"], "来年日本に行くつもりです"),
      arrange("I decided to study.", ["勉強する", "ことに", "しました"], "勉強することにしました"),
      tr("I plan to study tonight.", "今晩勉強するつもりです"),
      tr("I'm thinking of buying a new car.", "新しい車を買おうと思います"),
      tr("I decided to learn Japanese.", "日本語を勉強することにしました"),
      tr("I plan to travel next year.", "来年旅行するつもりです"),
    ],
  },
  // ============== Lesson 16 ==============
  {
    lesson: 16, title: "〜てあげる / 〜てくれる / 〜てもらう", slug: "genki-l16-1-giving-receiving",
    explanation: "- **〜てあげる** I do X for someone\n- **〜てくれる** someone does X for me\n- **〜てもらう** I have someone do X (for me)",
    examples: [
      { jp: "友達に本を貸してあげました。", en: "I lent a book to my friend." },
      { jp: "先生が教えてくれました。", en: "My teacher taught me (kindly)." },
      { jp: "兄に手伝ってもらいました。", en: "I had my older brother help me." },
    ],
    exercises: [
      mcq("My friend cooked for me:", ["作ってあげた", "作ってくれた", "作ってもらった", "作っている"], "作ってくれた"),
      mcq("I taught Mary Japanese:", ["教えてあげた", "教えてくれた", "教えてもらった", "教えました"], "教えてあげた"),
      mcq("'Had teacher explain' (received):", ["教えてあげた", "教えてくれた", "教えてもらった", "教えました"], "教えてもらった"),
      mcq("Humble of 〜てもらう:", ["〜てくださる", "〜ていただく", "〜てさしあげる", "〜てくれる"], "〜ていただく"),
      mcq("Direction of 〜てくれる:", ["from me to other", "from other to me", "between others", "no direction"], "from other to me"),
      mcq("If you helped me, you'd say:", ["手伝ってあげた", "手伝ってくれた", "手伝ってもらった", "手伝いました"], "手伝ってくれた", "From your perspective: I received."),
      fill("先生が教え___ました。 (kindly to me)", "てくれ"),
      fill("兄に手伝___もらいました。", "って"),
      fill("Type 'older brother' in hiragana: __ に", "あ"),
      arrange("I lent a book to my friend.", ["友達", "に", "本", "を", "貸してあげました"], "友達に本を貸してあげました"),
      arrange("My teacher taught me.", ["先生", "が", "教えてくれました"], "先生が教えてくれました"),
      arrange("I had my brother help me.", ["兄", "に", "手伝ってもらいました"], "兄に手伝ってもらいました"),
      tr("My mother made cake for me.", "母がケーキを作ってくれました"),
      tr("I bought a present for my friend.", "友達にプレゼントを買ってあげました"),
      tr("I had Tanaka teach me Japanese.", "田中さんに日本語を教えてもらいました"),
      tr("Please help me.", "手伝ってください"),
    ],
  },
  {
    lesson: 16, title: "〜ば — conditional", slug: "genki-l16-2-ba",
    explanation: "**ば-conditional**:\n- Ru: drop る + れば\n- U: う-row → え-row + ば\n- い-adj: drop い + ければ\n- Negative: 〜なければ",
    examples: [
      { jp: "雨が降れば、行きません。", en: "If it rains, I won't go." },
      { jp: "安ければ買います。", en: "If it's cheap, I'll buy it." },
      { jp: "勉強しなければ、合格できません。", en: "If you don't study, you can't pass." },
    ],
    exercises: [
      mcq("ば-form of 行く:", ["行きば", "行くば", "行けば", "行かば"], "行けば"),
      mcq("ば-form of 食べる:", ["食べれば", "食ば", "食べりば", "食べば"], "食べれば"),
      mcq("ば-form of 安い:", ["安いば", "安えば", "安ければ", "安くば"], "安ければ"),
      mcq("Negative ば-form of 行く:", ["行かないば", "行かなければ", "行きないば", "行かなくば"], "行かなければ"),
      mcq("ば vs たら, ば favors:", ["specific past events", "general/hypothetical statements", "polite speech", "casual speech"], "general/hypothetical statements"),
      mcq("ば-form of する:", ["すば", "すれば", "せば", "しれば"], "すれば"),
      fill("ば-form of 飲む: 飲___", "めば"),
      fill("ば-form of 来る: ___", "くれば"),
      fill("Type 'cheap' in hiragana: __ すい", "や"),
      arrange("If it rains, I won't go.", ["雨", "が", "降れば", "、", "行きません"], "雨が降れば、行きません"),
      arrange("If it's cheap, I'll buy it.", ["安ければ", "買います"], "安ければ買います"),
      arrange("If you don't study, you can't pass.", ["勉強しなければ", "、", "合格できません"], "勉強しなければ、合格できません"),
      tr("If you study, you will pass.", "勉強すれば、合格できます"),
      tr("If you ask, he will help.", "頼めば、彼は手伝ってくれます"),
      tr("If it's tasty, I'll eat more.", "おいしければ、もっと食べます"),
      tr("If I have time, I'll come.", "時間があれば、来ます"),
    ],
  },
  // ============== Lesson 17 ==============
  {
    lesson: 17, title: "〜そう — hearsay vs appearance", slug: "genki-l17-1-sou",
    explanation: "Two distinct そう:\n1. **Hearsay** — plain + そう (雨が降るそうです = I heard it'll rain)\n2. **Appearance** — verb stem / い-adj stem (drop い) + そう (おいしそう = looks delicious)",
    examples: [
      { jp: "明日は雨が降るそうです。", en: "I heard it will rain tomorrow." },
      { jp: "今にも雨が降りそうです。", en: "It looks like it'll rain any minute." },
      { jp: "そのケーキはおいしそうです。", en: "That cake looks delicious." },
    ],
    exercises: [
      mcq("Pick the hearsay form of 高い:", ["高そう", "高いそう", "高くそう", "高そうだ"], "高いそう"),
      mcq("Appearance from おいしい:", ["おいしそう", "おいしいそう", "おいしくそう", "おいしいだそう"], "おいしそう"),
      mcq("'Looks like it'll rain' (appearance):", ["降るそうです", "降りそうです", "降ったそうです", "降ってそうです"], "降りそうです"),
      mcq("'I heard he came' (hearsay):", ["来たそうです", "来そうです", "来るそうです", "来てそうです"], "来たそうです"),
      mcq("Hearsay attaches to:", ["verb stem", "te-form", "plain form (any tense)", "polite ます-form"], "plain form (any tense)"),
      mcq("Appearance 〜そう (from verbs) attaches to:", ["dictionary form", "verb stem (no ます)", "te-form", "plain past"], "verb stem (no ます)"),
      fill("'I heard it will rain': 降る___です。", "そう"),
      fill("'Looks like it'll rain': 降___そうです。", "り"),
      fill("Type 'delicious' in hiragana: __ いしい", "お"),
      arrange("I heard it will rain tomorrow.", ["明日", "は", "雨", "が", "降る", "そうです"], "明日は雨が降るそうです"),
      arrange("It looks like it'll rain any minute.", ["今にも", "雨", "が", "降りそうです"], "今にも雨が降りそうです"),
      arrange("That cake looks delicious.", ["その", "ケーキ", "は", "おいしそうです"], "そのケーキはおいしそうです"),
      tr("I heard Tanaka got married.", "田中さんは結婚したそうです"),
      tr("This soup looks hot.", "このスープは熱そうです"),
      tr("It looks like he's about to fall.", "彼は今にも倒れそうです"),
    ],
  },
  {
    lesson: 17, title: "〜たら (recap) and って (casual quoting)", slug: "genki-l17-2-tara-tte",
    explanation: "- **〜たら** also: *when/once X happened, Y* (past discovery)\n- **って** = casual contraction of と (quote): 田中さんは来ないって",
    examples: [
      { jp: "家に着いたら、誰もいなかった。", en: "When I got home, no one was there." },
      { jp: "田中さんは来ないって言ってた。", en: "Tanaka said he isn't coming. (casual)" },
      { jp: "おいしいって。", en: "(They say) it's delicious." },
    ],
    exercises: [
      mcq("〜たら for past discovery means:", ["if", "when/once X happened, Y", "should", "want"], "when/once X happened, Y"),
      mcq("Casual quote particle:", ["と", "って", "が", "の"], "って"),
      mcq("田中さんは来ない___言ってた。 (casual)", ["と", "って", "が", "の"], "って"),
      mcq("家に着___、誰もいなかった。 (past たら)", ["けば", "いたら", "ったら", "けたら"], "いたら"),
      mcq("おいしい___ means 'They say it's delicious':", ["って", "と", "ね", "よ"], "って"),
      fill("家に着___、誰もいなかった。", "いたら"),
      fill("田中さんは来ない___言ってた。", "って"),
      fill("Type 'home' in hiragana: __ え", "い"),
      arrange("When I got home, no one was there.", ["家", "に", "着いたら", "、", "誰も", "いなかった"], "家に着いたら、誰もいなかった"),
      arrange("Tanaka said he isn't coming. (casual)", ["田中さん", "は", "来ない", "って", "言ってた"], "田中さんは来ないって言ってた"),
      arrange("(They say) it's delicious.", ["おいしい", "って"], "おいしいって"),
      tr("Tanaka said it's delicious. (casual)", "田中さんはおいしいって言ってた"),
      tr("When I woke up, it was raining.", "起きたら、雨が降っていた"),
      tr("She said she'll come. (casual)", "彼女は来るって言ってた"),
      tr("When I opened the door, no one was there.", "ドアを開けたら、誰もいなかった"),
    ],
  },
  // ============== Lesson 18 ==============
  {
    lesson: 18, title: "Transitive vs intransitive verb pairs", slug: "genki-l18-1-transitive-intransitive",
    explanation: "Common pairs: 開ける/開く, 閉める/閉まる, 始める/始まる, つける/つく, 出す/出る.\nTransitive uses **を**; intransitive uses **が**.",
    examples: [
      { jp: "ドアを開けました。", en: "I opened the door. (transitive)" },
      { jp: "ドアが開きました。", en: "The door opened. (intransitive)" },
      { jp: "電気をつけてください。", en: "Please turn on the lights." },
    ],
    exercises: [
      mcq("Window opened (by itself):", ["窓を開けました", "窓が開きました", "窓を開きました", "窓が開けました"], "窓が開きました"),
      mcq("Transitive uses:", ["は", "が", "を", "に"], "を"),
      mcq("Intransitive uses:", ["は", "が", "を", "に"], "が"),
      mcq("Class started: 授業___始まりました。", ["を", "が", "は", "に"], "が"),
      mcq("Teacher started class: 先生が授業___始めました。", ["を", "が", "は", "に"], "を"),
      mcq("Pair for つける:", ["つく", "つかる", "つける", "つかれる"], "つく"),
      fill("ドア___開きました。 (intransitive)", "が"),
      fill("ドア___開けました。 (transitive)", "を"),
      fill("Type 'door' in hiragana: __ あ", "ど"),
      arrange("I opened the door.", ["ドア", "を", "開けました"], "ドアを開けました"),
      arrange("The door opened.", ["ドア", "が", "開きました"], "ドアが開きました"),
      arrange("Please turn on the lights.", ["電気", "を", "つけてください"], "電気をつけてください"),
      tr("I closed the window.", "窓を閉めました"),
      tr("The window closed.", "窓が閉まりました"),
      tr("Class started at nine.", "九時に授業が始まりました"),
      tr("I turned off the TV.", "テレビを消しました"),
    ],
  },
  {
    lesson: 18, title: "〜てしまう — completion / regret", slug: "genki-l18-2-te-shimau",
    explanation: "**te-form + しまう** = finish doing OR unintended/regret.\nCasual: 〜ちゃう / 〜じゃう.",
    examples: [
      { jp: "宿題を全部やってしまいました。", en: "I finished all the homework." },
      { jp: "ケーキを全部食べちゃった。", en: "I ended up eating all the cake. (casual)" },
      { jp: "電車に乗り遅れてしまった。", en: "I ended up missing the train." },
    ],
    exercises: [
      mcq("'Ended up eating' uses:", ["食べました", "食べてしまった", "食べたい", "食べている"], "食べてしまった"),
      mcq("Casual 〜てしまう:", ["〜てない", "〜ちゃう", "〜てこと", "〜とう"], "〜ちゃう"),
      mcq("Casual of 飲んでしまう:", ["飲んじゃう", "飲んでしまう", "飲んだ", "飲んでない"], "飲んじゃう"),
      mcq("〜てしまう CAN'T express:", ["completion", "regret", "permission", "unintended action"], "permission"),
      mcq("'Finished reading the book':", ["読みました", "読んでしまった", "読んでみた", "読んでみる"], "読んでしまった"),
      fill("宿題を全部やっ___ました。 (te-form of する + しまう)", "てしまい"),
      fill("ケーキを全部食べ___ ました。", "てしまい"),
      fill("Type 'cake' in hiragana: __ ーき", "け"),
      arrange("I finished all the homework.", ["宿題", "を", "全部", "やってしまいました"], "宿題を全部やってしまいました"),
      arrange("I ended up eating all the cake.", ["ケーキ", "を", "全部", "食べちゃった"], "ケーキを全部食べちゃった"),
      arrange("I missed the train.", ["電車", "に", "乗り遅れてしまった"], "電車に乗り遅れてしまった"),
      tr("I finished reading the book.", "本を読んでしまいました"),
      tr("I broke the cup.", "コップを割ってしまいました"),
      tr("I forgot my homework.", "宿題を忘れてしまいました"),
      tr("I lost my wallet.", "財布をなくしてしまいました"),
    ],
  },
  // ============== Lesson 19 ==============
  {
    lesson: 19, title: "Honorific language (尊敬語)", slug: "genki-l19-1-sonkeigo",
    explanation: "Elevates the listener/subject. Special verbs: いらっしゃる (be/come/go), 召し上がる (eat/drink), おっしゃる (say), なさる (do), ご覧になる (see). Pattern: **お + stem + になる**. Or potential-style 〜られる.",
    examples: [
      { jp: "先生はもう召し上がりましたか。", en: "Have you eaten already, sensei?" },
      { jp: "社長はいつお戻りになりますか。", en: "When will the president be back?" },
      { jp: "何をなさいますか。", en: "What will you do?" },
    ],
    exercises: [
      mcq("Honorific of 食べる:", ["食べさる", "召し上がる", "いただく", "頂戴する"], "召し上がる"),
      mcq("Honorific of 来る:", ["参る", "いらっしゃる", "おいでになる", "either いらっしゃる or おいでになる"], "either いらっしゃる or おいでになる"),
      mcq("Honorific of する:", ["いたす", "なさる", "される", "しれる"], "なさる"),
      mcq("Honorific of 見る:", ["ご覧になる", "見られる", "拝見する", "ご覧する"], "ご覧になる"),
      mcq("Pattern 'お + stem + になる' is:", ["humble", "honorific", "casual", "neutral"], "honorific"),
      mcq("Honorific of 言う:", ["申す", "おっしゃる", "言われる", "申し上げる"], "おっしゃる"),
      fill("Honorific of 帰る: お___ になる", "帰り"),
      fill("Honorific of 飲む is: 召し___ ", "上がる"),
      fill("Type 'teacher' in hiragana: __ んせい", "せ"),
      arrange("Have you eaten already, sensei?", ["先生", "は", "もう", "召し上がりましたか"], "先生はもう召し上がりましたか"),
      arrange("When will the president be back?", ["社長", "は", "いつ", "お戻りになりますか"], "社長はいつお戻りになりますか"),
      arrange("What will you do?", ["何", "を", "なさいますか"], "何をなさいますか"),
      tr("Where will you go, sensei?", "先生はどこへいらっしゃいますか"),
      tr("Please take a look at this.", "これをご覧ください"),
      tr("What did you say?", "何とおっしゃいましたか"),
      tr("The president will speak now.", "社長が今からお話しになります"),
    ],
  },
  // ============== Lesson 20 ==============
  {
    lesson: 20, title: "Humble language (謙譲語)", slug: "genki-l20-1-kenjougo",
    explanation: "Lowers the speaker. Special humble verbs: 参る (go/come), いただく (eat/drink/receive), 申す (say), 致す (do), 拝見する (see). Pattern: **お + stem + する**.",
    examples: [
      { jp: "明日参ります。", en: "I'll come tomorrow. (humble)" },
      { jp: "お荷物をお持ちします。", en: "I'll carry your luggage." },
      { jp: "メールを拝見しました。", en: "I have read your email. (humble)" },
    ],
    exercises: [
      mcq("Humble of する:", ["される", "なさる", "致す", "やる"], "致す"),
      mcq("Humble of 行く/来る:", ["参る", "いらっしゃる", "おいで", "申す"], "参る"),
      mcq("Humble of 言う:", ["申す", "おっしゃる", "言われる", "申し上げる either"], "申す"),
      mcq("Humble of 見る:", ["拝見する", "ご覧になる", "見られる", "見ます"], "拝見する"),
      mcq("Pattern 'お + stem + する' is:", ["honorific", "humble", "casual", "neutral"], "humble"),
      mcq("Humble of 食べる:", ["召し上がる", "いただく", "拝食する", "食べる"], "いただく"),
      fill("Humble of 持つ: お___ します", "持ち"),
      fill("Humble of 来る: ___ ます", "参り"),
      fill("Type 'luggage' in hiragana: にもつ : __ もつ", "に"),
      arrange("I'll come tomorrow. (humble)", ["明日", "参ります"], "明日参ります"),
      arrange("I'll carry your luggage.", ["お荷物", "を", "お持ちします"], "お荷物をお持ちします"),
      arrange("I have read your email.", ["メール", "を", "拝見しました"], "メールを拝見しました"),
      tr("I will call later. (humble)", "後でお電話します"),
      tr("I'll wait here. (humble)", "ここでお待ちします"),
      tr("I received a present.", "プレゼントをいただきました"),
      tr("I will help you. (humble)", "お手伝いします"),
    ],
  },
  // ============== Lesson 21 ==============
  {
    lesson: 21, title: "Passive form (受身)", slug: "genki-l21-1-passive",
    explanation: "*X was done* (often suffering nuance).\n- Ru: drop る + られる\n- U: う-row → あ-row + れる\n- Irregular: する → される, くる → こられる\nAgent with **に**.",
    examples: [
      { jp: "先生に質問されました。", en: "I was asked a question by the teacher." },
      { jp: "雨に降られて、大変でした。", en: "I got rained on — what a pain." },
      { jp: "弟にケーキを食べられました。", en: "My cake was eaten by my little brother." },
    ],
    exercises: [
      mcq("Passive of 書く:", ["書かれる", "書かせる", "書ける", "書きれる"], "書かれる"),
      mcq("Passive of 食べる:", ["食べられる", "食べさせる", "食べれる", "食べれられる"], "食べられる"),
      mcq("Passive of する:", ["される", "させる", "できる", "しれる"], "される"),
      mcq("Passive of 来る:", ["こられる", "くる", "こされる", "こさせる"], "こられる"),
      mcq("Agent marker in passive:", ["を", "が", "に", "で"], "に"),
      mcq("'Suffering passive' example:", ["先生にほめられた", "雨に降られた", "本を読まれた", "all of these"], "雨に降られた"),
      mcq("Passive of 読む:", ["読まれる", "読める", "読まれる", "読みれる"], "読まれる"),
      fill("Passive of 飲む: 飲___", "まれる"),
      fill("Passive of 見る: 見___", "られる"),
      fill("Type 'teacher' in hiragana: __ んせい", "せ"),
      arrange("I was asked a question by the teacher.", ["先生", "に", "質問されました"], "先生に質問されました"),
      arrange("My cake was eaten by my brother.", ["弟", "に", "ケーキ", "を", "食べられました"], "弟にケーキを食べられました"),
      arrange("I got rained on.", ["雨", "に", "降られて", "、", "大変でした"], "雨に降られて、大変でした"),
      tr("I was scolded by my teacher.", "先生に叱られました"),
      tr("My bike was stolen.", "自転車を盗まれました"),
    ],
  },
  // ============== Lesson 22 ==============
  {
    lesson: 22, title: "Causative form (使役)", slug: "genki-l22-1-causative",
    explanation: "*Make/let someone do X*.\n- Ru: drop る + させる\n- U: う-row → あ-row + せる\n- Irregular: する → させる, くる → こさせる\nForce: agent + を. Permit: agent + に.",
    examples: [
      { jp: "先生は学生に作文を書かせました。", en: "The teacher made the students write an essay." },
      { jp: "子供にケーキを食べさせました。", en: "I let the child eat the cake." },
      { jp: "母は弟を学校に行かせました。", en: "Mom made my brother go to school." },
    ],
    exercises: [
      mcq("Causative of する:", ["される", "させる", "しせる", "せさせる"], "させる"),
      mcq("Causative of 食べる:", ["食べさせる", "食べれる", "食べさせられる", "食べせる"], "食べさせる"),
      mcq("Causative of 書く:", ["書かせる", "書かれる", "書ける", "書きさせる"], "書かせる"),
      mcq("Causative of 来る:", ["こさせる", "くる", "こられる", "きさせる"], "こさせる"),
      mcq("For 'let / permit', agent marked with:", ["を", "が", "に", "で"], "に"),
      mcq("For 'force', agent marked with:", ["を", "が", "に", "で"], "を"),
      mcq("'Made him write':", ["書かせた", "書かれた", "書けた", "書きました"], "書かせた"),
      fill("Causative of 飲む: 飲___", "ませる"),
      fill("Causative of 読む: 読___", "ませる"),
      fill("Type 'essay' in hiragana: __ くぶん", "さ"),
      arrange("The teacher made the students write an essay.", ["先生", "は", "学生", "に", "作文", "を", "書かせました"], "先生は学生に作文を書かせました"),
      arrange("I let the child eat the cake.", ["子供", "に", "ケーキ", "を", "食べさせました"], "子供にケーキを食べさせました"),
      arrange("Mom made my brother go to school.", ["母", "は", "弟", "を", "学校", "に", "行かせました"], "母は弟を学校に行かせました"),
      tr("The teacher made us study.", "先生は私たちに勉強させました"),
      tr("Mom lets me watch TV.", "母は私にテレビを見させてくれます"),
    ],
  },
  // ============== Lesson 23 ==============
  {
    lesson: 23, title: "Causative-passive — was made to do", slug: "genki-l23-1-causative-passive",
    explanation: "Combines causative + passive: *I was made to do X (against my will)*.\nForm: causative + られる. 食べさせられる, 読まされる/読ませられる.",
    examples: [
      { jp: "親に勉強させられました。", en: "I was made to study by my parents." },
      { jp: "毎日漢字を書かされる。", en: "I'm made to write kanji every day." },
      { jp: "先生に長い作文を書かせられました。", en: "The teacher made me write a long essay." },
    ],
    exercises: [
      mcq("Causative-passive of 食べる:", ["食べさせられる", "食べられる", "食べさせる", "食べれる"], "食べさせられる"),
      mcq("Causative-passive of 飲む:", ["飲まされる", "飲まれる", "飲ませる", "飲める"], "飲まされる", "Common contraction; full form: 飲ませられる."),
      mcq("Causative-passive of する:", ["させられる", "される", "させる", "できる"], "させられる"),
      mcq("Causative-passive of 待つ:", ["待たされる", "待たれる", "待たせる", "待てる"], "待たされる"),
      mcq("Causative-passive of 来る:", ["こさせられる", "こられる", "こさせる", "くる"], "こさせられる"),
      mcq("Causative-passive expresses:", ["I made someone do X", "I was made to do X (against will)", "I can do X", "I do X for someone"], "I was made to do X (against will)"),
      fill("'Was made to write': 書___", "かされ"),
      fill("'Was made to study': 勉強___ ", "させられ"),
      fill("Type 'parents' in hiragana: __ や", "お"),
      arrange("I was made to study by my parents.", ["親", "に", "勉強させられました"], "親に勉強させられました"),
      arrange("I'm made to write kanji every day.", ["毎日", "漢字", "を", "書かされる"], "毎日漢字を書かされる"),
      arrange("The teacher made me write a long essay.", ["先生", "に", "長い作文", "を", "書かせられました"], "先生に長い作文を書かせられました"),
      tr("I was made to wait by the teacher.", "先生に待たされました"),
      tr("I was made to clean by my mom.", "母に掃除させられました"),
      tr("She was made to eat vegetables.", "彼女は野菜を食べさせられました"),
    ],
  },
  {
    lesson: 23, title: "〜ように / 〜ようにする / 〜ようになる", slug: "genki-l23-2-you-ni",
    explanation: "- **〜ように** so that X / in order to X\n- **〜ようにする** try to do X (make a habit)\n- **〜ようになる** come to do X (change of state)",
    examples: [
      { jp: "聞こえるように大きい声で話してください。", en: "Please speak loudly so we can hear." },
      { jp: "野菜を食べるようにしています。", en: "I make a point of eating vegetables." },
      { jp: "漢字が読めるようになりました。", en: "I came to be able to read kanji." },
    ],
    exercises: [
      mcq("'In order to be heard': 聞こえる___", ["ように", "ようにする", "ようになる", "ようとする"], "ように"),
      mcq("'I try to study every day': 毎日勉強___", ["するようになる", "するようにする", "するようにします", "してみる"], "するようにします"),
      mcq("'Came to be able to read kanji':", ["読めるようにする", "読めるようになる", "読めるようにした", "読まれるようになる"], "読めるようになる"),
      mcq("〜ように is followed by:", ["a wish", "a purpose / so-that clause", "a question", "a prohibition"], "a purpose / so-that clause"),
      mcq("'Make it a habit' uses:", ["ように", "ようにする", "ようになる", "ようとする"], "ようにする"),
      mcq("〜ようになる expresses:", ["a permanent state", "a change in ability/state", "a wish", "a polite request"], "a change in ability/state"),
      fill("聞こえる___大きい声で話してください。", "ように"),
      fill("野菜を食べる___しています。 (habit)", "ように"),
      fill("Type 'vegetable' in hiragana: __ さい", "や"),
      arrange("Please speak loudly so we can hear.", ["聞こえる", "ように", "大きい", "声", "で", "話してください"], "聞こえるように大きい声で話してください"),
      arrange("I make a point of eating vegetables.", ["野菜", "を", "食べる", "ようにしています"], "野菜を食べるようにしています"),
      arrange("I came to be able to read kanji.", ["漢字", "が", "読める", "ようになりました"], "漢字が読めるようになりました"),
      tr("I came to like sushi.", "寿司が好きになりました"),
      tr("Please write big so it's easy to read.", "読みやすいように大きく書いてください"),
      tr("I'm trying not to eat sweets.", "甘いものを食べないようにしています"),
    ],
  },
];

// Merge initial POINTS + REMAINING (which has same shape with exercises)
const ALL_POINTS: GP[] = [...POINTS, ...REMAINING.filter((p): p is GP => "exercises" in p && Array.isArray(p.exercises) && p.exercises.length > 0)];

// ===== Sections =====

const SECTIONS: Section[] = [
  // ----- N5 -----
  {
    slug: "n5-basics", title: "Basics: copula and demonstratives", jlptLevel: 5, order: 1,
    summary: "L1–L2: introducing yourself, identifying things, asking questions, and connecting nouns.",
    pointSlugs: ["genki-l1-1-wa-desu", "genki-l1-2-question-ka", "genki-l1-3-no-modifier", "genki-l2-1-kosoado", "genki-l2-2-mo"],
    reviews: [
      mcq("Which means 'Is that (near you) a book?'", ["それは本ですか。", "あれは本ですか。", "これは本ですか。", "それは本ですよ。"], "それは本ですか。"),
      mcq("Pattern for 'Tom is also a student':", ["トムも学生です", "トムは学生も", "トムが学生も", "トム学生も"], "トムも学生です"),
      mcq("My friend's book:", ["私と友達と本", "私の友達の本", "友達の私の本", "私は友達は本"], "私の友達の本"),
      mcq("Negative past of 学生です:", ["学生じゃない", "学生でした", "学生じゃなかったです", "学生ません"], "学生じゃなかったです"),
      fill("This (near speaker) is a book: ___は本です。", "これ"),
      arrange("This is my friend's book.", ["これ", "は", "私", "の", "友達", "の", "本", "です"], "これは私の友達の本です"),
      tr("Mary is a student too.", "メアリーさんも学生です"),
      tr("Is that an umbrella over there?", "あれは傘ですか"),
    ],
  },
  {
    slug: "n5-verbs-time", title: "Verbs, particles, time", jlptLevel: 5, order: 2,
    summary: "L3–L4: polite ます-form, action particles, existence, past tense.",
    pointSlugs: ["genki-l3-1-masu-form", "genki-l3-2-particles", "genki-l3-3-masenka", "genki-l4-1-iru-aru", "genki-l4-2-past-desu"],
    reviews: [
      mcq("Polite form of 飲む:", ["飲ます", "飲みます", "飲むます", "飲みむす"], "飲みます"),
      mcq("Yesterday at 7, I ate at a cafe: ___で7時に食べました。", ["カフェ", "カフェで", "カフェに", "カフェを"], "カフェ"),
      mcq("There is a book on the desk (existence):", ["机の上に本があります", "机の上に本がいます", "机の上で本があります", "机の上は本があります"], "机の上に本があります"),
      mcq("Past polite negative of 行く:", ["行きませんでした", "行かなかったです", "行きませんかった", "行ません"], "行きませんでした"),
      fill("I won't go to school tomorrow: 明日学校に___ません。", "行き"),
      arrange("Won't you eat lunch together?", ["一緒に", "昼ご飯", "を", "食べませんか"], "一緒に昼ご飯を食べませんか"),
      tr("There is a cat under the table.", "テーブルの下に猫がいます"),
      tr("Yesterday was a holiday.", "昨日は休みでした"),
    ],
  },
  {
    slug: "n5-adjectives", title: "Adjectives and likes", jlptLevel: 5, order: 3,
    summary: "L5: い-adjectives, な-adjectives, 好き/嫌い with が.",
    pointSlugs: ["genki-l5-1-adjectives", "genki-l5-2-suki-kirai"],
    reviews: [
      mcq("Past of 大きい (i-adj):", ["大きいでした", "大きかったです", "大きでした", "大きいかった"], "大きかったです"),
      mcq("な-adj 'pretty' modifying flower:", ["きれい花", "きれいな花", "きれいの花", "きれいい花"], "きれいな花"),
      mcq("I really like cats:", ["私は猫が大好きです", "私は猫を大好きです", "私が猫は大好きです", "私は猫好きが大です"], "私は猫が大好きです"),
      fill("Negative of 安い: 安___です", "くない"),
      arrange("That park was quiet.", ["あの", "公園", "は", "静か", "でした"], "あの公園は静かでした"),
      tr("This room is small but new.", "この部屋は小さいですが、新しいです"),
      tr("She doesn't like coffee.", "彼女はコーヒーが好きじゃないです"),
      tr("That movie was interesting.", "あの映画は面白かったです"),
    ],
  },
  {
    slug: "n5-te-form", title: "Te-form and ongoing actions", jlptLevel: 5, order: 4,
    summary: "L6–L7: te-form formation and uses (requests, permission, prohibition, ている, sequencing).",
    pointSlugs: ["genki-l6-1-te-form", "genki-l6-2-te-uses", "genki-l7-1-teiru", "genki-l7-2-te-sequence"],
    reviews: [
      mcq("te-form of 行く:", ["行いて", "行きて", "行って", "行んで"], "行って"),
      mcq("'Please drink water':", ["水を飲んでください", "水を飲みますください", "水を飲むください", "水を飲みください"], "水を飲んでください"),
      mcq("'He is married' (state):", ["結婚します", "結婚しています", "結婚しました", "結婚する"], "結婚しています"),
      mcq("Connecting two actions in past: 朝起きて、 ___。", ["コーヒーを飲みます", "コーヒーを飲みました", "コーヒー飲んだり", "コーヒーを飲んでください"], "コーヒーを飲みました"),
      fill("'May I take a photo?' 写真を撮___もいいですか。", "って"),
      arrange("I woke up, ate, and went to school.", ["起きて", "、", "食べて", "、", "学校", "に", "行きました"], "起きて、食べて、学校に行きました"),
      tr("Please wait a moment.", "ちょっと待ってください"),
      tr("I'm reading a book now.", "今、本を読んでいます"),
      tr("You must not smoke here.", "ここでたばこを吸ってはいけません"),
    ],
  },
  {
    slug: "n5-plain-forms", title: "Plain forms and reporting", jlptLevel: 5, order: 5,
    summary: "L8–L9: short forms, と思う, 〜たり, past plain.",
    pointSlugs: ["genki-l8-1-short-forms-present", "genki-l8-2-to-omou", "genki-l9-1-short-past", "genki-l9-2-tari"],
    reviews: [
      mcq("Plain neg of 食べる:", ["食べません", "食べない", "食べなかった", "食べないで"], "食べない"),
      mcq("Plain past of 行く:", ["行きた", "行った", "行いた", "行きました"], "行った"),
      mcq("'I think it will rain':", ["雨が降ると思います", "雨が降りますと思います", "雨だ降ると思う", "雨は降りそうだ"], "雨が降ると思います"),
      mcq("〜たり pattern ends with:", ["ます", "する", "なる", "た"], "する"),
      fill("Plain past neg of 食べる: 食べ___", "なかった"),
      arrange("On weekends I read and watch movies.", ["週末", "は", "本", "を", "読んだり", "、", "映画", "を", "見たり", "します"], "週末は本を読んだり、映画を見たりします"),
      tr("Tanaka said he wouldn't come. (polite)", "田中さんは来ないと言っていました"),
      tr("I didn't sleep yesterday.", "昨日は寝なかった"),
    ],
  },
  {
    slug: "n5-comparisons-wishes", title: "Comparisons, conditionals, wishes", jlptLevel: 5, order: 6,
    summary: "L10–L11: より/のほうが, 〜たら, 〜たい, 〜たことがある.",
    pointSlugs: ["genki-l10-1-comparisons", "genki-l10-2-tara", "genki-l11-1-tai", "genki-l11-2-ta-koto-ga-aru"],
    reviews: [
      mcq("'Cats are more popular than dogs':", ["犬より猫のほうが人気があります", "猫は犬のほうが人気があります", "犬と猫より人気があります", "犬は猫より人気だ"], "犬より猫のほうが人気があります"),
      mcq("'If it rains, I won't go':", ["雨が降ったら、行きません", "雨が降ると、行きません", "雨が降れば行きました", "雨が降って、行きません"], "雨が降ったら、行きません"),
      mcq("'I want to eat sushi':", ["寿司を食べる", "寿司を食べたいです", "寿司を食べります", "寿司を食べてある"], "寿司を食べたいです"),
      mcq("'Have you been to Japan?':", ["日本に行きますか", "日本に行ったことがありますか", "日本に行きたいですか", "日本に行こうと思いますか"], "日本に行ったことがありますか"),
      fill("If you have time, please come: 時間が___、来てください。", "あったら"),
      arrange("I want to go to Japan.", ["日本", "に", "行きたい", "です"], "日本に行きたいです"),
      tr("Which is bigger, Tokyo or Osaka?", "東京と大阪、どちらが大きいですか"),
      tr("I've never eaten natto.", "納豆を食べたことがありません"),
    ],
  },
  {
    slug: "n5-polite-explanations", title: "Polite explanations and obligations", jlptLevel: 5, order: 7,
    summary: "L12: 〜んです, 〜すぎる, 〜ほうがいい, 〜なくちゃいけません.",
    pointSlugs: ["genki-l12-1-n-desu", "genki-l12-2-suggestions-obligations"],
    reviews: [
      mcq("'I have a headache (explanation)':", ["頭が痛いです", "頭が痛いんです", "頭が痛そうです", "頭が痛かったです"], "頭が痛いんです"),
      mcq("'I ate too much':", ["食べすぎた", "食べたい", "食べります", "食べてしまった"], "食べすぎた"),
      mcq("'You should rest':", ["休んだほうがいいです", "休むつもりです", "休むなくちゃいけません", "休むかもしれません"], "休んだほうがいいです"),
      mcq("'I must do homework':", ["宿題したい", "宿題しなくちゃいけません", "宿題したことがある", "宿題するつもり"], "宿題しなくちゃいけません"),
      fill("'I'm a student (explanation)': 学生___です。", "なん"),
      arrange("You should take medicine.", ["薬", "を", "飲んだ", "ほうがいい", "です"], "薬を飲んだほうがいいです"),
      tr("This soup is too hot.", "このスープは熱すぎます"),
      tr("I have to study tonight.", "今晩勉強しなくちゃいけません"),
    ],
  },
  // ----- N4 -----
  {
    slug: "n4-potential", title: "Potential and listing reasons", jlptLevel: 4, order: 1,
    summary: "L13: potential form, 〜し.",
    pointSlugs: ["genki-l13-1-potential", "genki-l13-2-shi"],
    reviews: [
      mcq("Potential of 飲む:", ["飲める", "飲まれる", "飲ませる", "飲んでる"], "飲める"),
      mcq("Object marker with potential verbs:", ["を", "が", "は", "に"], "が"),
      mcq("'Cheap and tasty':", ["安いし、おいしいし", "安くて、おいしくて", "安いとおいしい", "all of the above"], "all of the above"),
      mcq("Potential of する:", ["される", "できる", "しれる", "せる"], "できる"),
      fill("Pattern: plain form + ___ for listing reasons.", "し"),
      arrange("I can speak Japanese.", ["私", "は", "日本語", "が", "話せます"], "私は日本語が話せます"),
      tr("Can you eat sushi?", "寿司が食べられますか"),
      tr("This shop is cheap and tasty, so I come often.", "この店は安いし、おいしいし、よく来ます"),
    ],
  },
  {
    slug: "n4-wishes-intentions", title: "Wishes, reasons, intentions", jlptLevel: 4, order: 2,
    summary: "L14–L15: 〜てほしい, 〜ので, volitional, 〜ようと思う, つもり.",
    pointSlugs: ["genki-l14-1-te-hoshii", "genki-l14-2-node", "genki-l15-1-volitional", "genki-l15-2-intentions"],
    reviews: [
      mcq("'I want you to help me':", ["手伝ってほしいです", "手伝いたいです", "手伝ってあげてください", "手伝ってもいいですか"], "手伝ってほしいです"),
      mcq("Volitional of 食べる:", ["食べよう", "食べるう", "食べりよう", "食べおう"], "食べよう"),
      mcq("'I plan to study':", ["勉強します", "勉強したいです", "勉強するつもりです", "勉強したことがある"], "勉強するつもりです"),
      mcq("Reason 'since I'm busy' (softer than から):", ["忙しくて", "忙しいから", "忙しいので", "忙しいけど"], "忙しいので"),
      fill("Pattern 'I'm thinking of doing X': X (volitional) + ___ 思う", "と"),
      arrange("Since it's cold, I'll wear a coat.", ["寒いので", "、", "コート", "を", "着ます"], "寒いので、コートを着ます"),
      tr("Let's go home.", "帰ろう"),
      tr("I want you to read this letter.", "この手紙を読んでほしいです"),
    ],
  },
  {
    slug: "n4-giving-receiving", title: "Giving, receiving, and conditionals", jlptLevel: 4, order: 3,
    summary: "L16: あげる/くれる/もらう, 〜ば.",
    pointSlugs: ["genki-l16-1-giving-receiving", "genki-l16-2-ba"],
    reviews: [
      mcq("'My teacher taught me' (kindness toward me):", ["教えてあげた", "教えてくれた", "教えてもらった", "教えました"], "教えてくれた"),
      mcq("'I had my brother help me':", ["手伝ってあげた", "手伝ってくれた", "手伝ってもらった", "手伝った"], "手伝ってもらった"),
      mcq("ば-form of 行く:", ["行けば", "行くば", "行きば", "行かば"], "行けば"),
      mcq("'If it's cheap, I'll buy it':", ["安いば買います", "安ければ買います", "安いと買います", "安かったら買います"], "安ければ買います"),
      fill("ば-form of 食べる: 食べ___", "れば"),
      arrange("I lent a book to my friend.", ["友達", "に", "本", "を", "貸してあげました"], "友達に本を貸してあげました"),
      tr("If you study, you'll pass.", "勉強すれば、合格できます"),
      tr("Mom made cake for me.", "母がケーキを作ってくれました"),
    ],
  },
  {
    slug: "n4-reports", title: "Reports and observations", jlptLevel: 4, order: 4,
    summary: "L17–L18: 〜そう, 〜たら/って, transitive/intransitive, 〜てしまう.",
    pointSlugs: ["genki-l17-1-sou", "genki-l17-2-tara-tte", "genki-l18-1-transitive-intransitive", "genki-l18-2-te-shimau"],
    reviews: [
      mcq("Hearsay form of 大きい:", ["大きそう", "大きいそう", "大きくそう", "大きそうだ"], "大きいそう"),
      mcq("Appearance from おいしい:", ["おいしそう", "おいしいそう", "おいしくそう", "おいしだそう"], "おいしそう"),
      mcq("'The door opened (by itself)':", ["ドアを開けました", "ドアが開きました", "ドアを開きました", "ドアが開けました"], "ドアが開きました"),
      mcq("'I ended up eating it all':", ["全部食べました", "全部食べてしまった", "全部食べてみた", "全部食べてある"], "全部食べてしまった"),
      fill("Casual contraction of と (quoting):", "って"),
      arrange("That cake looks delicious.", ["その", "ケーキ", "は", "おいしそうです"], "そのケーキはおいしそうです"),
      tr("I finished reading the book.", "本を読んでしまいました"),
      tr("When I got home, no one was there.", "家に着いたら、誰もいなかった"),
    ],
  },
  {
    slug: "n4-honorifics", title: "Honorifics", jlptLevel: 4, order: 5,
    summary: "L19–L20: sonkeigo and kenjougo (honorific and humble language).",
    pointSlugs: ["genki-l19-1-sonkeigo", "genki-l20-1-kenjougo"],
    reviews: [
      mcq("Honorific of 食べる:", ["召し上がる", "いただく", "なさる", "ご覧になる"], "召し上がる"),
      mcq("Humble of する:", ["なさる", "致す", "される", "やる"], "致す"),
      mcq("Pattern 'お + stem + する' is:", ["honorific", "humble", "casual", "neutral"], "humble"),
      mcq("Honorific of 言う:", ["申す", "おっしゃる", "申し上げる", "言われる"], "おっしゃる"),
      fill("Humble of 来る/行く:", "参る"),
      arrange("Where will you go, sensei?", ["先生", "は", "どこ", "へ", "いらっしゃいますか"], "先生はどこへいらっしゃいますか"),
      tr("I will carry your luggage.", "お荷物をお持ちします"),
      tr("Please take a look at this.", "これをご覧ください"),
    ],
  },
  {
    slug: "n4-passive-causative", title: "Passive, causative, and habits", jlptLevel: 4, order: 6,
    summary: "L21–L23: passive, causative, causative-passive, 〜ように patterns.",
    pointSlugs: ["genki-l21-1-passive", "genki-l22-1-causative", "genki-l23-1-causative-passive", "genki-l23-2-you-ni"],
    reviews: [
      mcq("Passive of 書く:", ["書かれる", "書かせる", "書ける", "書きれる"], "書かれる"),
      mcq("Causative of する:", ["させる", "される", "しせる", "せさせる"], "させる"),
      mcq("Causative-passive of 食べる:", ["食べさせられる", "食べられる", "食べさせる", "食べれる"], "食べさせられる"),
      mcq("'In order to be heard':", ["聞こえるように", "聞こえそう", "聞こえると", "聞こえれば"], "聞こえるように"),
      mcq("'I came to be able to read kanji':", ["漢字が読めるようになりました", "漢字が読めるようにします", "漢字を読みました", "漢字を読みたいです"], "漢字が読めるようになりました"),
      fill("'Was made to wait' (causative-passive of 待つ): 待___", "たされ"),
      arrange("Please speak loudly so I can hear.", ["大きい", "声", "で", "話してください"], "大きい声で話してください"),
      tr("I was scolded by my teacher.", "先生に叱られました"),
      tr("Mom made my brother go to school.", "母は弟を学校に行かせました"),
    ],
  },
];

// ===== Seeder =====

async function main() {
  console.log("Seeding curated Genki 1 + 2…");

  // 1. Upsert sections
  const sectionIdBySlug = new Map<string, number>();
  for (const s of SECTIONS) {
    const row = await db.grammarSection.upsert({
      where: { slug: s.slug },
      update: { title: s.title, jlptLevel: s.jlptLevel, order: s.order, summary: s.summary },
      create: { slug: s.slug, title: s.title, jlptLevel: s.jlptLevel, order: s.order, summary: s.summary },
    });
    sectionIdBySlug.set(s.slug, row.id);
    // Clear and re-insert section reviews
    await db.sectionReview.deleteMany({ where: { sectionId: row.id } });
    for (const r of s.reviews) {
      await db.sectionReview.create({
        data: {
          sectionId: row.id,
          type: r.type,
          prompt: r.prompt,
          choices: JSON.stringify(r.choices),
          answer: r.answer,
          explanation: r.explanation ?? null,
        },
      });
    }
  }
  console.log(`  ✓ ${SECTIONS.length} sections (with ${SECTIONS.reduce((a, s) => a + s.reviews.length, 0)} section-review questions)`);

  // 2. Build slug → sectionSlug map from sections.pointSlugs
  const sectionSlugByPoint = new Map<string, string>();
  for (const s of SECTIONS) for (const ps of s.pointSlugs) sectionSlugByPoint.set(ps, s.slug);

  // 3. Upsert grammar points + their exercises
  let pointCount = 0;
  let exCount = 0;
  for (const gp of ALL_POINTS) {
    const sectionSlug = sectionSlugByPoint.get(gp.slug);
    const sectionId = sectionSlug ? sectionIdBySlug.get(sectionSlug) ?? null : null;

    const row = await db.grammarPoint.upsert({
      where: { slug: gp.slug },
      update: {
        title: gp.title,
        jlptLevel: jlptOfLesson(gp.lesson),
        source: `genki-L${gp.lesson}`,
        explanation: gp.explanation,
        examples: JSON.stringify(gp.examples),
        sectionId,
        order: gp.lesson * 10,
      },
      create: {
        title: gp.title,
        slug: gp.slug,
        jlptLevel: jlptOfLesson(gp.lesson),
        source: `genki-L${gp.lesson}`,
        explanation: gp.explanation,
        examples: JSON.stringify(gp.examples),
        sectionId,
        order: gp.lesson * 10,
      },
    });
    await db.grammarExercise.deleteMany({ where: { grammarId: row.id } });
    for (const ex of gp.exercises) {
      await db.grammarExercise.create({
        data: {
          grammarId: row.id,
          type: ex.type,
          prompt: ex.prompt,
          choices: JSON.stringify(ex.choices),
          answer: ex.answer,
          explanation: ex.explanation ?? null,
        },
      });
      exCount++;
    }
    pointCount++;
  }
  console.log(`  ✓ ${pointCount} grammar points · ${exCount} exercises`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
