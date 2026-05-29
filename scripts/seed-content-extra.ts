// Additive listening + reading exercises (N4/N3 expansion).
// Idempotent: deletes existing entries matching the new titles first.
// Run: npm run seed:content:extra
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type Q = { q: string; choices: string[]; answer: string };
type Bilingual = { en: string; uk: string };
type BilingualQ = { q: Bilingual; choices: Bilingual[]; answer: Bilingual };

type Listening = { jlpt: number; title: Bilingual; transcript: string; english: Bilingual; imageUrl: string; questions: BilingualQ[] };
type Reading = { jlpt: number; title: Bilingual; text: string; english: Bilingual; imageUrl: string; questions: BilingualQ[] };

const img = (seed: string) => `https://picsum.photos/seed/${encodeURIComponent(seed.replace(/[^a-z0-9-]/gi, "-"))}/1200/600`;

// ============================================================
// LISTENING — 5 N4 + 5 N3
// ============================================================
const LISTENING: Listening[] = [
  // ===== N4 =====
  {
    jlpt: 4,
    title: { en: "Ordering at a restaurant", uk: "Замовлення в ресторані" },
    transcript: "すみません、メニューをお願いします。はい、こちらです。何がおすすめですか。今日のおすすめは焼き魚定食です。じゃあ、それを二つください。お飲み物はいかがですか。お茶を二つ、お願いします。",
    english: {
      en: "Excuse me, the menu please. Yes, here you are. What do you recommend? Today's recommendation is the grilled fish set. Then, two of those please. How about drinks? Two teas, please.",
      uk: "Перепрошую, меню, будь ласка. Так, ось. Що порекомендуєте? Сьогодні рекомендуємо сет із смаженою рибою. Тоді, дві штуки, будь ласка. А напої? Два чаї, будь ласка.",
    },
    imageUrl: img("japanese-restaurant-set-meal"),
    questions: [
      { q: { en: "What did they order?", uk: "Що замовили?" }, choices: [
        { en: "Sushi", uk: "Суші" },
        { en: "Grilled fish set", uk: "Сет зі смаженою рибою" },
        { en: "Ramen", uk: "Рамен" },
        { en: "Tempura", uk: "Темпуру" },
      ], answer: { en: "Grilled fish set", uk: "Сет зі смаженою рибою" } },
      { q: { en: "What drink did they choose?", uk: "Який напій обрали?" }, choices: [
        { en: "Coffee", uk: "Каву" },
        { en: "Beer", uk: "Пиво" },
        { en: "Tea", uk: "Чай" },
        { en: "Water", uk: "Воду" },
      ], answer: { en: "Tea", uk: "Чай" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Asking for directions", uk: "Запитання дороги" },
    transcript: "あのう、すみません。駅はどこですか。駅ですか。この道をまっすぐ行ってください。それから、二つ目の信号を右に曲がります。歩いて十分くらいです。ありがとうございました。",
    english: {
      en: "Um, excuse me. Where is the station? The station? Go straight down this street. Then, turn right at the second traffic light. It's about ten minutes on foot. Thank you.",
      uk: "Перепрошую. Де станція? Станція? Йдіть прямо цією вулицею. Потім поверніть праворуч на другому світлофорі. Десь десять хвилин пішки. Дякую.",
    },
    imageUrl: img("street-signs-tokyo"),
    questions: [
      { q: { en: "Where should they turn right?", uk: "Де треба повернути праворуч?" }, choices: [
        { en: "At the first traffic light", uk: "На першому світлофорі" },
        { en: "At the second traffic light", uk: "На другому світлофорі" },
        { en: "At the convenience store", uk: "У комбіні" },
        { en: "At the bridge", uk: "Біля моста" },
      ], answer: { en: "At the second traffic light", uk: "На другому світлофорі" } },
      { q: { en: "How long does it take?", uk: "Скільки часу займе?" }, choices: [
        { en: "About 5 minutes", uk: "Близько 5 хвилин" },
        { en: "About 10 minutes", uk: "Близько 10 хвилин" },
        { en: "About 20 minutes", uk: "Близько 20 хвилин" },
        { en: "About 30 minutes", uk: "Близько 30 хвилин" },
      ], answer: { en: "About 10 minutes", uk: "Близько 10 хвилин" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Visiting the doctor", uk: "Візит до лікаря" },
    transcript: "どうしましたか。三日前から頭が痛くて、熱もあります。喉も痛いですか。はい、少し。風邪ですね。薬を出しますから、よく休んでください。それから、水をたくさん飲んでください。",
    english: {
      en: "What's wrong? My head has hurt for three days, and I have a fever. Is your throat sore too? Yes, a little. It's a cold. I'll prescribe medicine, so please rest well. Also, drink plenty of water.",
      uk: "Що сталося? Три дні болить голова, і температура. Горло теж болить? Так, трохи. Це застуда. Випишу ліки, відпочивайте добре. І пийте багато води.",
    },
    imageUrl: img("doctor-clinic-japan"),
    questions: [
      { q: { en: "How long has the headache lasted?", uk: "Як довго болить голова?" }, choices: [
        { en: "1 day", uk: "1 день" },
        { en: "3 days", uk: "3 дні" },
        { en: "1 week", uk: "1 тиждень" },
        { en: "2 weeks", uk: "2 тижні" },
      ], answer: { en: "3 days", uk: "3 дні" } },
      { q: { en: "What advice did the doctor give besides medicine?", uk: "Яку пораду дав лікар окрім ліків?" }, choices: [
        { en: "Exercise more", uk: "Більше займатись спортом" },
        { en: "Rest and drink water", uk: "Відпочивати і пити воду" },
        { en: "Eat spicy food", uk: "Їсти гостру їжу" },
        { en: "Take a bath", uk: "Прийняти ванну" },
      ], answer: { en: "Rest and drink water", uk: "Відпочивати і пити воду" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Weekend plans", uk: "Плани на вихідні" },
    transcript: "週末は何をしますか。土曜日は友達と映画を見に行く予定です。何の映画ですか。新しいアニメ映画です。日曜日は家でゆっくりします。いいですね。私も今度行きたいです。",
    english: {
      en: "What are you doing this weekend? On Saturday I'm planning to go watch a movie with friends. What movie? A new anime movie. On Sunday I'll relax at home. That sounds nice. I want to go next time too.",
      uk: "Що робиш на вихідні? У суботу планую піти з друзями в кіно. Який фільм? Новий аніме-фільм. У неділю буду відпочивати вдома. Звучить добре. Я теж хочу піти наступного разу.",
    },
    imageUrl: img("cinema-friends-weekend"),
    questions: [
      { q: { en: "What is the speaker doing on Saturday?", uk: "Що мовець робить у суботу?" }, choices: [
        { en: "Studying", uk: "Вчиться" },
        { en: "Going to a movie", uk: "Йде в кіно" },
        { en: "Working overtime", uk: "Працює понаднормово" },
        { en: "Visiting family", uk: "Відвідує родину" },
      ], answer: { en: "Going to a movie", uk: "Йде в кіно" } },
      { q: { en: "What kind of movie?", uk: "Який це фільм?" }, choices: [
        { en: "Horror", uk: "Жахи" },
        { en: "Anime", uk: "Аніме" },
        { en: "Romance", uk: "Романтика" },
        { en: "Documentary", uk: "Документальний" },
      ], answer: { en: "Anime", uk: "Аніме" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Lost item at the station", uk: "Загублена річ на станції" },
    transcript: "すみません、電車にかばんを忘れました。どんなかばんですか。黒くて、大きいです。中に何が入っていますか。財布と本が入っています。少々お待ちください。確認します。",
    english: {
      en: "Excuse me, I forgot my bag on the train. What kind of bag? Black and big. What's inside? A wallet and a book. Please wait a moment. I'll check.",
      uk: "Перепрошую, забув сумку в потязі. Яка сумка? Чорна, велика. Що всередині? Гаманець і книга. Зачекайте, будь ласка. Перевірю.",
    },
    imageUrl: img("station-lost-and-found"),
    questions: [
      { q: { en: "Where was the bag forgotten?", uk: "Де забули сумку?" }, choices: [
        { en: "On a bus", uk: "В автобусі" },
        { en: "On a train", uk: "У потязі" },
        { en: "At a cafe", uk: "У кафе" },
        { en: "At work", uk: "На роботі" },
      ], answer: { en: "On a train", uk: "У потязі" } },
      { q: { en: "What's inside the bag?", uk: "Що в сумці?" }, choices: [
        { en: "Phone and keys", uk: "Телефон і ключі" },
        { en: "Wallet and book", uk: "Гаманець і книга" },
        { en: "Laptop", uk: "Ноутбук" },
        { en: "Camera", uk: "Камера" },
      ], answer: { en: "Wallet and book", uk: "Гаманець і книга" } },
    ],
  },

  // ===== N3 =====
  {
    jlpt: 3,
    title: { en: "Train delay announcement", uk: "Оголошення про затримку потяга" },
    transcript: "ご案内いたします。本日、強い雨の影響で、山手線は約二十分遅れて運行しております。お客様にはご迷惑をおかけしますが、ご了承ください。最新の運行情報はホームページでご確認ください。",
    english: {
      en: "We make the following announcement. Today, due to heavy rain, the Yamanote Line is operating with a delay of about twenty minutes. We apologize for the inconvenience and ask for your understanding. Please check the website for the latest operating information.",
      uk: "Робимо оголошення. Сьогодні через сильний дощ лінія Яманоте затримується приблизно на двадцять хвилин. Просимо вибачення за незручності. Перевіряйте останню інформацію на сайті.",
    },
    imageUrl: img("yamanote-train-delay"),
    questions: [
      { q: { en: "What caused the delay?", uk: "Що спричинило затримку?" }, choices: [
        { en: "An accident", uk: "Аварія" },
        { en: "Heavy rain", uk: "Сильний дощ" },
        { en: "A signal failure", uk: "Збій сигналу" },
        { en: "Construction", uk: "Будівництво" },
      ], answer: { en: "Heavy rain", uk: "Сильний дощ" } },
      { q: { en: "How long is the delay?", uk: "Яка тривалість затримки?" }, choices: [
        { en: "About 5 minutes", uk: "Близько 5 хвилин" },
        { en: "About 10 minutes", uk: "Близько 10 хвилин" },
        { en: "About 20 minutes", uk: "Близько 20 хвилин" },
        { en: "About 1 hour", uk: "Близько 1 години" },
      ], answer: { en: "About 20 minutes", uk: "Близько 20 хвилин" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Apartment hunting", uk: "Пошук квартири" },
    transcript: "駅から近くて、家賃が安い部屋を探しています。新築でなくても構いません。一人暮らしですから、ワンルームで十分です。日当たりがいい部屋がいいですね。ペットを飼っても大丈夫ですか。残念ながら、この物件はペット不可です。",
    english: {
      en: "I'm looking for a room close to the station with cheap rent. It doesn't have to be new. Since I live alone, a studio is enough. A sunny room would be nice. Is it okay to keep pets? Unfortunately, this property doesn't allow pets.",
      uk: "Шукаю кімнату близько до станції з невисокою орендою. Не обов'язково новобудова. Живу сам, тому однокімнатної досить. Бажано сонячну. Можна тримати тварин? На жаль, у цій квартирі тварини заборонені.",
    },
    imageUrl: img("japanese-apartment-tokyo"),
    questions: [
      { q: { en: "What type of place is the person looking for?", uk: "Який тип житла шукає?" }, choices: [
        { en: "A house", uk: "Будинок" },
        { en: "A studio (one-room) apartment", uk: "Однокімнатну квартиру" },
        { en: "A two-bedroom apartment", uk: "Двокімнатну квартиру" },
        { en: "A shared house", uk: "Спільне житло" },
      ], answer: { en: "A studio (one-room) apartment", uk: "Однокімнатну квартиру" } },
      { q: { en: "What's the problem with this property?", uk: "Що не так з цією квартирою?" }, choices: [
        { en: "Too expensive", uk: "Занадто дорога" },
        { en: "Too far from the station", uk: "Далеко від станції" },
        { en: "No pets allowed", uk: "Тварини заборонені" },
        { en: "Too dark", uk: "Занадто темна" },
      ], answer: { en: "No pets allowed", uk: "Тварини заборонені" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Job interview", uk: "Співбесіда на роботу" },
    transcript: "なぜ当社を志望されましたか。御社の環境への取り組みに感銘を受けました。私も大学で環境について学びました。前の会社ではどんな仕事をしていましたか。営業を三年間担当して、新しいお客様を増やしました。素晴らしいですね。チームワークについてはどう思いますか。一人では限界がありますから、協力が大切だと思います。",
    english: {
      en: "Why did you apply to our company? I was impressed by your company's environmental initiatives. I also studied the environment at university. What kind of work did you do at your previous company? I was in charge of sales for three years and increased new customers. Wonderful. What do you think about teamwork? There are limits when working alone, so cooperation is important.",
      uk: "Чому ви подали заявку до нас? Мене вразили екологічні ініціативи вашої компанії. Я теж вивчала екологію в університеті. Чим займалися на попередній роботі? Три роки відповідала за продажі та збільшила кількість нових клієнтів. Чудово. Що думаєте про командну роботу? Поодинці є обмеження, тому співпраця важлива.",
    },
    imageUrl: img("job-interview-office-japan"),
    questions: [
      { q: { en: "What impressed the candidate about the company?", uk: "Що вразило кандидата в компанії?" }, choices: [
        { en: "Salary", uk: "Зарплата" },
        { en: "Environmental initiatives", uk: "Екологічні ініціативи" },
        { en: "Famous founder", uk: "Відомий засновник" },
        { en: "Office location", uk: "Розташування офісу" },
      ], answer: { en: "Environmental initiatives", uk: "Екологічні ініціативи" } },
      { q: { en: "What does the candidate value about work?", uk: "Що цінує кандидат у роботі?" }, choices: [
        { en: "Working alone", uk: "Роботу поодинці" },
        { en: "Cooperation", uk: "Співпрацю" },
        { en: "Strict rules", uk: "Жорсткі правила" },
        { en: "High pay", uk: "Високу оплату" },
      ], answer: { en: "Cooperation", uk: "Співпрацю" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "News: economic recovery", uk: "Новини: економічне відновлення" },
    transcript: "経済ニュースをお伝えします。今月の調査によると、国内の観光業はようやく回復し始めました。特に外国人観光客の数は去年と比べて三十パーセント増えています。一方、地方の小さな店は依然として厳しい状況が続いています。政府は中小企業への支援を強化する方針です。",
    english: {
      en: "We bring you economic news. According to this month's survey, domestic tourism has finally started to recover. In particular, the number of foreign tourists has increased by 30 percent compared to last year. On the other hand, small shops in rural areas continue to face difficult conditions. The government plans to strengthen support for small and medium-sized businesses.",
      uk: "Передаємо економічні новини. За цьогомісячним опитуванням, внутрішній туризм нарешті почав відновлюватися. Зокрема, кількість іноземних туристів зросла на 30 відсотків порівняно з минулим роком. Водночас малі магазини у сільській місцевості залишаються в скрутному становищі. Уряд планує посилити підтримку малого та середнього бізнесу.",
    },
    imageUrl: img("news-economy-japan"),
    questions: [
      { q: { en: "By how much did foreign tourists increase?", uk: "На скільки зросла кількість іноземних туристів?" }, choices: [
        { en: "10%", uk: "10%" },
        { en: "20%", uk: "20%" },
        { en: "30%", uk: "30%" },
        { en: "50%", uk: "50%" },
      ], answer: { en: "30%", uk: "30%" } },
      { q: { en: "Who is still struggling?", uk: "Хто все ще страждає?" }, choices: [
        { en: "Large hotels", uk: "Великі готелі" },
        { en: "Small rural shops", uk: "Малі магазини в селах" },
        { en: "Airlines", uk: "Авіакомпанії" },
        { en: "Theme parks", uk: "Тематичні парки" },
      ], answer: { en: "Small rural shops", uk: "Малі магазини в селах" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Planning a trip with a friend", uk: "Планування подорожі з другом" },
    transcript: "夏休みに京都に行こうと思っているんだけど、一緒に行かない？いいね、行きたい。何日くらいの予定？三泊四日かな。お寺を回って、夜は祇園を散歩したい。じゃあ宿はどうする？できれば伝統的な旅館に泊まりたい。少し高くなるけど、せっかくだから経験してみたいね。",
    english: {
      en: "I'm thinking of going to Kyoto during summer break — want to come along? Sounds great, I'd love to go. How many days? Probably four days, three nights. I want to visit temples and walk around Gion in the evening. So what about lodging? If possible I'd like to stay at a traditional ryokan. It'll be a bit pricey, but since we're going, we should experience it.",
      uk: "Думаю поїхати в Кіото на літніх канікулах — підеш зі мною? Звучить чудово, хочу поїхати. На скільки днів? Чотири дні, три ночі. Хочу обійти храми, а ввечері прогулятись Ґіоном. А готель? Якщо можна — традиційний рьокан. Трохи дорого, але раз вже їдемо — варто спробувати.",
    },
    imageUrl: img("kyoto-temple-gion"),
    questions: [
      { q: { en: "How long is the trip?", uk: "Яка тривалість подорожі?" }, choices: [
        { en: "2 days, 1 night", uk: "2 дні, 1 ніч" },
        { en: "4 days, 3 nights", uk: "4 дні, 3 ночі" },
        { en: "5 days, 4 nights", uk: "5 днів, 4 ночі" },
        { en: "1 week", uk: "1 тиждень" },
      ], answer: { en: "4 days, 3 nights", uk: "4 дні, 3 ночі" } },
      { q: { en: "Where do they want to stay?", uk: "Де хочуть зупинитися?" }, choices: [
        { en: "A business hotel", uk: "Бізнес-готелі" },
        { en: "A traditional ryokan", uk: "Традиційному рьокані" },
        { en: "A hostel", uk: "Хостелі" },
        { en: "An Airbnb", uk: "Айрбіенбі" },
      ], answer: { en: "A traditional ryokan", uk: "Традиційному рьокані" } },
    ],
  },
];

// ============================================================
// READING — 5 N4 + 5 N3
// ============================================================
const READING: Reading[] = [
  // ===== N4 =====
  {
    jlpt: 4,
    title: { en: "First day at a new school", uk: "Перший день у новій школі" },
    text: "今日は新しい学校の初めての日でした。朝、緊張して、朝ご飯があまり食べられませんでした。教室に入った時、皆が私を見ました。少し恥ずかしかったです。隣の席の女の子が「おはよう」と言って、笑ってくれました。彼女の名前はゆかちゃんです。昼休みに一緒にお弁当を食べました。ゆかちゃんは音楽が好きだそうです。私もピアノを弾きますから、すぐに友達になれそうです。明日も学校に行くのが楽しみです。",
    english: {
      en: "Today was my first day at a new school. In the morning I was nervous and couldn't eat much breakfast. When I entered the classroom, everyone looked at me. I felt a little embarrassed. The girl next to me said 'good morning' and smiled. Her name is Yuka. We ate lunch together at lunch break. She says she likes music. I play piano too, so we'll become friends quickly. I'm looking forward to going to school tomorrow.",
      uk: "Сьогодні був мій перший день у новій школі. Зранку я нервувала і не змогла з'їсти багато на сніданок. Коли я зайшла до класу, всі подивилися на мене. Було трохи соромно. Дівчинка поруч сказала «доброго ранку» і посміхнулась. Її звуть Юка. На обідній перерві ми разом поїли бенто. Юка каже, що любить музику. Я теж граю на фортепіано, тож скоро ми подружимось. Завтра з нетерпінням чекаю школи.",
    },
    imageUrl: img("japanese-school-classroom"),
    questions: [
      { q: { en: "How did the writer feel in the morning?", uk: "Як автор почував себе вранці?" }, choices: [
        { en: "Excited", uk: "Схвильовано" },
        { en: "Nervous", uk: "Нервово" },
        { en: "Bored", uk: "Нудно" },
        { en: "Sick", uk: "Хворобливо" },
      ], answer: { en: "Nervous", uk: "Нервово" } },
      { q: { en: "What does Yuka like?", uk: "Що любить Юка?" }, choices: [
        { en: "Sports", uk: "Спорт" },
        { en: "Music", uk: "Музику" },
        { en: "Math", uk: "Математику" },
        { en: "Drawing", uk: "Малювання" },
      ], answer: { en: "Music", uk: "Музику" } },
      { q: { en: "What instrument does the writer play?", uk: "На якому інструменті грає автор?" }, choices: [
        { en: "Guitar", uk: "Гітарі" },
        { en: "Piano", uk: "Фортепіано" },
        { en: "Violin", uk: "Скрипці" },
        { en: "Flute", uk: "Флейті" },
      ], answer: { en: "Piano", uk: "Фортепіано" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Email about hanami plans", uk: "Лист про планування ханамі" },
    text: "山田さん、お久しぶりです。来週の土曜日に、上野公園で花見をする予定です。桜が満開になりそうですから、ぜひ一緒に行きませんか。十一時に駅の北口で待ち合わせします。お弁当と飲み物は私が準備しますから、何も持って来なくても大丈夫です。雨の場合は、私のうちでパーティーをします。ご都合をお知らせください。木村より。",
    english: {
      en: "Yamada-san, long time no see. Next Saturday I'm planning to do hanami at Ueno Park. The cherry blossoms look like they'll be in full bloom, so please come with us. Let's meet at the north exit of the station at 11. I'll prepare the bento and drinks, so you don't need to bring anything. If it rains, we'll have a party at my house. Please let me know if you can come. From Kimura.",
      uk: "Ямада-сан, давно не бачились. Наступної суботи планую ханамі в парку Уено. Сакура має зацвісти у повну силу, тож приєднуйся. Зустрічаємось об 11-й біля північного виходу станції. Я підготую бенто й напої, тож нічого приносити не треба. Якщо буде дощ, влаштуємо вечірку в мене вдома. Дай знати про твої плани. Кімура.",
    },
    imageUrl: img("ueno-park-cherry-blossom"),
    questions: [
      { q: { en: "Where is the hanami planned?", uk: "Де планується ханамі?" }, choices: [
        { en: "Ueno Park", uk: "Парк Уено" },
        { en: "Shinjuku Gyoen", uk: "Сад Сінджуку" },
        { en: "Yoyogi Park", uk: "Парк Йоьогі" },
        { en: "Inokashira Park", uk: "Парк Інокашіра" },
      ], answer: { en: "Ueno Park", uk: "Парк Уено" } },
      { q: { en: "What time do they meet?", uk: "О котрій зустрічаються?" }, choices: [
        { en: "10:00", uk: "10:00" },
        { en: "11:00", uk: "11:00" },
        { en: "12:00", uk: "12:00" },
        { en: "13:00", uk: "13:00" },
      ], answer: { en: "11:00", uk: "11:00" } },
      { q: { en: "What's the plan if it rains?", uk: "Що, якщо буде дощ?" }, choices: [
        { en: "Cancel", uk: "Скасувати" },
        { en: "Party at Kimura's home", uk: "Вечірка вдома у Кімури" },
        { en: "Move to next week", uk: "Перенести на наступний тиждень" },
        { en: "Go to a restaurant", uk: "Піти в ресторан" },
      ], answer: { en: "Party at Kimura's home", uk: "Вечірка вдома у Кімури" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Library notice", uk: "Оголошення бібліотеки" },
    text: "市立図書館のお知らせ。三月二十日から三月二十二日まで、館内の工事のため、図書館は休館いたします。本の返却はポストをご利用ください。ご予約された本は、三月二十三日以降にお取りください。新しい開館時間は、平日が午前九時から午後八時まで、週末は午前十時から午後六時までです。ご不便をおかけして申し訳ございません。",
    english: {
      en: "City Library Notice. From March 20 to March 22, the library will be closed for renovations. Please use the return post for books. Reserved books may be picked up on or after March 23. New opening hours: weekdays 9 AM to 8 PM, weekends 10 AM to 6 PM. We apologize for the inconvenience.",
      uk: "Оголошення міської бібліотеки. З 20 по 22 березня бібліотека буде закрита через ремонт. Книги повертайте через поштову скриньку. Заброньовані книги можна забрати з 23 березня. Новий графік: будні з 9:00 до 20:00, вихідні з 10:00 до 18:00. Перепрошуємо за незручності.",
    },
    imageUrl: img("japanese-public-library-interior"),
    questions: [
      { q: { en: "How long is the library closed?", uk: "Як довго бібліотека закрита?" }, choices: [
        { en: "1 day", uk: "1 день" },
        { en: "3 days", uk: "3 дні" },
        { en: "1 week", uk: "1 тиждень" },
        { en: "2 weeks", uk: "2 тижні" },
      ], answer: { en: "3 days", uk: "3 дні" } },
      { q: { en: "What time does the library close on weekdays after renovation?", uk: "О котрій бібліотека закривається в будні після ремонту?" }, choices: [
        { en: "6 PM", uk: "18:00" },
        { en: "7 PM", uk: "19:00" },
        { en: "8 PM", uk: "20:00" },
        { en: "9 PM", uk: "21:00" },
      ], answer: { en: "8 PM", uk: "20:00" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Letter to a friend abroad", uk: "Лист другу за кордоном" },
    text: "サラへ、お元気ですか。私は東京で頑張っています。先月、新しいアパートに引っ越しました。前のところより少し狭いですが、駅から五分でとても便利です。仕事は忙しいですが、楽しいです。週末はよく公園を散歩します。日本の秋は本当にきれいですよ。紅葉の写真を送ります。来年、サラが日本に来たら、一緒に京都に行きましょう。お返事を待っています。ともこより。",
    english: {
      en: "Dear Sarah, how are you? I'm doing my best in Tokyo. Last month I moved to a new apartment. It's a bit smaller than the previous one, but it's only five minutes from the station and very convenient. Work is busy but fun. On weekends I often walk in the park. Autumn in Japan is really beautiful. I'm sending photos of the autumn leaves. When you come to Japan next year, let's go to Kyoto together. Looking forward to your reply. From Tomoko.",
      uk: "Дорога Саро, як ти? Я стараюся в Токіо. Минулого місяця переїхала в нову квартиру. Трохи менша за попередню, але всього п'ять хвилин від станції — дуже зручно. На роботі багато, але цікаво. На вихідних часто гуляю в парку. Осінь у Японії справді гарна. Надсилаю фото осіннього листя. Коли приїдеш наступного року, поїдемо разом у Кіото. Чекаю відповіді. Томоко.",
    },
    imageUrl: img("tokyo-autumn-park-leaves"),
    questions: [
      { q: { en: "When did Tomoko move?", uk: "Коли переїхала Томоко?" }, choices: [
        { en: "Last week", uk: "Минулого тижня" },
        { en: "Last month", uk: "Минулого місяця" },
        { en: "Last year", uk: "Минулого року" },
        { en: "Yesterday", uk: "Вчора" },
      ], answer: { en: "Last month", uk: "Минулого місяця" } },
      { q: { en: "How far is the station from the new apartment?", uk: "Як далеко станція від нової квартири?" }, choices: [
        { en: "1 minute", uk: "1 хвилина" },
        { en: "5 minutes", uk: "5 хвилин" },
        { en: "10 minutes", uk: "10 хвилин" },
        { en: "20 minutes", uk: "20 хвилин" },
      ], answer: { en: "5 minutes", uk: "5 хвилин" } },
      { q: { en: "What does Tomoko propose for next year?", uk: "Що пропонує Томоко на наступний рік?" }, choices: [
        { en: "Visit Sarah", uk: "Відвідати Сару" },
        { en: "Go to Kyoto together", uk: "Поїхати разом у Кіото" },
        { en: "Move abroad", uk: "Переїхати за кордон" },
        { en: "Change jobs", uk: "Змінити роботу" },
      ], answer: { en: "Go to Kyoto together", uk: "Поїхати разом у Кіото" } },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Job ad for a cafe", uk: "Оголошення про роботу в кафе" },
    text: "アルバイト募集。原宿の小さなカフェで一緒に働きませんか。仕事の内容は、注文を取ったり、コーヒーを作ったり、お皿を洗ったりすることです。経験は要りません。日本語が話せれば大丈夫です。週三日以上働ける方を探しています。時給は千二百円。土日に働ける方は千四百円です。明るくて元気な人、歓迎します。電話または店頭でお問い合わせください。",
    english: {
      en: "Part-time staff wanted. Want to work together at a small cafe in Harajuku? The work includes taking orders, making coffee, washing dishes, and so on. No experience required. As long as you can speak Japanese, you'll be fine. We're looking for people who can work at least three days a week. Hourly wage 1,200 yen. 1,400 yen for those who can work weekends. Bright and energetic people welcome. Inquire by phone or in store.",
      uk: "Шукаємо працівника на пів ставки. Хочете попрацювати в маленькому кафе в Харадзюку? Робота: приймати замовлення, готувати каву, мити посуд. Досвід не потрібен. Достатньо вміти говорити японською. Шукаємо тих, хто може працювати щонайменше три дні на тиждень. Ставка 1 200 єн на годину. 1 400 єн для тих, хто працює у вихідні. Раді привітним і енергійним людям. Звертайтесь телефоном або в магазині.",
    },
    imageUrl: img("tokyo-cafe-harajuku"),
    questions: [
      { q: { en: "What is required?", uk: "Що потрібно?" }, choices: [
        { en: "Experience", uk: "Досвід" },
        { en: "Ability to speak Japanese", uk: "Знання японської" },
        { en: "A driver's license", uk: "Водійські права" },
        { en: "University degree", uk: "Університетська освіта" },
      ], answer: { en: "Ability to speak Japanese", uk: "Знання японської" } },
      { q: { en: "What's the weekend hourly wage?", uk: "Яка ставка у вихідні?" }, choices: [
        { en: "1,000 yen", uk: "1 000 єн" },
        { en: "1,200 yen", uk: "1 200 єн" },
        { en: "1,400 yen", uk: "1 400 єн" },
        { en: "1,600 yen", uk: "1 600 єн" },
      ], answer: { en: "1,400 yen", uk: "1 400 єн" } },
    ],
  },

  // ===== N3 =====
  {
    jlpt: 3,
    title: { en: "Essay on traditional crafts", uk: "Есе про традиційні ремесла" },
    text: "日本の伝統工芸は、長い歴史の中で発展してきた。例えば、京都の西陣織は約千年前から続いており、今でも多くの職人がその技術を守っている。しかし、最近、若い人がこの仕事を選ぶことが減っている。理由はいくつかある。一つは、技術を身につけるのに何十年もかかること。もう一つは、給料が安いことだ。それでも、世界中の人々が日本の工芸品の美しさに感動している。これからは、伝統と現代の生活を上手に組み合わせることが重要だろう。",
    english: {
      en: "Japan's traditional crafts have developed over a long history. For example, Nishijin weaving in Kyoto has continued for about a thousand years, and many artisans still preserve those techniques. However, recently fewer young people are choosing this work. There are several reasons. One is that it takes decades to master the skill. Another is that the wages are low. Still, people around the world are moved by the beauty of Japanese crafts. Going forward, it will be important to combine tradition skillfully with modern life.",
      uk: "Японські традиційні ремесла розвивалися протягом довгої історії. Наприклад, ткання Нісідзін у Кіото триває близько тисячі років, і багато майстрів досі бережуть ці техніки. Однак останнім часом все менше молоді обирає цю роботу. На це є кілька причин. Перша — оволодіння майстерністю займає десятиліття. Друга — низька зарплата. Попри це, людей у всьому світі захоплює краса японських виробів. У майбутньому важливо вміло поєднувати традицію з сучасним життям.",
    },
    imageUrl: img("nishijin-weaving-kyoto"),
    questions: [
      { q: { en: "How old is Nishijin weaving?", uk: "Скільки років ткацтву Нісідзін?" }, choices: [
        { en: "About 100 years", uk: "Близько 100 років" },
        { en: "About 500 years", uk: "Близько 500 років" },
        { en: "About 1,000 years", uk: "Близько 1 000 років" },
        { en: "About 2,000 years", uk: "Близько 2 000 років" },
      ], answer: { en: "About 1,000 years", uk: "Близько 1 000 років" } },
      { q: { en: "Why are young people not choosing this craft?", uk: "Чому молодь не обирає це ремесло?" }, choices: [
        { en: "It's too easy", uk: "Занадто легко" },
        { en: "Long training and low pay", uk: "Тривале навчання й низька зарплата" },
        { en: "No customers", uk: "Немає клієнтів" },
        { en: "Government bans", uk: "Заборони уряду" },
      ], answer: { en: "Long training and low pay", uk: "Тривале навчання й низька зарплата" } },
      { q: { en: "What does the author suggest for the future?", uk: "Що пропонує автор на майбутнє?" }, choices: [
        { en: "Stop traditional crafts", uk: "Припинити ремесла" },
        { en: "Combine tradition with modern life", uk: "Поєднати традицію з сучасним життям" },
        { en: "Only export, not sell domestically", uk: "Тільки експортувати" },
        { en: "Increase prices", uk: "Підняти ціни" },
      ], answer: { en: "Combine tradition with modern life", uk: "Поєднати традицію з сучасним життям" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Interview with a young entrepreneur", uk: "Інтерв'ю з молодим підприємцем" },
    text: "今日は、東京で人気のカフェを経営している田中さん（二十八歳）にお話を伺いました。「最初は資金もなく、銀行から借りるのも難しかったです。でも、SNSで自分のアイデアを発信し続けたら、応援してくれる人が少しずつ増えました。」田中さんは、地元の農家から直接食材を仕入れることで、新鮮で安全な料理を提供している。「お客様に喜んでいただくことが何より嬉しい」と語る。今後は地方にも店を広げたいそうだ。",
    english: {
      en: "Today we spoke with Tanaka-san (28), who runs a popular cafe in Tokyo. 'At first I had no funds, and borrowing from a bank was difficult. But by continuing to share my ideas on social media, the number of supporters gradually increased.' Tanaka-san buys ingredients directly from local farmers, providing fresh and safe meals. 'Nothing makes me happier than seeing customers pleased,' he says. He hopes to expand to rural areas in the future.",
      uk: "Сьогодні ми поговорили з паном Танакою (28 років), який керує популярним кафе в Токіо. «Спочатку не було коштів, і взяти кредит у банку було важко. Та коли я продовжував ділитися своїми ідеями в соцмережах, число прихильників поступово зростало.» Танака закуповує продукти безпосередньо в місцевих фермерів, забезпечуючи свіжу й безпечну їжу. «Радість клієнтів — найбільше щастя», — каже він. У майбутньому хоче відкривати кафе і в регіонах.",
    },
    imageUrl: img("young-entrepreneur-cafe-japan"),
    questions: [
      { q: { en: "How did Tanaka-san gain initial support?", uk: "Як Танака знайшов перших прихильників?" }, choices: [
        { en: "Bank loans", uk: "Через банківські кредити" },
        { en: "Social media", uk: "Через соцмережі" },
        { en: "Government grants", uk: "Через гранти" },
        { en: "Family money", uk: "Через сімейні гроші" },
      ], answer: { en: "Social media", uk: "Через соцмережі" } },
      { q: { en: "Where do the ingredients come from?", uk: "Звідки продукти?" }, choices: [
        { en: "Supermarkets", uk: "З супермаркетів" },
        { en: "Imports", uk: "З імпорту" },
        { en: "Local farmers", uk: "Від місцевих фермерів" },
        { en: "Wholesale market", uk: "З оптового ринку" },
      ], answer: { en: "Local farmers", uk: "Від місцевих фермерів" } },
      { q: { en: "What is Tanaka-san's future plan?", uk: "Які плани у Танаки на майбутнє?" }, choices: [
        { en: "Close the cafe", uk: "Закрити кафе" },
        { en: "Expand to rural areas", uk: "Відкрити в регіонах" },
        { en: "Move abroad", uk: "Переїхати за кордон" },
        { en: "Write a book", uk: "Написати книгу" },
      ], answer: { en: "Expand to rural areas", uk: "Відкрити в регіонах" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Article: working from home", uk: "Стаття: робота з дому" },
    text: "コロナの影響で多くの会社が在宅勤務を導入した。アンケートによると、社員の七割が「通勤時間が減って助かる」と答えている。しかし、問題もある。家族と一緒の時間が増える一方で、仕事と生活の境目があいまいになり、ストレスを感じる人も多い。さらに、若い社員にとっては先輩から学ぶ機会が減るという声もある。専門家は、週に何日か出社する「ハイブリッド型」が今後の主流になるだろうと予測している。",
    english: {
      en: "Due to the pandemic, many companies have introduced remote work. According to a survey, 70 percent of employees say 'the reduction in commuting time is helpful.' However, there are problems. While time with family increases, the line between work and life becomes blurred, and many people feel stress. Furthermore, some say young employees have fewer opportunities to learn from senior colleagues. Experts predict that a 'hybrid' approach, going to the office several days a week, will become mainstream from now on.",
      uk: "Через пандемію багато компаній перейшли на віддалену роботу. За опитуванням, 70% працівників відповідають: «скорочення часу на дорогу дуже допомагає». Проте є й проблеми. Поки час із сім'єю збільшується, грань між роботою й життям розмивається, і люди відчувають стрес. Крім того, у молодих працівників менше можливостей вчитися у старших колег. Експерти прогнозують, що в майбутньому переважатиме «гібрид» — кілька днів в офісі.",
    },
    imageUrl: img("remote-work-home-office"),
    questions: [
      { q: { en: "What is the biggest benefit reported?", uk: "Який головний плюс відзначають?" }, choices: [
        { en: "Higher salary", uk: "Вища зарплата" },
        { en: "Less commuting time", uk: "Менше часу на дорогу" },
        { en: "More vacation", uk: "Більше відпустки" },
        { en: "Better food", uk: "Краще харчування" },
      ], answer: { en: "Less commuting time", uk: "Менше часу на дорогу" } },
      { q: { en: "What concern is mentioned about young employees?", uk: "Яка проблема в молодих працівників?" }, choices: [
        { en: "Lower pay", uk: "Нижча зарплата" },
        { en: "Fewer chances to learn from seniors", uk: "Менше можливостей вчитися у старших" },
        { en: "Bad internet", uk: "Поганий інтернет" },
        { en: "No promotions", uk: "Немає підвищень" },
      ], answer: { en: "Fewer chances to learn from seniors", uk: "Менше можливостей вчитися у старших" } },
      { q: { en: "What do experts predict?", uk: "Що прогнозують експерти?" }, choices: [
        { en: "Full return to office", uk: "Повне повернення в офіс" },
        { en: "Hybrid model dominance", uk: "Перевага гібридної моделі" },
        { en: "Complete remote work forever", uk: "Повністю віддалена робота назавжди" },
        { en: "Four-day work week", uk: "Чотириденний робочий тиждень" },
      ], answer: { en: "Hybrid model dominance", uk: "Перевага гібридної моделі" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Book review: a quiet novel", uk: "Рецензія: тихий роман" },
    text: "村上春樹の最新作を読み終えた。物語は、田舎の小さな町に住む四十代の男性が主人公だ。妻を亡くした彼は、毎日同じ喫茶店に通い、本を読みながら静かに過ごしている。ある日、不思議な女性に出会い、彼の人生が少しずつ変わり始める。事件のような大きな出来事はないが、登場人物の心の動きが丁寧に描かれていて、最後まで読まずにはいられなかった。村上らしい雰囲気が好きな人には、ぜひおすすめしたい一冊である。",
    english: {
      en: "I finished reading Haruki Murakami's latest work. The story's protagonist is a man in his forties living in a small rural town. Having lost his wife, he goes to the same coffee shop every day and spends his time quietly reading. One day he meets a mysterious woman, and his life gradually begins to change. There are no big events like a dramatic incident, but the inner movements of the characters are carefully portrayed, and I couldn't help but read to the end. I highly recommend it to those who love Murakami's signature atmosphere.",
      uk: "Закінчила читати останню роботу Харукі Муракамі. Головний герой — чоловік за сорок, який живе у маленькому сільському містечку. Втративши дружину, він щодня ходить в одне й те саме кафе і тихо читає книги. Одного дня він зустрічає загадкову жінку, і його життя поступово змінюється. Великих подій тут немає, але внутрішні переживання героїв описано так дбайливо, що я не змогла не дочитати до кінця. Рекомендую тим, хто любить фірмову атмосферу Муракамі.",
    },
    imageUrl: img("book-cafe-murakami-quiet"),
    questions: [
      { q: { en: "What is the protagonist's situation?", uk: "Яка ситуація головного героя?" }, choices: [
        { en: "Just married", uk: "Щойно одружився" },
        { en: "Lost his wife", uk: "Втратив дружину" },
        { en: "Has young children", uk: "Має малих дітей" },
        { en: "Just retired", uk: "Щойно пішов на пенсію" },
      ], answer: { en: "Lost his wife", uk: "Втратив дружину" } },
      { q: { en: "What changes his life?", uk: "Що змінює його життя?" }, choices: [
        { en: "Winning the lottery", uk: "Виграш у лотерею" },
        { en: "Meeting a mysterious woman", uk: "Зустріч із загадковою жінкою" },
        { en: "Moving to the city", uk: "Переїзд у місто" },
        { en: "A new job", uk: "Нова робота" },
      ], answer: { en: "Meeting a mysterious woman", uk: "Зустріч із загадковою жінкою" } },
      { q: { en: "What does the reviewer praise?", uk: "Що хвалить рецензент?" }, choices: [
        { en: "Action scenes", uk: "Бойові сцени" },
        { en: "Inner portrayal of characters", uk: "Зображення внутрішнього світу героїв" },
        { en: "Humor", uk: "Гумор" },
        { en: "Cliffhangers", uk: "Інтриги" },
      ], answer: { en: "Inner portrayal of characters", uk: "Зображення внутрішнього світу героїв" } },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Article: rural depopulation", uk: "Стаття: знелюднення сіл" },
    text: "日本の地方では、人口がどんどん減っている。若い人が仕事を求めて都会に出て行き、戻ってこないからだ。残された高齢者は、買い物や病院に行くのも大変になっている。学校もクラスが減り、廃校になる地域もある。一方で、自然や静かな環境を好み、都会から地方へ移住する人も少しずつ増えている。インターネットがあれば、どこでも働ける時代になったことも理由の一つだ。地方を元気にするには、新しい考え方と支援が必要である。",
    english: {
      en: "In rural Japan, the population is steadily declining. Young people leave for the cities in search of work and don't return. The remaining elderly find shopping and visiting hospitals increasingly difficult. Schools have fewer classes, and some have even been closed. On the other hand, a small but growing number of people who prefer nature and quiet environments are moving from cities to rural areas. One reason is that with the internet, people can now work from anywhere. To revitalize the regions, new ideas and support are necessary.",
      uk: "У сільській Японії населення поступово зменшується. Молодь їде у міста по роботу і не повертається. Похилим людям, які залишилися, важко ходити по магазинах і до лікарні. У школах менше класів, деякі взагалі закривають. Водночас люди, які люблять природу і тишу, потроху переїжджають з міст у села. Одна з причин — у часи інтернету можна працювати звідусіль. Щоб оживити регіони, потрібні нові ідеї і підтримка.",
    },
    imageUrl: img("rural-japan-village"),
    questions: [
      { q: { en: "Why do young people leave?", uk: "Чому молодь їде?" }, choices: [
        { en: "Better climate", uk: "Кращий клімат" },
        { en: "Work in cities", uk: "Робота в містах" },
        { en: "Schools", uk: "Школи" },
        { en: "Family", uk: "Сім'я" },
      ], answer: { en: "Work in cities", uk: "Робота в містах" } },
      { q: { en: "Who is moving to rural areas?", uk: "Хто переїжджає в села?" }, choices: [
        { en: "People who prefer nature and quiet", uk: "Ті, хто любить природу і тишу" },
        { en: "Foreign tourists", uk: "Іноземні туристи" },
        { en: "Retired farmers", uk: "Пенсіонери-фермери" },
        { en: "University students", uk: "Студенти" },
      ], answer: { en: "People who prefer nature and quiet", uk: "Ті, хто любить природу і тишу" } },
      { q: { en: "What enables remote work?", uk: "Що дозволяє віддалену роботу?" }, choices: [
        { en: "Good transport", uk: "Гарний транспорт" },
        { en: "The internet", uk: "Інтернет" },
        { en: "Cheap housing", uk: "Дешеве житло" },
        { en: "Government subsidies", uk: "Державні субсидії" },
      ], answer: { en: "The internet", uk: "Інтернет" } },
    ],
  },
];

async function main() {
  console.log("Adding extra listening + reading content…");

  let l = 0, lSkip = 0;
  for (const x of LISTENING) {
    const existing = await db.listeningExercise.findFirst({ where: { title: x.title.en } });
    if (existing) { lSkip++; continue; }
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
  console.log(`  ✓ ${l} listening exercises added (skipped ${lSkip} dup).`);

  let r = 0, rSkip = 0;
  for (const x of READING) {
    const existing = await db.readingExercise.findFirst({ where: { title: x.title.en } });
    if (existing) { rSkip++; continue; }
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
  console.log(`  ✓ ${r} reading exercises added (skipped ${rSkip} dup).`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
