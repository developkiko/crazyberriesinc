/**
 * Разовая миграция: парсит карточки товаров из старого Drupal-дампа
 * (old/crazyberriesinc-main) и генерирует data/products.ts + манифест
 * изображений для scripts/assets.mjs.
 *
 * Запуск: node scripts/extract-products.mjs
 */
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.cwd();
const OLD = join(ROOT, "..", "old", "crazyberriesinc-main");
const SKIP = new Set(["about-us.html", "contact-us.html", "crazy-berries.html"]);

/** подкатегория старого каталога -> родительская категория нового */
const SUB_TO_PARENT = {
  "berry-juices": "berry-juices",
  "aronia-berry": "berry-juices",
  blackberry: "berry-juices",
  blueberry: "berry-juices",
  "blackberry-blueberry-mix": "berry-juices",
  "dried-fruits": "dried-fruits",
  "dried-peaches": "dried-fruits",
  "dried-pears": "dried-fruits",
  "dried-plums": "dried-fruits",
  "dried-berries": "dried-berries",
  "dried-aronia-berries": "dried-berries",
  "dried-blackberries": "dried-berries",
  "dried-black-currants": "dried-berries",
  "dried-cherries": "dried-berries",
  "dried-raspberries": "dried-berries",
  "dried-seaberries": "dried-berries",
  "dried-strawberries": "dried-berries",
  "dried-wild-blueberries": "dried-berries",
  "dried-wild-lingonberries": "dried-berries",
  "dried-wild-strawberries": "dried-berries",
  "dark-chocolate-covered-fruits": "dark-chocolate-covered-fruits",
};

const TAGS = {
  "berry-juices": ["100% Juice", "Not From Concentrate", "Unsweetened"],
  "dried-berries": ["Unsulfured", "Non-GMO", "European Import"],
  "dried-fruits": ["Unsulfured", "Non-GMO", "European Import"],
  "dark-chocolate-covered-fruits": ["Dark Chocolate", "European Import"],
};

const OZ = "3.5 oz (100 g)";

