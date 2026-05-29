// Add 2-3 example sentences per common N5 vocabulary entry.
// Run: npm run seed:examples
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type Example = { jp: string; en: string };
const EXAMPLES: Record<string, Example[]> = {
  // Greetings
  "こんにちは": [
    { jp: "田中さん、こんにちは。", en: "Hello, Tanaka." },
    { jp: "こんにちは、初めまして。", en: "Hello, nice to meet you." },
  ],
  "ありがとう": [
    { jp: "本当にありがとう。", en: "Thank you very much." },
    { jp: "プレゼント、ありがとう！", en: "Thanks for the present!" },
  ],
  "おはよう": [
    { jp: "おはようございます。", en: "Good morning. (polite)" },
    { jp: "お父さん、おはよう。", en: "Good morning, Dad." },
  ],
  "さようなら": [
    { jp: "じゃあ、さようなら。", en: "Well then, goodbye." },
    { jp: "先生、さようなら。", en: "Goodbye, teacher." },
  ],
  // People
  "学生": [
    { jp: "私は大学の学生です。", en: "I'm a university student." },
    { jp: "学生時代は楽しかった。", en: "My student days were fun." },
    { jp: "彼はまじめな学生だ。", en: "He is a serious student." },
  ],
  "先生": [
    { jp: "鈴木先生は優しいです。", en: "Suzuki-sensei is kind." },
    { jp: "先生、質問があります。", en: "Teacher, I have a question." },
  ],
  "友達": [
    { jp: "友達と公園に行きました。", en: "I went to the park with friends." },
    { jp: "新しい友達ができた。", en: "I made a new friend." },
  ],
  "私": [
    { jp: "私は日本人です。", en: "I am Japanese." },
    { jp: "私の名前は田中です。", en: "My name is Tanaka." },
  ],
  // Time
  "今日": [
    { jp: "今日は天気がいいですね。", en: "The weather is nice today." },
    { jp: "今日は何曜日ですか。", en: "What day of the week is today?" },
  ],
  "明日": [
    { jp: "明日また会いましょう。", en: "Let's meet again tomorrow." },
    { jp: "明日は雨が降るらしい。", en: "It seems it will rain tomorrow." },
  ],
  "昨日": [
    { jp: "昨日は忙しかった。", en: "I was busy yesterday." },
    { jp: "昨日のテストは難しかった。", en: "Yesterday's test was hard." },
  ],
  // Common verbs
  "食べる": [
    { jp: "毎朝パンを食べます。", en: "I eat bread every morning." },
    { jp: "もう食べましたか。", en: "Have you eaten already?" },
    { jp: "寿司が食べたい。", en: "I want to eat sushi." },
  ],
  "飲む": [
    { jp: "コーヒーを飲みます。", en: "I drink coffee." },
    { jp: "薬を飲んでください。", en: "Please take the medicine." },
    { jp: "ビールを飲みに行こう。", en: "Let's go drink some beer." },
  ],
  "見る": [
    { jp: "テレビを見ています。", en: "I'm watching TV." },
    { jp: "あの映画を見ましたか。", en: "Did you see that movie?" },
  ],
  "読む": [
    { jp: "毎日本を読みます。", en: "I read books every day." },
    { jp: "新聞を読むのが好きです。", en: "I like reading newspapers." },
  ],
  "書く": [
    { jp: "手紙を書きました。", en: "I wrote a letter." },
    { jp: "ノートに名前を書いてください。", en: "Please write your name on the notebook." },
  ],
  "聞く": [
    { jp: "音楽を聞きます。", en: "I listen to music." },
    { jp: "先生に質問を聞いた。", en: "I asked the teacher a question." },
  ],
  "行く": [
    { jp: "今日学校に行きます。", en: "I'm going to school today." },
    { jp: "週末、京都に行きませんか。", en: "Won't we go to Kyoto on the weekend?" },
  ],
  "来る": [
    { jp: "明日友達が来ます。", en: "A friend is coming tomorrow." },
    { jp: "電車が来た。", en: "The train came." },
  ],
  "起きる": [
    { jp: "毎朝七時に起きます。", en: "I wake up at 7 every morning." },
    { jp: "今日は早く起きた。", en: "I woke up early today." },
  ],
  "寝る": [
    { jp: "もう寝る時間です。", en: "It's already time to sleep." },
    { jp: "昨日はよく寝ました。", en: "I slept well yesterday." },
  ],
  "勉強する": [
    { jp: "毎日日本語を勉強します。", en: "I study Japanese every day." },
    { jp: "図書館で勉強しましょう。", en: "Let's study at the library." },
  ],
  "買う": [
    { jp: "パンを買いました。", en: "I bought some bread." },
    { jp: "新しい靴が買いたい。", en: "I want to buy new shoes." },
  ],
  "話す": [
    { jp: "日本語が少し話せます。", en: "I can speak a little Japanese." },
    { jp: "ゆっくり話してください。", en: "Please speak slowly." },
  ],
  "待つ": [
    { jp: "ちょっと待ってください。", en: "Please wait a moment." },
    { jp: "駅で友達を待っています。", en: "I'm waiting for a friend at the station." },
  ],
  "教える": [
    { jp: "日本語を教えてください。", en: "Please teach me Japanese." },
    { jp: "名前を教えてくれませんか。", en: "Could you tell me your name?" },
  ],
  // Objects / common nouns
  "本": [
    { jp: "この本は面白いです。", en: "This book is interesting." },
    { jp: "図書館で本を借りた。", en: "I borrowed a book from the library." },
  ],
  "水": [
    { jp: "水を一杯ください。", en: "A glass of water, please." },
    { jp: "毎日水をたくさん飲みます。", en: "I drink lots of water every day." },
  ],
  "山": [
    { jp: "あの山はとても高い。", en: "That mountain is very tall." },
    { jp: "週末、山に登ります。", en: "On the weekend I'll climb a mountain." },
  ],
  "川": [
    { jp: "町の中に川があります。", en: "There's a river in town." },
    { jp: "川で泳ぎたい。", en: "I want to swim in the river." },
  ],
  "日本": [
    { jp: "日本に行ったことがありますか。", en: "Have you been to Japan?" },
    { jp: "日本の料理が大好きです。", en: "I love Japanese food." },
  ],
  // Adjectives
  "大きい": [
    { jp: "大きい犬がいる。", en: "There is a big dog." },
    { jp: "声が大きいですね。", en: "Your voice is loud, isn't it." },
  ],
  "小さい": [
    { jp: "小さい部屋に住んでいます。", en: "I live in a small room." },
    { jp: "字が小さくて読めない。", en: "The letters are small and I can't read." },
  ],
  "新しい": [
    { jp: "新しい本を買いました。", en: "I bought a new book." },
    { jp: "彼は新しい先生だ。", en: "He is the new teacher." },
  ],
  "古い": [
    { jp: "古い時計を見つけた。", en: "I found an old clock." },
    { jp: "古い友達と会いました。", en: "I met an old friend." },
  ],
  "良い": [
    { jp: "天気が良いですね。", en: "The weather is good, isn't it." },
    { jp: "良い一日を！", en: "Have a good day!" },
  ],
  // Family
  "母": [
    { jp: "母は料理が上手です。", en: "My mother is good at cooking." },
    { jp: "母にプレゼントを買った。", en: "I bought a present for my mother." },
  ],
  "父": [
    { jp: "父は会社員です。", en: "My father is a company employee." },
    { jp: "父と買い物に行きました。", en: "I went shopping with my father." },
  ],
  "兄": [
    { jp: "兄は大学生です。", en: "My older brother is a college student." },
    { jp: "兄とサッカーをした。", en: "I played soccer with my older brother." },
  ],
  "姉": [
    { jp: "姉は東京に住んでいます。", en: "My older sister lives in Tokyo." },
    { jp: "姉が結婚した。", en: "My older sister got married." },
  ],
  "家族": [
    { jp: "私の家族は四人です。", en: "There are four people in my family." },
    { jp: "家族と一緒に旅行した。", en: "I traveled with my family." },
  ],
  // Sushi/food extras
  "寿司": [
    { jp: "寿司が大好きです。", en: "I love sushi." },
    { jp: "今夜は寿司を食べよう。", en: "Let's eat sushi tonight." },
  ],
  "コーヒー": [
    { jp: "朝、コーヒーを飲みます。", en: "I drink coffee in the morning." },
    { jp: "コーヒーをもう一杯ください。", en: "Another coffee, please." },
  ],
  "お茶": [
    { jp: "お茶を飲みましょう。", en: "Let's have some tea." },
    { jp: "緑のお茶が好きです。", en: "I like green tea." },
  ],
  // Places
  "学校": [
    { jp: "学校は駅から近いです。", en: "School is close to the station." },
    { jp: "毎朝学校に行きます。", en: "I go to school every morning." },
  ],
  "家": [
    { jp: "家に帰ります。", en: "I'm going home." },
    { jp: "私の家は小さいです。", en: "My house is small." },
  ],
  "図書館": [
    { jp: "図書館で勉強します。", en: "I study at the library." },
    { jp: "図書館は静かです。", en: "The library is quiet." },
  ],
  // Numbers
  "一つ": [
    { jp: "りんごを一つください。", en: "One apple, please." },
  ],
  "二つ": [
    { jp: "パンを二つ買いました。", en: "I bought two pieces of bread." },
  ],

  // ==========================================================
  // N4 example sentences
  // ==========================================================
  "会社": [
    { jp: "兄は大きな会社で働いています。", en: "My older brother works at a big company." },
    { jp: "会社まで電車で三十分かかります。", en: "It takes 30 minutes to the company by train." },
  ],
  "仕事": [
    { jp: "今日は仕事が忙しかったです。", en: "Work was busy today." },
    { jp: "彼は仕事ができる人です。", en: "He's a capable worker." },
  ],
  "会議": [
    { jp: "明日の会議は三時からです。", en: "Tomorrow's meeting starts at 3." },
    { jp: "会議で新しいアイデアを出しました。", en: "I shared a new idea at the meeting." },
  ],
  "宿題": [
    { jp: "宿題はもう終わりました。", en: "I've already finished my homework." },
    { jp: "今日の宿題は難しいです。", en: "Today's homework is difficult." },
  ],
  "試験": [
    { jp: "来週、日本語の試験があります。", en: "There's a Japanese exam next week." },
    { jp: "試験に合格しました。", en: "I passed the exam." },
  ],
  "授業": [
    { jp: "九時から授業が始まります。", en: "Class begins at 9." },
    { jp: "今日は授業が三つあります。", en: "I have three classes today." },
  ],
  "息子": [
    { jp: "息子は小学生です。", en: "My son is in elementary school." },
    { jp: "息子と公園で遊びました。", en: "I played with my son at the park." },
  ],
  "娘": [
    { jp: "娘はピアノを習っています。", en: "My daughter is learning piano." },
    { jp: "娘の誕生日は来月です。", en: "My daughter's birthday is next month." },
  ],
  "彼女": [
    { jp: "彼女と映画を見ました。", en: "I watched a movie with her." },
    { jp: "彼女はとても優しい人です。", en: "She is a very kind person." },
  ],
  "決める": [
    { jp: "旅行の場所を決めました。", en: "I decided on the travel destination." },
    { jp: "早く決めてください。", en: "Please decide quickly." },
  ],
  "選ぶ": [
    { jp: "好きな色を選んでください。", en: "Please choose the color you like." },
    { jp: "メニューから魚を選びました。", en: "I chose fish from the menu." },
  ],
  "変える": [
    { jp: "予定を変えました。", en: "I changed the schedule." },
    { jp: "髪型を変えたいです。", en: "I want to change my hairstyle." },
  ],
  "始まる": [
    { jp: "映画は何時に始まりますか。", en: "What time does the movie start?" },
    { jp: "新しい一週間が始まる。", en: "A new week is beginning." },
  ],
  "終わる": [
    { jp: "授業は三時に終わります。", en: "Class ends at 3." },
    { jp: "やっと宿題が終わりました。", en: "I finally finished my homework." },
  ],
  "間違える": [
    { jp: "答えを間違えました。", en: "I got the answer wrong." },
    { jp: "誰でも間違えることがあります。", en: "Anyone can make mistakes." },
  ],
  "壊れる": [
    { jp: "時計が壊れています。", en: "The clock is broken." },
    { jp: "雨で傘が壊れた。", en: "The umbrella broke from the rain." },
  ],
  "嬉しい": [
    { jp: "プレゼントをもらって嬉しいです。", en: "I'm happy to receive a present." },
    { jp: "会えて嬉しかったです。", en: "I was glad to see you." },
  ],
  "悲しい": [
    { jp: "悲しい映画でした。", en: "It was a sad movie." },
    { jp: "猫が死んで悲しいです。", en: "I'm sad because my cat died." },
  ],
  "心配": [
    { jp: "心配しないでください。", en: "Please don't worry." },
    { jp: "母は私のことを心配しています。", en: "My mom is worried about me." },
  ],
  "予約": [
    { jp: "レストランを予約しました。", en: "I made a restaurant reservation." },
    { jp: "ホテルの予約をお願いします。", en: "Please make a hotel reservation." },
  ],
  "約束": [
    { jp: "友達と約束があります。", en: "I have an appointment with a friend." },
    { jp: "約束を守ってください。", en: "Please keep your promise." },
  ],
  "意見": [
    { jp: "皆さんの意見を聞きたいです。", en: "I'd like to hear everyone's opinion." },
    { jp: "私の意見は違います。", en: "My opinion is different." },
  ],
  "趣味": [
    { jp: "私の趣味は読書です。", en: "My hobby is reading." },
    { jp: "彼の趣味は何ですか。", en: "What is his hobby?" },
  ],
  "夢": [
    { jp: "子供の頃の夢は医者でした。", en: "My childhood dream was to be a doctor." },
    { jp: "昨夜、変な夢を見ました。", en: "I had a strange dream last night." },
  ],
  "経験": [
    { jp: "日本での経験は貴重でした。", en: "My experience in Japan was precious." },
    { jp: "彼は教える経験が豊富です。", en: "He has rich teaching experience." },
  ],
  "問題": [
    { jp: "この問題は難しいです。", en: "This problem is difficult." },
    { jp: "何か問題がありますか。", en: "Is there any problem?" },
  ],
  "理由": [
    { jp: "遅れた理由を教えてください。", en: "Please tell me the reason you were late." },
    { jp: "理由は分かりません。", en: "I don't know the reason." },
  ],
  "場所": [
    { jp: "会う場所を決めましょう。", en: "Let's decide where to meet." },
    { jp: "ここは静かな場所です。", en: "This is a quiet place." },
  ],
  "予定": [
    { jp: "明日の予定は何ですか。", en: "What are your plans for tomorrow?" },
    { jp: "週末は予定がありません。", en: "I have no plans for the weekend." },
  ],
};

async function main() {
  console.log("Seeding example sentences…");

  // Wipe old examples first to keep idempotent
  await db.vocabularyExample.deleteMany({});
  await db.exampleSentence.deleteMany({});

  let totalLinks = 0;
  let totalSentences = 0;

  for (const [word, examples] of Object.entries(EXAMPLES)) {
    // Find matching vocabulary entries (multiple readings may exist; take first by word)
    const vocab = await db.vocabulary.findFirst({ where: { word } });
    if (!vocab) {
      // try matching by reading
      continue;
    }
    for (const ex of examples) {
      const sentence = await db.exampleSentence.create({
        data: { japanese: ex.jp, english: ex.en },
      });
      await db.vocabularyExample.create({
        data: { vocabularyId: vocab.id, exampleId: sentence.id },
      });
      totalSentences++;
      totalLinks++;
    }
  }
  console.log(`  ✓ ${totalSentences} example sentences across ${Object.keys(EXAMPLES).length} words (${totalLinks} links)`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
