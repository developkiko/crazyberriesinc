# Crazy Berries v2

Полная пересборка [crazyberries.vercel.app](https://crazyberries.vercel.app) со статического
дампа Drupal 7 на современный стек. Ветка `next` — новая версия (Vercel делает для неё
preview-деплой), в `main` — старый сайт (откат = переключить прод на main).

## Стек

- **Next.js 16** (App Router, Turbopack, SSG) + **TypeScript** strict
- **Tailwind CSS 4.3** (CSS-first конфиг в `app/globals.css`)
- **lucide-react** (иконки), **next-themes** (ночь/день/авто), **zustand** (корзина),
  **sharp** (скрипт миграции картинок)
- PWA: `manifest.ts` + handwritten `public/sw.js` (precache + cache-first для статики,
  network-first для страниц, офлайн-фолбэк `/offline`)
- Никакой аналитики и трекеров — только уведомления менеджерам

## Ключевые фичи

- Анимированный бесшовный фон на всех страницах (light/dark версии, GPU-transform,
  случайный угол/длительность 3–10 c, `prefers-reduced-motion` выключает)
- Тема ночь/день с автоопределением системной (3 состояния, next-themes)
- Мини-корзина-заявка без сумм: количество позиций → форма → **Telegram-бот**
  админам (@crazyberries_bot) + копия на e-mail владельца (опционально)
- 41 товар, 4 категории; все старые URL (*.html, /node/*, /taxonomy/*) — 301/308 редиректы
- SEO: metadata + OG, JSON-LD (Organization/Product/Breadcrumbs), sitemap.xml, robots.txt

## Разработка

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production-сборка
```

## Переменные окружения (`.env.local`, в репо не попадает)

```
TELEGRAM_BOT_TOKEN=...   # токен бота @crazyberries_bot
TELEGRAM_CHAT_IDS=...    # chat_id через запятую (узнать: написать боту → getUpdates)
# опционально — копия на почту через Resend:
RESEND_API_KEY= / MAIL_FROM= / MAIL_TO=
```

На Vercel эти переменные нужно задать в Settings → Environment Variables.

## Структура

- `app/` — маршруты (SSG-страницы, API-роуты order/contact, sitemap/robots/manifest)
- `components/` — layout / background / cart / catalog / product / ui / seo / pwa
- `data/` — контент сайта: `site.ts`, `categories.ts`, `products.ts` (сгенерирован)
- `lib/` — доступ к каталогу, стор корзины, уведомления (Telegram+email), SEO-хелперы
- `scripts/` — разовая миграция: `extract-products.mjs` (парсинг дампа) и `assets.mjs`
  (sharp: фоны/логотип/иконки/фото)
- `public/` — фоны `bg/`, фото `img/`, иконки PWA `icons/`, `sw.js`

Документация: `project.md` (аудит старого сайта) и `upgrade.md` (план апгрейда).
