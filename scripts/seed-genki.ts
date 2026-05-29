// Curated Genki 1 + Genki 2 structure: lesson-by-lesson grammar points and core vocabulary.
// Genki PDFs in user's possession are scanned images with no text layer — automated parsing
// returned empty. This seed reproduces the textbook's structure from established public
// knowledge of Genki's grammar curriculum, suitable for personal study.
//
// Run: npm run seed:genki:curated
//
// Sources for verification while editing: Tofugu Genki summaries, Bunpro Genki path,
// Genki publisher (Japan Times) sample pages.
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type Ex = { jp: string; en: string; note?: string };
type Quiz = { type: "mcq" | "fill" | "translate"; prompt: string; choices: string[]; answer: string; explanation?: string };
type GP = { lesson: number; title: string; slug: string; explanation: string; examples: Ex[]; exercises?: Quiz[] };
type V = { lesson: number; word: string; reading: string; meanings: string[]; pos: string };

const GENKI_1_GRAMMAR: GP[] = [
  // ============== Lesson 1 ==============
  {
    lesson: 1,
    title: "L1.1 XはYです — the basic copula",
    slug: "genki-l1-1-wa-desu",
    explanation:
      "**XはYです** = X is Y.\n\n- **は** marks the topic (pronounced `wa`).\n- **です** is the polite copula. Plain form: だ.\n- Negative: XはYじゃないです / Yじゃありません.\n- This pattern only links noun-to-noun (or noun-to-な-adjective). For verbs, the form is different.",
    examples: [
      { jp: "私は学生です。", en: "I am a student." },
      { jp: "メアリーさんは日本人じゃないです。", en: "Mary is not Japanese." },
    ],
    exercises: [
      { type: "mcq", prompt: "私___学生です。", choices: ["は", "が", "を", "に"], answer: "は", explanation: "は marks the topic." },
      { type: "mcq", prompt: "Negative form of です:", choices: ["でした", "じゃないです", "じゃありました", "でません"], answer: "じゃないです" },
    ],
  },
  {
    lesson: 1,
    title: "L1.2 Question particle か",
    slug: "genki-l1-2-question-ka",
    explanation:
      "Append **か** to a statement (with です/だ or a verb) to form a yes/no or wh-question. In writing, か replaces the question mark in polite Japanese.",
    examples: [
      { jp: "メアリーさんは学生ですか。", en: "Are you a student, Mary?" },
      { jp: "今、何時ですか。", en: "What time is it now?" },
    ],
    exercises: [
      { type: "translate", prompt: "Is Tanaka-san a teacher?", choices: [], answer: "田中さんは先生ですか" },
    ],
  },
  {
    lesson: 1,
    title: "L1.3 Noun + の + Noun — modification / possession",
    slug: "genki-l1-3-no-modifier",
    explanation:
      "**A の B** links two nouns where A modifies B. Often translates as `A's B`, `B of A`, or `A B` (in the sense of category).",
    examples: [
      { jp: "私の本です。", en: "It's my book." },
      { jp: "東京大学の学生です。", en: "I'm a student at the University of Tokyo." },
    ],
    exercises: [
      { type: "translate", prompt: "Mary's friend", choices: [], answer: "メアリーさんの友達" },
    ],
  },
  // ============== Lesson 2 ==============
  {
    lesson: 2,
    title: "L2.1 これ・それ・あれ — this/that/that over there",
    slug: "genki-l2-1-kosoado",
    explanation:
      "Demonstrative pronouns:\n- **これ** = this (near speaker)\n- **それ** = that (near listener)\n- **あれ** = that over there (far from both)\n- **どれ** = which\n\nUsed standalone: これは本です (This is a book).\nFor 'this book' attached to a noun, use **この・その・あの・どの**: この本.",
    examples: [
      { jp: "これは何ですか。", en: "What is this?" },
      { jp: "あの人は田中さんです。", en: "That person is Tanaka-san." },
    ],
    exercises: [
      { type: "mcq", prompt: "[Pointing at something near the listener] ___は本ですか。", choices: ["これ", "それ", "あれ", "どれ"], answer: "それ" },
    ],
  },
  {
    lesson: 2,
    title: "L2.2 Particle も — also/too",
    slug: "genki-l2-2-mo",
    explanation:
      "**も** replaces は or を when saying X also / X too. The previous statement remains true and is extended to include X.",
    examples: [
      { jp: "私は学生です。トムさんも学生です。", en: "I'm a student. Tom is also a student." },
      { jp: "コーヒーを飲みます。お茶も飲みます。", en: "I drink coffee. I drink tea too." },
    ],
    exercises: [
      { type: "mcq", prompt: "私___学生です。", choices: ["は", "を", "も", "に"], answer: "も", explanation: "Use も when extending 'me too' to a previous statement." },
    ],
  },
  // ============== Lesson 3 ==============
  {
    lesson: 3,
    title: "L3.1 Verb conjugation: ます-form (polite present/future)",
    slug: "genki-l3-1-masu-form",
    explanation:
      "Three verb groups, polite present tense:\n1. **Ru-verbs (ichidan)**: drop る, add ます. たべる → たべます\n2. **U-verbs (godan)**: change final う-row to い-row, add ます. のむ → のみます\n3. **Irregular**: する → します, くる → きます\n\nNegative: ません. Past: ました. Past negative: ませんでした.",
    examples: [
      { jp: "毎日本を読みます。", en: "I read books every day." },
      { jp: "明日来ません。", en: "I will not come tomorrow." },
    ],
    exercises: [
      { type: "mcq", prompt: "Polite form of 行く:", choices: ["行きます", "行ます", "行るます", "行います"], answer: "行きます" },
      { type: "mcq", prompt: "Polite form of 食べる:", choices: ["食べます", "食べります", "食びます", "食べいます"], answer: "食べます" },
    ],
  },
  {
    lesson: 3,
    title: "L3.2 Particles を, で, に, へ",
    slug: "genki-l3-2-particles",
    explanation:
      "- **を** marks the direct object: 本を読みます (I read a book)\n- **で** marks location of action: 図書館で勉強します (I study at the library)\n- **に** marks specific time or direction: 七時に起きます, 学校に行きます\n- **へ** also marks direction (interchangeable with に for motion): 東京へ行きます",
    examples: [
      { jp: "カフェでコーヒーを飲みます。", en: "I drink coffee at a cafe." },
      { jp: "九時に学校に行きます。", en: "I go to school at 9." },
    ],
    exercises: [
      { type: "mcq", prompt: "図書館___本を読みます。", choices: ["で", "に", "を", "は"], answer: "で", explanation: "で marks location of action." },
      { type: "mcq", prompt: "七時___起きます。", choices: ["で", "に", "を", "へ"], answer: "に", explanation: "に marks specific time." },
    ],
  },
  {
    lesson: 3,
    title: "L3.3 ~ませんか — invitation",
    slug: "genki-l3-3-masenka",
    explanation:
      "Negative ます-form + か forms a polite invitation: *Won't you...?* Use **~ましょう** to suggest *Let's...*.",
    examples: [
      { jp: "一緒に映画を見ませんか。", en: "Would you like to watch a movie together?" },
      { jp: "そろそろ食べましょう。", en: "Let's start eating soon." },
    ],
    exercises: [
      { type: "translate", prompt: "Won't you drink coffee?", choices: [], answer: "コーヒーを飲みませんか" },
    ],
  },
  // ============== Lesson 4 ==============
  {
    lesson: 4,
    title: "L4.1 います / あります — existence",
    slug: "genki-l4-1-iru-aru",
    explanation:
      "Two verbs for *there is / has*:\n- **います** — animate (people, animals)\n- **あります** — inanimate (objects, plants, abstract)\n\nPattern: [Location]に[Thing]があります／います.\nFor possession: [Person]は[Thing]があります.",
    examples: [
      { jp: "机の上に本があります。", en: "There is a book on the desk." },
      { jp: "公園に猫がいます。", en: "There is a cat in the park." },
    ],
    exercises: [
      { type: "mcq", prompt: "教室に学生___。", choices: ["です", "あります", "います", "ある"], answer: "います", explanation: "Students are animate → います." },
    ],
  },
  {
    lesson: 4,
    title: "L4.2 Past tense of nouns/adjectives (です → でした)",
    slug: "genki-l4-2-past-desu",
    explanation:
      "- Past: **でした** (was/were)\n- Past negative: **じゃなかったです** / **じゃありませんでした**\n- For verbs, ました / ませんでした (already covered in L3).",
    examples: [
      { jp: "昨日は休みでした。", en: "Yesterday was a day off." },
      { jp: "学生じゃなかったです。", en: "I wasn't a student." },
    ],
    exercises: [
      { type: "mcq", prompt: "Past of 学生です:", choices: ["学生だった", "学生でした", "学生じゃない", "学生でした"], answer: "学生でした" },
    ],
  },
  // ============== Lesson 5 ==============
  {
    lesson: 5,
    title: "L5.1 い-adjectives and な-adjectives",
    slug: "genki-l5-1-adjectives",
    explanation:
      "Two adjective types:\n\n**い-adjectives** end in い (大きい, 新しい).\n- Negative: drop い, add くない. 大きくない\n- Past: drop い, add かった. 大きかった\n- Exception: いい → よい-stem (よくない, よかった)\n\n**な-adjectives** don't end in い (静か, きれい).\n- Modify nouns with な: きれいな花\n- Use です with no inflection: 静かです → 静かじゃないです → 静かでした",
    examples: [
      { jp: "この本は新しいです。", en: "This book is new." },
      { jp: "あの公園は静かです。", en: "That park is quiet." },
      { jp: "昨日は寒かったです。", en: "Yesterday was cold." },
    ],
    exercises: [
      { type: "mcq", prompt: "Negative of 高い:", choices: ["高じゃない", "高くない", "高ないです", "高いない"], answer: "高くない" },
      { type: "mcq", prompt: "きれい + 花 (modifying):", choices: ["きれい花", "きれいの花", "きれいな花", "きれいい花"], answer: "きれいな花", explanation: "な-adjective uses な when modifying a noun." },
    ],
  },
  {
    lesson: 5,
    title: "L5.2 好き / 嫌い + が",
    slug: "genki-l5-2-suki-kirai",
    explanation:
      "**好き** (like) and **嫌い** (dislike) are な-adjectives. The object liked is marked with **が**, not を.\nPattern: [Person]は[Thing]が好きです.",
    examples: [
      { jp: "私は寿司が好きです。", en: "I like sushi." },
      { jp: "彼は野菜が嫌いです。", en: "He dislikes vegetables." },
    ],
    exercises: [
      { type: "mcq", prompt: "私は猫___好きです。", choices: ["を", "が", "は", "に"], answer: "が" },
    ],
  },
  // ============== Lesson 6 ==============
  {
    lesson: 6,
    title: "L6.1 て-form — formation",
    slug: "genki-l6-1-te-form",
    explanation:
      "The **て-form** is essential — used for requests, ongoing actions, sequencing, and more.\n\nFormation:\n- **Ru-verbs**: drop る, add て. 食べる → 食べて\n- **U-verbs** (by ending):\n  - う/つ/る → って (買う→買って, 待つ→待って, ある→あって)\n  - む/ぶ/ぬ → んで (読む→読んで, 飛ぶ→飛んで, 死ぬ→死んで)\n  - く → いて (書く→書いて) [exception: 行く → 行って]\n  - ぐ → いで (泳ぐ→泳いで)\n  - す → して (話す→話して)\n- **Irregular**: する→して, くる→きて",
    examples: [
      { jp: "食べる → 食べて", en: "" },
      { jp: "書く → 書いて", en: "" },
      { jp: "行く → 行って (exception)", en: "" },
    ],
    exercises: [
      { type: "mcq", prompt: "て-form of 読む:", choices: ["読みて", "読いて", "読んで", "読って"], answer: "読んで" },
      { type: "mcq", prompt: "て-form of 行く:", choices: ["行いて", "行きて", "行って", "行んで"], answer: "行って", explanation: "Exception — irregular." },
    ],
  },
  {
    lesson: 6,
    title: "L6.2 ~てください / ~てもいいです / ~てはいけません",
    slug: "genki-l6-2-te-uses",
    explanation:
      "Three high-frequency uses of て-form:\n- **〜てください** — polite request: 'Please do X'\n- **〜てもいいです (か)** — permission: 'You may X' / 'May I X?'\n- **〜てはいけません** — prohibition: 'You must not X'",
    examples: [
      { jp: "ちょっと待ってください。", en: "Please wait a moment." },
      { jp: "ここで写真を撮ってもいいですか。", en: "May I take photos here?" },
      { jp: "ここで食べてはいけません。", en: "You must not eat here." },
    ],
    exercises: [
      { type: "translate", prompt: "Please read this book.", choices: [], answer: "この本を読んでください" },
    ],
  },
  // ============== Lesson 7 ==============
  {
    lesson: 7,
    title: "L7.1 ~ている — progressive and state",
    slug: "genki-l7-1-teiru",
    explanation:
      "**て-form + いる** has two meanings:\n1. **Progressive** (action verbs): currently doing X. 食べている = is eating.\n2. **State** (verbs of change): the resulting state. 結婚している = is married, 知っている = know.\n\nPolite: ています.",
    examples: [
      { jp: "今、本を読んでいます。", en: "I'm reading a book now." },
      { jp: "彼は結婚しています。", en: "He is married." },
      { jp: "田中さんを知っていますか。", en: "Do you know Tanaka?" },
    ],
    exercises: [
      { type: "mcq", prompt: "I'm eating now: 今、___。", choices: ["食べる", "食べます", "食べています", "食べた"], answer: "食べています" },
    ],
  },
  {
    lesson: 7,
    title: "L7.2 Connecting actions with て",
    slug: "genki-l7-2-te-sequence",
    explanation:
      "Use て-form to chain sequential actions: *do X and then Y*.\n\nThe tense (politeness/past) is determined by the final verb only.",
    examples: [
      { jp: "朝起きて、コーヒーを飲んで、学校に行きます。", en: "I wake up, drink coffee, and go to school." },
    ],
    exercises: [
      { type: "translate", prompt: "I ate breakfast and went to work.", choices: [], answer: "朝ご飯を食べて、仕事に行きました" },
    ],
  },
  // ============== Lesson 8 ==============
  {
    lesson: 8,
    title: "L8.1 Short forms (plain present)",
    slug: "genki-l8-1-short-forms-present",
    explanation:
      "Plain (short) forms are the dictionary forms used in casual speech and embedded clauses.\n\n**Present positive** = dictionary form (食べる, 読む, する, くる).\n**Present negative** =\n- Ru-verbs: drop る + ない. 食べる→食べない\n- U-verbs: う-row → あ-row + ない. 読む→読まない. Exception: ある → ない.\n- Irregular: する→しない, くる→こない\n\nFor nouns/な-adj: present negative = じゃない. Present positive = だ (often dropped in casual speech).",
    examples: [
      { jp: "明日は学校に行かない。", en: "I'm not going to school tomorrow." },
      { jp: "彼は学生だ。", en: "He's a student. (plain)" },
    ],
    exercises: [
      { type: "mcq", prompt: "Plain negative of 食べる:", choices: ["食べません", "食べない", "食べなかった", "食べるない"], answer: "食べない" },
      { type: "mcq", prompt: "Plain negative of する:", choices: ["しません", "しない", "すない", "さない"], answer: "しない" },
    ],
  },
  {
    lesson: 8,
    title: "L8.2 〜と思う / 〜と言っていた",
    slug: "genki-l8-2-to-omou",
    explanation:
      "Quote / opinion patterns using the plain form + と:\n- **〜と思う** — *I think that...* (only used about the speaker's own thoughts in plain form before と)\n- **〜と言っていた** — *(person) was saying that...*\n\nThe verb/clause before と is in **plain form**.",
    examples: [
      { jp: "明日は雨だと思います。", en: "I think it will rain tomorrow." },
      { jp: "田中さんは来ないと言っていました。", en: "Tanaka-san said he won't come." },
    ],
    exercises: [
      { type: "mcq", prompt: "The clause before と思う must be in ___ form.", choices: ["polite ます", "plain (dictionary)", "te-form", "past"], answer: "plain (dictionary)" },
    ],
  },
  // ============== Lesson 9 ==============
  {
    lesson: 9,
    title: "L9.1 Short past forms",
    slug: "genki-l9-1-short-past",
    explanation:
      "Plain past = **た-form** (same formation as て-form, with た/だ instead of て/で).\n\n- Ru-verbs: 食べた\n- U-verbs: 読んだ, 書いた, 待った, 話した, 行った (exception)\n- Irregular: した, きた\n\nPlain past negative: replace ない with なかった. 食べなかった, 読まなかった.\n\nNouns/な-adj: だった (positive), じゃなかった (negative).",
    examples: [
      { jp: "昨日テレビを見た。", en: "I watched TV yesterday." },
      { jp: "宿題をしなかった。", en: "I didn't do the homework." },
    ],
    exercises: [
      { type: "mcq", prompt: "Plain past of 行く:", choices: ["行きた", "行った", "行いた", "行んだ"], answer: "行った" },
    ],
  },
  {
    lesson: 9,
    title: "L9.2 ~たり~たりする — non-exhaustive list of actions",
    slug: "genki-l9-2-tari",
    explanation:
      "Use **〜たり〜たりする** to list a few representative activities (among others). The implication is *do things like A and B (and other stuff)*.\n\nFormation: past plain form + り + past plain form + り + する.",
    examples: [
      { jp: "週末は本を読んだり、映画を見たりします。", en: "On weekends I do things like read books and watch movies." },
    ],
    exercises: [
      { type: "translate", prompt: "On Sunday I do things like sleep and study.", choices: [], answer: "日曜日は寝たり、勉強したりします" },
    ],
  },
  // ============== Lesson 10 ==============
  {
    lesson: 10,
    title: "L10.1 Comparisons より / ほうが / どちら",
    slug: "genki-l10-1-comparisons",
    explanation:
      "- **AよりBのほうが [adj]です** — B is more [adj] than A.\n- Question form: **AとB、どちら[noun]が[adj]ですか** — Which one is more [adj]?\n- **〜と同じぐらい** — about the same as.",
    examples: [
      { jp: "犬より猫のほうが好きです。", en: "I like cats more than dogs." },
      { jp: "東京と大阪、どちらが大きいですか。", en: "Which is bigger, Tokyo or Osaka?" },
    ],
    exercises: [
      { type: "translate", prompt: "Coffee is more delicious than tea.", choices: [], answer: "お茶よりコーヒーのほうがおいしいです" },
    ],
  },
  {
    lesson: 10,
    title: "L10.2 〜たら — conditional",
    slug: "genki-l10-2-tara",
    explanation:
      "Plain past form + ら → conditional *if/when X happens, then Y*.\n\nWorks for any verb tense and even past events: 'when X happened, Y'.",
    examples: [
      { jp: "雨が降ったら、行きません。", en: "If it rains, I won't go." },
      { jp: "うちに帰ったら、電話します。", en: "When I get home, I'll call." },
    ],
    exercises: [
      { type: "mcq", prompt: "From 行く form 'if go':", choices: ["行きたら", "行ったら", "行きったら", "行くたら"], answer: "行ったら" },
    ],
  },
  // ============== Lesson 11 ==============
  {
    lesson: 11,
    title: "L11.1 〜たい — want to do",
    slug: "genki-l11-1-tai",
    explanation:
      "Verb stem (ます-form minus ます) + **たい** = *want to do*. Inflects like an い-adjective.\n\nNegative: 〜たくない. Past: 〜たかった. Past negative: 〜たくなかった.\n\nNote: this is for the speaker's own wants. For others, use 〜たがる or 〜たいと言っている.",
    examples: [
      { jp: "寿司を食べたいです。", en: "I want to eat sushi." },
      { jp: "今日は何もしたくない。", en: "I don't want to do anything today." },
    ],
    exercises: [
      { type: "mcq", prompt: "Want to read: from 読みます:", choices: ["読みたい", "読たい", "読むたい", "読んたい"], answer: "読みたい" },
    ],
  },
  {
    lesson: 11,
    title: "L11.2 〜たことがある — have done before",
    slug: "genki-l11-2-ta-koto-ga-aru",
    explanation:
      "Past plain form + **ことがある** expresses *have had the experience of doing X*.\n\nNegative: 〜たことがない. Question: 〜たことがありますか.",
    examples: [
      { jp: "日本に行ったことがあります。", en: "I have been to Japan." },
      { jp: "寿司を食べたことがありますか。", en: "Have you ever eaten sushi?" },
    ],
    exercises: [
      { type: "translate", prompt: "Have you ever read this book?", choices: [], answer: "この本を読んだことがありますか" },
    ],
  },
  // ============== Lesson 12 ==============
  {
    lesson: 12,
    title: "L12.1 〜んです — explanation / asking for explanation",
    slug: "genki-l12-1-n-desu",
    explanation:
      "**Plain form + んです** softens a statement into an explanation or invites one.\n\n- Verbs/い-adj: dictionary form + んです. 食べるんです, 大きいんです.\n- Nouns/な-adj: な + んです. 学生なんです, 静かなんです.\n\nUsed when there's context or background to explain.",
    examples: [
      { jp: "どうして来なかったんですか。", en: "How come you didn't come?" },
      { jp: "頭が痛いんです。", en: "(The reason is) I have a headache." },
    ],
    exercises: [
      { type: "mcq", prompt: "From 学生です + んです:", choices: ["学生んです", "学生なんです", "学生のんです", "学生だんです"], answer: "学生なんです" },
    ],
  },
  {
    lesson: 12,
    title: "L12.2 〜すぎる / 〜ほうがいいです / 〜なくちゃいけません",
    slug: "genki-l12-2-suggestions-obligations",
    explanation:
      "Three useful patterns:\n- **Verb-stem + すぎる** — *do too much*. 食べすぎる. (い-adj: drop い + すぎる. 高すぎる)\n- **Past plain + ほうがいいです** — *you should do X*. 行ったほうがいいです.\n- **Negative stem + なくちゃいけません/なきゃいけません** — *must do X*. 行かなくちゃいけません.",
    examples: [
      { jp: "昨日寝すぎました。", en: "I slept too much yesterday." },
      { jp: "薬を飲んだほうがいいです。", en: "You should take medicine." },
      { jp: "宿題をしなくちゃいけません。", en: "I have to do homework." },
    ],
    exercises: [
      { type: "mcq", prompt: "'too expensive' from 高い:", choices: ["高すぎる", "高いすぎる", "高がすぎる", "高えすぎる"], answer: "高すぎる" },
    ],
  },
];

