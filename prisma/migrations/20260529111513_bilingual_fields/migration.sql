-- AlterTable
ALTER TABLE "GrammarPoint" ADD COLUMN "examplesUk" TEXT;
ALTER TABLE "GrammarPoint" ADD COLUMN "explanationUk" TEXT;
ALTER TABLE "GrammarPoint" ADD COLUMN "titleUk" TEXT;

-- AlterTable
ALTER TABLE "GrammarSection" ADD COLUMN "summaryUk" TEXT;
ALTER TABLE "GrammarSection" ADD COLUMN "titleUk" TEXT;

-- AlterTable
ALTER TABLE "Kanji" ADD COLUMN "meaningsUk" TEXT;
ALTER TABLE "Kanji" ADD COLUMN "mnemonicUk" TEXT;

-- AlterTable
ALTER TABLE "ListeningExercise" ADD COLUMN "englishUk" TEXT;
ALTER TABLE "ListeningExercise" ADD COLUMN "questionsUk" TEXT;
ALTER TABLE "ListeningExercise" ADD COLUMN "titleUk" TEXT;

-- AlterTable
ALTER TABLE "Radical" ADD COLUMN "meaningUk" TEXT;

-- AlterTable
ALTER TABLE "ReadingExercise" ADD COLUMN "englishUk" TEXT;
ALTER TABLE "ReadingExercise" ADD COLUMN "questionsUk" TEXT;
ALTER TABLE "ReadingExercise" ADD COLUMN "titleUk" TEXT;

-- AlterTable
ALTER TABLE "Vocabulary" ADD COLUMN "meaningsUk" TEXT;
ALTER TABLE "Vocabulary" ADD COLUMN "partOfSpeechUk" TEXT;
