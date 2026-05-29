// Expanded listening + reading exercises across N5–N3.
// Run: npm run seed:content
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type Q = { q: string; choices: string[]; answer: string };
type Listening = { jlpt: number; title: string; transcript: string; english: string; questions: Q[] };
type Reading = { jlpt: number; title: string; text: string; english: string; questions: Q[] };

const LISTENING: Listening[] = [
  // ===== N5 =====
  {
    jlpt: 5,
    title: "Self-introduction",
    transcript: "はじめまして。田中です。学生です。よろしくお願いします。",
    english: "Nice to meet you. I'm Tanaka. I'm a student. Please treat me well.",
    questions: [
      { q: "What is the speaker's name?", choices: ["Tanaka", "Suzuki", "Sato", "Yamada"], answer: "Tanaka" },
      { q: "What is the speaker's occupation?", choices: ["Teacher", "Student", "Doctor", "Engineer"], answer: "Student" },
    ],
  },
  {
    jlpt: 5,
    title: "Ordering at a restaurant",
    transcript: "すみません。水をください。それから、ラーメンをお願いします。",
    english: "Excuse me. Water please. And ramen please.",
    questions: [
      { q: "What does the speaker order to drink?", choices: ["Tea", "Water", "Beer", "Coffee"], answer: "Water" },
      { q: "What food does the speaker order?", choices: ["Sushi", "Ramen", "Udon", "Curry"], answer: "Ramen" },
    ],
  },
  {
    jlpt: 5,
    title: "Telephone call",
    transcript: "もしもし。鈴木です。山田さんはいますか。すみません、もう一度お願いします。",
    english: "Hello, this is Suzuki. Is Yamada there? Excuse me, could you say that again?",
    questions: [
      { q: "Who is calling?", choices: ["Tanaka", "Suzuki", "Yamada", "Sato"], answer: "Suzuki" },
      { q: "Who does the caller want to speak to?", choices: ["Tanaka", "Suzuki", "Yamada", "Sato"], answer: "Yamada" },
      { q: "What does the caller ask the listener to do?", choices: ["Wait", "Repeat", "Come back later", "Hang up"], answer: "Repeat" },
    ],
  },
  {
    jlpt: 5,
    title: "Buying a ticket",
    transcript: "東京まで切符を一枚ください。何時の電車ですか。九時半の電車です。",
    english: "One ticket to Tokyo, please. What time is the train? It's the 9:30 train.",
    questions: [
      { q: "Where is the speaker going?", choices: ["Osaka", "Tokyo", "Kyoto", "Nagoya"], answer: "Tokyo" },
      { q: "How many tickets are bought?", choices: ["One", "Two", "Three", "Four"], answer: "One" },
      { q: "What time does the train depart?", choices: ["9:00", "9:30", "10:00", "10:30"], answer: "9:30" },
    ],
  },
  {
    jlpt: 5,
    title: "Asking directions",
    transcript: "すみません。郵便局はどこですか。あの銀行の隣です。ありがとうございます。",
    english: "Excuse me. Where is the post office? It's next to that bank. Thank you very much.",
    questions: [
      { q: "What is the speaker looking for?", choices: ["Bank", "Post office", "Station", "Library"], answer: "Post office" },
      { q: "Where is it located?", choices: ["Next to the bank", "Inside the station", "In front of the school", "Behind the library"], answer: "Next to the bank" },
    ],
  },
  {
    jlpt: 5,
    title: "Daily routine",
    transcript: "私は毎朝七時に起きます。八時に朝ご飯を食べます。九時に学校に行きます。",
    english: "I wake up at 7 every morning. I eat breakfast at 8. I go to school at 9.",
    questions: [
      { q: "What time does the speaker wake up?", choices: ["6", "7", "8", "9"], answer: "7" },
      { q: "What time does the speaker eat breakfast?", choices: ["7", "8", "9", "10"], answer: "8" },
      { q: "What time does the speaker go to school?", choices: ["7", "8", "9", "10"], answer: "9" },
    ],
  },
  {
    jlpt: 5,
    title: "Family",
    transcript: "私の家族は四人です。父と母と兄と私です。兄は大学生です。",
    english: "My family has four people. My father, mother, older brother, and me. My older brother is a university student.",
    questions: [
      { q: "How many people are in the family?", choices: ["Two", "Three", "Four", "Five"], answer: "Four" },
      { q: "What is the speaker's older brother?", choices: ["A teacher", "A doctor", "A university student", "A high school student"], answer: "A university student" },
    ],
  },
  {
    jlpt: 5,
    title: "Shopping",
    transcript: "このりんごはいくらですか。一個百円です。じゃあ、三個ください。",
    english: "How much is this apple? It's 100 yen each. Then, give me three please.",
    questions: [
      { q: "What is the speaker buying?", choices: ["Banana", "Apple", "Orange", "Strawberry"], answer: "Apple" },
      { q: "How much is one?", choices: ["50 yen", "100 yen", "150 yen", "200 yen"], answer: "100 yen" },
      { q: "How many does the speaker buy?", choices: ["One", "Two", "Three", "Four"], answer: "Three" },
    ],
  },
  {
    jlpt: 5,
    title: "Weekend plans",
    transcript: "週末は何をしますか。土曜日に友達と映画を見ます。日曜日は家で休みます。",
    english: "What will you do on the weekend? On Saturday I'll watch a movie with a friend. On Sunday I'll rest at home.",
    questions: [
      { q: "What is the speaker doing on Saturday?", choices: ["Studying", "Watching a movie", "Working", "Sleeping"], answer: "Watching a movie" },
      { q: "Where is the speaker on Sunday?", choices: ["At a cafe", "At school", "At home", "At a park"], answer: "At home" },
    ],
  },
  {
    jlpt: 5,
    title: "Weather",
    transcript: "今日は天気がいいですね。はい、暖かいですね。明日は雨が降るそうです。",
    english: "Today the weather is nice, isn't it. Yes, it's warm. I heard tomorrow will rain.",
    questions: [
      { q: "How is the weather today?", choices: ["Cold", "Rainy", "Warm", "Snowy"], answer: "Warm" },
      { q: "How will tomorrow be?", choices: ["Sunny", "Rainy", "Snowy", "Windy"], answer: "Rainy" },
    ],
  },
  // ===== N4 =====
  {
    jlpt: 4,
    title: "Train announcement",
    transcript: "ご乗車の皆様にお知らせします。事故のため、電車が三十分遅れています。お急ぎのところ、ご迷惑をおかけします。",
    english: "Attention all passengers. Due to an accident, the train is delayed by 30 minutes. We apologize for the inconvenience.",
    questions: [
      { q: "Why is the train delayed?", choices: ["Bad weather", "Accident", "Construction", "Strike"], answer: "Accident" },
      { q: "How long is the delay?", choices: ["10 minutes", "20 minutes", "30 minutes", "1 hour"], answer: "30 minutes" },
    ],
  },
  {
    jlpt: 4,
    title: "Restaurant reservation",
    transcript: "もしもし、レストランさくらです。明日の七時に四人で予約したいんですが。はい、お名前をお願いします。田中です。",
    english: "Hello, this is Restaurant Sakura. I'd like to make a reservation for four people at 7 tomorrow. Yes, your name please. It's Tanaka.",
    questions: [
      { q: "How many people is the reservation for?", choices: ["Two", "Three", "Four", "Five"], answer: "Four" },
      { q: "What time is the reservation?", choices: ["6:00", "7:00", "8:00", "9:00"], answer: "7:00" },
      { q: "Whose name is the reservation under?", choices: ["Tanaka", "Suzuki", "Sato", "Yamada"], answer: "Tanaka" },
    ],
  },
  {
    jlpt: 4,
    title: "At the doctor's office",
    transcript: "どうしましたか。三日前から頭が痛いんです。熱もありますか。はい、少し。風邪ですね。薬を出します。",
    english: "What's wrong? My head has been hurting for three days. Do you have a fever too? Yes, a little. It's a cold. I'll prescribe medicine.",
    questions: [
      { q: "Since when has the patient had a headache?", choices: ["1 day ago", "2 days ago", "3 days ago", "1 week ago"], answer: "3 days ago" },
      { q: "Does the patient have a fever?", choices: ["Yes, a lot", "Yes, a little", "No", "Doesn't know"], answer: "Yes, a little" },
      { q: "What does the doctor diagnose?", choices: ["Flu", "Cold", "Allergy", "Headache only"], answer: "Cold" },
    ],
  },
  {
    jlpt: 4,
    title: "Travel plans",
    transcript: "夏休みに京都へ行こうと思っています。何日ぐらい行きますか。一週間ぐらいです。お寺をたくさん見たいんです。",
    english: "I'm thinking of going to Kyoto for summer vacation. How many days will you go? About a week. I want to see lots of temples.",
    questions: [
      { q: "Where is the speaker going?", choices: ["Tokyo", "Osaka", "Kyoto", "Hokkaido"], answer: "Kyoto" },
      { q: "When is the trip?", choices: ["Spring break", "Summer vacation", "Winter break", "Golden Week"], answer: "Summer vacation" },
      { q: "How long is the trip?", choices: ["3 days", "5 days", "1 week", "2 weeks"], answer: "1 week" },
      { q: "What does the speaker want to see?", choices: ["Mountains", "Beaches", "Temples", "Museums"], answer: "Temples" },
    ],
  },
  {
    jlpt: 4,
    title: "Job interview",
    transcript: "なぜ当社に応募されましたか。御社の製品が好きだからです。前の会社では何をしていましたか。営業の仕事をしていました。",
    english: "Why did you apply to our company? Because I like your products. What did you do at your previous company? I worked in sales.",
    questions: [
      { q: "Why did the applicant apply?", choices: ["Good salary", "Likes the products", "Close to home", "Famous company"], answer: "Likes the products" },
      { q: "What was their previous job?", choices: ["Engineering", "Sales", "Marketing", "Accounting"], answer: "Sales" },
    ],
  },
  {
    jlpt: 4,
    title: "Lost item at the station",
    transcript: "すみません。電車に鞄を忘れました。何色の鞄ですか。黒い鞄です。中に本と財布が入っています。",
    english: "Excuse me. I left my bag on the train. What color is the bag? It's a black bag. There's a book and a wallet inside.",
    questions: [
      { q: "Where was the bag lost?", choices: ["Bus", "Train", "Taxi", "Bench"], answer: "Train" },
      { q: "What color is the bag?", choices: ["Red", "Blue", "Black", "White"], answer: "Black" },
      { q: "What's inside?", choices: ["Phone and keys", "Book and wallet", "Lunch and umbrella", "Laptop and notebook"], answer: "Book and wallet" },
    ],
  },
  // ===== N3 =====
  {
    jlpt: 3,
    title: "Apartment hunting",
    transcript: "駅から近いアパートを探しているんですが。家賃はどのくらいですか。月十万円までです。ペットは飼えますか。はい、小さい犬なら大丈夫です。",
    english: "I'm looking for an apartment close to the station. What's the rent? Up to 100,000 yen per month. Can I have pets? Yes, a small dog is fine.",
    questions: [
      { q: "What is the most important condition?", choices: ["Close to station", "Cheap", "Big rooms", "New building"], answer: "Close to station" },
      { q: "What is the maximum rent?", choices: ["50,000 yen", "100,000 yen", "150,000 yen", "200,000 yen"], answer: "100,000 yen" },
      { q: "What kind of pet is allowed?", choices: ["Large dog", "Small dog", "Cat only", "No pets"], answer: "Small dog" },
    ],
  },
  {
    jlpt: 3,
    title: "Job change interview",
    transcript: "なぜ今の会社を辞めようと思ったんですか。もっと専門的な仕事がしたいからです。当社に入ったら、何をしたいですか。新しい製品の開発に関わりたいです。",
    english: "Why are you considering leaving your current company? Because I want to do more specialized work. What would you like to do if you join us? I want to be involved in new product development.",
    questions: [
      { q: "Why is the applicant leaving their job?", choices: ["Salary", "More specialized work", "Bad boss", "Long hours"], answer: "More specialized work" },
      { q: "What do they want to do in the new role?", choices: ["Marketing", "Sales", "Product development", "HR"], answer: "Product development" },
    ],
  },
];