/** ручные метаданные: имя/вес/фасет/короткая строка для карточки */
const META = {
  // ---- соки ----
  "organic-aronia-berry-juice-200ml": ["Organic Aronia Juice", "200 ml", "Aronia", "100% cold-pressed aronia — unsweetened, not from concentrate."],
  "organic-aronia-berry-juice-720ml": ["Organic Aronia Juice", "720 ml", "Aronia", "Family-size aronia: pure cold-pressed juice, nothing added."],
  "organic-blackberry-juice-200ml": ["Organic Blackberry Juice", "200 ml", "Blackberry", "Deep, dark blackberry juice — nothing but berries."],
  "organic-blueberry-juice-200ml": ["Organic Blueberry Juice", "200 ml", "Blueberry", "Wild-grown blueberries, cold-pressed into a glass."],
  "organic-blackberry-blueberry-mix-200ml": ["Blackberry–Blueberry Juice Blend", "200 ml", "Mix", "Two superberries in one glass. No added sugar."],
  // ---- сушёные ягоды ----
  "organic-aronia-berries-35-oz100g": ["Organic Dried Aronia Berries", OZ, "Aronia", "The antioxidant king, lightly sweetened with apple juice."],
  "aronia-chokeberry-35-oz100g": ["Dried Aronia (Chokeberry)", OZ, "Aronia", "Bold, tart chokeberries — a true superfood classic."],
  "organic-blackberries-35-oz100g": ["Organic Dried Blackberries", OZ, "Blackberry", "Plump, jammy blackberries — not a drop of sulfur."],
  "organic-black-currants-35-oz100g": ["Organic Dried Black Currants", OZ, "Black Currant", "Intense, tart currants — a European favorite."],
  "black-currants-35-oz100g": ["Dried Black Currants", OZ, "Black Currant", "Rich, tangy currants for snacking and baking."],
  "organic-wild-blueberries-35-oz100g": ["Organic Dried Wild Blueberries", OZ, "Wild Blueberry", "Small, intense wild blueberries from European forests."],
  "lingonberries-35-oz100g": ["Dried Wild Lingonberries", OZ, "Lingonberry", "Rare Nordic lingonberries — tart and bright."],
  "organic-raspberries-35-oz100g": ["Organic Dried Raspberries", OZ, "Raspberry", "Certified organic raspberries — fragrant and tangy-sweet."],
  "raspberries-35-oz100g": ["Dried Raspberries", OZ, "Raspberry", "Fragrant, tangy-sweet raspberries, unsulfured."],
  "organic-seaberries-35-oz100g": ["Organic Dried Seaberries", OZ, "Seaberry", "Sea buckthorn — the sunny vitamin-C bomb."],
  "seaberries-35-oz100g": ["Dried Seaberries", OZ, "Seaberry", "Golden, tangy sea buckthorn berries."],
  "organic-strawberries-35-oz100g": ["Organic Dried Strawberries", OZ, "Strawberry", "Plump, sweet strawberries — 100% daily vitamin C per serving."],
  "strawberries-35-oz100g": ["Dried Strawberries", OZ, "Strawberry", "Sweet, chewy strawberry slices."],
  "organic-wild-strawberries-35-oz-100g": ["Organic Dried Wild Strawberries", OZ, "Wild Strawberry", "Tiny wild strawberries with intense aroma."],
  "organic-tart-cherries": ["Organic Dried Tart Cherries", OZ, "Tart Cherry", "Sour-sweet tart cherries — a natural melatonin source."],
  "tart-cherries": ["Dried Tart Cherries", OZ, "Tart Cherry", "Sour-sweet cherries for snacking and desserts."],
  // ---- сухофрукты ----
  "organic-peaches-35-oz100g": ["Organic Dried Peaches", OZ, "Peach", "Mediterranean peaches — moist and potassium-rich."],
  "peaches-35-oz100g": ["Dried Peaches", OZ, "Peach", "Sun-ripened peaches the old-world way."],
  "organic-pears-35-oz100g": ["Organic Dried Pears", OZ, "Pear", "Tender, honeyed pears."],
  "pears-35-oz100g": ["Dried Pears", OZ, "Pear", "Soft, fragrant pear slices."],
  "organic-plums-35-oz100g": ["Organic Dried Plums", OZ, "Plum", "Naturally sweet prunes — no additives."],
  "plums-35-oz100g": ["Dried Plums", OZ, "Plum", "Classic, juicy prunes."],
  // ---- шоколад ----
  "apricot-chocolate": ["Apricot in Dark Chocolate", null, "Apricot", "Sun-dried apricot under silky dark chocolate."],
  "aronia-chocolate": ["Aronia in Dark Chocolate", null, "Aronia", "Antioxidant-packed aronia meets dark chocolate."],
  "blackberry-chocolate": ["Blackberry in Dark Chocolate", null, "Blackberry", "Jammy blackberry in a dark chocolate shell."],
  "black-currants-chocolate": ["Black Currant in Dark Chocolate", null, "Black Currant", "Tart currant and dark chocolate — a perfect pair."],
  "blueberry-chocolate": ["Blueberry in Dark Chocolate", null, "Blueberry", "Wild blueberry bites coated in dark chocolate."],
  "chickpeas-chocolate": ["Roasted Chickpeas in Dark Chocolate", null, "Chickpeas", "Crunchy, unexpected, addictive."],
  "cranberry-chocolate": ["Cranberry in Dark Chocolate", null, "Cranberry", "Bright cranberry meets bitter-sweet chocolate."],
  "peach-chocolate": ["Peach in Dark Chocolate", null, "Peach", "Sweet peach, dark chocolate — southern classic."],
  "pear-chocolate": ["Pear in Dark Chocolate", null, "Pear", "Silky pear under a dark chocolate veil."],
  "plum-chocolate": ["Plum in Dark Chocolate", null, "Plum", "Juicy prune heart, chocolate coat."],
  "raspberry-chocolate": ["Raspberry in Dark Chocolate", null, "Raspberry", "The berry-and-chocolate romance, perfected."],
  "strawberry-chocolate": ["Strawberry in Dark Chocolate", null, "Strawberry", "Sweet strawberry in dark chocolate — the crowd favorite."],
  "sunflower-chocolate": ["Sunflower Seeds in Dark Chocolate", null, "Sunflower", "Toasty seeds in a dark chocolate shell."],
  "tart-cherry-chocolate": ["Tart Cherry in Dark Chocolate", null, "Tart Cherry", "Sour cherry spark inside smooth chocolate."],
};

