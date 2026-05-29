-- CreateTable
CREATE TABLE "Radical" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "character" TEXT NOT NULL,
    "meaning" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Kanji" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "character" TEXT NOT NULL,
    "meanings" TEXT NOT NULL,
    "onReadings" TEXT NOT NULL,
    "kunReadings" TEXT NOT NULL,
    "jlptLevel" INTEGER NOT NULL,
    "strokeCount" INTEGER NOT NULL DEFAULT 0,
    "mnemonic" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "KanjiRadical" (
    "kanjiId" INTEGER NOT NULL,
    "radicalId" INTEGER NOT NULL,

    PRIMARY KEY ("kanjiId", "radicalId"),
    CONSTRAINT "KanjiRadical_kanjiId_fkey" FOREIGN KEY ("kanjiId") REFERENCES "Kanji" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "KanjiRadical_radicalId_fkey" FOREIGN KEY ("radicalId") REFERENCES "Radical" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vocabulary" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "word" TEXT NOT NULL,
    "reading" TEXT NOT NULL,
    "meanings" TEXT NOT NULL,
    "partOfSpeech" TEXT NOT NULL,
    "jlptLevel" INTEGER NOT NULL,
    "source" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "VocabularyKanji" (
    "vocabularyId" INTEGER NOT NULL,
    "kanjiId" INTEGER NOT NULL,

    PRIMARY KEY ("vocabularyId", "kanjiId"),
    CONSTRAINT "VocabularyKanji_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VocabularyKanji_kanjiId_fkey" FOREIGN KEY ("kanjiId") REFERENCES "Kanji" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ExampleSentence" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "japanese" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "audioUrl" TEXT
);

-- CreateTable
CREATE TABLE "VocabularyExample" (
    "vocabularyId" INTEGER NOT NULL,
    "exampleId" INTEGER NOT NULL,

    PRIMARY KEY ("vocabularyId", "exampleId"),
    CONSTRAINT "VocabularyExample_vocabularyId_fkey" FOREIGN KEY ("vocabularyId") REFERENCES "Vocabulary" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "VocabularyExample_exampleId_fkey" FOREIGN KEY ("exampleId") REFERENCES "ExampleSentence" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrammarPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "jlptLevel" INTEGER NOT NULL,
    "source" TEXT,
    "explanation" TEXT NOT NULL,
    "examples" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "GrammarExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "grammarId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "choices" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    CONSTRAINT "GrammarExercise_grammarId_fkey" FOREIGN KEY ("grammarId") REFERENCES "GrammarPoint" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ListeningExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jlptLevel" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "transcript" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "audioUrl" TEXT,
    "questions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ReadingExercise" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jlptLevel" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "english" TEXT NOT NULL,
    "questions" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "SrsCard" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "itemType" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "easeFactor" REAL NOT NULL DEFAULT 2.5,
    "intervalDays" INTEGER NOT NULL DEFAULT 0,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "dueAt" DATETIME NOT NULL,
    "lastReviewedAt" DATETIME,
    "state" TEXT NOT NULL DEFAULT 'new',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ReviewLog" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "cardId" INTEGER NOT NULL,
    "grade" INTEGER NOT NULL,
    "prevInterval" INTEGER NOT NULL,
    "newInterval" INTEGER NOT NULL,
    "reviewedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ReviewLog_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "SrsCard" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UserStats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "xp" INTEGER NOT NULL DEFAULT 0,
    "streakDays" INTEGER NOT NULL DEFAULT 0,
    "lastStudyDate" DATETIME,
    "dailyGoal" INTEGER NOT NULL DEFAULT 20,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "unlockedAt" DATETIME
);

-- CreateTable
CREATE TABLE "GrammarProgress" (
    "grammarId" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "completedAt" DATETIME
);

-- CreateTable
CREATE TABLE "LessonProgress" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "source" TEXT NOT NULL,
    "completedAt" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "Radical_character_key" ON "Radical"("character");

-- CreateIndex
CREATE UNIQUE INDEX "Kanji_character_key" ON "Kanji"("character");

-- CreateIndex
CREATE INDEX "Kanji_jlptLevel_idx" ON "Kanji"("jlptLevel");

-- CreateIndex
CREATE INDEX "Vocabulary_jlptLevel_idx" ON "Vocabulary"("jlptLevel");

-- CreateIndex
CREATE UNIQUE INDEX "Vocabulary_word_reading_key" ON "Vocabulary"("word", "reading");

-- CreateIndex
CREATE UNIQUE INDEX "GrammarPoint_slug_key" ON "GrammarPoint"("slug");

-- CreateIndex
CREATE INDEX "GrammarPoint_jlptLevel_idx" ON "GrammarPoint"("jlptLevel");

-- CreateIndex
CREATE INDEX "ListeningExercise_jlptLevel_idx" ON "ListeningExercise"("jlptLevel");

-- CreateIndex
CREATE INDEX "ReadingExercise_jlptLevel_idx" ON "ReadingExercise"("jlptLevel");

-- CreateIndex
CREATE INDEX "SrsCard_dueAt_state_idx" ON "SrsCard"("dueAt", "state");

-- CreateIndex
CREATE UNIQUE INDEX "SrsCard_itemType_itemId_key" ON "SrsCard"("itemType", "itemId");

-- CreateIndex
CREATE INDEX "ReviewLog_reviewedAt_idx" ON "ReviewLog"("reviewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_key_key" ON "Achievement"("key");

-- CreateIndex
CREATE UNIQUE INDEX "LessonProgress_source_key" ON "LessonProgress"("source");