const GENKI_2_GRAMMAR: GP[] = [
  // ============== Lesson 13 ==============
  {
    lesson: 13,
    title: "L13.1 Potential form — can do",
    slug: "genki-l13-1-potential",
    explanation:
      "Potential form expresses *can do* X.\n\n- **Ru-verbs**: drop る + られる. 食べる → 食べられる\n- **U-verbs**: う-row → え-row + る. 読む → 読める\n- **Irregular**: する → できる, くる → こられる\n\nObject marker switches from を to が in the potential: 日本語が話せます (I can speak Japanese).",
    examples: [
      { jp: "私は日本語が話せます。", en: "I can speak Japanese." },
      { jp: "刺身は食べられません。", en: "I can't eat sashimi." },
    ],
    exercises: [
      { type: "mcq", prompt: "Potential of 読む:", choices: ["読まれる", "読める", "読んでる", "読みれる"], answer: "読める" },
      { type: "mcq", prompt: "Potential of する:", choices: ["される", "できる", "しれる", "しられる"], answer: "できる" },
    ],
  },
  {
    lesson: 13,
    title: "L13.2 〜し — listing reasons",
    slug: "genki-l13-2-shi",
    explanation:
      "Plain form + **し** lists multiple reasons / characteristics, implying there are more. Often translated *and (additionally)*.",
    examples: [
      { jp: "この店は安いし、おいしいし、よく来ます。", en: "This place is cheap and delicious, so I come often." },
    ],
    exercises: [
      { type: "translate", prompt: "This room is bright and quiet.", choices: [], answer: "この部屋は明るいし、静かです" },
    ],
  },
  // ============== Lesson 14 ==============
  {
    lesson: 14,
    title: "L14.1 〜てほしい — want someone to do",
    slug: "genki-l14-1-te-hoshii",
    explanation:
      "**て-form + ほしい** = *want someone to do X*. The agent is marked with に.\nNegative: 〜ないでほしい.",
    examples: [
      { jp: "もっと話してほしいです。", en: "I want you to talk more." },
      { jp: "ここに来ないでほしい。", en: "I want you not to come here." },
    ],
    exercises: [
      { type: "translate", prompt: "I want you to help me.", choices: [], answer: "手伝ってほしいです" },
    ],
  },
  {
    lesson: 14,
    title: "L14.2 〜ので — reason (softer than から)",
    slug: "genki-l14-2-node",
    explanation:
      "Plain form + **ので** = *because/since*. Softer and more objective than から.\n\nNouns and な-adjectives: なので. 学生なので, 静かなので.",
    examples: [
      { jp: "頭が痛いので、帰ります。", en: "Since I have a headache, I'll go home." },
    ],
    exercises: [
      { type: "mcq", prompt: "From 学生 + ので:", choices: ["学生ので", "学生のので", "学生なので", "学生だので"], answer: "学生なので" },
    ],
  },
  // ============== Lesson 15 ==============
  {
    lesson: 15,
    title: "L15.1 Volitional form — let's / I shall",
    slug: "genki-l15-1-volitional",
    explanation:
      "Plain volitional ('let's X'):\n- **Ru-verbs**: drop る + よう. 食べる → 食べよう\n- **U-verbs**: う-row → お-row + う. 行く → 行こう\n- **Irregular**: する → しよう, くる → こよう\n\nPolite version is the familiar 〜ましょう (L3).",
    examples: [
      { jp: "そろそろ行こう。", en: "Let's get going." },
      { jp: "食べよう！", en: "Let's eat!" },
    ],
    exercises: [
      { type: "mcq", prompt: "Volitional of 飲む:", choices: ["飲もう", "飲みよう", "飲もうう", "飲まう"], answer: "飲もう" },
    ],
  },
  {
    lesson: 15,
    title: "L15.2 〜ようと思う / つもり — intentions",
    slug: "genki-l15-2-intentions",
    explanation:
      "- **Volitional + と思う** = *I'm thinking of doing X*. 行こうと思う.\n- **Dictionary form + つもりです** = *I plan to do X*. 行くつもりです.\n- **Dictionary form + ことにする** = *I decided to do X*.",
    examples: [
      { jp: "今度の週末、京都に行こうと思います。", en: "I'm thinking of going to Kyoto this weekend." },
      { jp: "来年日本に行くつもりです。", en: "I plan to go to Japan next year." },
    ],
    exercises: [
      { type: "translate", prompt: "I plan to study tonight.", choices: [], answer: "今晩勉強するつもりです" },
    ],
  },
  // ============== Lesson 16 ==============
  {
    lesson: 16,
    title: "L16.1 〜てあげる / 〜てくれる / 〜てもらう — giving and receiving actions",
    slug: "genki-l16-1-giving-receiving",
    explanation:
      "- **〜てあげる** — *I do X for someone* (humble: 〜て差し上げる)\n- **〜てくれる** — *someone does X for me*\n- **〜てもらう** — *I receive the action of X from someone* (humble: 〜ていただく)\n\nThese express the social/emotional direction of a favor.",
    examples: [
      { jp: "友達に本を貸してあげました。", en: "I lent a book to my friend." },
      { jp: "先生が教えてくれました。", en: "My teacher taught me (kindly)." },
      { jp: "兄に手伝ってもらいました。", en: "I had my older brother help me." },
    ],
    exercises: [
      { type: "mcq", prompt: "My friend cooked for me:", choices: ["作ってあげた", "作ってくれた", "作ってもらった", "作っている"], answer: "作ってくれた" },
    ],
  },
  {
    lesson: 16,
    title: "L16.2 〜ば — conditional",
    slug: "genki-l16-2-ba",
    explanation:
      "**ば-conditional** — *if X, then Y* (often hypothetical/general).\n\n- **Ru-verbs**: drop る + れば. 食べる → 食べれば\n- **U-verbs**: う-row → え-row + ば. 行く → 行けば\n- **い-adjectives**: drop い + ければ. 高い → 高ければ\n- **Negative**: 〜なければ\n\nFor concrete future, 〜たら is more common; ば favors general statements.",
    examples: [
      { jp: "雨が降れば、行きません。", en: "If it rains, I won't go." },
      { jp: "安ければ買います。", en: "If it's cheap, I'll buy it." },
    ],
    exercises: [
      { type: "mcq", prompt: "ば-form of 行く:", choices: ["行きば", "行くば", "行けば", "行かば"], answer: "行けば" },
    ],
  },
  // ============== Lesson 17 ==============
  {
    lesson: 17,
    title: "L17.1 〜そう — hearsay vs appearance",
    slug: "genki-l17-1-sou",
    explanation:
      "Two distinct **〜そう** uses:\n\n1. **Hearsay** — plain form + そう: *I heard that...*. 雨が降るそうです.\n2. **Appearance / about to** — verb stem (without ます) / い-adj stem + そう: *looks like / about to*. 雨が降りそう. おいしそう.\n\nDon't confuse them!",
    examples: [
      { jp: "明日は雨が降るそうです。", en: "I heard it will rain tomorrow. (hearsay)" },
      { jp: "今にも雨が降りそうです。", en: "It looks like it'll rain any minute. (appearance)" },
    ],
    exercises: [
      { type: "mcq", prompt: "Pick the hearsay form of 高い:", choices: ["高そう", "高いそう", "高くそう", "高そうだ"], answer: "高いそう" },
    ],
  },
  {
    lesson: 17,
    title: "L17.2 〜たら (re-cap) and って (casual quoting)",
    slug: "genki-l17-2-tara-tte",
    explanation:
      "- **〜たら** (revisited): can also mean *when/once X happened, Y*: 朝起きたら、雨だった (When I woke up, it was raining).\n- **って** is the casual contraction of と (quote particle) — 田中さんは来ないって言ってた (Tanaka said he isn't coming).",
    examples: [
      { jp: "家に着いたら、誰もいなかった。", en: "When I got home, no one was there." },
    ],
    exercises: [
      { type: "translate", prompt: "Tanaka said it's delicious. (casual)", choices: [], answer: "田中さんはおいしいって言ってた" },
    ],
  },
  // ============== Lesson 18 ==============
  {
    lesson: 18,
    title: "L18.1 Transitive vs intransitive verb pairs",
    slug: "genki-l18-1-transitive-intransitive",
    explanation:
      "Many Japanese verbs come in transitive/intransitive pairs that look similar but have different uses:\n\n- 開ける (transitive, *open something*) / 開く (intransitive, *X opens*)\n- 閉める / 閉まる\n- 始める / 始まる\n- つける / つく\n- 出す / 出る\n\nTransitive uses **を**, intransitive uses **が**. ドアを開ける vs ドアが開く.",
    examples: [
      { jp: "ドアを開けました。", en: "I opened the door. (transitive)" },
      { jp: "ドアが開きました。", en: "The door opened. (intransitive)" },
    ],
    exercises: [
      { type: "mcq", prompt: "Window opened (by itself):", choices: ["窓を開けました", "窓が開きました", "窓を開きました", "窓が開けました"], answer: "窓が開きました" },
    ],
  },
  {
    lesson: 18,
    title: "L18.2 〜てしまう — completion / regret",
    slug: "genki-l18-2-te-shimau",
    explanation:
      "**て-form + しまう** has two flavors:\n1. **Completion** — *finish X, do X completely*. 本を読んでしまいました.\n2. **Regret / unintended** — *oops, ended up doing X*. 食べてしまった (I ate it all / I ended up eating it).\n\nCasual contraction: 〜ちゃう / 〜じゃう. 食べちゃった.",
    examples: [
      { jp: "宿題を全部やってしまいました。", en: "I finished all the homework." },
      { jp: "ケーキを全部食べちゃった。", en: "I ended up eating all the cake. (casual)" },
    ],
    exercises: [
      { type: "translate", prompt: "I finished reading the book.", choices: [], answer: "本を読んでしまいました" },
    ],
  },
  // ============== Lesson 19 ==============
  {
    lesson: 19,
    title: "L19.1 Honorific language (尊敬語 — sonkeigo)",
    slug: "genki-l19-1-sonkeigo",
    explanation:
      "Used to elevate the listener / subject (boss, customer, sensei).\n\nThree common patterns:\n1. Special honorific verbs: いらっしゃる (be/come/go), 召し上がる (eat/drink), おっしゃる (say), なさる (do), ご覧になる (see).\n2. **お + verb stem + になる** — お話しになる (speak).\n3. **〜られる** form (same as passive) — read as honorific in context.",
    examples: [
      { jp: "先生はもう召し上がりましたか。", en: "Have you eaten already, sensei?" },
      { jp: "社長はいつお戻りになりますか。", en: "When will the president be back?" },
    ],
    exercises: [
      { type: "mcq", prompt: "Honorific of 食べる:", choices: ["食べさる", "召し上がる", "いただく", "頂戴する"], answer: "召し上がる" },
    ],
  },
  // ============== Lesson 20 ==============
  {
    lesson: 20,
    title: "L20.1 Humble language (謙譲語 — kenjougo)",
    slug: "genki-l20-1-kenjougo",
    explanation:
      "Used to lower the speaker (humble) when speaking to / about a superior.\n\nSpecial humble verbs: 参る (go/come), いただく (eat/drink/receive), 申す (say), 致す (do), 拝見する (see).\n\nGeneral pattern: **お + verb stem + する**. お持ちします (I'll carry it).",
    examples: [
      { jp: "明日参ります。", en: "I'll come tomorrow. (humble)" },
      { jp: "お荷物をお持ちします。", en: "I'll carry your luggage." },
    ],
    exercises: [
      { type: "mcq", prompt: "Humble of する:", choices: ["される", "なさる", "致す", "やる"], answer: "致す" },
    ],
  },
  // ============== Lesson 21 ==============
  {
    lesson: 21,
    title: "L21.1 Passive form (受身 — ukemi)",
    slug: "genki-l21-1-passive",
    explanation:
      "Expresses *X was done* (often with a sense of being affected, sometimes negatively).\n\n- **Ru-verbs**: drop る + られる. 食べる → 食べられる\n- **U-verbs**: う-row → あ-row + れる. 読む → 読まれる\n- **Irregular**: する → される, くる → こられる\n\nAgent marked with **に**: 先生に叱られた (I was scolded by the teacher).",
    examples: [
      { jp: "先生に質問されました。", en: "I was asked a question by the teacher." },
      { jp: "雨に降られて、大変でした。", en: "I got rained on — what a pain. (suffering passive)" },
    ],
    exercises: [
      { type: "mcq", prompt: "Passive of 書く:", choices: ["書かれる", "書かせる", "書ける", "書ける"], answer: "書かれる" },
    ],
  },
  // ============== Lesson 22 ==============
  {
    lesson: 22,
    title: "L22.1 Causative form (使役 — shieki)",
    slug: "genki-l22-1-causative",
    explanation:
      "Expresses *make/let someone do X*.\n\n- **Ru-verbs**: drop る + させる. 食べさせる.\n- **U-verbs**: う-row → あ-row + せる. 読ませる.\n- **Irregular**: する → させる, くる → こさせる\n\nForced action: agent with **を**. Permitted action: agent with **に**. 子供を寝させる (make the kid sleep) / 子供にケーキを食べさせる (let the kid eat cake).",
    examples: [
      { jp: "先生は学生に作文を書かせました。", en: "The teacher made the students write an essay." },
    ],
    exercises: [
      { type: "mcq", prompt: "Causative of する:", choices: ["される", "させる", "しせる", "せさせる"], answer: "させる" },
    ],
  },
  // ============== Lesson 23 ==============
  {
    lesson: 23,
    title: "L23.1 Causative-passive — was made to do",
    slug: "genki-l23-1-causative-passive",
    explanation:
      "Combines causative + passive: *I was made to do X (against my will)*.\n\nForm: causative form's せる/させる → さ replaced by された/られた.\n- 食べる → 食べさせられる (was made to eat)\n- 読む → 読まされる / 読ませられる (was made to read)\n\nVery common in suffering contexts.",
    examples: [
      { jp: "親に勉強させられました。", en: "I was made to study by my parents." },
      { jp: "毎日漢字を書かされる。", en: "I'm made to write kanji every day." },
    ],
    exercises: [
      { type: "translate", prompt: "I was made to wait by the teacher.", choices: [], answer: "先生に待たされました" },
    ],
  },
  {
    lesson: 23,
    title: "L23.2 〜ように / 〜ようにする / 〜ようになる",
    slug: "genki-l23-2-you-ni",
    explanation:
      "- **〜ように** — *so that X / in order to X*. 忘れないように、メモを取ります.\n- **〜ようにする** — *try to do X (habitually)*. 毎日運動するようにしています.\n- **〜ようになる** — *come to do X (change of state)*. 日本語が話せるようになった.",
    examples: [
      { jp: "聞こえるように大きい声で話してください。", en: "Please speak loudly so we can hear." },
      { jp: "野菜を食べるようにしています。", en: "I make a point of eating vegetables." },
    ],
    exercises: [
      { type: "translate", prompt: "I came to be able to read kanji.", choices: [], answer: "漢字が読めるようになりました" },
    ],
  },
];