const decode = (s) =>
  s
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&mdash;|&#8212;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&rsquo;/g, "’")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&hellip;/g, "…");

const strip = (html) =>
  decode(String(html))
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

/** абзацы описания из body-HTML: <p> → абзац, <li> → маркированная строка */
function parseBody(bodyHtml) {
  const blocks = [];
  let liBuffer = [];
  const chunks = bodyHtml.split(/<(p|li)[^>]*>|<\/(p|li)>/);
  // split с чередованием: [text, tag, text, tag, ...] — упрощённо проходим по <p>/<li> содержимому
  const re = /<(p|li)[^>]*>([\s\S]*?)<\/\1>/g;
  let m;
  while ((m = re.exec(bodyHtml))) {
    const isLi = m[1] === "li";
    const text = strip(m[2]).join(" ").replace(/\s+/g, " ").trim();
    if (!text) continue;
    if (isLi) {
      liBuffer.push(text);
    } else {
      if (liBuffer.length) {
        blocks.push({ type: "ul", items: liBuffer });
        liBuffer = [];
      }
      blocks.push({ type: "p", text });
    }
  }
  if (liBuffer.length) blocks.push({ type: "ul", items: liBuffer });
  return blocks;
}

/** режем текстовый поток на description / ingredients / storage */
function splitSections(lines) {
  const joined = lines.join("\n");
  const ingIdx = joined.search(/\n?\s*Ingredients\s*:?\s*\n?/i);
  const stoIdx = joined.search(/\n?\s*Storage\s*:?\s*\n?/i);
  const endIdx = joined.search(/Staten Island NY/i);

  const desc = (ingIdx > -1 ? joined.slice(0, ingIdx) : endIdx > -1 ? joined.slice(0, endIdx) : joined).trim();
  let ingredients = "";
  let storage = "";
  if (ingIdx > -1) {
    const ingEnd = stoIdx > ingIdx ? stoIdx : endIdx > ingIdx ? endIdx : joined.length;
    ingredients = joined.slice(ingIdx, ingEnd).replace(/^\s*Ingredients\s*:?\s*/i, "").trim();
  }
  if (stoIdx > -1) {
    const stoEnd = endIdx > stoIdx ? endIdx : joined.length;
    storage = joined.slice(stoIdx, stoEnd).replace(/^\s*Storage\s*:?\s*/i, "").trim();
  }
  return { desc, ingredients, storage };
}

// в дампе часть страниц лежит без .html (peach-chocolate и др.) — берём все, кроме SKIP
const files = readdirSync(join(OLD, "content"))
  .filter((f) => !f.startsWith(".") && !SKIP.has(f) && !SKIP.has(`${f}.html`))
  .map((f) => ({ raw: f, slugFile: f.endsWith(".html") ? f : `${f}.html` }));
const products = [];
const assetManifest = [];
const warnings = [];

