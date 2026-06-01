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
npm run seed:vocab           # расширенный словарь (~300 слов N5/N4/N3)
npm run seed:n5              # полный набор N5: 101 кандзи + ~210 слов
npm run seed:radicals        # радикалы + разбор кандзи по радикалам
npm run seed:n5:more         # ещё N5: кандзи 車/休 + ~90 слов
npm run seed:vocab:more      # ещё ~90 слов N5/N4/N3 (времена года, глаголы, наречия)
npm run seed:content:v3      # 12 listening + 15 reading на N5/N4/N3 (заменяет старые)
npm run seed:content:extra   # ещё 9 listening + 10 reading на N4/N3
npm run seed:examples        # ~157 примеров предложений для словаря
npm run translate:uk         # заполнить украинские поля (по словарям)
npm run translate:uk:extra   # второй проход: мнемоники, объяснения грамматики, listening/reading
npm run translate:uk:exercises # текст упражнений (промпты, пояснения) + примеры словаря
npm run dev
```

Открой <http://localhost:3000>.

## Перенос на другой Windows-ПК

В корне репозитория лежат `setup.bat` + `setup.ps1` — двоклик `setup.bat` поднимает проект на чистом ПК с нуля.

### Что делает setup.ps1

1. Проверяет наличие `node` / `npm`
2. `npm install`
3. Создаёт `.env` с `DATABASE_URL`, если его нет
4. `npx prisma generate` + `npx prisma migrate deploy`
5. Если `dev.db` уже скопирован — пропускает сидинг (сохраняет SRS-прогресс)
   Если `dev.db` отсутствует — запускает все сидеры по порядку
6. `npm run dev` → сайт на `http://localhost:3000`

### Пошагово

**Если хочешь сохранить прогресс SRS** (повторения, XP, стрик):

1. На исходном ПК скопируй папку `japanese-srs` целиком, **кроме** `node_modules` и `.next` (они большие и пересоздаются)
2. Убедись, что вместе с проектом скопировался файл `dev.db` в корне репозитория — он содержит весь прогресс
3. Перенеси папку на новый ПК (USB / архив / OneDrive)
4. Установи [Node.js LTS](https://nodejs.org) (один раз; даст `node` и `npm`)
5. Двоклик `setup.bat` в скопированной папке
6. Дождись надписи `Site will be available at http://localhost:3000` и открой её в браузере

**Если прогресс не нужен** — просто склонируй репозиторий:

```powershell
git clone https://github.com/Mariia157/japanese-study-web.git
cd japanese-study-web
.\setup.bat
```

`dev.db` будет отсутствовать, и скрипт автоматически прогонит все сидеры (~3–5 минут на первый запуск).

### Если PowerShell ругается на политику безопасности

Скрипт `setup.bat` уже передаёт `-ExecutionPolicy Bypass`, так что вручную ничего менять не нужно. Если всё-таки требуется — один раз в админском PowerShell:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

### Последующие запуски

Достаточно `npm run dev` в терминале из папки проекта (или снова двоклик `setup.bat` — он за пару секунд проверит зависимости и запустит сервер).

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

Использует **SQLite** локально (файл `dev.db` в корне репозитория, путь прописан в `.env` как `DATABASE_URL="file:./dev.db"`). Все массивы и JSON хранятся как строки JSON (для совместимости с SQLite).

Ключевые модели: `Kanji`, `Radical`, `Vocabulary`, `GrammarPoint`, `GrammarExercise`, `ListeningExercise`, `ReadingExercise`, `SrsCard`, `ReviewLog`, `UserStats`, `Achievement`.

Для деплоя на Vercel поменяй `provider = "sqlite"` на `"postgresql"` в `prisma/schema.prisma`, добавь `DATABASE_URL` Postgres и запусти `prisma migrate deploy`.

### Как получить доступ к БД

**1. Prisma Studio** — визуальный браузер с фильтрами и редактированием
```powershell
npm run db:studio
```
Откроет `http://localhost:5555`.

**2. SQLite CLI** (если установлен `sqlite3`)
```powershell
sqlite3 dev.db
.tables
SELECT word, reading, jlptLevel FROM Vocabulary LIMIT 10;
.exit
```

**3. GUI-клиент** — открыть файл `dev.db` в:
- [DB Browser for SQLite](https://sqlitebrowser.org/) — бесплатный, удобный для просмотра
- DBeaver / TablePlus / DataGrip

**4. Одноразовый запрос через Prisma из кода**
```ts
// scripts/query.ts
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: "./dev.db" }) });
const rows = await db.vocabulary.findMany({ where: { jlptLevel: 3 }, take: 10 });
console.log(rows);
await db.$disconnect();
```
Запуск: `npx tsx scripts/query.ts`.

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
| `npm run seed` | Стартовый набор контента (N5: радикалы, кандзи, слова, грамматика) |
| `npm run seed:genki` | Курированный Genki 1+2 — 44 грамм. точки |
| `npm run seed:vocab` | Расширенный словарь (~300 слов N5/N4/N3) |
| `npm run seed:n5` | Полный набор N5 — 101 кандзи + ~210 слов (с мнемониками и радикалами) |
| `npm run seed:radicals` | Доп. радикалы + привязка кандзи к радикалам |
| `npm run seed:n5:more` | Ещё N5 — кандзи 車/休 + ~90 слов (цвета, тело, время, вопросы, наречия) |
| `npm run seed:vocab:more` | Ещё ~90 слов N5/N4/N3 (времена года, природа, глаголы, прилагательные, наречия) |
| `npm run seed:content:v3` | Listening + reading с картинками (заменяет существующие) |
| `npm run seed:content:extra` | Дополнительные N4/N3 listening + reading |
| `npm run seed:examples` | Примеры предложений для словаря |
| `npm run seed:explanations` | Развёрнутые объяснения грамматики |
| `npm run translate:uk` | Заполнить украинские поля на основе английских (словари) |
| `npm run translate:uk:extra` | Второй проход: мнемоники кандзи, объяснения и примеры грамматики, listening/reading |
| `npm run translate:uk:exercises` | Текст упражнений грамматики (промпты, пояснения) + примеры предложений словаря |
| `npm run seed:genki:pdf` | Импорт PDF (если есть текстовый слой) |

## Лицензия

Личный проект. Код можешь использовать как угодно. Учебный контент в `scripts/seed-starter.ts` — общеизвестные сведения о японском, без копирайта. Контент в `scripts/seed-genki.ts` — пересказ структуры Genki своими словами для личного изучения. PDF учебников не входят в репозиторий.
