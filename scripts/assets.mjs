/**
 * Разовая подготовка ассетов:
 *  - фоны анимации (light/dark): jpg + webp + avif
 *  - логотип + PWA-иконки (192/512/maskable/apple/favicon)
 *  - фото товаров и Nutrition-картинки из старого дампа (resize + сжатие)
 *  - фото категорий
 *
 * Запуск: node scripts/assets.mjs   (нужен sharp: npm i -D sharp)
 */
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const IMGS = join(ROOT, "..", "imgs");
const OLD = join(ROOT, "..", "old", "crazyberriesinc-main");
const PUBLIC = join(ROOT, "public");

const ensure = (p) => mkdirSync(p, { recursive: true });

async function variants(src, outBase, { max = 2400, quality = 72 } = {}) {
  const img = sharp(src).rotate(); // учитываем EXIF
  const meta = await img.metadata();
  const resized = img.resize({ width: Math.min(meta.width ?? max, max), withoutEnlargement: true });
  ensure(dirname(outBase));
  await resized.clone().jpeg({ quality, mozjpeg: true }).toFile(`${outBase}.jpg`);
  await resized.clone().webp({ quality }).toFile(`${outBase}.webp`);
  await resized.clone().avif({ quality: quality - 10 }).toFile(`${outBase}.avif`);
  const out = await sharp(`${outBase}.jpg`).metadata();
  return { w: out.width, h: out.height };
}

async function main() {
  const report = {};

  // ---------- 1. Фоны ----------
  ensure(join(PUBLIC, "bg"));
  report.bgLight = await variants(join(IMGS, "bg-anim-light.jpg"), join(PUBLIC, "bg", "bg-anim-light"), { max: 2400, quality: 70 });
  report.bgDark = await variants(join(IMGS, "bg-anim-dark.jpg"), join(PUBLIC, "bg", "bg-anim-dark"), { max: 2400, quality: 70 });

  // ---------- 2. Логотип + иконки ----------
  // цветной градиентный SVG-знак — единый источник для шапки и всех иконок
  const logoSvg = join(IMGS, "logo_sign-chatgpt-colored-gradient-min.svg");
  ensure(join(PUBLIC, "icons"));
  copyFileSync(logoSvg, join(PUBLIC, "logo.svg"));
  await sharp(logoSvg, { density: 300 }).resize(900, 900, { fit: "inside" }).png().toFile(join(PUBLIC, "logo.png"));

  const icon = async (size, file, { pad = 0, bg = null } = {}) => {
    const inner = await sharp(logoSvg, { density: 300 })
      .resize(size - pad * 2, size - pad * 2, { fit: "inside" })
      .png()
      .toBuffer();
    if (bg) {
      return sharp({
        create: { width: size, height: size, channels: 4, background: bg },
      }).composite([{ input: inner, gravity: "center" }]).png().toFile(file);
    }
    return sharp(inner).png().toFile(file);
  };
  await icon(192, join(PUBLIC, "icons", "icon-192.png"));
  await icon(512, join(PUBLIC, "icons", "icon-512.png"));
  // maskable: безопасная зона 80% → поля 10% с каждой стороны на брендовом фоне
  await icon(512, join(PUBLIC, "icons", "icon-maskable-512.png"), { pad: 64, bg: { r: 142, g: 31, b: 63, alpha: 1 } });
  await icon(180, join(PUBLIC, "apple-touch-icon.png"), { pad: 18, bg: { r: 255, g: 250, b: 244, alpha: 1 } });
  await icon(32, join(PUBLIC, "favicon-32.png"));
  // favicon.ico из 32px png (просто копия png — все браузеры понимают)
  copyFileSync(join(PUBLIC, "favicon-32.png"), join(PUBLIC, "favicon.ico"));

  // ---------- 3. Товары + Nutrition ----------
  const manifest = JSON.parse(readFileSync(join(ROOT, "scripts", "assets-manifest.json"), "utf8"));
  let ok = 0, fail = [];
  for (const { from: fromRaw, to } of manifest.products) {
    // в дампе кириллические имена URL-закодированы — декодируем
    let from = fromRaw;
    try {
      from = decodeURIComponent(fromRaw);
    } catch {}
    const srcNorm = join(OLD, from);
    if (!existsSync(srcNorm)) {
      fail.push(from);
      continue;
    }
    const dest = join(PUBLIC, to);
    ensure(dirname(dest));
    const isNutrition = to.startsWith("img/nutrition/");
    await sharp(srcNorm)
      .rotate()
      .resize({ width: isNutrition ? 700 : 900, withoutEnlargement: true })
      .flatten({ background: "#ffffff" })
      .jpeg({ quality: isNutrition ? 78 : 82, mozjpeg: true })
      .toFile(dest);
    ok++;
  }
  report.products = { ok, fail };

  // ---------- 4. Категории ----------
  // прямые исходники из старого дампа (не из карточек товаров)
  const CATEGORY_SOURCES = {
    "dark-chocolate-covered-fruits":
      "../old/crazyberriesinc-main/sites/default/files/styles/category/public/71ae5b039f5544fe6538.jpg",
  };

  for (const [slug, productImg] of Object.entries(manifest.categories)) {
    const dest = join(PUBLIC, "img", "categories", `${slug}.jpg`);
    ensure(dirname(dest));
    const direct = CATEGORY_SOURCES[slug];
    if (direct && existsSync(direct)) {
      await sharp(direct).resize({ width: 900, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
      continue;
    }
    if (!productImg) continue;
    const src = join(PUBLIC, productImg);
    if (!existsSync(src)) {
      console.warn(`нет исходника для категории ${slug}: ${productImg}`);
      continue;
    }
    await sharp(src).resize({ width: 900, withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  }
  report.categories = Object.keys(manifest.categories);

  console.log(JSON.stringify(report, (k, v) => (k === "fail" && Array.isArray(v) && v.length === 0 ? "none" : v), 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
