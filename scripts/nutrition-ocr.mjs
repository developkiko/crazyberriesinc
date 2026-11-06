/**
 * OCR пищевых этикеток: public/img/nutrition/*.jpg → data/nutrition.ts
 *
 * tesseract.js (eng) + sharp-препроцессинг (grayscale + normalize + 1600w).
 * Результат — типизированный Record<slug, NutritionFacts>; товары, где OCR
 * не смог разобрать этикетку, просто не попадают в файл (на странице товара
 * останется картинка-фолбэк).
 *
 * Запуск: node scripts/nutrition-ocr.mjs
 */
import { createWorker } from "tesseract.js";
import sharp from "sharp";
import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const SRC_DIR = join(process.cwd(), "public", "img", "nutrition");
const OUT = join(process.cwd(), "data", "nutrition.ts");

/* --- разбор одной этикетки --- */

// поля основной таблицы: [label, isSub] — isSub = сдвиг вправо как на FDA-этикетке
const MAIN_FIELDS = [
  ["Total Fat", false],
  ["Saturated Fat", true],
  ["Trans Fat", true],
  ["Cholesterol", false],
  ["Sodium", false],
  ["Total Carbohydrate", false],
  ["Dietary Fiber", true],
  ["Fiber", true], // вариант названия без "Dietary"
  ["Sugars", true],
  ["Protein", false],
];

const MICRO_FIELDS = ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E", "Calcium", "Iron", "Potassium"];

function parseLabel(raw) {
  // типичные ошибки OCR: буква O вместо нуля, "(409)" вместо "(40g)"
  const text = raw
    .replace(/\r/g, "")
    .replace(/\bO(?=g\b)/gi, "0")
    .replace(/\((\d+)9\)/g, "($1g)");

  const one = (re) => {
    const m = text.match(re);
    return m ? m[1].trim() : undefined;
  };

  const servingSize = one(/Serving\s*Size\s*[:\-]?\s*(.+)/i);
  const servings = one(/Servings\s*per\s*Container\s*[:\-]?\s*(.+)/i);
  const calories = one(/(?<!from\s)Calories\s+(\d+)/i) ?? one(/Calories\s+(\d+)/i);
  const caloriesFromFat = one(/Calories\s+from\s*Fat\s+(\d+)/i);

  const rows = [];
  for (const [label, isSub] of MAIN_FIELDS) {
    if (rows.some((r) => r.label === label)) continue;
    const re = new RegExp(`${label}\\s+([\\d.]+)\\s*(g|mg|mcg)?\\s*(?:(\\d+)\\s*%)?`, "i");
    const m = text.match(re);
    if (!m) continue;
    const amount = m[1] + (m[2] ? m[2] : "g");
    // "Fiber" дублирует "Dietary Fiber" — оставляем только один вариант
    if (label === "Fiber" && rows.some((r) => r.label === "Dietary Fiber")) continue;
    if (label === "Dietary Fiber" && rows.some((r) => r.label === "Fiber")) {
      const idx = rows.findIndex((r) => r.label === "Fiber");
      rows[idx] = { label: "Dietary Fiber", amount, dv: m[3] ? `${m[3]}%` : undefined, indent: true };
      continue;
    }
    rows.push({
      label,
      amount,
      dv: m[3] ? `${m[3]}%` : undefined,
      indent: isSub,
    });
  }

  const micronutrients = [];
  for (const label of MICRO_FIELDS) {
    const re = new RegExp(`${label}\\s+(\\d+)\\s*%`, "gi");
    let m;
    while ((m = re.exec(text))) {
      micronutrients.push({ label, amount: `${m[1]}%` });
      break;
    }
  }

  return {
    servingSize: servingSize ?? "",
    servingsPerContainer: servings,
    calories: calories ? Number(calories) : undefined,
    caloriesFromFat: caloriesFromFat ? Number(caloriesFromFat) : undefined,
    rows,
    micronutrients,
  };
}

/* --- прогон по всем картинкам --- */

async function main() {
  const files = (await readdir(SRC_DIR)).filter((f) => f.endsWith(".jpg")).sort();
  console.log(`этикеток: ${files.length}`);

  const worker = await createWorker("eng");
  const result = {};
  const failed = [];

  for (const file of files) {
    const slug = file.replace(/\.jpg$/, "");

    // два прохода: «как есть» (без апскейла) и апскейл с резкостью —
    // разные этикетки читаются по-разному, берём лучший результат
    const base = sharp(join(SRC_DIR, file)).grayscale().normalize();
    const bufA = await base.clone().resize({ width: 1600, withoutEnlargement: true }).png().toBuffer();
    const bufB = await base
      .clone()
      .resize({ width: 1600, kernel: "lanczos3" })
      .sharpen()
      .png()
      .toBuffer();

    const [{ data: a }, { data: b }] = await Promise.all([
      worker.recognize(bufA),
      worker.recognize(bufB),
    ]);
    const factsA = parseLabel(a.text);
    const factsB = parseLabel(b.text);
    const score = (f) => (f.calories !== undefined ? 100 : 0) + f.rows.length * 10 + f.micronutrients.length * 5;
    const facts = score(factsB) > score(factsA) ? factsB : factsA;

    // правдоподобность: есть порция, минимум 5 строк и хоть какая-то цифра калорий или жира
    const plausible =
      facts.servingSize &&
      facts.rows.length >= 5 &&
      (facts.calories !== undefined || facts.rows.some((r) => r.label === "Total Fat"));

    if (plausible) {
      result[slug] = facts;
      console.log(`✓ ${slug}: ${facts.calories ?? "?"} kcal, ${facts.rows.length} строк, микро: ${facts.micronutrients.length}`);
    } else {
      failed.push(slug);
      console.warn(`✗ ${slug}: OCR не разобрал (${facts.rows.length} строк)`);
    }
  }

  await worker.terminate();

  const header = `// GENERATED by scripts/nutrition-ocr.mjs — НЕ редактировать руками.
// Источник: public/img/nutrition/*.jpg (этикетки с упаковок), распознано tesseract.js.
// Товары без распознанных данных здесь отсутствуют — на странице показывается картинка.
import type { NutritionFacts } from "@/types";

export const nutrition: Record<string, NutritionFacts> = `;

  const body = JSON.stringify(result, null, 2);

  await writeFile(OUT, `${header}${body};\n`, "utf8");
  console.log(`\nготово: ${Object.keys(result).length}/${files.length} в data/nutrition.ts`);
  if (failed.length) console.log("не распознаны (фолбэк — картинка):", failed.join(", "));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
