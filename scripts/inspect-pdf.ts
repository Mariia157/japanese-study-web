// Dump raw text snippets from a Genki PDF to figure out lesson markers.
import fs from "node:fs";

const path = process.argv[2];
if (!path) { console.error("usage: tsx inspect-pdf.ts <path>"); process.exit(1); }

async function main() {
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: new Uint8Array(fs.readFileSync(path)) });
  const r = await parser.getText();
  await parser.destroy();
  const text = r.text ?? "";
  console.log("Total chars:", text.length);
  console.log("Pages:", r.pages?.length);
  // Find lesson markers
  const lessonMatches = text.match(/第\s*\d+\s*課|Lesson\s+\d+|だい\s*\d+\s*か/gi) ?? [];
  console.log("Lesson-like matches:", lessonMatches.slice(0, 20));
  // Print first 2000 chars
  console.log("\n--- First 2000 chars ---\n");
  console.log(text.slice(0, 2000));
  console.log("\n--- chars 10000-12000 ---\n");
  console.log(text.slice(10000, 12000));
}
main().catch(console.error);
