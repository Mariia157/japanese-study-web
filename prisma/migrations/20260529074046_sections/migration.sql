-- CreateTable
CREATE TABLE "GrammarSection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jlptLevel" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "summary" TEXT
);

-- CreateTable
CREATE TABLE "SectionReview" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sectionId" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "choices" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "explanation" TEXT,
    CONSTRAINT "SectionReview_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "GrammarSection" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GrammarPoint" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "jlptLevel" INTEGER NOT NULL,
    "source" TEXT,
    "sectionId" INTEGER,
    "order" INTEGER NOT NULL DEFAULT 0,
    "explanation" TEXT NOT NULL,
    "examples" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "GrammarPoint_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "GrammarSection" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_GrammarPoint" ("createdAt", "examples", "explanation", "id", "jlptLevel", "slug", "source", "title", "updatedAt") SELECT "createdAt", "examples", "explanation", "id", "jlptLevel", "slug", "source", "title", "updatedAt" FROM "GrammarPoint";
DROP TABLE "GrammarPoint";
ALTER TABLE "new_GrammarPoint" RENAME TO "GrammarPoint";
CREATE UNIQUE INDEX "GrammarPoint_slug_key" ON "GrammarPoint"("slug");
CREATE INDEX "GrammarPoint_jlptLevel_idx" ON "GrammarPoint"("jlptLevel");
CREATE INDEX "GrammarPoint_sectionId_order_idx" ON "GrammarPoint"("sectionId", "order");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "GrammarSection_slug_key" ON "GrammarSection"("slug");

-- CreateIndex
CREATE INDEX "GrammarSection_jlptLevel_order_idx" ON "GrammarSection"("jlptLevel", "order");

-- CreateIndex
CREATE INDEX "SectionReview_sectionId_idx" ON "SectionReview"("sectionId");
