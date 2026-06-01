import "server-only";
import { cookies } from "next/headers";
import { LOCALE_COOKIE, format, type Locale, type Vars } from "@/lib/i18n-shared";

const STRINGS = {
  // ===== Navigation =====
  "nav.home": { en: "Home", uk: "Головна" },
  "nav.grammar": { en: "Grammar", uk: "Граматика" },
  "nav.vocabulary": { en: "Vocabulary", uk: "Словник" },
  "nav.vocab_short": { en: "Vocab", uk: "Слова" },
  "nav.practice": { en: "Practice", uk: "Практика" },
  "nav.listening": { en: "Listening", uk: "Аудіювання" },
  "nav.reading": { en: "Reading", uk: "Читання" },
  "nav.stats": { en: "Stats", uk: "Статистика" },
  "nav.kanji": { en: "Kanji", uk: "Канджі" },
  "nav.review": { en: "Review", uk: "Повторення" },

  // ===== Common =====
  "common.back": { en: "Back", uk: "Назад" },
  "common.next": { en: "Next", uk: "Далі" },
  "common.start": { en: "Start", uk: "Почати" },
  "common.check": { en: "Check", uk: "Перевірити" },
  "common.restart": { en: "Restart", uk: "Спочатку" },
  "common.reset": { en: "Reset", uk: "Скинути" },
  "common.save": { en: "Save", uk: "Зберегти" },
  "common.cancel": { en: "Cancel", uk: "Скасувати" },
  "common.edit": { en: "Edit", uk: "Редагувати" },
  "common.correct": { en: "Correct!", uk: "Правильно!" },
  "common.answer": { en: "Answer", uk: "Відповідь" },
  "common.score": { en: "Score", uk: "Бал" },
  "common.question": { en: "Question", uk: "Питання" },
  "common.show_answer": { en: "Show answer", uk: "Показати відповідь" },
  "common.again": { en: "Again", uk: "Знову" },
  "common.hard": { en: "Hard", uk: "Важко" },
  "common.good": { en: "Good", uk: "Добре" },
  "common.easy": { en: "Easy", uk: "Легко" },
  "common.listen": { en: "Listen", uk: "Прослухати" },
  "common.play": { en: "Play", uk: "Грати" },
  "common.in_deck": { en: "in deck", uk: "у колоді" },
  "common.learned": { en: "learned", uk: "вивчено" },
  "common.learning": { en: "learning", uk: "вивчається" },
  "common.added_to_deck": { en: "Added to deck", uk: "Додано до колоди" },
  "common.in_your_deck": { en: "In your deck", uk: "Уже в колоді" },

  // ===== Home / Dashboard =====
  "home.welcome": { en: "Welcome back", uk: "З поверненням" },
  "home.title": { en: "Today's study plan", uk: "План на сьогодні" },
  "home.start_review": { en: "Start review ({count})", uk: "Почати повторення ({count})" },
  "home.streak": { en: "Streak", uk: "Серія" },
  "home.streak_days": { en: "{n} day", uk: "{n} день" },
  "home.streak_days_pl": { en: "{n} days", uk: "{n} днів" },
  "home.next_milestone": { en: "Next milestone: {n} days", uk: "Наступна ціль: {n} днів" },
  "home.all_milestones": { en: "All milestones reached!", uk: "Усі цілі досягнуті!" },
  "home.xp": { en: "XP", uk: "XP" },
  "home.level_xp_progress": { en: "Level {level} — {current}/{needed} XP", uk: "Рівень {level} — {current}/{needed} XP" },
  "home.reviews_due": { en: "Reviews due", uk: "До повторення" },
  "home.reviews_breakdown": { en: "{newCount} new · {learningCount} learning", uk: "{newCount} нових · {learningCount} у процесі" },
  "home.daily_goal": { en: "Daily goal", uk: "Денна ціль" },
  "home.to_go": { en: "{n} to go", uk: "Лишилось: {n}" },
  "home.review_queue": { en: "Review queue", uk: "Черга повторення" },
  "home.cards_ready": { en: "{n} cards ready · mixed across vocab, kanji and grammar", uk: "{n} карток готові · слова, канджі та граматика" },
  "home.open_to_add": { en: "Open any word, kanji, or grammar point to add it to your deck.", uk: "Відкрий будь-яке слово, канджі чи граматику, щоб додати в колоду." },
  "home.up_next": { en: "Up next", uk: "Далі по черзі" },
  "home.deck_empty": { en: "Your deck is empty.", uk: "Колода порожня." },
  "home.browse_to_add": { en: "Browse vocabulary, kanji, or grammar and open any item to add it.", uk: "Відкрий слова, канджі або граматику й додай будь-який пункт." },
  "home.your_progress": { en: "Your N{level} progress", uk: "Твій прогрес N{level}" },
  "home.progress_summary": { en: "{learned} of {total} items learned at this level ({pct}%)", uk: "Вивчено {learned} з {total} на цьому рівні ({pct}%)" },
  "home.switch_level_hint": { en: "Switch level in the navbar to see progress.", uk: "Переключи рівень у меню, щоб побачити прогрес." },
  "home.level_label": { en: "Level {n}", uk: "Рівень {n}" },
  "home.xp_to_next": { en: "XP to next level", uk: "До наступного рівня" },
  "home.xp_total": { en: "{current} / {needed} XP ({total} total)", uk: "{current} / {needed} XP (усього {total})" },
  "home.cat.grammar": { en: "Grammar", uk: "Граматика" },
  "home.cat.vocabulary": { en: "Vocabulary", uk: "Словник" },
  "home.cat.kanji": { en: "Kanji", uk: "Канджі" },
  "home.progress_row": { en: "{learned} learned · {learning} in progress · {total} total", uk: "Вивчено: {learned} · у процесі: {learning} · усього: {total}" },
  "home.no_content_title": { en: "No content yet", uk: "Немає контенту" },
  "home.no_content_body": { en: "Run npm run seed to load starter content (kana, basic vocab, N5 grammar, common kanji). Then import Genki lessons via npm run seed:genki.", uk: "Виконай npm run seed щоб завантажити стартовий контент. Потім npm run seed:genki для уроків Genki." },

  // ===== Vocabulary =====
  "vocab.title": { en: "Vocabulary", uk: "Словник" },
  "vocab.summary": { en: "N{level} · {shown} of {total} words. Click a word to study it.", uk: "N{level} · {shown} з {total} слів. Клікни на слово для вивчення." },
  "vocab.empty_cat": { en: "No words in this category at N{level}.", uk: "У цій категорії немає слів для N{level}." },
  "vocab.cat.all": { en: "All", uk: "Усі" },
  "vocab.cat.latest": { en: "Latest", uk: "Нові" },
  "vocab.cat.nouns": { en: "Nouns", uk: "Іменники" },
  "vocab.cat.verbs": { en: "Verbs", uk: "Дієслова" },
  "vocab.cat.adjectives": { en: "Adjectives", uk: "Прикметники" },
  "vocab.cat.other": { en: "Other", uk: "Інше" },
  "vocab.detail.kanji_used": { en: "Kanji used", uk: "Канджі у слові" },
  "vocab.detail.examples": { en: "Examples", uk: "Приклади" },

  // ===== Grammar =====
  "grammar.title": { en: "Grammar", uk: "Граматика" },
  "grammar.subtitle": { en: "Showing N{level}. Complete each section's topics, then run the section review quiz to mix all points together with new questions.", uk: "Рівень N{level}. Пройди всі теми розділу, потім відкрий підсумкову вікторину з новими питаннями по всьому розділу." },
  "grammar.no_content": { en: "No grammar at this level yet.", uk: "Поки немає граматики на цьому рівні." },
  "grammar.topics_learned": { en: "{learned} / {total} topics learned", uk: "Вивчено: {learned} / {total} тем" },
  "grammar.section_review": { en: "Section review", uk: "Огляд розділу" },
  "grammar.preview_review": { en: "Preview review", uk: "Попередній перегляд" },
  "grammar.other_points": { en: "Other grammar points", uk: "Інші правила" },
  "grammar.other_points_desc": { en: "Topics not assigned to a section.", uk: "Теми поза розділами." },
  "grammar.explanation": { en: "Explanation", uk: "Пояснення" },
  "grammar.examples": { en: "Examples", uk: "Приклади" },
  "grammar.ready_to_practice": { en: "Ready to practice?", uk: "Готовий до практики?" },
  "grammar.ready_desc": { en: "{count} questions: multiple choice, fill-in, arrange tokens, and translate to Japanese.", uk: "{count} питань: вибір варіанту, заповнення, складання речення, переклад на японську." },
  "grammar.start_practice": { en: "Start practice", uk: "Почати практику" },

  // Practice page
  "practice.title_suffix": { en: "Practice", uk: "Практика" },
  "practice.questions_title": { en: "Practice ({count} questions)", uk: "Практика ({count} питань)" },
  "practice.questions_desc": { en: "Mix of MCQ, fill-in, arrange-the-tokens, and translate-to-Japanese.", uk: "Мікс: вибір варіанту, заповнення, складання токенів, переклад." },
  "practice.no_questions": { en: "No practice questions for this grammar point yet.", uk: "Поки немає питань для цього правила." },
  "practice.quiz_complete": { en: "Quiz complete — {score}/{total} correct", uk: "Тест завершено — {score}/{total} правильно" },
  "practice.pct_perfect": { en: "{pct}% — Perfect!", uk: "{pct}% — Бездоганно!" },
  "practice.pct_great": { en: "{pct}% — Great job!", uk: "{pct}% — Чудова робота!" },
  "practice.pct_keep": { en: "{pct}% — Keep practicing!", uk: "{pct}% — Тренуйся далі!" },
  "practice.progress": { en: "Question {i} / {total}", uk: "Питання {i} / {total}" },
  "practice.score": { en: "Score: {score}", uk: "Бал: {score}" },
  "practice.arrange_to_form": { en: "Arrange to form:", uk: "Склади речення:" },
  "practice.arrange_hint": { en: "Click tokens below to assemble the sentence", uk: "Натискай токени нижче, щоб скласти речення" },
  "practice.placeholder_translate": { en: "Type Japanese (romaji auto-converts)", uk: "Введи японською (ромадзі конвертується автоматично)" },
  "practice.placeholder_answer": { en: "Type the answer…", uk: "Введи відповідь…" },
  "practice.romaji_hint_pre": { en: "Type romaji like", uk: "Введи ромадзі, як-от" },
  "practice.romaji_hint_mid": { en: "and it auto-converts to", uk: "— воно автоматично перетвориться на" },

  // Section review
  "section.back_to_grammar": { en: "Back to grammar", uk: "До граматики" },
  "section.review_subtitle": { en: "Section review — {count} new questions mixing all {total} topics in this section.", uk: "Огляд розділу — {count} нових питань, які перевіряють усі {total} тем розділу." },
  "section.locked_hint": { en: "({remaining} topics still need to reach the review state to officially complete this section.)", uk: "(Ще {remaining} тем мають дійти до стану review, щоб офіційно закрити розділ.)" },
  "section.preview_mode": { en: "Preview mode", uk: "Попередній перегляд" },
  "section.preview_body": { en: "You can practice the section review now, but it's designed to be taken after all topics in this section are learned (reached review state in SRS). Currently {learned}/{total} learned.", uk: "Підсумкову вікторину можна пройти і зараз, але вона розрахована на момент, коли всі теми вивчено. Зараз {learned}/{total} вивчено." },
  "section.mixed_quiz": { en: "Mixed review quiz", uk: "Підсумкова вікторина" },
  "section.mixed_quiz_desc": { en: "Questions are new — they don't repeat what you saw in individual lessons.", uk: "Питання нові — не повторюють того, що було в окремих уроках." },
  "section.no_review": { en: "No section review questions yet.", uk: "Поки немає питань для огляду розділу." },

  // ===== Quiz block =====
  "quiz.q_progress": { en: "Question {i} / {total}", uk: "Питання {i} / {total}" },
  "quiz.score_label": { en: "Score: {n}", uk: "Бал: {n}" },
  "quiz.complete": { en: "Quiz complete — {score}/{total} correct", uk: "Вікторину пройдено — {score}/{total} правильних" },
  "quiz.complete_pct": { en: "{pct}% — {label}", uk: "{pct}% — {label}" },
  "quiz.complete_perfect": { en: "Perfect!", uk: "Бездоганно!" },
  "quiz.complete_great": { en: "Great job!", uk: "Чудова робота!" },
  "quiz.complete_keep": { en: "Keep practicing!", uk: "Продовжуй практикуватись!" },
  "quiz.arrange_hint": { en: "Arrange to form: {hint}", uk: "Склади речення: {hint}" },
  "quiz.arrange_empty": { en: "Click tokens below to assemble the sentence", uk: "Клікай токени нижче, щоб скласти речення" },
  "quiz.input_translate": { en: "Type Japanese (romaji auto-converts)", uk: "Введи японською (ромаджі сам перетворюється)" },
  "quiz.input_answer": { en: "Type the answer…", uk: "Введи відповідь…" },
  "quiz.romaji_hint": { en: "Type romaji like watashi and it auto-converts to わたし.", uk: "Введи ромаджі типу watashi — само перетвориться у わたし." },

  // ===== Kanji =====
  "kanji.title": { en: "Kanji", uk: "Канджі" },
  "kanji.summary": { en: "Showing N{level} kanji ({count}). Change level in the navbar.", uk: "N{level} канджі ({count}). Зміни рівень у меню." },
  "kanji.empty": { en: "No kanji at this level yet. Run npm run seed.", uk: "На цьому рівні поки немає канджі. Виконай npm run seed." },
  "kanji.on_readings": { en: "On readings", uk: "Читання Он" },
  "kanji.kun_readings": { en: "Kun readings", uk: "Читання Кун" },
  "kanji.radicals": { en: "Radicals", uk: "Радикали" },
  "kanji.mnemonic": { en: "Mnemonic", uk: "Мнемоніка" },
  "kanji.no_mnemonic": { en: "No mnemonic yet.", uk: "Поки немає мнемоніки." },
  "kanji.mnemonic_placeholder": { en: "Story / image that helps you remember this kanji…", uk: "Історія чи образ, який допомагає запам'ятати канджі…" },
  "kanji.strokes_meta": { en: "N{level} · {strokes} strokes", uk: "N{level} · {strokes} рисок" },

  // ===== Listening / Reading =====
  "listening.title": { en: "Listening", uk: "Аудіювання" },
  "listening.summary": { en: "N{level} audio exercises ({count}). Change level in the navbar.", uk: "N{level} вправ з аудіювання ({count}). Зміни рівень у меню." },
  "listening.empty": { en: "No listening exercises at this level yet.", uk: "На цьому рівні поки немає аудіо-вправ." },
  "listening.show_transcript": { en: "Show transcript", uk: "Показати транскрипт" },
  "listening.hide_transcript": { en: "Hide transcript", uk: "Сховати транскрипт" },
  "listening.check_answers": { en: "Check answers", uk: "Перевірити відповіді" },
  "listening.score_label": { en: "Score: {score} / {total}", uk: "Бал: {score} / {total}" },
  "listening.start_exercise": { en: "Start exercise", uk: "Почати вправу" },
  "listening.collapse": { en: "Collapse", uk: "Згорнути" },

  "reading.title": { en: "Reading", uk: "Читання" },
  "reading.summary": { en: "N{level} reading exercises ({count}). Change level in the navbar.", uk: "N{level} вправ з читання ({count}). Зміни рівень у меню." },
  "reading.empty": { en: "No reading exercises at this level yet.", uk: "На цьому рівні поки немає текстів." },
  "reading.show_translation": { en: "Show translation", uk: "Показати переклад" },
  "reading.hide_translation": { en: "Hide translation", uk: "Сховати переклад" },

  // ===== Review =====
  "review.empty_title": { en: "Nothing due right now", uk: "Зараз нічого повторювати" },
  "review.empty_body": { en: "Add new vocabulary, kanji, or grammar to your study queue from their pages. Come back tomorrow for scheduled reviews.", uk: "Додай нові слова, канджі або граматику з відповідних сторінок. Повертайся завтра по запланованих повтореннях." },
  "review.all_done_title": { en: "All done!", uk: "Усе готово!" },
  "review.all_done_body": { en: "You reviewed {n} card this session.", uk: "Ти повторив(ла) {n} картку за цю сесію." },
  "review.all_done_body_pl": { en: "You reviewed {n} cards this session.", uk: "Ти повторив(ла) {n} карток за цю сесію." },
  "review.back_home": { en: "Back home", uk: "На головну" },
  "review.recall_vocab": { en: "Recall reading + meaning", uk: "Пригадай читання та значення" },
  "review.recall_kanji": { en: "Recall meaning + readings", uk: "Пригадай значення та читання" },
  "review.recall_grammar": { en: "Recall the grammar pattern", uk: "Пригадай граматичну конструкцію" },

  // ===== Stats =====
  "stats.title": { en: "Stats", uk: "Статистика" },
  "stats.subtitle": { en: "Track your study consistency and JLPT progress.", uk: "Стеж за регулярністю навчання та прогресом JLPT." },
  "stats.activity_title": { en: "Activity — last 12 weeks", uk: "Активність — останні 12 тижнів" },
  "stats.activity_desc": { en: "Each cell is a day. Darker = more reviews.", uk: "Кожна клітинка — день. Темніше — більше повторень." },
  "stats.jlpt_progress": { en: "JLPT progress", uk: "Прогрес JLPT" },
  "stats.jlpt_desc": { en: "Cards in the \"review\" state count as learned.", uk: "Картки у стані review зараховуються як вивчені." },
  "stats.level_progress": { en: "Level progress", uk: "Прогрес рівня" },
  "stats.achievements": { en: "Achievements", uk: "Досягнення" },
  "stats.total_reviews": { en: "Total reviews", uk: "Усього повторень" },
  "stats.streak_label": { en: "Streak", uk: "Серія" },

  // ===== Locale switcher =====
  "locale.label_long": { en: "Language", uk: "Мова" },
} as const;

export type StringKey = keyof typeof STRINGS;

export async function getLocale(): Promise<Locale> {
  const c = await cookies();
  const v = c.get(LOCALE_COOKIE)?.value;
  // Default to Ukrainian; only "en" explicitly switches to English.
  return v === "en" ? "en" : "uk";
}

export type T = (key: StringKey, vars?: Vars) => string;

export async function getT(): Promise<T> {
  const locale = await getLocale();
  return (key, vars) => format(STRINGS[key]?.[locale] ?? STRINGS[key]?.en ?? key, vars);
}
