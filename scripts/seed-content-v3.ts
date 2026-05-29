// Listening + reading v3: longer texts, thematic images, both EN/UK in one pass.
// Wipes old listening/reading and re-inserts.
// Run: npm run seed:content:v3
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type Q = { q: string; choices: string[]; answer: string };
type Bilingual = { en: string; uk: string };
type BilingualQ = { q: Bilingual; choices: { en: string; uk: string }[]; answer: Bilingual };

type Listening = { jlpt: number; title: Bilingual; transcript: string; english: Bilingual; imageUrl: string; questions: BilingualQ[] };
type Reading = { jlpt: number; title: Bilingual; text: string; english: Bilingual; imageUrl: string; questions: BilingualQ[] };

// Lorem Picsum — deterministic random photos by seed. Reliable, fast CDN.
// Each unique seed always returns the same image, so cards are stable across reloads.
const img = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed.replace(/[^a-z0-9-]/gi, "-"))}/1200/600`;

// ============================================================
// LISTENING
// ============================================================

const LISTENING: Listening[] = [
  // ===== N5 =====
  {
    jlpt: 5,
    title: { en: "Cherry blossoms in the park", uk: "Сакура в парку" },
    transcript: "わあ、桜がきれいですね。本当にきれいです。先週はまだ咲いていませんでしたよ。今日は天気もいいですから、花見をしましょう。お弁当を持ってきました。ありがとうございます。",
    english: {
      en: "Wow, the cherry blossoms are beautiful. Really beautiful. Last week they hadn't bloomed yet. Today the weather is nice too, so let's do hanami. I brought a bento. Thank you.",
      uk: "Ого, сакура яка гарна. Дійсно красива. Минулого тижня ще не цвіла. Сьогодні і погода гарна, тож робимо ханамі. Я приніс(ла) бенто. Дякую.",
    },
    imageUrl: img("sakura,cherry-blossom,japan"),
    questions: [
      { q: { en: "What state were the blossoms last week?", uk: "У якому стані була сакура минулого тижня?" }, choices: [
        { en: "In full bloom", uk: "У повному цвіту" },
        { en: "Hadn't bloomed yet", uk: "Ще не зацвіла" },
        { en: "Already fallen", uk: "Уже опала" },
        { en: "Half-bloomed", uk: "Наполовину" },
      ], answer: { en: "Hadn't bloomed yet", uk: "Ще не зацвіла" } },
      { q: { en: "What did one of them bring?", uk: "Що приніс один із них?" }, choices: [
        { en: "Drinks", uk: "Напої" },
        { en: "Bento", uk: "Бенто" },
        { en: "A blanket", uk: "Ковдру" },
        { en: "A camera", uk: "Камеру" },
      ], answer: { en: "Bento", uk: "Бенто" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Cat at home", uk: "Кіт удома" },
    transcript: "猫を飼っていますか。はい、二匹います。何色ですか。一匹は黒くて、もう一匹は白いです。名前は何ですか。黒い方はクロで、白い方はシロです。可愛いですね。",
    english: {
      en: "Do you keep cats? Yes, I have two. What color? One is black, the other is white. What are their names? The black one is Kuro, the white one is Shiro. How cute.",
      uk: "Тримаєш котів? Так, двох. Якого кольору? Один чорний, інший білий. Як їх звуть? Чорного звуть Куро, білу — Сіро. Які ж милі.",
    },
    imageUrl: img("cat,kitten,pet"),
    questions: [
      { q: { en: "How many cats?", uk: "Скільки котів?" }, choices: [
        { en: "One", uk: "Один" },
        { en: "Two", uk: "Два" },
        { en: "Three", uk: "Три" },
        { en: "None", uk: "Жодного" },
      ], answer: { en: "Two", uk: "Два" } },
      { q: { en: "Name of the black cat?", uk: "Як звати чорного кота?" }, choices: [
        { en: "Shiro", uk: "Сіро" },
        { en: "Kuro", uk: "Куро" },
        { en: "Mike", uk: "Майк" },
        { en: "Tama", uk: "Тама" },
      ], answer: { en: "Kuro", uk: "Куро" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Convenience store snack", uk: "Перекус у комбіні" },
    transcript: "いらっしゃいませ。このおにぎりとお茶をください。袋はいりますか。いいえ、大丈夫です。温めますか。はい、お願いします。少々お待ちください。",
    english: {
      en: "Welcome. Please give me this onigiri and tea. Need a bag? No, thanks. Should I heat it up? Yes, please. Just a moment.",
      uk: "Ласкаво просимо. Цей онігірі та чай, будь ласка. Пакет потрібен? Ні, дякую. Підігріти? Так, будь ласка. Хвилинку.",
    },
    imageUrl: img("japanese,convenience-store,onigiri"),
    questions: [
      { q: { en: "What is purchased?", uk: "Що купують?" }, choices: [
        { en: "Sandwich and coffee", uk: "Сендвіч і каву" },
        { en: "Onigiri and tea", uk: "Онігірі та чай" },
        { en: "Ramen and beer", uk: "Рамен і пиво" },
        { en: "Sushi and water", uk: "Суші та воду" },
      ], answer: { en: "Onigiri and tea", uk: "Онігірі та чай" } },
      { q: { en: "Does the customer want it heated?", uk: "Чи хоче покупець підігрів?" }, choices: [
        { en: "Yes", uk: "Так" },
        { en: "No", uk: "Ні" },
        { en: "Just the tea", uk: "Тільки чай" },
        { en: "Not sure", uk: "Не знає" },
      ], answer: { en: "Yes", uk: "Так" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Joining the tennis club", uk: "Вступ до тенісного клубу" },
    transcript: "テニス部に入りたいんですが。練習は週何回ですか。月曜日と水曜日と金曜日です。時間はどのくらいですか。放課後二時間ぐらいです。試合もありますか。はい、毎月一回ぐらい試合があります。",
    english: {
      en: "I'd like to join the tennis club. How many times a week is practice? Mondays, Wednesdays, and Fridays. How long? About two hours after school. Are there matches? Yes, about once a month.",
      uk: "Хочу вступити до тенісного клубу. Скільки разів на тиждень тренування? Понеділок, середа, п'ятниця. Скільки триває? Близько двох годин після уроків. Матчі є? Так, приблизно раз на місяць.",
    },
    imageUrl: img("tennis,sport,court"),
    questions: [
      { q: { en: "How many days a week?", uk: "Скільки днів на тиждень?" }, choices: [
        { en: "Two", uk: "Два" },
        { en: "Three", uk: "Три" },
        { en: "Four", uk: "Чотири" },
        { en: "Every day", uk: "Щодня" },
      ], answer: { en: "Three", uk: "Три" } },
      { q: { en: "How long is each session?", uk: "Скільки триває заняття?" }, choices: [
        { en: "1 hour", uk: "1 година" },
        { en: "2 hours", uk: "2 години" },
        { en: "3 hours", uk: "3 години" },
        { en: "All day", uk: "Цілий день" },
      ], answer: { en: "2 hours", uk: "2 години" } },
      { q: { en: "How often are matches?", uk: "Як часто матчі?" }, choices: [
        { en: "Weekly", uk: "Щотижня" },
        { en: "Once a month", uk: "Раз на місяць" },
        { en: "Yearly", uk: "Раз на рік" },
        { en: "Never", uk: "Ніколи" },
      ], answer: { en: "Once a month", uk: "Раз на місяць" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Birthday plans", uk: "Плани на день народження" },
    transcript: "明日は私の誕生日です。何かしますか。友達とケーキを食べます。それから映画を見に行きます。何の映画ですか。新しいアニメ映画です。とても楽しみです。プレゼントもありますよ。",
    english: {
      en: "Tomorrow is my birthday. Will you do anything? I'll eat cake with friends. Then go see a movie. What movie? A new anime. I'm really looking forward to it. There are presents too.",
      uk: "Завтра у мене день народження. Робитимеш щось? Поїм торт з друзями. Потім підемо в кіно. Який фільм? Нове аніме. Я в захваті. І подарунки будуть.",
    },
    imageUrl: img("birthday,cake,celebration"),
    questions: [
      { q: { en: "When is the birthday?", uk: "Коли день народження?" }, choices: [
        { en: "Today", uk: "Сьогодні" },
        { en: "Tomorrow", uk: "Завтра" },
        { en: "Next week", uk: "Наступного тижня" },
        { en: "Yesterday", uk: "Учора" },
      ], answer: { en: "Tomorrow", uk: "Завтра" } },
      { q: { en: "What kind of movie?", uk: "Який фільм?" }, choices: [
        { en: "Drama", uk: "Драма" },
        { en: "Anime", uk: "Аніме" },
        { en: "Comedy", uk: "Комедія" },
        { en: "Horror", uk: "Жахи" },
      ], answer: { en: "Anime", uk: "Аніме" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Beach memories", uk: "Спогади про море" },
    transcript: "夏休みは何をしましたか。家族と海に行きました。沖縄です。泳いだり、貝を集めたり、シュノーケリングをしたりしました。海の中には色々な魚がいて、本当に綺麗でした。とても楽しかったです。",
    english: {
      en: "What did you do during summer break? I went to the sea with family. Okinawa. We swam, collected shells, and snorkeled. There were various fish in the sea, really beautiful. It was very fun.",
      uk: "Що ти робив на літніх канікулах? Їздив на море з родиною. На Окінаву. Плавали, збирали мушлі, плавали з трубкою. У морі — різні риби, дуже красиво. Було дуже весело.",
    },
    imageUrl: img("okinawa,beach,sea"),
    questions: [
      { q: { en: "Where did they go?", uk: "Куди вони їздили?" }, choices: [
        { en: "Hokkaido", uk: "Хоккайдо" },
        { en: "Okinawa", uk: "Окінаву" },
        { en: "Tokyo Bay", uk: "Токійська затока" },
        { en: "Atami", uk: "Атамі" },
      ], answer: { en: "Okinawa", uk: "Окінаву" } },
      { q: { en: "Which activity is NOT mentioned?", uk: "Яка діяльність НЕ згадана?" }, choices: [
        { en: "Swimming", uk: "Плавання" },
        { en: "Snorkeling", uk: "Сноркелінг" },
        { en: "Collecting shells", uk: "Збір мушель" },
        { en: "Surfing", uk: "Серфінг" },
      ], answer: { en: "Surfing", uk: "Серфінг" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Favorite music", uk: "Улюблена музика" },
    transcript: "どんな音楽が好きですか。J-POPが好きです。最近よく聞いています。誰の歌が一番好きですか。あいみょんが一番好きです。コンサートにも行きたいです。",
    english: {
      en: "What kind of music do you like? I like J-pop. I listen to it often these days. Whose songs do you like best? I like Aimyon best. I want to go to a concert too.",
      uk: "Яку музику любиш? Люблю J-pop. Останнім часом часто слухаю. Чиї пісні подобаються найбільше? Найбільше — Айм'йон. Хочу і на концерт сходити.",
    },
    imageUrl: img("concert,music,jpop"),
    questions: [
      { q: { en: "What genre?", uk: "Який жанр?" }, choices: [
        { en: "Rock", uk: "Рок" },
        { en: "J-pop", uk: "J-pop" },
        { en: "Classical", uk: "Класика" },
        { en: "Jazz", uk: "Джаз" },
      ], answer: { en: "J-pop", uk: "J-pop" } },
      { q: { en: "What does the speaker want?", uk: "Чого хоче мовець?" }, choices: [
        { en: "Buy an album", uk: "Купити альбом" },
        { en: "Go to a concert", uk: "Сходити на концерт" },
        { en: "Learn an instrument", uk: "Вчити інструмент" },
        { en: "Meet the singer", uk: "Зустрітися зі співаком" },
      ], answer: { en: "Go to a concert", uk: "Сходити на концерт" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Cooking okonomiyaki", uk: "Готуємо окономіякі" },
    transcript: "今日はお好み焼きを作りましょう。まずキャベツを細かく切ってください。次に卵を入れます。小麦粉も入れて、よく混ぜます。フライパンで両面を焼きます。最後にソースとマヨネーズをかけて完成です。",
    english: {
      en: "Today let's make okonomiyaki. First, finely cut the cabbage. Next, add eggs. Add flour too and mix well. Fry both sides in a pan. Finally, pour sauce and mayonnaise on top. Done.",
      uk: "Сьогодні готуємо окономіякі. Спершу дрібно поріж капусту. Потім додаємо яйця. Додаємо борошно і добре перемішуємо. Смажимо з обох боків на сковорідці. Наприкінці поливаємо соусом і майонезом. Готово.",
    },
    imageUrl: img("okonomiyaki,japanese,cooking"),
    questions: [
      { q: { en: "First step?", uk: "Перший крок?" }, choices: [
        { en: "Beat eggs", uk: "Розбити яйця" },
        { en: "Cut cabbage finely", uk: "Дрібно порізати капусту" },
        { en: "Heat the pan", uk: "Розігріти сковорідку" },
        { en: "Mix flour", uk: "Змішати борошно" },
      ], answer: { en: "Cut cabbage finely", uk: "Дрібно порізати капусту" } },
      { q: { en: "What goes on top at the end?", uk: "Що зверху наприкінці?" }, choices: [
        { en: "Cheese", uk: "Сир" },
        { en: "Sauce and mayonnaise", uk: "Соус і майонез" },
        { en: "Soy sauce only", uk: "Лише соєвий соус" },
        { en: "Nothing", uk: "Нічого" },
      ], answer: { en: "Sauce and mayonnaise", uk: "Соус і майонез" } },
    ],
  },
  // ===== N4 =====
  {
    jlpt: 4,
    title: { en: "Office chat about hiking", uk: "Розмова в офісі про похід" },
    transcript: "週末はどうでしたか。山に登りました。富士山です。一日で頂上まで行けましたか。いいえ、二日かかりました。山小屋で一泊しました。朝日がとても綺麗で、頑張った甲斐がありました。今度一緒に登りませんか。",
    english: {
      en: "How was your weekend? I climbed a mountain — Mt. Fuji. Could you reach the summit in a day? No, it took two days. We stayed at a mountain hut one night. The sunrise was so beautiful — worth all the effort. Want to climb together next time?",
      uk: "Як вихідні? Піднявся на гору — Фудзі. За день дістався вершини? Ні, пішло два дні. Ночували у гірській хатинці. Світанок був неймовірний — вартий зусиль. Підемо разом наступного разу?",
    },
    imageUrl: img("mount-fuji,mountain,sunrise"),
    questions: [
      { q: { en: "Which mountain?", uk: "Яка гора?" }, choices: [
        { en: "Mt. Tateyama", uk: "Татеяма" },
        { en: "Mt. Fuji", uk: "Фудзі" },
        { en: "Mt. Aso", uk: "Асо" },
        { en: "Mt. Yarigatake", uk: "Яриґатаке" },
      ], answer: { en: "Mt. Fuji", uk: "Фудзі" } },
      { q: { en: "How long did the climb take?", uk: "Скільки тривав похід?" }, choices: [
        { en: "Half a day", uk: "Півдня" },
        { en: "One day", uk: "Один день" },
        { en: "Two days", uk: "Два дні" },
        { en: "Three days", uk: "Три дні" },
      ], answer: { en: "Two days", uk: "Два дні" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Pottery class chat", uk: "Розмова на уроці кераміки" },
    transcript: "趣味は何ですか。陶芸を始めたばかりです。難しいですか。最初は土を扱うのに苦労しました。でも今は楽しいです。先生がとても親切で、いつも丁寧に教えてくれます。今度、私の作品を見せましょうか。",
    english: {
      en: "What's your hobby? I just started pottery. Is it hard? At first I struggled handling the clay. But now it's fun. My teacher is very kind and always teaches carefully. Shall I show you my work next time?",
      uk: "Яке у тебе хобі? Нещодавно почав(ла) кераміку. Складно? Спочатку було важко з глиною. Але зараз цікаво. Викладач добрий і завжди ретельно пояснює. Показати тобі мої роботи якось?",
    },
    imageUrl: img("pottery,ceramics,clay"),
    questions: [
      { q: { en: "What was hard at first?", uk: "Що було складно спочатку?" }, choices: [
        { en: "Finding a studio", uk: "Знайти студію" },
        { en: "Handling the clay", uk: "Працювати з глиною" },
        { en: "Understanding the teacher", uk: "Зрозуміти викладача" },
        { en: "Buying tools", uk: "Купити інструменти" },
      ], answer: { en: "Handling the clay", uk: "Працювати з глиною" } },
      { q: { en: "How is the teacher?", uk: "Який викладач?" }, choices: [
        { en: "Strict", uk: "Суворий" },
        { en: "Kind and careful", uk: "Добрий і ретельний" },
        { en: "Busy", uk: "Зайнятий" },
        { en: "Inexperienced", uk: "Недосвідчений" },
      ], answer: { en: "Kind and careful", uk: "Добрий і ретельний" } },
    ],
  },
  // ===== N3 =====
  {
    jlpt: 3,
    title: { en: "Climate change discussion", uk: "Розмова про зміну клімату" },
    transcript: "最近、気候変動の影響がますます深刻になっていますね。本当に。日本でも夏が以前より暑くなっていると感じます。個人レベルでも何かできることはありますか。例えば、公共交通機関を使ったり、肉を減らしたり、家のエネルギーを節約したりすることが効果的だと言われています。小さな積み重ねが大事ですね。",
    english: {
      en: "Lately, the effects of climate change are becoming increasingly serious. Yes. I feel summers in Japan are getting hotter than before. Is there anything we can do as individuals? It's said that using public transport, reducing meat, and saving energy at home are effective. Small accumulated actions matter.",
      uk: "Останнім часом наслідки зміни клімату стають дедалі серйознішими. Так. Відчуваю, що літо в Японії стає спекотнішим. Чи можемо ми щось робити особисто? Кажуть, що ефективно — користуватися громадським транспортом, менше м'яса, економити енергію вдома. Малі накопичені дії — важливі.",
    },
    imageUrl: img("climate,environment,earth"),
    questions: [
      { q: { en: "What change in Japan is noticed?", uk: "Яку зміну в Японії помічають?" }, choices: [
        { en: "Colder winters", uk: "Холодніші зими" },
        { en: "Hotter summers", uk: "Спекотніші літа" },
        { en: "More rain", uk: "Більше дощу" },
        { en: "More earthquakes", uk: "Більше землетрусів" },
      ], answer: { en: "Hotter summers", uk: "Спекотніші літа" } },
      { q: { en: "What is the main message?", uk: "Який головний меседж?" }, choices: [
        { en: "Only governments can fix it", uk: "Це справа лише уряду" },
        { en: "Small actions accumulate", uk: "Малі дії накопичуються" },
        { en: "It's already too late", uk: "Вже надто пізно" },
        { en: "Technology will solve everything", uk: "Технології усе вирішать" },
      ], answer: { en: "Small actions accumulate", uk: "Малі дії накопичуються" } },
    ],
  },
];

// ============================================================
// READING — 15 entries with longer texts (200-400 chars JP) and images
// ============================================================

const READING: Reading[] = [
  // ===== N5 =====
  {
    jlpt: 5,
    title: { en: "About my town", uk: "Про моє місто" },
    text: "私の町は小さいです。人は多くないですが、自然がとても綺麗です。町の真ん中に大きい川があります。川の周りには桜の木がたくさんあります。春になると、町の人がみんな川のそばに集まります。お弁当を食べたり、写真を撮ったりします。秋には紅葉も綺麗です。山の色が赤や黄色に変わります。私はこの町が大好きです。静かで、空気が綺麗で、住みやすい場所です。",
    english: {
      en: "My town is small. There aren't many people, but nature is very beautiful. In the middle of town there's a big river. There are many cherry trees around it. When spring comes, everyone in town gathers by the river. They eat bento and take photos. Autumn maple leaves are pretty too. The mountains turn red and yellow. I love this town. It's quiet, the air is clean, and easy to live in.",
      uk: "Моє містечко мале. Людей небагато, але природа дуже красива. Посередині міста — велика річка. Навколо річки багато дерев сакури. Навесні всі мешканці збираються біля річки. Їдять бенто, фотографуються. Восени красиве і кленове листя. Гори стають червоними та жовтими. Я люблю своє місто. Тут тихо, чисте повітря, легко жити.",
    },
    imageUrl: img("japanese,countryside,river"),
    questions: [
      { q: { en: "How big is the town?", uk: "Яке за розміром містечко?" }, choices: [
        { en: "Very big", uk: "Дуже велике" },
        { en: "Small", uk: "Мале" },
        { en: "Medium", uk: "Середнє" },
        { en: "Huge", uk: "Величезне" },
      ], answer: { en: "Small", uk: "Мале" } },
      { q: { en: "What is in the middle of town?", uk: "Що посередині містечка?" }, choices: [
        { en: "A station", uk: "Станція" },
        { en: "A castle", uk: "Замок" },
        { en: "A big river", uk: "Велика річка" },
        { en: "A school", uk: "Школа" },
      ], answer: { en: "A big river", uk: "Велика річка" } },
      { q: { en: "What do people do in spring?", uk: "Що роблять люди навесні?" }, choices: [
        { en: "Climb mountains", uk: "Сходять на гори" },
        { en: "Stay home", uk: "Сидять удома" },
        { en: "Gather by the river", uk: "Збираються біля річки" },
        { en: "Go to school", uk: "Йдуть до школи" },
      ], answer: { en: "Gather by the river", uk: "Збираються біля річки" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Grandma's garden", uk: "Бабусин сад" },
    text: "祖母の家には小さな庭があります。庭にはトマト、きゅうり、なす、ピーマンなどの野菜が並んでいます。祖母は毎朝六時に起きて、庭に水をやります。夏になると、野菜がたくさんできます。祖母はその野菜で美味しい料理を作ります。トマトのサラダ、なすの煮物、きゅうりの漬物など、どれも本当に美味しいです。私も時々祖母を手伝いに行きます。土の匂いが好きです。",
    english: {
      en: "My grandmother's house has a small garden. In it grow tomatoes, cucumbers, eggplants, bell peppers, and more. Grandma gets up at 6 every morning to water it. In summer there are lots of vegetables. She cooks delicious dishes with them — tomato salad, simmered eggplant, cucumber pickles. All really tasty. I sometimes go help her. I love the smell of soil.",
      uk: "У бабусиному домі є невеликий сад. Там ростуть помідори, огірки, баклажани, перці тощо. Бабуся встає о шостій ранку і поливає сад. Влітку — багато овочів. Бабуся готує з них смачні страви: салат із помідорів, тушковані баклажани, мариновані огірки. Усе справді смачне. Я іноді допомагаю. Люблю запах землі.",
    },
    imageUrl: img("garden,vegetables,japan"),
    questions: [
      { q: { en: "What time does grandma get up?", uk: "О котрій встає бабуся?" }, choices: [
        { en: "5 AM", uk: "5 ранку" },
        { en: "6 AM", uk: "6 ранку" },
        { en: "7 AM", uk: "7 ранку" },
        { en: "8 AM", uk: "8 ранку" },
      ], answer: { en: "6 AM", uk: "6 ранку" } },
      { q: { en: "Which is NOT mentioned as a dish?", uk: "Яка страва НЕ згадується?" }, choices: [
        { en: "Tomato salad", uk: "Салат із помідорів" },
        { en: "Simmered eggplant", uk: "Тушковані баклажани" },
        { en: "Cucumber pickles", uk: "Мариновані огірки" },
        { en: "Pepper soup", uk: "Перцевий суп" },
      ], answer: { en: "Pepper soup", uk: "Перцевий суп" } },
      { q: { en: "What does the writer love?", uk: "Що любить автор?" }, choices: [
        { en: "Eating vegetables only", uk: "Тільки їсти овочі" },
        { en: "The smell of soil", uk: "Запах землі" },
        { en: "Working in the kitchen", uk: "Працювати на кухні" },
        { en: "Selling vegetables", uk: "Продавати овочі" },
      ], answer: { en: "The smell of soil", uk: "Запах землі" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Letter to a pen pal", uk: "Лист другу по листуванню" },
    text: "アンナさんへ。お元気ですか。私は元気です。日本では桜が咲き始めました。今週末は友達と一緒にお花見に行きます。お弁当も作りますよ。アンナさんの国の春はどうですか。日本に来たことはありますか。来年の春、一緒にお花見をしませんか。私の家に泊まってくださいね。返事を待っています。今度は写真も送ります。ゆうこ",
    english: {
      en: "To Anna. How are you? I'm well. Cherry blossoms have started blooming in Japan. This weekend I'm going hanami with friends. I'll make bento too. How is spring in your country? Have you ever been to Japan? Next spring, let's do hanami together. Please stay at my house. Waiting for your reply. I'll send photos next time. Yuko.",
      uk: "До Анни. Як справи? У мене все добре. У Японії почала цвісти сакура. Цих вихідних йду з друзями на ханамі. Зроблю і бенто. А як весна у твоїй країні? Чи була колись у Японії? Наступної весни — давай разом ханамі! Зупинися в мене. Чекаю відповіді. Цього разу пришлю і фото. Юко.",
    },
    imageUrl: img("letter,japan,sakura"),
    questions: [
      { q: { en: "Who wrote the letter?", uk: "Хто написав лист?" }, choices: [
        { en: "Yuko", uk: "Юко" },
        { en: "Anna", uk: "Анна" },
        { en: "Tomoko", uk: "Томоко" },
        { en: "Mary", uk: "Мері" },
      ], answer: { en: "Yuko", uk: "Юко" } },
      { q: { en: "What is the writer doing this weekend?", uk: "Що автор робитиме цих вихідних?" }, choices: [
        { en: "Studying", uk: "Вчитися" },
        { en: "Hanami with friends", uk: "Ханамі з друзями" },
        { en: "Visiting Anna", uk: "Гостювати в Анни" },
        { en: "Going to Tokyo", uk: "Їхати в Токіо" },
      ], answer: { en: "Hanami with friends", uk: "Ханамі з друзями" } },
      { q: { en: "What is the invitation for next spring?", uk: "На що запрошує наступної весни?" }, choices: [
        { en: "Wedding", uk: "Весілля" },
        { en: "Hanami together", uk: "Ханамі разом" },
        { en: "Concert", uk: "Концерт" },
        { en: "Cooking class", uk: "Кулінарний клас" },
      ], answer: { en: "Hanami together", uk: "Ханамі разом" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "My room", uk: "Моя кімната" },
    text: "私の部屋はあまり大きくないですが、とても気に入っています。机が一つあって、その上にパソコンと本がたくさん並んでいます。椅子も一つあります。窓は二つあって、朝はとても明るくなります。ベッドの隣に小さい本棚があります。本棚には漫画と小説が入っています。壁にはアニメのポスターを貼っています。一日のほとんどの時間をこの部屋で過ごします。",
    english: {
      en: "My room isn't very big, but I really like it. There's a desk with my PC and lots of books on it. There's also a chair. There are two windows, so it gets very bright in the morning. Next to the bed there's a small bookshelf with manga and novels. On the walls I've put anime posters. I spend most of my day in this room.",
      uk: "Моя кімната не дуже велика, але дуже подобається. Є один стіл, на ньому комп'ютер і багато книжок. Стілець теж один. Два вікна — зранку дуже світло. Біля ліжка — маленька книжкова шафа з мангою і романами. На стінах — постери з аніме. Більшу частину дня я проводжу в цій кімнаті.",
    },
    imageUrl: img("japanese,bedroom,desk"),
    questions: [
      { q: { en: "What's on the desk?", uk: "Що на столі?" }, choices: [
        { en: "A TV and games", uk: "Телевізор і ігри" },
        { en: "PC and books", uk: "Комп'ютер і книги" },
        { en: "A vase", uk: "Ваза" },
        { en: "Tools", uk: "Інструменти" },
      ], answer: { en: "PC and books", uk: "Комп'ютер і книги" } },
      { q: { en: "What's in the bookshelf?", uk: "Що на книжковій полиці?" }, choices: [
        { en: "Textbooks", uk: "Підручники" },
        { en: "Manga and novels", uk: "Манга і романи" },
        { en: "Cookbooks", uk: "Кулінарні книги" },
        { en: "Newspapers", uk: "Газети" },
      ], answer: { en: "Manga and novels", uk: "Манга і романи" } },
      { q: { en: "What's on the walls?", uk: "Що на стінах?" }, choices: [
        { en: "Paintings", uk: "Картини" },
        { en: "Anime posters", uk: "Постери з аніме" },
        { en: "Photos", uk: "Фото" },
        { en: "Nothing", uk: "Нічого" },
      ], answer: { en: "Anime posters", uk: "Постери з аніме" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "At a coffee shop", uk: "У кав'ярні" },
    text: "私は週末によくカフェに行きます。家から歩いて十分のところに、小さくて静かなカフェがあります。コーヒーが美味しくて、ケーキも種類が多いです。窓の近くの席が一番好きです。窓の外を見ながら、本を読むのが楽しいです。マスターはとても優しい人で、いつも挨拶してくれます。最近、新しいメニューが増えました。次は抹茶ラテを試してみたいです。",
    english: {
      en: "I often go to a cafe on weekends. Ten minutes' walk from my home there's a small, quiet cafe. The coffee is good and they have many kinds of cake. I like the seats near the window best. Looking outside while reading a book is fun. The owner is very kind and always greets me. Recently they added new menu items. Next I want to try the matcha latte.",
      uk: "На вихідних часто ходжу до кав'ярні. За 10 хвилин ходу від дому є невелика тиха кав'ярня. Кава смачна, тістечок багато. Найбільше люблю місця біля вікна. Цікаво читати книгу, дивлячись у вікно. Власник дуже добрий, завжди вітається. Останнім часом з'явилися нові пункти меню. Хочу спробувати маття-лате.",
    },
    imageUrl: img("japanese,coffee-shop,cafe"),
    questions: [
      { q: { en: "How far is the cafe?", uk: "Як далеко кав'ярня?" }, choices: [
        { en: "5 min walk", uk: "5 хв ходу" },
        { en: "10 min walk", uk: "10 хв ходу" },
        { en: "30 min walk", uk: "30 хв ходу" },
        { en: "1 hour walk", uk: "1 година ходу" },
      ], answer: { en: "10 min walk", uk: "10 хв ходу" } },
      { q: { en: "Where does the writer like to sit?", uk: "Де любить сидіти автор?" }, choices: [
        { en: "Near the door", uk: "Біля дверей" },
        { en: "Near the window", uk: "Біля вікна" },
        { en: "At the counter", uk: "За барною стійкою" },
        { en: "Outside", uk: "Знадвору" },
      ], answer: { en: "Near the window", uk: "Біля вікна" } },
      { q: { en: "What does the writer want to try?", uk: "Що автор хоче спробувати?" }, choices: [
        { en: "Espresso", uk: "Еспресо" },
        { en: "Matcha latte", uk: "Маття-лате" },
        { en: "Cheesecake", uk: "Чізкейк" },
        { en: "Hot chocolate", uk: "Гарячий шоколад" },
      ], answer: { en: "Matcha latte", uk: "Маття-лате" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "My friend Kenta", uk: "Мій друг Кента" },
    text: "私の友達のけんたさんは料理がとても上手です。特に和食を作るのが得意です。彼の家のキッチンには、たくさんの調味料が並んでいます。週末になると、けんたさんはよく友達を家に呼んでパーティーを開きます。みんなで食べて、話して、笑って、本当に楽しい時間です。来月は私の誕生日パーティーを彼の家でやるそうです。とても楽しみにしています。",
    english: {
      en: "My friend Kenta is very good at cooking. He's especially skilled at Japanese cuisine. In his kitchen there are many seasonings lined up. On weekends he often invites friends over for a party. We eat, talk, laugh — really fun times. Next month my birthday party will be at his house. I'm really looking forward to it.",
      uk: "Мій друг Кента дуже добре готує. Особливо вправний у японській кухні. У нього на кухні безліч приправ. На вихідних часто запрошує друзів на вечірку. Ми їмо, балакаємо, сміємося — справді весело. Наступного місяця моя вечірка з нагоди дня народження буде у нього. Дуже чекаю.",
    },
    imageUrl: img("japanese,cooking,kitchen"),
    questions: [
      { q: { en: "What is Kenta good at?", uk: "У чому Кента вправний?" }, choices: [
        { en: "Painting", uk: "Малюванні" },
        { en: "Cooking Japanese food", uk: "Готуванні японської їжі" },
        { en: "Singing", uk: "Співі" },
        { en: "Sports", uk: "Спорті" },
      ], answer: { en: "Cooking Japanese food", uk: "Готуванні японської їжі" } },
      { q: { en: "What is in his kitchen?", uk: "Що на його кухні?" }, choices: [
        { en: "Many cookbooks", uk: "Багато кулінарних книг" },
        { en: "Many seasonings", uk: "Багато приправ" },
        { en: "Antique pots", uk: "Антикварні каструлі" },
        { en: "Nothing special", uk: "Нічого особливого" },
      ], answer: { en: "Many seasonings", uk: "Багато приправ" } },
      { q: { en: "Where will the birthday be?", uk: "Де буде день народження?" }, choices: [
        { en: "At a restaurant", uk: "У ресторані" },
        { en: "At Kenta's house", uk: "У Кенти вдома" },
        { en: "At a park", uk: "У парку" },
        { en: "At work", uk: "На роботі" },
      ], answer: { en: "At Kenta's house", uk: "У Кенти вдома" } },
    ],
  },
  {
    jlpt: 5,
    title: { en: "School library", uk: "Шкільна бібліотека" },
    text: "私の学校の図書館はとても大きいです。本棚が二十以上あって、本の数は五万冊以上だそうです。一階には小説や絵本があります。二階には歴史や科学の本があります。三階は自習室になっています。試験の前は、たくさんの学生が三階で勉強しています。私も時々友達と一緒に行きます。図書館は朝九時から夜九時まで開いています。",
    english: {
      en: "My school library is very big. There are more than 20 bookshelves, and they say there are over 50,000 books. On the first floor are novels and picture books. On the second, history and science books. The third is a study room. Before exams, many students study there. I go sometimes with friends. The library is open from 9 AM to 9 PM.",
      uk: "Шкільна бібліотека дуже велика. Стелажів — понад 20, книг — кажуть, понад 50 000. На першому поверсі — романи і книжки з картинками. На другому — історія і наука. Третій поверх — кімната для самостійних занять. Перед іспитами там багато студентів. Я іноді ходжу з друзями. Бібліотека відчинена з 9:00 до 21:00.",
    },
    imageUrl: img("library,school,books"),
    questions: [
      { q: { en: "How many books?", uk: "Скільки книг?" }, choices: [
        { en: "5,000", uk: "5 000" },
        { en: "50,000+", uk: "понад 50 000" },
        { en: "500,000", uk: "500 000" },
        { en: "100", uk: "100" },
      ], answer: { en: "50,000+", uk: "понад 50 000" } },
      { q: { en: "What's on the third floor?", uk: "Що на третьому поверсі?" }, choices: [
        { en: "Novels", uk: "Романи" },
        { en: "History books", uk: "Книги з історії" },
        { en: "A study room", uk: "Кімната для самостійних занять" },
        { en: "Cafeteria", uk: "Кафетерій" },
      ], answer: { en: "A study room", uk: "Кімната для самостійних занять" } },
      { q: { en: "Library hours?", uk: "Години роботи?" }, choices: [
        { en: "8 AM to 5 PM", uk: "8:00 — 17:00" },
        { en: "9 AM to 9 PM", uk: "9:00 — 21:00" },
        { en: "24 hours", uk: "Цілодобово" },
        { en: "Only weekends", uk: "Лише вихідні" },
      ], answer: { en: "9 AM to 9 PM", uk: "9:00 — 21:00" } },
    ],
  },
  // ===== N4 =====
  {
    jlpt: 4,
    title: { en: "Email from old friend", uk: "Лист від старого друга" },
    text: "お久しぶりです。元気にしていますか。私は最近東京から大阪に引っ越しました。新しい仕事を始めたんです。最初は知らない街で不安でしたが、同僚が皆親切で、もう慣れてきました。新しい家は会社まで電車で二十分のところにあって、便利です。近くには美味しいたこ焼きの店もたくさんあります。今度大阪に遊びに来てくださいね。案内します。待っています。",
    english: {
      en: "Long time no see. Are you well? I recently moved from Tokyo to Osaka. Started a new job. At first I was anxious in an unfamiliar city, but my coworkers are all kind, and I've gotten used to it. My new place is 20 min by train from work — convenient. There are also lots of great takoyaki shops nearby. Come visit Osaka sometime — I'll show you around. Waiting.",
      uk: "Давно не бачилися. Як справи? Нещодавно переїхав із Токіо до Осаки. Почав нову роботу. Спочатку тривожно в незнайомому місті, але колеги добрі, і я вже звик. Нова квартира за 20 хвилин на потязі від роботи — зручно. Поряд багато ятків зі смачним такоякі. Приїжджай у гості до Осаки — покажу. Чекаю.",
    },
    imageUrl: img("osaka,japan,takoyaki"),
    questions: [
      { q: { en: "Where did the writer move from?", uk: "Звідки переїхав автор?" }, choices: [
        { en: "Osaka", uk: "Осака" },
        { en: "Tokyo", uk: "Токіо" },
        { en: "Kyoto", uk: "Кіото" },
        { en: "Nagoya", uk: "Наґоя" },
      ], answer: { en: "Tokyo", uk: "Токіо" } },
      { q: { en: "How are the coworkers?", uk: "Які колеги?" }, choices: [
        { en: "Cold", uk: "Холодні" },
        { en: "Kind", uk: "Добрі" },
        { en: "Distant", uk: "Відсторонені" },
        { en: "Loud", uk: "Гучні" },
      ], answer: { en: "Kind", uk: "Добрі" } },
      { q: { en: "What's near the new home?", uk: "Що поряд із новим домом?" }, choices: [
        { en: "Beaches", uk: "Пляжі" },
        { en: "Takoyaki shops", uk: "Ятки з такоякі" },
        { en: "Temples", uk: "Храми" },
        { en: "Office buildings", uk: "Офісні будівлі" },
      ], answer: { en: "Takoyaki shops", uk: "Ятки з такоякі" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Cherry blossom season", uk: "Сезон сакури" },
    text: "毎年三月から四月にかけて、日本中で桜が咲きます。北の方は遅く、南の方は早く咲きます。テレビでは「桜前線」という言葉をよく聞きます。これは桜が咲く地域の地図のことです。多くの人が公園でお花見をします。家族や友達と集まって、お弁当を食べたり、お酒を飲んだり、写真を撮ったりします。夜桜も人気で、ライトアップされた桜は昼とは違う美しさがあります。短い期間ですが、日本人にとって特別な季節です。",
    english: {
      en: "Every year from March to April, cherry blossoms bloom across Japan. They bloom later in the north and earlier in the south. On TV you often hear the term 'sakura zensen' — the map of regions where blossoms are blooming. Many people do hanami in parks. They gather with family and friends, eat bento, drink sake, take photos. Night sakura is also popular — illuminated, they have a beauty different from daytime. A short period, but a special season for Japanese people.",
      uk: "Щороку з березня по квітень по всій Японії цвіте сакура. На півночі — пізніше, на півдні — раніше. На ТБ часто чути «сакура зенсен» — це карта регіонів, де цвіте сакура. Багато людей роблять ханамі в парках. Збираються з родиною та друзями, їдять бенто, п'ють саке, фотографуються. Популярна і нічна сакура — підсвічена, вона має іншу красу. Короткий період, але особливий сезон для японців.",
    },
    imageUrl: img("sakura,hanami,japan-spring"),
    questions: [
      { q: { en: "Where do blossoms bloom first?", uk: "Де сакура цвіте першою?" }, choices: [
        { en: "North", uk: "На півночі" },
        { en: "South", uk: "На півдні" },
        { en: "Center", uk: "У центрі" },
        { en: "All at once", uk: "Усюди одночасно" },
      ], answer: { en: "South", uk: "На півдні" } },
      { q: { en: "What is 'sakura zensen'?", uk: "Що таке «сакура зенсен»?" }, choices: [
        { en: "A festival", uk: "Свято" },
        { en: "A map of blooming areas", uk: "Карта районів цвітіння" },
        { en: "A song", uk: "Пісня" },
        { en: "A type of cherry", uk: "Сорт вишні" },
      ], answer: { en: "A map of blooming areas", uk: "Карта районів цвітіння" } },
      { q: { en: "Why is night sakura special?", uk: "Чим особлива нічна сакура?" }, choices: [
        { en: "More people come", uk: "Приходить більше людей" },
        { en: "Illuminated, different beauty", uk: "Підсвічена, інша краса" },
        { en: "Free food", uk: "Безкоштовна їжа" },
        { en: "Live music", uk: "Жива музика" },
      ], answer: { en: "Illuminated, different beauty", uk: "Підсвічена, інша краса" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Summer festival notice", uk: "Оголошення про літнє свято" },
    text: "町内会からのお知らせです。八月十五日(土)、午後六時から駅前広場で夏祭りを行います。今年は屋台が三十軒以上出る予定です。やきとり、たこ焼き、かき氷など、美味しい食べ物がたくさんあります。午後八時からは盆踊りが始まり、九時から花火大会があります。子供連れの方は、迷子にならないように手をつないでください。浴衣を着てきてくださると嬉しいです。雨の場合は翌日に延期します。皆様のご来場をお待ちしております。",
    english: {
      en: "Notice from the neighborhood association. Saturday, August 15, from 6 PM at the station square, summer festival. This year over 30 food stalls are planned — yakitori, takoyaki, shaved ice, and more. Bon-odori dancing starts at 8 PM, fireworks at 9 PM. Please hold hands with children so they don't get lost. We'd be happy if you came in yukata. In case of rain, postponed to the next day. We look forward to seeing you.",
      uk: "Оголошення квартального комітету. У суботу 15 серпня з 18:00 на площі перед станцією — літнє свято. Цього року заплановано понад 30 яток: якіторі, такоякі, скуйовджений лід та інші смаколики. О 20:00 починається бон-одорі, о 21:00 — феєрверк. Тримайте дітей за руки, щоб не загубилися. Будемо раді, якщо прийдете в юкаті. У дощ — перенесемо на наступний день. Чекаємо всіх.",
    },
    imageUrl: img("japanese,summer-festival,fireworks"),
    questions: [
      { q: { en: "What time does the festival start?", uk: "О котрій починається свято?" }, choices: [
        { en: "5 PM", uk: "17:00" },
        { en: "6 PM", uk: "18:00" },
        { en: "7 PM", uk: "19:00" },
        { en: "8 PM", uk: "20:00" },
      ], answer: { en: "6 PM", uk: "18:00" } },
      { q: { en: "How many stalls?", uk: "Скільки яток?" }, choices: [
        { en: "About 10", uk: "Близько 10" },
        { en: "About 20", uk: "Близько 20" },
        { en: "30+", uk: "30+" },
        { en: "50+", uk: "50+" },
      ], answer: { en: "30+", uk: "30+" } },
      { q: { en: "What happens if it rains?", uk: "Що у разі дощу?" }, choices: [
        { en: "Canceled", uk: "Скасовано" },
        { en: "Postponed to next day", uk: "Перенесено на наступний день" },
        { en: "Moved indoors", uk: "Перенесено у приміщення" },
        { en: "Half held", uk: "Проведуть частково" },
      ], answer: { en: "Postponed to next day", uk: "Перенесено на наступний день" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Learning Japanese: my journey", uk: "Як я вивчаю японську" },
    text: "日本語を勉強し始めてもうすぐ三年になります。最初の頃はひらがなとカタカナを覚えるのに二ヶ月ぐらいかかりました。漢字は本当に難しくて、何度も諦めようと思いました。でも、毎日少しずつ続けたら、だんだん読めるようになりました。今では簡単なニュースなら辞書なしで読めます。アニメも字幕なしで半分ぐらい分かります。一番の楽しみは日本人の友達と日本語で話すことです。最初は単語しか言えませんでしたが、今は冗談も言えるようになりました。これからも続けたいです。",
    english: {
      en: "It's almost three years since I started studying Japanese. At first it took about two months to memorize hiragana and katakana. Kanji was really hard — I almost gave up many times. But by continuing little by little every day, I gradually became able to read. Now I can read simple news without a dictionary. With anime I understand about half without subtitles. My biggest joy is talking to Japanese friends in Japanese. At first I could only say single words, but now I can even make jokes. I want to keep going.",
      uk: "Вже майже три роки, як я почав вивчати японську. Спочатку запам'ятати хіраґану і катакану зайняло близько двох місяців. Канджі — справді складно, не раз думав здатися. Але потроху щодня — і поступово почав читати. Зараз прості новини читаю без словника. В аніме без субтитрів розумію приблизно половину. Найбільша радість — спілкуватися з японцями японською. Спочатку міг лише окремі слова, тепер навіть жартую. Хочу продовжувати.",
    },
    imageUrl: img("japanese,language,study"),
    questions: [
      { q: { en: "How long has the writer studied?", uk: "Як довго навчається автор?" }, choices: [
        { en: "1 year", uk: "1 рік" },
        { en: "2 years", uk: "2 роки" },
        { en: "Almost 3 years", uk: "Майже 3 роки" },
        { en: "5 years", uk: "5 років" },
      ], answer: { en: "Almost 3 years", uk: "Майже 3 роки" } },
      { q: { en: "What was the hardest?", uk: "Що було найскладніше?" }, choices: [
        { en: "Kana", uk: "Кана" },
        { en: "Kanji", uk: "Канджі" },
        { en: "Grammar", uk: "Граматика" },
        { en: "Pronunciation", uk: "Вимова" },
      ], answer: { en: "Kanji", uk: "Канджі" } },
      { q: { en: "What's the biggest joy now?", uk: "Що найбільша радість зараз?" }, choices: [
        { en: "Watching anime", uk: "Дивитися аніме" },
        { en: "Reading news", uk: "Читати новини" },
        { en: "Talking with Japanese friends", uk: "Спілкуватися з японцями" },
        { en: "Writing essays", uk: "Писати есеї" },
      ], answer: { en: "Talking with Japanese friends", uk: "Спілкуватися з японцями" } },
    ],
  },
  // ===== N3 =====
  {
    jlpt: 3,
    title: { en: "The art of the tea ceremony", uk: "Мистецтво чайної церемонії" },
    text: "茶道は、ただお茶を飲むだけのものではありません。客への心遣い、季節の感覚、道具の美しさなど、日本文化の精神が詰まっています。茶室に入る前には、必ず手と口を清めます。これは、心を落ち着けて、その瞬間に集中するための儀式です。茶碗の持ち方、お辞儀の角度、会話の内容まで、全てに意味があります。最近では、外国人観光客向けの体験教室も人気です。一度参加してみると、日本人でも新しい発見があるかもしれません。形式が厳しいと感じる人もいますが、その厳しさの中にこそ、自由と美しさが隠れているのです。",
    english: {
      en: "The tea ceremony is not just about drinking tea. It contains the spirit of Japanese culture — consideration for guests, sense of season, beauty of utensils. Before entering the tea room, you must purify your hands and mouth. This is a ritual to calm the mind and focus on the moment. From how you hold the bowl, to the angle of the bow, to the content of conversation — everything has meaning. Recently, experience classes for foreign tourists are popular. Even Japanese people might make new discoveries by trying once. Some find the formality strict, but freedom and beauty are hidden within that very strictness.",
      uk: "Чайна церемонія — це не лише про чай. У ній закладений дух японської культури: турбота про гостя, відчуття сезону, краса посуду. Перед входом до чайної кімнати треба очистити руки та рот. Це ритуал, щоб заспокоїти розум і зосередитися на моменті. Усе має значення — як тримати чашу, кут поклону, теми розмови. Останнім часом популярні майстер-класи для іноземних туристів. Спробувавши хоч раз, навіть японець може зробити для себе відкриття. Хтось вважає форму суворою, але саме в цій суворості ховаються свобода і краса.",
    },
    imageUrl: img("tea-ceremony,japan,matcha"),
    questions: [
      { q: { en: "What is the tea ceremony really about?", uk: "У чому суть чайної церемонії?" }, choices: [
        { en: "Drinking tea", uk: "Пиття чаю" },
        { en: "Spirit of Japanese culture", uk: "Дух японської культури" },
        { en: "Entertaining tourists", uk: "Розвага туристів" },
        { en: "A meditation technique", uk: "Техніка медитації" },
      ], answer: { en: "Spirit of Japanese culture", uk: "Дух японської культури" } },
      { q: { en: "What do you do before entering?", uk: "Що робиш перед входом?" }, choices: [
        { en: "Take off shoes only", uk: "Лише знімаєш взуття" },
        { en: "Purify hands and mouth", uk: "Очищаєш руки та рот" },
        { en: "Take a photo", uk: "Робиш фото" },
        { en: "Pay an entrance fee", uk: "Платиш за вхід" },
      ], answer: { en: "Purify hands and mouth", uk: "Очищаєш руки та рот" } },
      { q: { en: "What's hidden inside the strictness?", uk: "Що ховається в суворості?" }, choices: [
        { en: "Boredom", uk: "Нудьга" },
        { en: "Freedom and beauty", uk: "Свобода і краса" },
        { en: "Stress", uk: "Стрес" },
        { en: "Nothing", uk: "Нічого" },
      ], answer: { en: "Freedom and beauty", uk: "Свобода і краса" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Essay: moving from Tokyo to a small town", uk: "Есе: переїзд із Токіо в містечко" },
    text: "東京で十年暮らした後、地方の小さな町に引っ越しました。理由は、もっと自然に近い生活がしたかったからです。都会の便利さは確かに恋しいですが、自然に囲まれた生活には別の豊かさがあります。朝、鳥の声で目を覚まし、窓を開けると新鮮な空気が入ってきます。夜は星がたくさん見えて、東京では見えなかった天の川も見えます。近所の人たちは温かくて、すぐに名前を覚えてくれました。野菜をくれたり、お祭りに誘ってくれたりします。スーパーまでは車で二十分かかりますが、それも慣れました。どちらが正解ということはありません。自分にとって何が大切かを考える時間でした。",
    english: {
      en: "After living in Tokyo for 10 years, I moved to a small country town. The reason was I wanted a life closer to nature. I do miss the city's convenience, but life surrounded by nature has a different richness. I wake to the sound of birds in the morning, and fresh air comes in when I open the window. At night I can see many stars — even the Milky Way, which I couldn't see in Tokyo. The neighbors are warm and remembered my name quickly. They give me vegetables, invite me to festivals. It takes 20 minutes by car to a supermarket, but I've gotten used to that too. There's no right answer. It was a time to think about what truly matters to me.",
      uk: "Після 10 років у Токіо я переїхав у мале містечко. Хотів життя ближче до природи. Так, мені бракує зручності міста, але життя в природі має іншу повноту. Зранку прокидаюся під спів птахів, відчиняю вікно — заходить свіже повітря. Вночі видно багато зірок, навіть Чумацький Шлях, якого в Токіо не було. Сусіди теплі, швидко запам'ятали моє ім'я. Дають овочі, кличуть на свята. До супермаркету — 20 хвилин машиною, але я звик. Тут немає правильної відповіді. Це був час подумати, що для мене дійсно важливо.",
    },
    imageUrl: img("japanese,village,countryside"),
    questions: [
      { q: { en: "How long did the writer live in Tokyo?", uk: "Скільки років автор жив у Токіо?" }, choices: [
        { en: "5 years", uk: "5 років" },
        { en: "10 years", uk: "10 років" },
        { en: "15 years", uk: "15 років" },
        { en: "20 years", uk: "20 років" },
      ], answer: { en: "10 years", uk: "10 років" } },
      { q: { en: "What can be seen now that couldn't before?", uk: "Що тепер видно, чого не було видно?" }, choices: [
        { en: "Cherry trees", uk: "Сакура" },
        { en: "The Milky Way", uk: "Чумацький Шлях" },
        { en: "Snow", uk: "Сніг" },
        { en: "Fireflies", uk: "Світлячки" },
      ], answer: { en: "The Milky Way", uk: "Чумацький Шлях" } },
      { q: { en: "How are the neighbors?", uk: "Які сусіди?" }, choices: [
        { en: "Distant", uk: "Відсторонені" },
        { en: "Warm", uk: "Теплі" },
        { en: "Noisy", uk: "Гучні" },
        { en: "Suspicious", uk: "Підозрілі" },
      ], answer: { en: "Warm", uk: "Теплі" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Working from home, one year later", uk: "Рік роботи з дому" },
    text: "コロナをきっかけに、私の会社では在宅勤務が一般的になりました。最初は環境が整っていなくて、家のテーブルでパソコンを使うのは大変でした。だんだん椅子や机を整え、ヘッドホンも買って、仕事がしやすい空間を作りました。通勤時間がなくなったので、朝の時間に余裕ができ、運動する習慣もつきました。一方で、同僚と直接会わないので、ちょっとした雑談ができないのが寂しいです。週に一回はオフィスに行くようにしていますが、それでも難しい問題は対面で話した方が早いと感じます。完全な答えはありませんが、新しい働き方は確実に定着してきていると思います。",
    english: {
      en: "Because of COVID, remote work became common at my company. At first the setup wasn't ready and using the laptop at the kitchen table was hard. Gradually I got a proper chair, desk, and headphones — built a comfortable workspace. With no commute, I have extra morning time and even built an exercise habit. On the other hand, since I don't meet coworkers in person, I miss casual chats. I try to go to the office once a week, but for tricky problems face-to-face is still faster. There's no complete answer, but I think this new way of working is here to stay.",
      uk: "Через COVID у нашій компанії віддалена робота стала звичайною. Спочатку обладнання не вистачало, працювати з ноутбуком на кухонному столі було складно. Поступово купив крісло, стіл, навушники — облаштував зручний простір. Без поїздок з'явився час уранці, виробилася звичка займатися спортом. З іншого боку, не бачу колег наживо — бракує невимушених розмов. Раз на тиждень намагаюся ходити в офіс, але для складних питань очна розмова все одно швидша. Повної відповіді немає, але цей формат, гадаю, тут надовго.",
    },
    imageUrl: img("remote-work,home-office,laptop"),
    questions: [
      { q: { en: "What triggered remote work?", uk: "Що спричинило перехід на дистанційку?" }, choices: [
        { en: "Earthquake", uk: "Землетрус" },
        { en: "COVID", uk: "COVID" },
        { en: "Company restructure", uk: "Реструктуризація компанії" },
        { en: "Office renovation", uk: "Ремонт офісу" },
      ], answer: { en: "COVID", uk: "COVID" } },
      { q: { en: "What habit did the writer build?", uk: "Яку звичку виробив автор?" }, choices: [
        { en: "Reading more", uk: "Більше читати" },
        { en: "Exercising", uk: "Займатися спортом" },
        { en: "Cooking elaborate meals", uk: "Готувати складні страви" },
        { en: "Sleeping more", uk: "Більше спати" },
      ], answer: { en: "Exercising", uk: "Займатися спортом" } },
      { q: { en: "What does the writer miss?", uk: "За чим скучає автор?" }, choices: [
        { en: "Strict deadlines", uk: "Жорсткими дедлайнами" },
        { en: "Casual chats with coworkers", uk: "Розмовами з колегами" },
        { en: "Long meetings", uk: "Довгими нарадами" },
        { en: "The office cafeteria", uk: "Офісним кафетерієм" },
      ], answer: { en: "Casual chats with coworkers", uk: "Розмовами з колегами" } },
    ],
  },
];

async function main() {
  console.log("Replacing listening + reading with v3 (long texts + images)…");
  const oldL = await db.listeningExercise.count();
  const oldR = await db.readingExercise.count();
  await db.listeningExercise.deleteMany({});
  await db.readingExercise.deleteMany({});
  console.log(`  ✗ Removed ${oldL} listening + ${oldR} reading entries`);

  let l = 0;
  for (const x of LISTENING) {
    const qEn: Q[] = x.questions.map((q) => ({ q: q.q.en, choices: q.choices.map((c) => c.en), answer: q.answer.en }));
    const qUk: Q[] = x.questions.map((q) => ({ q: q.q.uk, choices: q.choices.map((c) => c.uk), answer: q.answer.uk }));
    await db.listeningExercise.create({
      data: {
        jlptLevel: x.jlpt,
        title: x.title.en, titleUk: x.title.uk,
        transcript: x.transcript,
        english: x.english.en, englishUk: x.english.uk,
        imageUrl: x.imageUrl,
        questions: JSON.stringify(qEn), questionsUk: JSON.stringify(qUk),
      },
    });
    l++;
  }
  console.log(`  ✓ ${l} listening exercises`);

  let r = 0;
  for (const x of READING) {
    const qEn: Q[] = x.questions.map((q) => ({ q: q.q.en, choices: q.choices.map((c) => c.en), answer: q.answer.en }));
    const qUk: Q[] = x.questions.map((q) => ({ q: q.q.uk, choices: q.choices.map((c) => c.uk), answer: q.answer.uk }));
    await db.readingExercise.create({
      data: {
        jlptLevel: x.jlpt,
        title: x.title.en, titleUk: x.title.uk,
        text: x.text,
        english: x.english.en, englishUk: x.english.uk,
        imageUrl: x.imageUrl,
        questions: JSON.stringify(qEn), questionsUk: JSON.stringify(qUk),
      },
    });
    r++;
  }
  console.log(`  ✓ ${r} reading exercises`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
