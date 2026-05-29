# Nihongo SRS — изучение японского

Персональное веб-приложение для изучения японского языка с системой spaced repetition (SM-2), охватывающее уровни JLPT N5–N1.

## Возможности

- **SRS-движок (SM-2)** — словарь, кандзи и грамматика проходят через единый алгоритм интервальных повторений в стиле Anki
- **Грамматика** — теория, примеры и квизы по каждой теме; курс структурирован по урокам Genki 1 + Genki 2
- **Словарь** по уровням JLPT с одним кликом для добавления слова в очередь изучения
- **Кандзи** с редактором мнемоник и разбором по радикалам
- **Аудирование** и **чтение** — упражнения с проверочными вопросами; для звука используется Web Speech API (или Tatoeba, если есть)
- **Фуригана** — автоматически отображается над кандзи в карточках ревью и списке слов
- **Геймификация** — XP, ежедневный стрик, daily goal, ачивки
- **Статистика** — heatmap активности за 12 недель, прогресс по уровням JLPT, разблокированные ачивки
- **Переключатель уровня JLPT в навбаре** — выбранный уровень действует на все разделы сразу

## Стек

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Prisma 7** + **better-sqlite3** (SQLite локально; на проде переключается на PostgreSQL через `DATABASE_URL`)
- **Vitest** — юнит-тесты SM-2
- shadcn/ui-стиль компоненты + lucide-иконки
- Бело-фиолетовая цветовая палитра (`#7c3aed` + градиенты)

## Локальный запуск

```bash
npm install
npm run db:migrate           # создаст SQLite БД и применит миграции
npm run seed                 # стартовый набор N5 (радикалы, кандзи, слова, грамматика, listening, reading)
npm run seed:genki           # курированный Genki 1+2: 44 грамматические точки + 88 слов
npm run dev
```

Открой <http://localhost:3000>.

## Архитектура

```
src/
  app/
    page.tsx                  # дашборд: стрик, XP, due-ревью, daily goal
    review/                   # /review — сессия SRS с кнопками Again/Hard/Good/Easy
    grammar/                  # список грамматики текущего JLPT + детали по slug
    vocabulary/               # словарь текущего уровня
    kanji/                    # кандзи текущего уровня + детальная страница по символу
    listening/, reading/      # упражнения по аудированию и чтению
    stats/                    # heatmap, прогресс, ачивки
    api/
      srs/queue                # GET: due-карточки на сегодня
      srs/review               # POST: оценка карточки 1–4 → планирование + начисление XP
      srs/add                  # POST: добавить элемент в очередь SRS
      level                    # POST: смена JLPT-уровня (cookie)
      kanji/[id]/mnemonic      # POST: сохранить мнемонику
  components/
    Nav.tsx, LevelSwitcher.tsx
    Furigana.tsx               # ruby-аннотации кандзи
    srs/ReviewSession.tsx      # карточка ревью
    grammar/QuizBlock.tsx      # квизы
    kanji/MnemonicEditor.tsx   # редактор мнемоник
    listening/, reading/       # упражнения
    ui/                        # Card, Button, Progress
  lib/
    srs/sm2.ts                 # алгоритм SM-2 (с юнит-тестами)
    srs/queue.ts               # построение очереди ревью
    xp.ts                      # XP, стрики, ачивки
    level.ts                   # текущий JLPT-уровень из cookie
    db.ts                      # Prisma client (singleton + SQLite adapter)
prisma/
  schema.prisma                # все модели
scripts/
  seed-starter.ts              # минимальный N5-набор для старта
  seed-genki.ts                # курированная структура Genki 1+2 (грамматика+слова)
  import-genki.ts              # PDF-парсер Genki (работает только с PDF, у которых есть текстовый слой)
```

## Логика SM-2

`src/lib/srs/sm2.ts` — чистая функция, оценки 1–4:

- **1 (Again)** — сбрасывает счётчик повторений, следующий показ через 1 день
- **2 (Hard)** — интервал ×0.6
- **3 (Good)** — стандартный интервал: 1 → 6 → 6×EF → 6×EF² ...
- **4 (Easy)** — интервал ×1.3, ease factor растёт

Ease factor имеет нижнюю границу 1.3. Все 6 тест-кейсов в `sm2.test.ts` проходят.

## База данных

Использует **SQLite** локально (файл `prisma/dev.db`). Все массивы и JSON хранятся как строки JSON (для совместимости с SQLite).

Ключевые модели: `Kanji`, `Radical`, `Vocabulary`, `GrammarPoint`, `GrammarExercise`, `ListeningExercise`, `ReadingExercise`, `SrsCard`, `ReviewLog`, `UserStats`, `Achievement`.

Для деплоя на Vercel поменяй `provider = "sqlite"` на `"postgresql"` в `prisma/schema.prisma`, добавь `DATABASE_URL` Postgres и запусти `prisma migrate deploy`.

## Источники контента

- **Стартовый набор (`npm run seed`)** — 15 радикалов, 30 N5-кандзи (с готовыми мнемониками), 30 базовых слов, 5 грамматических конструкций N5, listening/reading примеры
- **Genki track (`npm run seed:genki`)** — 44 грамматические точки по 23 урокам Genki 1+2 + 88 слов с привязкой к урокам через `source: "genki-L<n>"`. Контент написан вручную на основе общеизвестной структуры учебника
- **PDF-парсер (`npm run seed:genki:pdf -- --book=1|2 --textbook=<path>`)** — для PDF с текстовым слоем; сканированные изображения не парсятся

> **Важно:** Genki — коммерческий учебник. PDF в этот репозиторий НЕ включены. Используй только собственные легально приобретённые копии для личного изучения.

## Деплой на Vercel

1. Запушить репозиторий на GitHub
2. Создать проект на Vercel, подключить Vercel Postgres (или Neon)
3. В `prisma/schema.prisma` поменять `provider` с `sqlite` на `postgresql`
4. Задать `DATABASE_URL` в переменных окружения Vercel
5. Build command: `prisma migrate deploy && next build`
6. (Рекомендуется) добавить Basic Auth middleware (`src/middleware.ts`), особенно если БД содержит контент, производный от Genki

## Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Запуск Turbopack dev-сервера |
| `npm run build` | Production-сборка |
| `npm test` | Юнит-тесты SM-2 (Vitest) |
| `npm run db:migrate` | Применить Prisma-миграции |
| `npm run db:studio` | Prisma Studio (визуальный браузер БД) |
| `npm run seed` | Стартовый набор контента |
| `npm run seed:genki` | Курированный Genki 1+2 |
| `npm run seed:genki:pdf` | Импорт PDF (если есть текстовый слой) |

## Лицензия

Личный проект. Код можешь использовать как угодно. Учебный контент в `scripts/seed-starter.ts` — общеизвестные сведения о японском, без копирайта. Контент в `scripts/seed-genki.ts` — пересказ структуры Genki своими словами для личного изучения. PDF учебников не входят в репозиторий.