for (const { raw, slugFile } of files) {
  const slug = slugFile.replace(/\.html$/, "");
  const html = readFileSync(join(OLD, "content", raw), "utf8");

  const meta = META[slug];
  if (!meta) {
    warnings.push(`нет META для ${slug}`);
    continue;
  }
  const [name, weight, berry, short] = meta;

  // категория по ссылке внутри поля category
  const catMatch = html.match(/field-name-field-category[\s\S]*?href="[^"]*\/catalog\/([a-z-]+)\.html/);
  const category = catMatch ? SUB_TO_PARENT[catMatch[1]] ?? "dried-berries" : slug.includes("juice") ? "berry-juices" : slug.includes("chocolate") ? "dark-chocolate-covered-fruits" : "dried-berries";

  // главное фото
  const imgMatch = html.match(/field-name-field-image[\s\S]*?src="\.\.\/(sites\/default\/files\/[^"]+)"/);
  // nutrition facts
  const nutMatch = html.match(/field-name-field-nutrition-facts[\s\S]*?src="\.\.\/(sites\/default\/files\/[^"]+)"/);

  // тело
  const bodySplit = html.split("field-name-body");
  const bodyHtml = bodySplit[1] ? bodySplit[1].split("Back to top")[0] : "";
  const lines = strip(bodyHtml);
  const { desc, ingredients, storage } = splitSections(lines);
  const blocks = parseBody(bodyHtml);

  // для соков ingredients задаём вручную (в дампе это маркетинговый список)
  const isJuice = category === "berry-juices";
  const finalIngredients = isJuice
    ? `100% natural ${berry.toLowerCase()} juice. Not from concentrate, unsweetened, no preservatives.`
    : ingredients;

  let description = blocks.length
    ? blocks.map((b) => (b.type === "p" ? b.text : b.items.map((i) => `• ${i}`).join("\n")))
    : desc ? [desc] : [];

  // выбрасываем паразитные абзацы-заголовки Ingredients/Storage из описания
  description = description.filter(
    (t) => !/^\s*(ingredients|storage)\b/i.test(t) && !/^Staten Island/i.test(t)
  );

  // у части шоколадных позиций в дампе не было описания — только состав
  if (!description.length) {
    description = [
      `${name} — ${short} Premium European ingredients, small batches, honest recipe.`,
    ];
  }

  if (!imgMatch) warnings.push(`нет картинки: ${slug}`);
  if (!description.length) warnings.push(`нет описания: ${slug}`);

  products.push({
    slug,
    name,
    category,
    berry,
    weight: weight ?? undefined,
    short,
    description,
    ingredients: finalIngredients || undefined,
    storage: storage || undefined,
    tags: TAGS[category],
    image: `/img/products/${slug}.jpg`,
    imageAlt: `${name} — Crazy Berries`,
    nutritionImage: nutMatch ? `/img/nutrition/${slug}.jpg` : undefined,
  });

  if (imgMatch) assetManifest.push({ from: imgMatch[1], to: `img/products/${slug}.jpg` });
  if (nutMatch) assetManifest.push({ from: nutMatch[1], to: `img/nutrition/${slug}.jpg` });
}

const ORDER = ["berry-juices", "dried-berries", "dried-fruits", "dark-chocolate-covered-fruits"];
products.sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category) || a.name.localeCompare(b.name));

// картинки категорий — берём фото представительных товаров
const pickImg = (slug) => products.find((p) => p.slug === slug)?.image;
const categoryImages = {
  "berry-juices": pickImg("organic-aronia-berry-juice-720ml"),
  "dried-berries": pickImg("organic-wild-blueberries-35-oz100g"),
  "dried-fruits": pickImg("organic-pears-35-oz100g"),
  "dark-chocolate-covered-fruits": pickImg("strawberry-chocolate"),
};

mkdirSync(join(ROOT, "data"), { recursive: true });
writeFileSync(
  join(ROOT, "data", "products.ts"),
  `// Сгенерировано scripts/extract-products.mjs из старого каталога — не редактировать вручную.
import type { Product } from "@/types";

export const products: Product[] = ${JSON.stringify(products, null, 2)};
`
);

mkdirSync(join(ROOT, "scripts"), { recursive: true });
writeFileSync(join(ROOT, "scripts", "assets-manifest.json"), JSON.stringify({ products: assetManifest, categories: categoryImages }, null, 2));

console.log(`товаров: ${products.length}`);
warnings.forEach((w) => console.warn("WARN:", w));
console.log("категории:", categoryImages);