const READING: Reading[] = [
  // ===== N5 =====
  {
    jlpt: 5,
    title: "My morning",
    text: "私は毎日七時に起きます。それから、水を飲みます。ご飯を食べます。八時に学校に行きます。",
    english: "I wake up at 7 every day. Then I drink water. I eat rice. I go to school at 8.",
    questions: [
      { q: "What time does the writer wake up?", choices: ["6", "7", "8", "9"], answer: "7" },
      { q: "What does the writer drink in the morning?", choices: ["Tea", "Water", "Coffee", "Milk"], answer: "Water" },
      { q: "What time does the writer go to school?", choices: ["7", "8", "9", "10"], answer: "8" },
    ],
  },
  {
    jlpt: 5,
    title: "My family",
    text: "私の家族は五人です。父と母と兄と妹と私です。父は会社員です。母は先生です。兄は大学生です。妹は中学生です。",
    english: "My family has five people. Father, mother, older brother, younger sister, and me. Father is a company worker. Mother is a teacher. Older brother is a university student. Younger sister is a middle school student.",
    questions: [
      { q: "How many people are in the family?", choices: ["Four", "Five", "Six", "Seven"], answer: "Five" },
      { q: "What does the father do?", choices: ["Teacher", "Doctor", "Company worker", "Student"], answer: "Company worker" },
      { q: "What is the older brother?", choices: ["High school student", "University student", "Worker", "Middle school student"], answer: "University student" },
    ],
  },
  {
    jlpt: 5,
    title: "About hobbies",
    text: "私の趣味は本を読むことです。週末はいつも図書館に行きます。日本の小説が好きです。映画も好きです。",
    english: "My hobby is reading books. I always go to the library on weekends. I like Japanese novels. I also like movies.",
    questions: [
      { q: "What is the writer's hobby?", choices: ["Sports", "Music", "Reading", "Drawing"], answer: "Reading" },
      { q: "Where does the writer go on weekends?", choices: ["School", "Library", "Park", "Store"], answer: "Library" },
      { q: "What kind of novels does the writer like?", choices: ["English", "Japanese", "Chinese", "Korean"], answer: "Japanese" },
    ],
  },
  {
    jlpt: 5,
    title: "A short letter",
    text: "メアリーさん、こんにちは。お元気ですか。私は元気です。今日は日本語を勉強しました。明日も勉強します。じゃ、また。田中",
    english: "Hello Mary. How are you? I'm well. Today I studied Japanese. I'll study tomorrow too. See you. Tanaka.",
    questions: [
      { q: "Who is the letter to?", choices: ["Mary", "Tanaka", "Suzuki", "Yamada"], answer: "Mary" },
      { q: "What did the writer do today?", choices: ["Worked", "Studied Japanese", "Watched TV", "Went shopping"], answer: "Studied Japanese" },
      { q: "Who wrote the letter?", choices: ["Mary", "Tanaka", "Suzuki", "Yamada"], answer: "Tanaka" },
    ],
  },
  {
    jlpt: 5,
    title: "My room",
    text: "私の部屋はあまり大きくないです。机が一つあります。椅子も一つあります。窓は二つあります。本がたくさんあります。",
    english: "My room is not very big. There is one desk. There is also one chair. There are two windows. There are lots of books.",
    questions: [
      { q: "How big is the room?", choices: ["Very big", "Big", "Not very big", "Tiny"], answer: "Not very big" },
      { q: "How many windows are there?", choices: ["One", "Two", "Three", "Four"], answer: "Two" },
      { q: "What is there a lot of?", choices: ["Chairs", "Desks", "Windows", "Books"], answer: "Books" },
    ],
  },
  {
    jlpt: 5,
    title: "At a coffee shop",
    text: "私は毎日カフェに行きます。コーヒーが好きですから。いつもケーキも食べます。カフェで本も読みます。",
    english: "I go to a cafe every day. Because I like coffee. I always eat cake too. I also read books at the cafe.",
    questions: [
      { q: "How often does the writer go to the cafe?", choices: ["Sometimes", "Every week", "Every day", "Once a month"], answer: "Every day" },
      { q: "Why does the writer go?", choices: ["Likes coffee", "Likes cake", "Meets friends", "Studies"], answer: "Likes coffee" },
      { q: "What else does the writer do there?", choices: ["Watches TV", "Reads books", "Plays games", "Sleeps"], answer: "Reads books" },
    ],
  },
  {
    jlpt: 5,
    title: "Weekend",
    text: "土曜日は午前中に勉強します。午後は買い物に行きます。日曜日は友達と公園で遊びます。とても楽しいです。",
    english: "On Saturday morning I study. In the afternoon I go shopping. On Sunday I play with friends in the park. It's very fun.",
    questions: [
      { q: "What does the writer do on Saturday morning?", choices: ["Sleep", "Study", "Shop", "Play"], answer: "Study" },
      { q: "What does the writer do on Sunday?", choices: ["Study", "Shop", "Work", "Play in the park"], answer: "Play in the park" },
      { q: "How does the writer feel about the weekend?", choices: ["Tired", "Bored", "Fun", "Sad"], answer: "Fun" },
    ],
  },
  // ===== N4 =====
  {
    jlpt: 4,
    title: "Email about plans",
    text: "山田さん、お元気ですか。来週の土曜日、一緒に映画を見に行きませんか。新しいアニメ映画が始まったそうです。三時の回はどうですか。返事を待っています。田中",
    english: "Hello Yamada, how are you? Would you like to go see a movie together next Saturday? I heard a new anime movie just started. How about the 3 PM showing? Waiting for your reply. Tanaka.",
    questions: [
      { q: "What is the writer suggesting?", choices: ["Dinner", "Movie", "Shopping", "Walk"], answer: "Movie" },
      { q: "When?", choices: ["This Saturday", "Next Saturday", "Next Sunday", "Tonight"], answer: "Next Saturday" },
      { q: "What time?", choices: ["1 PM", "2 PM", "3 PM", "4 PM"], answer: "3 PM" },
      { q: "What kind of movie?", choices: ["Action", "Romance", "Anime", "Horror"], answer: "Anime" },
    ],
  },
  {
    jlpt: 4,
    title: "Recipe: Miso soup",
    text: "材料：豆腐、わかめ、味噌、だし。まずお湯を沸かします。次にだしを入れます。豆腐とわかめを入れます。最後に味噌を入れて、火を止めます。",
    english: "Ingredients: tofu, wakame, miso, dashi. First, boil water. Next, add dashi. Add tofu and wakame. Finally, add miso and turn off the heat.",
    questions: [
      { q: "What is the first step?", choices: ["Add miso", "Boil water", "Add tofu", "Add dashi"], answer: "Boil water" },
      { q: "What is the last step?", choices: ["Add miso", "Boil water", "Add tofu", "Cool the soup"], answer: "Add miso" },
      { q: "Which ingredient is NOT mentioned?", choices: ["Tofu", "Wakame", "Salt", "Miso"], answer: "Salt" },
    ],
  },
  {
    jlpt: 4,
    title: "Job posting",
    text: "コンビニのスタッフを募集しています。週三日、夕方六時から十時までです。日本語が話せる人。経験がなくても大丈夫です。時給は千百円です。",
    english: "Hiring convenience store staff. Three days a week, from 6 PM to 10 PM. Must speak Japanese. No experience needed. Hourly wage is 1,100 yen.",
    questions: [
      { q: "How many days a week?", choices: ["Two", "Three", "Four", "Five"], answer: "Three" },
      { q: "What time?", choices: ["6 PM to 10 PM", "10 AM to 6 PM", "Morning shift", "Night shift"], answer: "6 PM to 10 PM" },
      { q: "Is experience required?", choices: ["Yes, 1 year", "Yes, 3 years", "No", "Yes, in retail"], answer: "No" },
      { q: "What is the hourly wage?", choices: ["1,000 yen", "1,100 yen", "1,200 yen", "1,500 yen"], answer: "1,100 yen" },
    ],
  },
  {
    jlpt: 4,
    title: "Travel diary",
    text: "今日は京都に着きました。新幹線で東京から二時間半かかりました。ホテルは駅から歩いて五分のところにあります。明日は清水寺に行く予定です。",
    english: "Today I arrived in Kyoto. It took two and a half hours from Tokyo by Shinkansen. The hotel is a 5-minute walk from the station. Tomorrow I plan to go to Kiyomizu Temple.",
    questions: [
      { q: "Where did the writer go?", choices: ["Tokyo", "Kyoto", "Osaka", "Nara"], answer: "Kyoto" },
      { q: "How did they travel?", choices: ["Plane", "Car", "Shinkansen", "Bus"], answer: "Shinkansen" },
      { q: "How long is the walk from the station to the hotel?", choices: ["5 minutes", "10 minutes", "15 minutes", "30 minutes"], answer: "5 minutes" },
      { q: "Where will they go tomorrow?", choices: ["Kinkaku-ji", "Kiyomizu Temple", "Fushimi Inari", "Arashiyama"], answer: "Kiyomizu Temple" },
    ],
  },
  {
    jlpt: 4,
    title: "Notice at school",
    text: "学生の皆様へ。来週の月曜日、図書館は工事のため休館します。火曜日から金曜日までは普通通り開きます。本を借りたい人は早く返してください。",
    english: "To all students. Next Monday, the library will be closed due to construction. Tuesday through Friday it will be open as usual. Those who want to borrow books, please return them quickly.",
    questions: [
      { q: "When is the library closed?", choices: ["Monday", "Tuesday", "Wednesday", "Friday"], answer: "Monday" },
      { q: "Why is it closed?", choices: ["Holiday", "Construction", "Inventory", "Renovation"], answer: "Construction" },
      { q: "What should students do?", choices: ["Wait for the announcement", "Return books quickly", "Bring books home", "Not borrow books"], answer: "Return books quickly" },
    ],
  },
  // ===== N3 =====
  {
    jlpt: 3,
    title: "Environment article",
    text: "最近、地球温暖化が大きな問題になっています。私たち一人一人がエコバッグを使ったり、電気を節約したり、ゴミを分別したりすることが大切です。小さなことでも、続けることで地球を守ることができます。",
    english: "Recently, global warming has become a major problem. It is important for each of us to do things like using eco-bags, saving electricity, and sorting trash. Even small things, by continuing them, we can protect the Earth.",
    questions: [
      { q: "What is the main topic?", choices: ["Pollution", "Global warming", "Recycling", "Energy"], answer: "Global warming" },
      { q: "Which is NOT mentioned as something to do?", choices: ["Use eco-bags", "Save electricity", "Sort trash", "Plant trees"], answer: "Plant trees" },
      { q: "What is emphasized?", choices: ["Big changes", "Government action", "Continuing small things", "Technology"], answer: "Continuing small things" },
    ],
  },
  {
    jlpt: 3,
    title: "Book review",
    text: "この本は子どもの成長について書かれた小説です。主人公は小学生で、家族や友達と過ごす毎日が描かれています。読みやすい文章で、感動的な場面もたくさんありました。ぜひおすすめしたい一冊です。",
    english: "This book is a novel about a child's growth. The main character is an elementary school student, and the daily life with family and friends is depicted. The writing is easy to read, and there are many moving scenes. A book I highly recommend.",
    questions: [
      { q: "What kind of book is it?", choices: ["Mystery", "Romance", "Novel about growth", "History"], answer: "Novel about growth" },
      { q: "Who is the main character?", choices: ["A teacher", "An elementary school student", "A parent", "A college student"], answer: "An elementary school student" },
      { q: "How does the reviewer feel about it?", choices: ["Disappointed", "Recommends it", "Confused", "Bored"], answer: "Recommends it" },
    ],
  },
];

async function main() {
  console.log("Seeding listening + reading content…");

  let l = 0;
  for (const x of LISTENING) {
    const existing = await db.listeningExercise.findFirst({ where: { title: x.title, jlptLevel: x.jlpt } });
    const data = {
      jlptLevel: x.jlpt,
      title: x.title,
      transcript: x.transcript,
      english: x.english,
      questions: JSON.stringify(x.questions),
    };
    if (existing) await db.listeningExercise.update({ where: { id: existing.id }, data });
    else await db.listeningExercise.create({ data });
    l++;
  }
  console.log(`  ✓ ${l} listening exercises`);

  let r = 0;
  for (const x of READING) {
    const existing = await db.readingExercise.findFirst({ where: { title: x.title, jlptLevel: x.jlpt } });
    const data = {
      jlptLevel: x.jlpt,
      title: x.title,
      text: x.text,
      english: x.english,
      questions: JSON.stringify(x.questions),
    };
    if (existing) await db.readingExercise.update({ where: { id: existing.id }, data });
    else await db.readingExercise.create({ data });
    r++;
  }
  console.log(`  ✓ ${r} reading exercises`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