const GENKI_VOCAB: V[] = [
  // L1
  { lesson: 1, word: "学生", reading: "がくせい", meanings: ["student"], pos: "noun" },
  { lesson: 1, word: "先生", reading: "せんせい", meanings: ["teacher"], pos: "noun" },
  { lesson: 1, word: "友達", reading: "ともだち", meanings: ["friend"], pos: "noun" },
  { lesson: 1, word: "日本人", reading: "にほんじん", meanings: ["Japanese person"], pos: "noun" },
  { lesson: 1, word: "アメリカ人", reading: "アメリカじん", meanings: ["American"], pos: "noun" },
  { lesson: 1, word: "今", reading: "いま", meanings: ["now"], pos: "noun" },
  { lesson: 1, word: "何時", reading: "なんじ", meanings: ["what time"], pos: "expression" },
  // L2
  { lesson: 2, word: "本", reading: "ほん", meanings: ["book"], pos: "noun" },
  { lesson: 2, word: "傘", reading: "かさ", meanings: ["umbrella"], pos: "noun" },
  { lesson: 2, word: "鞄", reading: "かばん", meanings: ["bag"], pos: "noun" },
  { lesson: 2, word: "靴", reading: "くつ", meanings: ["shoes"], pos: "noun" },
  { lesson: 2, word: "時計", reading: "とけい", meanings: ["watch", "clock"], pos: "noun" },
  { lesson: 2, word: "新聞", reading: "しんぶん", meanings: ["newspaper"], pos: "noun" },
  // L3
  { lesson: 3, word: "食べる", reading: "たべる", meanings: ["to eat"], pos: "ichidan verb" },
  { lesson: 3, word: "飲む", reading: "のむ", meanings: ["to drink"], pos: "godan verb" },
  { lesson: 3, word: "見る", reading: "みる", meanings: ["to see", "to watch"], pos: "ichidan verb" },
  { lesson: 3, word: "読む", reading: "よむ", meanings: ["to read"], pos: "godan verb" },
  { lesson: 3, word: "書く", reading: "かく", meanings: ["to write"], pos: "godan verb" },
  { lesson: 3, word: "聞く", reading: "きく", meanings: ["to listen", "to ask"], pos: "godan verb" },
  { lesson: 3, word: "起きる", reading: "おきる", meanings: ["to wake up"], pos: "ichidan verb" },
  { lesson: 3, word: "寝る", reading: "ねる", meanings: ["to sleep"], pos: "ichidan verb" },
  { lesson: 3, word: "勉強する", reading: "べんきょうする", meanings: ["to study"], pos: "irregular verb" },
  { lesson: 3, word: "明日", reading: "あした", meanings: ["tomorrow"], pos: "noun" },
  { lesson: 3, word: "毎日", reading: "まいにち", meanings: ["every day"], pos: "noun" },
  // L4
  { lesson: 4, word: "上", reading: "うえ", meanings: ["above", "on top"], pos: "noun" },
  { lesson: 4, word: "下", reading: "した", meanings: ["below", "under"], pos: "noun" },
  { lesson: 4, word: "中", reading: "なか", meanings: ["inside", "middle"], pos: "noun" },
  { lesson: 4, word: "前", reading: "まえ", meanings: ["in front", "before"], pos: "noun" },
  { lesson: 4, word: "後ろ", reading: "うしろ", meanings: ["behind"], pos: "noun" },
  { lesson: 4, word: "右", reading: "みぎ", meanings: ["right"], pos: "noun" },
  { lesson: 4, word: "左", reading: "ひだり", meanings: ["left"], pos: "noun" },
  { lesson: 4, word: "猫", reading: "ねこ", meanings: ["cat"], pos: "noun" },
  { lesson: 4, word: "犬", reading: "いぬ", meanings: ["dog"], pos: "noun" },
  { lesson: 4, word: "昨日", reading: "きのう", meanings: ["yesterday"], pos: "noun" },
  // L5
  { lesson: 5, word: "大きい", reading: "おおきい", meanings: ["big"], pos: "i-adjective" },
  { lesson: 5, word: "小さい", reading: "ちいさい", meanings: ["small"], pos: "i-adjective" },
  { lesson: 5, word: "新しい", reading: "あたらしい", meanings: ["new"], pos: "i-adjective" },
  { lesson: 5, word: "古い", reading: "ふるい", meanings: ["old"], pos: "i-adjective" },
  { lesson: 5, word: "高い", reading: "たかい", meanings: ["expensive", "tall"], pos: "i-adjective" },
  { lesson: 5, word: "安い", reading: "やすい", meanings: ["cheap"], pos: "i-adjective" },
  { lesson: 5, word: "面白い", reading: "おもしろい", meanings: ["interesting"], pos: "i-adjective" },
  { lesson: 5, word: "静か", reading: "しずか", meanings: ["quiet"], pos: "na-adjective" },
  { lesson: 5, word: "綺麗", reading: "きれい", meanings: ["pretty", "clean"], pos: "na-adjective" },
  { lesson: 5, word: "好き", reading: "すき", meanings: ["liked"], pos: "na-adjective" },
  { lesson: 5, word: "嫌い", reading: "きらい", meanings: ["disliked"], pos: "na-adjective" },
  // L6
  { lesson: 6, word: "待つ", reading: "まつ", meanings: ["to wait"], pos: "godan verb" },
  { lesson: 6, word: "話す", reading: "はなす", meanings: ["to speak"], pos: "godan verb" },
  { lesson: 6, word: "写真", reading: "しゃしん", meanings: ["photo"], pos: "noun" },
  { lesson: 6, word: "撮る", reading: "とる", meanings: ["to take (photo)"], pos: "godan verb" },
  // L7
  { lesson: 7, word: "結婚する", reading: "けっこんする", meanings: ["to get married"], pos: "irregular verb" },
  { lesson: 7, word: "知る", reading: "しる", meanings: ["to know"], pos: "godan verb" },
  { lesson: 7, word: "住む", reading: "すむ", meanings: ["to live (residence)"], pos: "godan verb" },
  { lesson: 7, word: "働く", reading: "はたらく", meanings: ["to work"], pos: "godan verb" },
  // L8
  { lesson: 8, word: "思う", reading: "おもう", meanings: ["to think"], pos: "godan verb" },
  { lesson: 8, word: "言う", reading: "いう", meanings: ["to say"], pos: "godan verb" },
  // L9
  { lesson: 9, word: "週末", reading: "しゅうまつ", meanings: ["weekend"], pos: "noun" },
  { lesson: 9, word: "映画", reading: "えいが", meanings: ["movie"], pos: "noun" },
  { lesson: 9, word: "宿題", reading: "しゅくだい", meanings: ["homework"], pos: "noun" },
  // L10
  { lesson: 10, word: "天気", reading: "てんき", meanings: ["weather"], pos: "noun" },
  { lesson: 10, word: "雨", reading: "あめ", meanings: ["rain"], pos: "noun" },
  { lesson: 10, word: "暑い", reading: "あつい", meanings: ["hot"], pos: "i-adjective" },
  { lesson: 10, word: "寒い", reading: "さむい", meanings: ["cold (weather)"], pos: "i-adjective" },
  // L11
  { lesson: 11, word: "旅行", reading: "りょこう", meanings: ["travel"], pos: "noun" },
  { lesson: 11, word: "国", reading: "くに", meanings: ["country"], pos: "noun" },
  { lesson: 11, word: "海", reading: "うみ", meanings: ["sea"], pos: "noun" },
  // L12
  { lesson: 12, word: "頭", reading: "あたま", meanings: ["head"], pos: "noun" },
  { lesson: 12, word: "痛い", reading: "いたい", meanings: ["painful"], pos: "i-adjective" },
  { lesson: 12, word: "薬", reading: "くすり", meanings: ["medicine"], pos: "noun" },
  // L13
  { lesson: 13, word: "話せる", reading: "はなせる", meanings: ["can speak"], pos: "ichidan verb (potential)" },
  { lesson: 13, word: "刺身", reading: "さしみ", meanings: ["sashimi"], pos: "noun" },
  // L14
  { lesson: 14, word: "手伝う", reading: "てつだう", meanings: ["to help"], pos: "godan verb" },
  // L15
  { lesson: 15, word: "京都", reading: "きょうと", meanings: ["Kyoto"], pos: "noun" },
  { lesson: 15, word: "来年", reading: "らいねん", meanings: ["next year"], pos: "noun" },
  // L16
  { lesson: 16, word: "貸す", reading: "かす", meanings: ["to lend"], pos: "godan verb" },
  { lesson: 16, word: "借りる", reading: "かりる", meanings: ["to borrow"], pos: "ichidan verb" },
  { lesson: 16, word: "教える", reading: "おしえる", meanings: ["to teach"], pos: "ichidan verb" },
  // L17
  { lesson: 17, word: "聞こえる", reading: "きこえる", meanings: ["to be audible"], pos: "ichidan verb" },
  // L18
  { lesson: 18, word: "開ける", reading: "あける", meanings: ["to open (something)"], pos: "ichidan verb (transitive)" },
  { lesson: 18, word: "開く", reading: "あく", meanings: ["to open (intransitive)"], pos: "godan verb" },
  { lesson: 18, word: "閉める", reading: "しめる", meanings: ["to close (something)"], pos: "ichidan verb (transitive)" },
  { lesson: 18, word: "閉まる", reading: "しまる", meanings: ["to close (intransitive)"], pos: "godan verb" },
  // L19
  { lesson: 19, word: "いらっしゃる", reading: "いらっしゃる", meanings: ["to be / come / go (honorific)"], pos: "godan verb (honorific)" },
  { lesson: 19, word: "召し上がる", reading: "めしあがる", meanings: ["to eat / drink (honorific)"], pos: "godan verb (honorific)" },
  // L20
  { lesson: 20, word: "参る", reading: "まいる", meanings: ["to go / come (humble)"], pos: "godan verb (humble)" },
  { lesson: 20, word: "いただく", reading: "いただく", meanings: ["to receive / eat / drink (humble)"], pos: "godan verb (humble)" },
  // L21
  { lesson: 21, word: "叱る", reading: "しかる", meanings: ["to scold"], pos: "godan verb" },
  // L22
  { lesson: 22, word: "作文", reading: "さくぶん", meanings: ["essay"], pos: "noun" },
  // L23
  { lesson: 23, word: "運動", reading: "うんどう", meanings: ["exercise"], pos: "noun" },
];

