// Add the radicals needed to decompose the remaining N5 kanji, then link each
// kanji to its component radicals. Decompositions follow the actual character
// components / Kangxi radicals (and match the wording of each kanji's mnemonic).
// Idempotent. Run: npm run seed:radicals  (before translate:uk so meaningUk fills)
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import "dotenv/config";

const url = process.env.DATABASE_URL?.replace(/^file:/, "") ?? "./prisma/dev.db";
const db = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url }) });

// New radicals (English meaning; meaningUk is filled by translate:uk via RADICAL_MAP).
const RADICALS = [
  { character: "一", meaning: "one" },
  { character: "二", meaning: "two" },
  { character: "八", meaning: "eight" },
  { character: "十", meaning: "ten" },
  { character: "入", meaning: "enter" },
  { character: "川", meaning: "river" },
  { character: "禾", meaning: "grain" },
  { character: "儿", meaning: "legs" },
  { character: "彳", meaning: "step" },
  { character: "辶", meaning: "movement" },
  { character: "刀", meaning: "sword" },
  { character: "夕", meaning: "evening" },
  { character: "卜", meaning: "divination" },
  { character: "工", meaning: "work" },
  { character: "穴", meaning: "hole" },
  { character: "艹", meaning: "grass" },
  { character: "首", meaning: "head" },
  { character: "馬", meaning: "horse" },
  { character: "尺", meaning: "measure" },
  { character: "示", meaning: "altar" },
  { character: "囗", meaning: "enclosure" },
  { character: "母", meaning: "mother" },
  { character: "生", meaning: "life" },
  { character: "父", meaning: "father" },
  { character: "文", meaning: "writing" },
  { character: "長", meaning: "long" },
  { character: "弓", meaning: "bow" },
  { character: "西", meaning: "west" },
  { character: "匕", meaning: "spoon" },
  { character: "气", meaning: "steam" },
];

// kanji character -> radical components (only radicals that exist in the table).
const LINKS: Record<string, string[]> = {
  "一": ["一"],
  "二": ["二"],
  "三": ["一"],
  "四": ["囗"],
  "五": ["二"],
  "六": ["八"],
  "七": ["一"],
  "八": ["八"],
  "十": ["十"],
  "川": ["川"],
  "私": ["禾"],
  "今": ["人"],
  "学": ["子"],
  "生": ["生"],
  "先": ["儿"],
  "行": ["彳"],
  "百": ["一", "白"],
  "千": ["十"],
  "万": ["一"],
  "分": ["八", "刀"],
  "半": ["十"],
  "週": ["辶"],
  "毎": ["母"],
  "午": ["十"],
  "上": ["一"],
  "下": ["一"],
  "外": ["夕", "卜"],
  "左": ["工"],
  "前": ["月"],
  "後": ["彳"],
  "南": ["十"],
  "父": ["父"],
  "母": ["母"],
  "弟": ["弓"],
  "長": ["長"],
  "北": ["匕"],
  "気": ["气"],
  "西": ["西"],
  "空": ["穴", "工"],
  "花": ["艹"],
  "文": ["文"],
  "道": ["辶", "首"],
  "駅": ["馬", "尺"],
  "書": ["日"],
  "出": ["山"], // 出 visually stacks 山-like forms; link the closest existing radical
  "入": ["入"],
  "社": ["示", "土"],
};

async function main() {
  console.log("Adding radicals + linking kanji…");

  for (const r of RADICALS) {
    await db.radical.upsert({ where: { character: r.character }, update: { meaning: r.meaning }, create: r });
  }
  console.log(`  ✓ ${RADICALS.length} radicals ensured`);

  let links = 0, skipped = 0;
  for (const [kc, rads] of Object.entries(LINKS)) {
    const k = await db.kanji.findUnique({ where: { character: kc } });
    if (!k) { skipped++; continue; }
    for (const rc of rads) {
      const r = await db.radical.findUnique({ where: { character: rc } });
      if (!r) { skipped++; continue; }
      await db.kanjiRadical.upsert({
        where: { kanjiId_radicalId: { kanjiId: k.id, radicalId: r.id } },
        update: {},
        create: { kanjiId: k.id, radicalId: r.id },
      });
      links++;
    }
  }
  console.log(`  ✓ ${links} kanji↔radical links (skipped ${skipped} unknown)`);
  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
