// Fresh, original listening & reading content. NOT based on Genki or any commercial textbook.
// Each entry is bilingual (en + uk) so both locales are populated at once.
//
// Run: npm run seed:content:v2  (wipes old listening/reading first)
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

type Q = { q: string; choices: string[]; answer: string };
type Bilingual = { en: string; uk: string };
type BilingualQ = { q: Bilingual; choices: { en: string; uk: string }[]; answer: Bilingual };

type Listening = {
  jlpt: number;
  title: Bilingual;
  transcript: string; // Japanese
  english: Bilingual;
  questions: BilingualQ[];
};

type Reading = {
  jlpt: number;
  title: Bilingual;
  text: string; // Japanese
  english: Bilingual;
  questions: BilingualQ[];
};

const LISTENING: Listening[] = [
  // ===== N5 =====
  {
    jlpt: 5,
    title: { en: "Cherry blossoms in the park", uk: "Сакура в парку" },
    transcript: "わあ、桜がきれいですね。本当にきれいです。写真を撮りましょう。いいですよ。",
    english: {
      en: "Wow, the cherry blossoms are beautiful, aren't they? Yes, really beautiful. Let's take a photo. Sure.",
      uk: "Ого, сакура така гарна, правда? Так, дуже гарна. Давай зробимо фото. Гаразд.",
    },
    questions: [
      {
        q: { en: "What are they looking at?", uk: "На що вони дивляться?" },
        choices: [
          { en: "Cherry blossoms", uk: "Сакуру" },
          { en: "Maple leaves", uk: "Кленове листя" },
          { en: "Roses", uk: "Троянди" },
          { en: "Snow", uk: "Сніг" },
        ],
        answer: { en: "Cherry blossoms", uk: "Сакуру" },
      },
      {
        q: { en: "What do they want to do?", uk: "Що вони хочуть зробити?" },
        choices: [
          { en: "Buy flowers", uk: "Купити квіти" },
          { en: "Take a photo", uk: "Зробити фото" },
          { en: "Eat lunch", uk: "Пообідати" },
          { en: "Go home", uk: "Піти додому" },
        ],
        answer: { en: "Take a photo", uk: "Зробити фото" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Talking about a cat", uk: "Розмова про кота" },
    transcript: "猫を飼っていますか。はい、二匹います。何色ですか。一匹は黒くて、一匹は白いです。",
    english: {
      en: "Do you keep a cat? Yes, I have two. What color are they? One is black and one is white.",
      uk: "Тримаєш кота? Так, у мене двоє. Якого кольору? Один чорний, а інший білий.",
    },
    questions: [
      {
        q: { en: "How many cats does the person have?", uk: "Скільки котів у людини?" },
        choices: [
          { en: "One", uk: "Один" },
          { en: "Two", uk: "Два" },
          { en: "Three", uk: "Три" },
          { en: "None", uk: "Жодного" },
        ],
        answer: { en: "Two", uk: "Два" },
      },
      {
        q: { en: "What colors are the cats?", uk: "Якого кольору коти?" },
        choices: [
          { en: "Both black", uk: "Обидва чорні" },
          { en: "Black and white", uk: "Чорний і білий" },
          { en: "Brown and gray", uk: "Коричневий і сірий" },
          { en: "Orange and white", uk: "Рудий і білий" },
        ],
        answer: { en: "Black and white", uk: "Чорний і білий" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "At the convenience store", uk: "У комбіні" },
    transcript: "いらっしゃいませ。このおにぎりとお茶をください。袋はいりますか。いいえ、大丈夫です。",
    english: {
      en: "Welcome. Please give me this rice ball and tea. Do you need a bag? No, it's okay.",
      uk: "Ласкаво просимо. Будь ласка, цей онігірі та чай. Пакет потрібен? Ні, дякую.",
    },
    questions: [
      {
        q: { en: "What is the customer buying?", uk: "Що купує покупець?" },
        choices: [
          { en: "Rice ball and tea", uk: "Онігірі та чай" },
          { en: "Sandwich and coffee", uk: "Сендвіч і каву" },
          { en: "Bread and milk", uk: "Хліб і молоко" },
          { en: "Sushi and beer", uk: "Суші та пиво" },
        ],
        answer: { en: "Rice ball and tea", uk: "Онігірі та чай" },
      },
      {
        q: { en: "Does the customer want a bag?", uk: "Чи хоче покупець пакет?" },
        choices: [
          { en: "Yes", uk: "Так" },
          { en: "No", uk: "Ні" },
          { en: "Two bags", uk: "Два пакети" },
          { en: "A big bag", uk: "Великий пакет" },
        ],
        answer: { en: "No", uk: "Ні" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Joining a club", uk: "Вступ до гуртка" },
    transcript: "テニス部に入りたいんです。練習は週何回ですか。月曜日と水曜日と金曜日です。",
    english: {
      en: "I want to join the tennis club. How many times a week is practice? Mondays, Wednesdays, and Fridays.",
      uk: "Хочу вступити до тенісного клубу. Скільки разів на тиждень тренування? Понеділок, середа і п'ятниця.",
    },
    questions: [
      {
        q: { en: "Which club does the person want to join?", uk: "До якого клубу хоче вступити людина?" },
        choices: [
          { en: "Soccer", uk: "Футбол" },
          { en: "Tennis", uk: "Теніс" },
          { en: "Basketball", uk: "Баскетбол" },
          { en: "Art", uk: "Малювання" },
        ],
        answer: { en: "Tennis", uk: "Теніс" },
      },
      {
        q: { en: "How many days a week is practice?", uk: "Скільки днів на тиждень тренування?" },
        choices: [
          { en: "Two", uk: "Два" },
          { en: "Three", uk: "Три" },
          { en: "Four", uk: "Чотири" },
          { en: "Five", uk: "П'ять" },
        ],
        answer: { en: "Three", uk: "Три" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Birthday plans", uk: "Плани на день народження" },
    transcript: "明日は私の誕生日です。何かしますか。友達とケーキを食べます。それから映画を見ます。",
    english: {
      en: "Tomorrow is my birthday. Will you do something? I'll eat cake with friends. Then watch a movie.",
      uk: "Завтра у мене день народження. Робитимеш щось? Поїм торт з друзями. Потім подивимось фільм.",
    },
    questions: [
      {
        q: { en: "When is the speaker's birthday?", uk: "Коли у мовця день народження?" },
        choices: [
          { en: "Today", uk: "Сьогодні" },
          { en: "Tomorrow", uk: "Завтра" },
          { en: "Next week", uk: "Наступного тижня" },
          { en: "Yesterday", uk: "Учора" },
        ],
        answer: { en: "Tomorrow", uk: "Завтра" },
      },
      {
        q: { en: "What will they do after eating cake?", uk: "Що робитимуть після торта?" },
        choices: [
          { en: "Go shopping", uk: "Підуть у магазин" },
          { en: "Watch a movie", uk: "Подивляться фільм" },
          { en: "Play games", uk: "Гратимуть в ігри" },
          { en: "Sleep", uk: "Спатимуть" },
        ],
        answer: { en: "Watch a movie", uk: "Подивляться фільм" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Beach memories", uk: "Спогади про море" },
    transcript: "夏休みは何をしましたか。海に行きました。泳いだり、貝を集めたりしました。とても楽しかったです。",
    english: {
      en: "What did you do during summer vacation? I went to the sea. I swam and collected shells. It was very fun.",
      uk: "Що ти робив на літніх канікулах? Їздив на море. Плавав і збирав мушлі. Було дуже весело.",
    },
    questions: [
      {
        q: { en: "Where did the speaker go?", uk: "Куди їздив мовець?" },
        choices: [
          { en: "To the mountains", uk: "У гори" },
          { en: "To the sea", uk: "На море" },
          { en: "To the river", uk: "На річку" },
          { en: "To the forest", uk: "У ліс" },
        ],
        answer: { en: "To the sea", uk: "На море" },
      },
      {
        q: { en: "What did the speaker collect?", uk: "Що збирав мовець?" },
        choices: [
          { en: "Stones", uk: "Каміння" },
          { en: "Shells", uk: "Мушлі" },
          { en: "Flowers", uk: "Квіти" },
          { en: "Sand", uk: "Пісок" },
        ],
        answer: { en: "Shells", uk: "Мушлі" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Favorite music", uk: "Улюблена музика" },
    transcript: "どんな音楽が好きですか。J-POPが好きです。誰の歌が一番好きですか。あいみょんが一番好きです。",
    english: {
      en: "What kind of music do you like? I like J-pop. Whose songs do you like the most? I like Aimyon the most.",
      uk: "Яку музику любиш? Люблю J-pop. Чиї пісні подобаються найбільше? Найбільше — Айм'йон.",
    },
    questions: [
      {
        q: { en: "What genre does the speaker like?", uk: "Який жанр любить мовець?" },
        choices: [
          { en: "Rock", uk: "Рок" },
          { en: "Classical", uk: "Класика" },
          { en: "J-pop", uk: "J-pop" },
          { en: "Jazz", uk: "Джаз" },
        ],
        answer: { en: "J-pop", uk: "J-pop" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Making okonomiyaki", uk: "Готуємо окономіякі" },
    transcript: "今日はお好み焼きを作りましょう。キャベツを切ってください。卵を入れます。混ぜます。フライパンで焼きます。",
    english: {
      en: "Let's make okonomiyaki today. Please cut the cabbage. We add eggs. We mix. We fry it in a pan.",
      uk: "Сьогодні готуємо окономіякі. Поріж капусту, будь ласка. Додаємо яйця. Перемішуємо. Смажимо на сковорідці.",
    },
    questions: [
      {
        q: { en: "What vegetable does the recipe use?", uk: "Який овоч є в рецепті?" },
        choices: [
          { en: "Carrot", uk: "Морква" },
          { en: "Cabbage", uk: "Капуста" },
          { en: "Onion", uk: "Цибуля" },
          { en: "Potato", uk: "Картопля" },
        ],
        answer: { en: "Cabbage", uk: "Капуста" },
      },
      {
        q: { en: "How is okonomiyaki cooked?", uk: "Як готують окономіякі?" },
        choices: [
          { en: "Boiled", uk: "Варять" },
          { en: "Fried in a pan", uk: "Смажать на сковорідці" },
          { en: "Baked in oven", uk: "Печуть у духовці" },
          { en: "Steamed", uk: "Готують на парі" },
        ],
        answer: { en: "Fried in a pan", uk: "Смажать на сковорідці" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Library card", uk: "Бібліотечна картка" },
    transcript: "図書館のカードを作りたいんですが。ここに名前と住所を書いてください。学生証はありますか。はい、これです。",
    english: {
      en: "I'd like to make a library card. Please write your name and address here. Do you have a student ID? Yes, here it is.",
      uk: "Хотів(ла) б оформити бібліотечну картку. Напишіть тут ім'я та адресу. Студентський є? Так, ось.",
    },
    questions: [
      {
        q: { en: "What does the person want?", uk: "Що хоче людина?" },
        choices: [
          { en: "To borrow a book", uk: "Взяти книгу" },
          { en: "To make a library card", uk: "Оформити бібліотечну картку" },
          { en: "To return a book", uk: "Повернути книгу" },
          { en: "To find a teacher", uk: "Знайти вчителя" },
        ],
        answer: { en: "To make a library card", uk: "Оформити бібліотечну картку" },
      },
      {
        q: { en: "What ID does the person show?", uk: "Який документ показує людина?" },
        choices: [
          { en: "Passport", uk: "Паспорт" },
          { en: "Driver's license", uk: "Водійське посвідчення" },
          { en: "Student ID", uk: "Студентський" },
          { en: "Library card", uk: "Бібліотечну картку" },
        ],
        answer: { en: "Student ID", uk: "Студентський" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Lost cat poster", uk: "Оголошення про загубленого кота" },
    transcript: "もしもし、猫を見つけました。茶色い猫ですか。はい、首輪をしています。本当ですか。ありがとうございます。",
    english: {
      en: "Hello, I found a cat. Is it a brown cat? Yes, it's wearing a collar. Really? Thank you so much.",
      uk: "Алло, я знайшов(ла) кота. Це коричневий кіт? Так, з нашийником. Справді? Дуже дякую.",
    },
    questions: [
      {
        q: { en: "What color is the cat?", uk: "Якого кольору кіт?" },
        choices: [
          { en: "Black", uk: "Чорного" },
          { en: "White", uk: "Білого" },
          { en: "Brown", uk: "Коричневого" },
          { en: "Gray", uk: "Сірого" },
        ],
        answer: { en: "Brown", uk: "Коричневого" },
      },
      {
        q: { en: "What is the cat wearing?", uk: "Що на коті?" },
        choices: [
          { en: "A bell", uk: "Дзвіночок" },
          { en: "A collar", uk: "Нашийник" },
          { en: "A coat", uk: "Курточка" },
          { en: "Nothing", uk: "Нічого" },
        ],
        answer: { en: "A collar", uk: "Нашийник" },
      },
    ],
  },
  // ===== N4 =====
  {
    jlpt: 4,
    title: { en: "Office chat about weekend", uk: "Розмова в офісі про вихідні" },
    transcript: "週末はどうでしたか。山に登りました。山頂から見た景色は最高でしたよ。私もいつか行ってみたいです。",
    english: {
      en: "How was your weekend? I climbed a mountain. The view from the summit was the best. I'd like to try going someday too.",
      uk: "Як пройшли вихідні? Піднявся на гору. Краєвид з вершини був неймовірний. Я теж колись хочу спробувати.",
    },
    questions: [
      {
        q: { en: "What did the speaker do?", uk: "Що робив мовець?" },
        choices: [
          { en: "Went swimming", uk: "Плавав" },
          { en: "Climbed a mountain", uk: "Піднявся на гору" },
          { en: "Stayed home", uk: "Сидів удома" },
          { en: "Went to a concert", uk: "Сходив на концерт" },
        ],
        answer: { en: "Climbed a mountain", uk: "Піднявся на гору" },
      },
      {
        q: { en: "How did they describe the view?", uk: "Як описали краєвид?" },
        choices: [
          { en: "Disappointing", uk: "Розчаровуючий" },
          { en: "The best", uk: "Найкращий" },
          { en: "Average", uk: "Звичайний" },
          { en: "Foggy", uk: "У тумані" },
        ],
        answer: { en: "The best", uk: "Найкращий" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Coffee shop hobby chat", uk: "Розмова про хобі в кав'ярні" },
    transcript: "趣味は何ですか。陶芸を始めたばかりです。難しいですが、楽しいです。今度作品を見せてくださいね。",
    english: {
      en: "What's your hobby? I just started pottery. It's difficult, but fun. Show me your work next time, okay?",
      uk: "Яке у тебе хобі? Нещодавно почав(ла) займатися керамікою. Складно, але цікаво. Покажи якось свої роботи!",
    },
    questions: [
      {
        q: { en: "What is the speaker's new hobby?", uk: "Яке нове хобі мовця?" },
        choices: [
          { en: "Painting", uk: "Малювання" },
          { en: "Pottery", uk: "Кераміка" },
          { en: "Knitting", uk: "В'язання" },
          { en: "Photography", uk: "Фотографія" },
        ],
        answer: { en: "Pottery", uk: "Кераміка" },
      },
      {
        q: { en: "How does the speaker feel about it?", uk: "Як ставиться мовець?" },
        choices: [
          { en: "Boring", uk: "Нудно" },
          { en: "Difficult but fun", uk: "Складно, але цікаво" },
          { en: "Easy", uk: "Легко" },
          { en: "Tiring", uk: "Втомлює" },
        ],
        answer: { en: "Difficult but fun", uk: "Складно, але цікаво" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Buying ski equipment", uk: "Купівля лижного спорядження" },
    transcript: "スキー用品を探しています。初心者向けのおすすめはありますか。こちらのセットはどうでしょう。値段も手頃ですよ。",
    english: {
      en: "I'm looking for ski equipment. Do you have recommendations for beginners? How about this set? The price is reasonable too.",
      uk: "Шукаю спорядження для лиж. Що порадите для початківця? Ось цей комплект — як вам? І ціна доступна.",
    },
    questions: [
      {
        q: { en: "What is the customer looking for?", uk: "Що шукає покупець?" },
        choices: [
          { en: "Hiking gear", uk: "Спорядження для туризму" },
          { en: "Ski equipment", uk: "Лижне спорядження" },
          { en: "Swimming gear", uk: "Для плавання" },
          { en: "Camping gear", uk: "Для кемпінгу" },
        ],
        answer: { en: "Ski equipment", uk: "Лижне спорядження" },
      },
      {
        q: { en: "What level is the customer?", uk: "Який рівень покупця?" },
        choices: [
          { en: "Beginner", uk: "Початківець" },
          { en: "Intermediate", uk: "Середній" },
          { en: "Advanced", uk: "Просунутий" },
          { en: "Professional", uk: "Професіонал" },
        ],
        answer: { en: "Beginner", uk: "Початківець" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Talking with teacher about studies", uk: "Розмова з вчителем про навчання" },
    transcript: "先生、最近数学が分からなくなってきました。じゃあ放課後一緒に勉強しましょう。本当にいいんですか。もちろん。",
    english: {
      en: "Sensei, lately I've started not understanding math. Then let's study together after school. Is that really okay? Of course.",
      uk: "Сенсею, останнім часом не розумію математику. Тоді позаймаємось разом після уроків. Справді можна? Звісно.",
    },
    questions: [
      {
        q: { en: "What subject is the problem?", uk: "З яким предметом проблема?" },
        choices: [
          { en: "English", uk: "Англійська" },
          { en: "Math", uk: "Математика" },
          { en: "History", uk: "Історія" },
          { en: "Science", uk: "Природознавство" },
        ],
        answer: { en: "Math", uk: "Математика" },
      },
      {
        q: { en: "What does the teacher suggest?", uk: "Що пропонує вчитель?" },
        choices: [
          { en: "Drop the class", uk: "Кинути предмет" },
          { en: "Study together after school", uk: "Позайматися разом після уроків" },
          { en: "Hire a tutor", uk: "Найняти репетитора" },
          { en: "Read more books", uk: "Читати більше книг" },
        ],
        answer: { en: "Study together after school", uk: "Позайматися разом після уроків" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Movie review", uk: "Огляд фільму" },
    transcript: "あの映画を見ましたか。はい、昨日。どうでしたか。最初はつまらなかったけど、後半はすごく面白かったです。",
    english: {
      en: "Did you watch that movie? Yes, yesterday. How was it? The beginning was boring, but the second half was really interesting.",
      uk: "Ти дивився той фільм? Так, учора. Як він? Початок був нудний, але друга половина — дуже цікава.",
    },
    questions: [
      {
        q: { en: "When did the speaker watch the movie?", uk: "Коли мовець подивився фільм?" },
        choices: [
          { en: "Today", uk: "Сьогодні" },
          { en: "Yesterday", uk: "Учора" },
          { en: "Last week", uk: "Минулого тижня" },
          { en: "A month ago", uk: "Місяць тому" },
        ],
        answer: { en: "Yesterday", uk: "Учора" },
      },
      {
        q: { en: "How was the second half?", uk: "Якою була друга половина?" },
        choices: [
          { en: "Boring", uk: "Нудна" },
          { en: "Very interesting", uk: "Дуже цікава" },
          { en: "Confusing", uk: "Заплутана" },
          { en: "Sad", uk: "Сумна" },
        ],
        answer: { en: "Very interesting", uk: "Дуже цікава" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Restaurant complaint", uk: "Скарга в ресторані" },
    transcript: "すみません、注文した料理がまだ来ないんですが。本当に申し訳ありません。すぐにお持ちします。ありがとうございます。",
    english: {
      en: "Excuse me, the food I ordered hasn't arrived yet. We're truly sorry. I'll bring it right away. Thank you.",
      uk: "Перепрошую, моє замовлення ще не принесли. Дуже перепрошуємо. Зараз же принесу. Дякую.",
    },
    questions: [
      {
        q: { en: "What is the problem?", uk: "У чому проблема?" },
        choices: [
          { en: "The food is cold", uk: "Їжа холодна" },
          { en: "The food hasn't arrived", uk: "Їжу не принесли" },
          { en: "Wrong order", uk: "Неправильне замовлення" },
          { en: "Too expensive", uk: "Задорого" },
        ],
        answer: { en: "The food hasn't arrived", uk: "Їжу не принесли" },
      },
      {
        q: { en: "How does the staff respond?", uk: "Як реагує персонал?" },
        choices: [
          { en: "Refuses to help", uk: "Відмовляється допомогти" },
          { en: "Apologizes and brings it", uk: "Перепрошує і принесе" },
          { en: "Asks customer to wait longer", uk: "Просить ще зачекати" },
          { en: "Offers a discount", uk: "Пропонує знижку" },
        ],
        answer: { en: "Apologizes and brings it", uk: "Перепрошує і принесе" },
      },
    ],
  },
  // ===== N3 =====
  {
    jlpt: 3,
    title: { en: "Climate change discussion", uk: "Розмова про зміну клімату" },
    transcript: "最近、気候変動の影響がますます深刻になっていますね。本当に。個人レベルでも何かできることはありますか。例えば、公共交通機関を使ったり、肉を減らしたりすることが効果的だと言われています。",
    english: {
      en: "Lately, the effects of climate change are becoming increasingly serious, aren't they? Really. Is there anything we can do on an individual level? For example, it's said that using public transportation and reducing meat consumption is effective.",
      uk: "Останнім часом наслідки зміни клімату стають дедалі серйознішими, чи не так? Справді. Чи можемо ми щось зробити на особистому рівні? Наприклад, кажуть, що користуватися громадським транспортом і їсти менше м'яса — ефективно.",
    },
    questions: [
      {
        q: { en: "What is the main topic?", uk: "Яка головна тема?" },
        choices: [
          { en: "Air pollution", uk: "Забруднення повітря" },
          { en: "Climate change", uk: "Зміна клімату" },
          { en: "Recycling", uk: "Переробка" },
          { en: "Population growth", uk: "Зростання населення" },
        ],
        answer: { en: "Climate change", uk: "Зміна клімату" },
      },
      {
        q: { en: "Which is suggested as an individual action?", uk: "Яка дія пропонується на особистому рівні?" },
        choices: [
          { en: "Plant more trees", uk: "Садити більше дерев" },
          { en: "Use public transport", uk: "Користуватися громадським транспортом" },
          { en: "Donate money", uk: "Жертвувати гроші" },
          { en: "Protest", uk: "Протестувати" },
        ],
        answer: { en: "Use public transport", uk: "Користуватися громадським транспортом" },
      },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Senior career advice", uk: "Порада від колеги-старшого" },
    transcript: "新人の頃、自分も同じように悩んだものですよ。今はどうやって乗り越えたんですか。失敗を恐れずに挑戦し続けることが大事だと思います。少しずつでも成長していきますから。",
    english: {
      en: "When I was a newbie, I struggled the same way. How did you get past it? I think the important thing is to keep challenging yourself without fearing failure. You grow little by little.",
      uk: "Коли я був новачком, теж так само мучився. Як ви тоді впоралися? Гадаю, головне — не боятися помилок і продовжувати пробувати. Помалу, але ростеш.",
    },
    questions: [
      {
        q: { en: "What is the senior's main advice?", uk: "Яка головна порада старшого?" },
        choices: [
          { en: "Avoid difficult tasks", uk: "Уникати складних задач" },
          { en: "Don't fear failure", uk: "Не боятися невдач" },
          { en: "Work harder than others", uk: "Працювати більше за інших" },
          { en: "Find a mentor", uk: "Знайти ментора" },
        ],
        answer: { en: "Don't fear failure", uk: "Не боятися невдач" },
      },
      {
        q: { en: "What pace of growth does the senior describe?", uk: "Який темп зростання описує старший?" },
        choices: [
          { en: "Rapid", uk: "Швидкий" },
          { en: "Little by little", uk: "Поступовий" },
          { en: "Sudden bursts", uk: "Раптовими стрибками" },
          { en: "No growth", uk: "Жодного" },
        ],
        answer: { en: "Little by little", uk: "Поступовий" },
      },
    ],
  },
];

const READING: Reading[] = [
  // ===== N5 =====
  {
    jlpt: 5,
    title: { en: "About my town", uk: "Про моє місто" },
    text: "私の町は小さいです。人は多くないです。でも、川がきれいです。秋には紅葉がとても綺麗です。私の町が大好きです。",
    english: {
      en: "My town is small. There aren't many people. But the river is beautiful. In autumn the maple leaves are very pretty. I love my town.",
      uk: "Моє містечко мале. Людей небагато. Але річка гарна. Восени кленове листя дуже красиве. Я люблю своє місто.",
    },
    questions: [
      {
        q: { en: "How big is the town?", uk: "Яке за розміром містечко?" },
        choices: [
          { en: "Very big", uk: "Дуже велике" },
          { en: "Small", uk: "Мале" },
          { en: "Medium", uk: "Середнє" },
          { en: "Huge", uk: "Величезне" },
        ],
        answer: { en: "Small", uk: "Мале" },
      },
      {
        q: { en: "When are the maple leaves pretty?", uk: "Коли кленове листя красиве?" },
        choices: [
          { en: "Spring", uk: "Весна" },
          { en: "Summer", uk: "Літо" },
          { en: "Autumn", uk: "Осінь" },
          { en: "Winter", uk: "Зима" },
        ],
        answer: { en: "Autumn", uk: "Осінь" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Grandma's garden", uk: "Бабусин сад" },
    text: "祖母の家には小さな庭があります。トマトときゅうりとなすを育てています。夏になると野菜がたくさんできます。祖母はそれで料理を作ります。とても美味しいです。",
    english: {
      en: "My grandma's house has a small garden. She grows tomatoes, cucumbers, and eggplants. In summer there are lots of vegetables. Grandma cooks with them. Very delicious.",
      uk: "У бабусиному домі є маленький сад. Вона вирощує помідори, огірки та баклажани. Влітку овочів багато. Бабуся з них готує. Дуже смачно.",
    },
    questions: [
      {
        q: { en: "What does grandma grow?", uk: "Що вирощує бабуся?" },
        choices: [
          { en: "Flowers", uk: "Квіти" },
          { en: "Vegetables", uk: "Овочі" },
          { en: "Fruit trees", uk: "Фруктові дерева" },
          { en: "Herbs only", uk: "Тільки трави" },
        ],
        answer: { en: "Vegetables", uk: "Овочі" },
      },
      {
        q: { en: "When are there lots of vegetables?", uk: "Коли овочів багато?" },
        choices: [
          { en: "Spring", uk: "Весною" },
          { en: "Summer", uk: "Влітку" },
          { en: "Autumn", uk: "Восени" },
          { en: "All year", uk: "Цілорічно" },
        ],
        answer: { en: "Summer", uk: "Влітку" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Letter to a pen pal", uk: "Лист другу по листуванню" },
    text: "アンナさんへ。元気ですか。私は元気です。日本では桜が咲き始めました。とても綺麗です。アンナさんの国はどうですか。返事を待っています。ゆうこ",
    english: {
      en: "To Anna. How are you? I'm well. In Japan cherry blossoms have started blooming. They're very beautiful. How is it in your country? I'm waiting for your reply. Yuko.",
      uk: "До Анни. Як справи? У мене все добре. У Японії почала цвісти сакура. Дуже красиво. А як у твоїй країні? Чекаю відповіді. Юко.",
    },
    questions: [
      {
        q: { en: "Who is the letter to?", uk: "Кому лист?" },
        choices: [
          { en: "Yuko", uk: "Юко" },
          { en: "Anna", uk: "Анна" },
          { en: "Tomoko", uk: "Томоко" },
          { en: "Mary", uk: "Мері" },
        ],
        answer: { en: "Anna", uk: "Анна" },
      },
      {
        q: { en: "What season is it?", uk: "Яка пора року?" },
        choices: [
          { en: "Spring (cherry blossom)", uk: "Весна (сакура)" },
          { en: "Summer", uk: "Літо" },
          { en: "Autumn", uk: "Осінь" },
          { en: "Winter", uk: "Зима" },
        ],
        answer: { en: "Spring (cherry blossom)", uk: "Весна (сакура)" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Club newsletter", uk: "Новини гуртка" },
    text: "写真部のお知らせです。来月、駅前で写真展を開きます。十月十日から十五日までです。みなさん見に来てください。入場は無料です。",
    english: {
      en: "Photography club news. Next month we'll hold a photo exhibition in front of the station. From October 10 to 15. Everyone please come see. Admission is free.",
      uk: "Новини фотогуртка. Наступного місяця проведемо фотовиставку біля станції. З 10 по 15 жовтня. Запрошуємо всіх. Вхід безкоштовний.",
    },
    questions: [
      {
        q: { en: "What club is this from?", uk: "З якого це гуртка?" },
        choices: [
          { en: "Music", uk: "Музичний" },
          { en: "Photography", uk: "Фотогурток" },
          { en: "Art", uk: "Художній" },
          { en: "Drama", uk: "Театральний" },
        ],
        answer: { en: "Photography", uk: "Фотогурток" },
      },
      {
        q: { en: "When is the exhibition?", uk: "Коли виставка?" },
        choices: [
          { en: "October 1-5", uk: "1-5 жовтня" },
          { en: "October 10-15", uk: "10-15 жовтня" },
          { en: "November 10-15", uk: "10-15 листопада" },
          { en: "September 10-15", uk: "10-15 вересня" },
        ],
        answer: { en: "October 10-15", uk: "10-15 жовтня" },
      },
      {
        q: { en: "How much is admission?", uk: "Скільки коштує вхід?" },
        choices: [
          { en: "100 yen", uk: "100 єн" },
          { en: "500 yen", uk: "500 єн" },
          { en: "Free", uk: "Безкоштовно" },
          { en: "1000 yen", uk: "1000 єн" },
        ],
        answer: { en: "Free", uk: "Безкоштовно" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Tamagoyaki recipe", uk: "Рецепт тамагоякі" },
    text: "卵焼きの作り方。卵を三つ、ボウルに入れます。砂糖と塩を少し入れます。よく混ぜます。フライパンで焼きます。簡単で美味しいです。",
    english: {
      en: "How to make tamagoyaki. Put 3 eggs in a bowl. Add a little sugar and salt. Mix well. Fry in a pan. Easy and delicious.",
      uk: "Як приготувати тамагоякі. Розбити 3 яйця в миску. Додати трохи цукру й солі. Гарно перемішати. Смажити на сковорідці. Просто й смачно.",
    },
    questions: [
      {
        q: { en: "How many eggs?", uk: "Скільки яєць?" },
        choices: [
          { en: "Two", uk: "Два" },
          { en: "Three", uk: "Три" },
          { en: "Four", uk: "Чотири" },
          { en: "Five", uk: "П'ять" },
        ],
        answer: { en: "Three", uk: "Три" },
      },
      {
        q: { en: "What is added besides eggs?", uk: "Що додають окрім яєць?" },
        choices: [
          { en: "Milk and pepper", uk: "Молоко і перець" },
          { en: "Sugar and salt", uk: "Цукор і сіль" },
          { en: "Soy sauce only", uk: "Лише соєвий соус" },
          { en: "Butter", uk: "Масло" },
        ],
        answer: { en: "Sugar and salt", uk: "Цукор і сіль" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "Postcard from Hokkaido", uk: "Поштівка з Хоккайдо" },
    text: "北海道から。今、札幌にいます。雪がとても多いです。寒いけど、雪まつりはきれいでした。明日は温泉に行きます。",
    english: {
      en: "From Hokkaido. I'm in Sapporo now. There's lots of snow. It's cold, but the snow festival was beautiful. Tomorrow I'm going to a hot spring.",
      uk: "З Хоккайдо. Зараз я в Саппоро. Снігу дуже багато. Холодно, але снігове свято — гарне. Завтра іду на онсен.",
    },
    questions: [
      {
        q: { en: "Where is the writer?", uk: "Де перебуває автор?" },
        choices: [
          { en: "Tokyo", uk: "Токіо" },
          { en: "Sapporo (Hokkaido)", uk: "Саппоро (Хоккайдо)" },
          { en: "Kyoto", uk: "Кіото" },
          { en: "Okinawa", uk: "Окінава" },
        ],
        answer: { en: "Sapporo (Hokkaido)", uk: "Саппоро (Хоккайдо)" },
      },
      {
        q: { en: "What is the writer doing tomorrow?", uk: "Що автор робитиме завтра?" },
        choices: [
          { en: "Skiing", uk: "Кататися на лижах" },
          { en: "Going to a hot spring", uk: "Іти на онсен" },
          { en: "Eating ramen", uk: "Їсти рамен" },
          { en: "Going home", uk: "Повертатися" },
        ],
        answer: { en: "Going to a hot spring", uk: "Іти на онсен" },
      },
    ],
  },
  {
    jlpt: 5,
    title: { en: "My friend", uk: "Мій друг" },
    text: "私の友達のけんたさんは料理が上手です。週末によく自分で料理を作ります。今度パーティーを開くそうです。私も招待されました。とても楽しみです。",
    english: {
      en: "My friend Kenta is good at cooking. He often cooks by himself on weekends. He says he'll have a party next time. I was invited too. I'm really looking forward to it.",
      uk: "Мій друг Кента добре готує. На вихідних часто готує сам. Каже, скоро влаштує вечірку. Мене теж запросили. Дуже чекаю.",
    },
    questions: [
      {
        q: { en: "What is Kenta good at?", uk: "У чому Кента вправний?" },
        choices: [
          { en: "Singing", uk: "Спів" },
          { en: "Cooking", uk: "Готування" },
          { en: "Sports", uk: "Спорт" },
          { en: "Drawing", uk: "Малювання" },
        ],
        answer: { en: "Cooking", uk: "Готування" },
      },
      {
        q: { en: "What event is Kenta planning?", uk: "Яку подію планує Кента?" },
        choices: [
          { en: "Trip", uk: "Подорож" },
          { en: "Party", uk: "Вечірку" },
          { en: "Concert", uk: "Концерт" },
          { en: "Class", uk: "Урок" },
        ],
        answer: { en: "Party", uk: "Вечірку" },
      },
    ],
  },
  // ===== N4 =====
  {
    jlpt: 4,
    title: { en: "Email from Japanese friend", uk: "Лист від японського друга" },
    text: "お久しぶりです。元気にしていますか。私は最近引っ越しました。新しい家は駅から近くて便利です。今度遊びに来てくださいね。待っています。",
    english: {
      en: "Long time no see. Are you well? I moved recently. The new house is close to the station and convenient. Come visit me sometime. I'll be waiting.",
      uk: "Давно не бачилися. Як справи? Я нещодавно переїхав. Нова квартира близько до станції, зручно. Приїжджай у гості. Чекатиму.",
    },
    questions: [
      {
        q: { en: "What is the main news?", uk: "Яка головна новина?" },
        choices: [
          { en: "Got a new job", uk: "Нова робота" },
          { en: "Moved to a new house", uk: "Переїхав у нову квартиру" },
          { en: "Bought a car", uk: "Купив машину" },
          { en: "Got married", uk: "Одружився" },
        ],
        answer: { en: "Moved to a new house", uk: "Переїхав у нову квартиру" },
      },
      {
        q: { en: "Why is the new place convenient?", uk: "Чому нове місце зручне?" },
        choices: [
          { en: "Big rooms", uk: "Великі кімнати" },
          { en: "Close to station", uk: "Близько до станції" },
          { en: "Quiet area", uk: "Тихий район" },
          { en: "Low rent", uk: "Низька оренда" },
        ],
        answer: { en: "Close to station", uk: "Близько до станції" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Cherry blossom season article", uk: "Стаття про сезон сакури" },
    text: "毎年三月から四月にかけて、桜が咲きます。多くの人が公園でお花見をします。家族や友達と集まって、お弁当を食べたり、お酒を飲んだりします。日本の春の風物詩です。",
    english: {
      en: "Every year from March to April, cherry blossoms bloom. Many people do hanami in parks. They gather with family and friends, eat bento, and drink sake. It's a typical scene of Japanese spring.",
      uk: "Щороку з березня по квітень цвіте сакура. Багато людей роблять ханамі в парках. Збираються з родиною та друзями, їдять бенто, п'ють саке. Це класична картина японської весни.",
    },
    questions: [
      {
        q: { en: "When do cherry blossoms bloom?", uk: "Коли цвіте сакура?" },
        choices: [
          { en: "January-February", uk: "Січень-лютий" },
          { en: "March-April", uk: "Березень-квітень" },
          { en: "May-June", uk: "Травень-червень" },
          { en: "Year-round", uk: "Цілорічно" },
        ],
        answer: { en: "March-April", uk: "Березень-квітень" },
      },
      {
        q: { en: "What is hanami?", uk: "Що таке ханамі?" },
        choices: [
          { en: "Tea ceremony", uk: "Чайна церемонія" },
          { en: "Flower viewing", uk: "Милування квітами" },
          { en: "Fireworks", uk: "Феєрверк" },
          { en: "Bonfire", uk: "Багаття" },
        ],
        answer: { en: "Flower viewing", uk: "Милування квітами" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Onigiri recipe", uk: "Рецепт онігірі" },
    text: "おにぎりの作り方。ご飯を炊いて、少し冷まします。塩水で手をぬらして、ご飯を三角形にします。中に梅干しや鮭を入れます。最後に海苔を巻きます。",
    english: {
      en: "How to make onigiri. Cook rice and let it cool a bit. Wet your hands with salt water and shape the rice into a triangle. Put umeboshi or salmon inside. Finally wrap with nori.",
      uk: "Як зробити онігірі. Зварити рис, трохи остудити. Намочити руки солоною водою і сформувати трикутник з рису. Усередину покласти умебоші або лосось. Наприкінці загорнути в норі.",
    },
    questions: [
      {
        q: { en: "What shape is onigiri?", uk: "Якої форми онігірі?" },
        choices: [
          { en: "Round", uk: "Круглий" },
          { en: "Triangle", uk: "Трикутний" },
          { en: "Square", uk: "Квадратний" },
          { en: "Cylinder", uk: "Циліндр" },
        ],
        answer: { en: "Triangle", uk: "Трикутний" },
      },
      {
        q: { en: "What goes inside?", uk: "Що всередині?" },
        choices: [
          { en: "Cheese", uk: "Сир" },
          { en: "Umeboshi or salmon", uk: "Умебоші або лосось" },
          { en: "Chicken only", uk: "Лише курка" },
          { en: "Vegetables", uk: "Овочі" },
        ],
        answer: { en: "Umeboshi or salmon", uk: "Умебоші або лосось" },
      },
      {
        q: { en: "What is wrapped around?", uk: "Чим обгортають?" },
        choices: [
          { en: "Lettuce", uk: "Салатом" },
          { en: "Nori (seaweed)", uk: "Норі (водорості)" },
          { en: "Paper", uk: "Папером" },
          { en: "Plastic", uk: "Плівкою" },
        ],
        answer: { en: "Nori (seaweed)", uk: "Норі (водорості)" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Festival notice", uk: "Оголошення про фестиваль" },
    text: "夏祭りのお知らせ。八月十五日、午後六時から駅前で夏祭りを行います。屋台や花火大会があります。浴衣を着てきてください。雨の場合は中止になります。",
    english: {
      en: "Summer festival notice. On August 15 from 6 PM, we'll hold a summer festival in front of the station. There will be food stalls and a fireworks display. Please come in yukata. Canceled in case of rain.",
      uk: "Оголошення про літнє свято. 15 серпня з 18:00 біля станції — літнє свято. Будуть ятки і феєрверк. Приходьте в юкаті. У дощ — відміна.",
    },
    questions: [
      {
        q: { en: "When is the festival?", uk: "Коли свято?" },
        choices: [
          { en: "August 15, 6 PM", uk: "15 серпня, 18:00" },
          { en: "August 5, 7 PM", uk: "5 серпня, 19:00" },
          { en: "July 15, 6 PM", uk: "15 липня, 18:00" },
          { en: "August 15, 8 AM", uk: "15 серпня, 8:00 ранку" },
        ],
        answer: { en: "August 15, 6 PM", uk: "15 серпня, 18:00" },
      },
      {
        q: { en: "What should attendees wear?", uk: "У чому приходити?" },
        choices: [
          { en: "Formal suit", uk: "У костюмі" },
          { en: "Yukata", uk: "У юкаті" },
          { en: "Sportswear", uk: "У спортивному" },
          { en: "Any clothes", uk: "У будь-якому" },
        ],
        answer: { en: "Yukata", uk: "У юкаті" },
      },
      {
        q: { en: "What happens if it rains?", uk: "Що буде у дощ?" },
        choices: [
          { en: "Postponed", uk: "Перенесуть" },
          { en: "Indoor", uk: "Перенесуть у приміщення" },
          { en: "Canceled", uk: "Скасують" },
          { en: "Half-day", uk: "Скоротять" },
        ],
        answer: { en: "Canceled", uk: "Скасують" },
      },
    ],
  },
  {
    jlpt: 4,
    title: { en: "Blog: learning Japanese", uk: "Блог: вивчаю японську" },
    text: "日本語を勉強して二年が経ちました。最初は漢字が全然分からなかったけど、毎日少しずつ覚えました。今はアニメも字幕なしで少し分かるようになりました。続けることが大切だと思います。",
    english: {
      en: "It's been two years since I started studying Japanese. At first I didn't understand kanji at all, but I learned a little every day. Now I can understand a bit of anime without subtitles. I think it's important to keep going.",
      uk: "Два роки, як я вивчаю японську. Спочатку зовсім не розумів канджі, але потроху щодня вчив. Зараз вже трохи розумію аніме без субтитрів. Гадаю, головне — не кидати.",
    },
    questions: [
      {
        q: { en: "How long has the writer studied Japanese?", uk: "Скільки часу автор вивчає японську?" },
        choices: [
          { en: "1 year", uk: "1 рік" },
          { en: "2 years", uk: "2 роки" },
          { en: "3 years", uk: "3 роки" },
          { en: "5 years", uk: "5 років" },
        ],
        answer: { en: "2 years", uk: "2 роки" },
      },
      {
        q: { en: "What can they now understand?", uk: "Що автор тепер розуміє?" },
        choices: [
          { en: "Newspapers", uk: "Газети" },
          { en: "Anime without subtitles", uk: "Аніме без субтитрів" },
          { en: "Business meetings", uk: "Ділові зустрічі" },
          { en: "Old literature", uk: "Стару літературу" },
        ],
        answer: { en: "Anime without subtitles", uk: "Аніме без субтитрів" },
      },
      {
        q: { en: "What's the writer's advice?", uk: "Яка порада автора?" },
        choices: [
          { en: "Travel to Japan", uk: "Поїхати в Японію" },
          { en: "Keep going", uk: "Не кидати" },
          { en: "Use textbooks only", uk: "Використовувати лише підручники" },
          { en: "Find a teacher", uk: "Знайти вчителя" },
        ],
        answer: { en: "Keep going", uk: "Не кидати" },
      },
    ],
  },
  // ===== N3 =====
  {
    jlpt: 3,
    title: { en: "Tea ceremony article", uk: "Стаття про чайну церемонію" },
    text: "茶道は、ただお茶を飲むだけのものではありません。客への心遣い、季節の感覚、道具の美しさなど、日本文化の精神が詰まっています。最近では、外国人観光客向けの体験教室も人気です。一度参加してみると、日本人でも新しい発見があるかもしれません。",
    english: {
      en: "The tea ceremony is not just about drinking tea. It contains the spirit of Japanese culture — consideration for guests, sense of season, beauty of utensils. Lately, experience classes for foreign tourists are also popular. Even Japanese people might make new discoveries by participating once.",
      uk: "Чайна церемонія — це не лише про чай. У ній закладений дух японської культури: турбота про гостя, відчуття сезону, краса посуду. Останнім часом популярні майстер-класи для іноземних туристів. Спробувавши хоч раз, навіть японець може зробити для себе відкриття.",
    },
    questions: [
      {
        q: { en: "What does the tea ceremony represent?", uk: "Що уособлює чайна церемонія?" },
        choices: [
          { en: "Just drinking tea", uk: "Просто пиття чаю" },
          { en: "The spirit of Japanese culture", uk: "Дух японської культури" },
          { en: "A type of meditation only", uk: "Лише медитацію" },
          { en: "A tourist gimmick", uk: "Туристичну фішку" },
        ],
        answer: { en: "The spirit of Japanese culture", uk: "Дух японської культури" },
      },
      {
        q: { en: "Who attends modern experience classes?", uk: "Хто відвідує сучасні майстер-класи?" },
        choices: [
          { en: "Only locals", uk: "Лише місцеві" },
          { en: "Foreign tourists", uk: "Іноземні туристи" },
          { en: "Children only", uk: "Лише діти" },
          { en: "Tea masters", uk: "Майстри чаю" },
        ],
        answer: { en: "Foreign tourists", uk: "Іноземні туристи" },
      },
    ],
  },
  {
    jlpt: 3,
    title: { en: "Essay: moving cities", uk: "Есе: переїзд між містами" },
    text: "東京で十年暮らした後、地方の小さな町に引っ越しました。都会の便利さは確かに恋しいですが、自然に囲まれた生活には別の豊かさがあります。朝、鳥の声で目を覚まし、夜は星がたくさん見えます。どちらが正解ということはなく、自分にとって何が大切かを考える時間でした。",
    english: {
      en: "After living in Tokyo for 10 years, I moved to a small country town. I do miss the convenience of the city, but life surrounded by nature has a different richness. I wake up to the sound of birds in the morning, and at night I see lots of stars. There's no right answer — it was a time to think about what matters to me.",
      uk: "Після 10 років у Токіо я переїхав у мале містечко в провінції. Так, мені бракує зручності міста, але життя в природі має іншу повноту. Зранку прокидаюся від співу птахів, увечері видно багато зірок. Тут немає правильної відповіді — це був час подумати, що дійсно важливо для мене.",
    },
    questions: [
      {
        q: { en: "Where did the writer live before?", uk: "Де автор жив до того?" },
        choices: [
          { en: "Osaka", uk: "Осака" },
          { en: "Kyoto", uk: "Кіото" },
          { en: "Tokyo for 10 years", uk: "Токіо 10 років" },
          { en: "Abroad", uk: "За кордоном" },
        ],
        answer: { en: "Tokyo for 10 years", uk: "Токіо 10 років" },
      },
      {
        q: { en: "What does the writer miss about the city?", uk: "Чого автору бракує з міста?" },
        choices: [
          { en: "The food", uk: "Їжа" },
          { en: "The convenience", uk: "Зручність" },
          { en: "The friends", uk: "Друзі" },
          { en: "The shopping", uk: "Шопінг" },
        ],
        answer: { en: "The convenience", uk: "Зручність" },
      },
      {
        q: { en: "What is the main takeaway?", uk: "Який головний висновок?" },
        choices: [
          { en: "Country life is better", uk: "Сільське життя краще" },
          { en: "City life is better", uk: "Міське життя краще" },
          { en: "No single right answer", uk: "Немає єдиної правильної відповіді" },
          { en: "Money is most important", uk: "Гроші — головне" },
        ],
        answer: { en: "No single right answer", uk: "Немає єдиної правильної відповіді" },
      },
    ],
  },
];

async function main() {
  console.log("Replacing listening + reading with fresh original content…");

  // Wipe existing exercises
  const oldL = await db.listeningExercise.count();
  const oldR = await db.readingExercise.count();
  await db.listeningExercise.deleteMany({});
  await db.readingExercise.deleteMany({});
  console.log(`  ✗ Removed ${oldL} listening + ${oldR} reading entries`);

  // Listening
  let l = 0;
  for (const x of LISTENING) {
    const questionsEn: Q[] = x.questions.map((q) => ({
      q: q.q.en,
      choices: q.choices.map((c) => c.en),
      answer: q.answer.en,
    }));
    const questionsUk: Q[] = x.questions.map((q) => ({
      q: q.q.uk,
      choices: q.choices.map((c) => c.uk),
      answer: q.answer.uk,
    }));
    await db.listeningExercise.create({
      data: {
        jlptLevel: x.jlpt,
        title: x.title.en,
        titleUk: x.title.uk,
        transcript: x.transcript,
        english: x.english.en,
        englishUk: x.english.uk,
        questions: JSON.stringify(questionsEn),
        questionsUk: JSON.stringify(questionsUk),
      },
    });
    l++;
  }
  console.log(`  ✓ ${l} new listening exercises`);

  // Reading
  let r = 0;
  for (const x of READING) {
    const questionsEn: Q[] = x.questions.map((q) => ({
      q: q.q.en,
      choices: q.choices.map((c) => c.en),
      answer: q.answer.en,
    }));
    const questionsUk: Q[] = x.questions.map((q) => ({
      q: q.q.uk,
      choices: q.choices.map((c) => c.uk),
      answer: q.answer.uk,
    }));
    await db.readingExercise.create({
      data: {
        jlptLevel: x.jlpt,
        title: x.title.en,
        titleUk: x.title.uk,
        text: x.text,
        english: x.english.en,
        englishUk: x.english.uk,
        questions: JSON.stringify(questionsEn),
        questionsUk: JSON.stringify(questionsUk),
      },
    });
    r++;
  }
  console.log(`  ✓ ${r} new reading exercises`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