function jlptOfLesson(l: number): number {
  return l <= 12 ? 5 : 4;
}

async function main() {
  console.log("Seeding curated Genki 1 + 2 content…");

  let g = 0;
  for (const gp of [...GENKI_1_GRAMMAR, ...GENKI_2_GRAMMAR]) {
    const point = await db.grammarPoint.upsert({
      where: { slug: gp.slug },
      update: {
        title: gp.title,
        jlptLevel: jlptOfLesson(gp.lesson),
        source: `genki-L${gp.lesson}`,
        explanation: gp.explanation,
        examples: JSON.stringify(gp.examples),
      },
      create: {
        title: gp.title,
        slug: gp.slug,
        jlptLevel: jlptOfLesson(gp.lesson),
        source: `genki-L${gp.lesson}`,
        explanation: gp.explanation,
        examples: JSON.stringify(gp.examples),
      },
    });
    await db.grammarExercise.deleteMany({ where: { grammarId: point.id } });
    for (const ex of gp.exercises ?? []) {
      await db.grammarExercise.create({
        data: {
          grammarId: point.id,
          type: ex.type,
          prompt: ex.prompt,
          choices: JSON.stringify(ex.choices),
          answer: ex.answer,
          explanation: ex.explanation ?? null,
        },
      });
    }
    g++;
  }
  console.log(`  ✓ ${g} grammar points`);

  let v = 0;
  for (const w of GENKI_VOCAB) {
    await db.vocabulary.upsert({
      where: { word_reading: { word: w.word, reading: w.reading } },
      update: { source: `genki-L${w.lesson}`, jlptLevel: jlptOfLesson(w.lesson) },
      create: {
        word: w.word,
        reading: w.reading,
        meanings: JSON.stringify(w.meanings),
        partOfSpeech: JSON.stringify([w.pos]),
        jlptLevel: jlptOfLesson(w.lesson),
        source: `genki-L${w.lesson}`,
      },
    });
    v++;
  }
  console.log(`  ✓ ${v} vocabulary`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
