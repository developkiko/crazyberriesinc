# Crazy Berries — план апгрейда (to-be)

Цель: пересобрать сайт как современный, быстрый, красивый PWA-каталог с мини-корзиной
(заказ-заявка), темой ночь/день, анимированным фоном на всех страницах и SEO, способным
органически приводить продажи без рекламы.

---

## 1. Новый стек

| Задача | Выбор | Почему |
|---|---|---|
| Фреймворк | **Next.js 15+ (App Router, Turbopack)** | SSG для всех страниц каталога = скорость статики + метаданные/sitemap/редиректы из коробки; деплой на Vercel уже есть |
| Язык | **TypeScript (strict)** | типизация каталога, корзины, SEO-хелперов |
| Стили | **Tailwind CSS v4 (4.3)** | CSS-first конфиг (`@theme` в `globals.css`), нативный `dark:` вариант, container queries, минимальный рантайм |
| Иконки | **lucide-react** | tree-shaking, единый стиль, ES-модули |
| Тема | **next-themes** | переключатель light/dark/**system** (автоопределение), без FOUC, синхронизация с `prefers-color-scheme` |
| Корзина | **zustand + persist** | ~1 КБ, middleware `persist` → localStorage, без провайдера-обёртки |
| Утилиты | **clsx + tailwind-merge** | `cn()` для классов |
| PWA | **@serwist/next** | service worker (precache + runtime-кэш) и manifest следующего поколения |
| Слайдер (если нужен на главной) | **embla-carousel-react** | замена FlexSlider, 3 КБ, touch из коробки |
| Аналитика | **Vercel Analytics** (или Plausible) | замена мёртвого UA-92095914-1 |
| Линт/формат | **ESLint (next/core-web-vitals) + Prettier** | стандарт Next |

Ничего тяжелее не тянем: нет UI-кита на ComponentKit, нет CSS-in-JS, нет лишних рантаймов.
Мини UI-набор (Button, Badge, Input, Section) пишем сами на Tailwind — 4 компонента.

## 2. Модульная архитектура

Принцип: каждый модуль — отдельная папка, максимально тупая зависимость вниз
(`data` ← `lib` ← `components` ← `app`), ничего не знает лишнего о соседях.

```
new/
├─ app/                          # маршруты (тонкие: только компоновка + metadata)
│  ├─ layout.tsx                 #  <ThemeProvider> + <AnimatedBackground> + Header/Footer
│  ├─ page.tsx                   #  главная: hero, категории, выборочные товары, УТП, wholesale-CTA
│  ├─ catalog/page.tsx           #  все категории
│  ├─ catalog/[category]/page.tsx#  список товаров категории (+ generateStaticParams)
│  ├─ product/[slug]/page.tsx    #  карточка (+ generateMetadata, JSON-LD)
│  ├─ cart/page.tsx              #  страница корзины/оформления заявки
│  ├─ about/page.tsx
│  ├─ contact/page.tsx
│  ├─ berries/[slug]/page.tsx    #  SEO-хабы по ягодам (см. §8) — ФАЗА 2
│  ├─ offline/page.tsx           #  офлайн-фолбэк для PWA
│  ├─ api/order/route.ts         #  приём заявки из корзины (email/Resend)
│  ├─ sitemap.ts  robots.ts  manifest.ts  not-found.tsx  opengraph-image.tsx
├─ components/
│  ├─ layout/    Header · Footer · MobileNav · ThemeToggle · Logo
│  ├─ background/AnimatedBackground.tsx      # §4 — анимированный фон
│  ├─ cart/      CartButton (бейдж) · CartDrawer (slide-over) · CartItemRow · AddToCartButton · CheckoutForm
│  ├─ catalog/   CategoryCard · ProductCard · ProductGrid · Filters(сорт/поиск, опц.)
│  ├─ product/   ProductGallery · Ingredients · StorageInfo · RelatedProducts
│  ├─ ui/        Button · Badge · Input · Textarea · Section · Container
│  └─ seo/       JsonLd.tsx                    # единый инжект структурных данных
├─ lib/
│  ├─ products.ts                #  getProducts / getByCategory / getBySlug (по data/)
│  ├─ cart-store.ts              #  zustand: items, add, remove, setQty, clear + persist
│  ├─ seo.ts                     #  buildMetadata(), productJsonLd(), breadcrumbJsonLd()
│  └─ utils.ts                   #  cn(), slugify(), форматирование
├─ data/                         #  ЕДИНЫЙ источник контента (без CMS)
│  ├─ site.ts                    #  контакты, навигация, соцссылки, домен
│  ├─ categories.ts              #  4 категории: slug, title, описание, фото
│  └─ products/                  #  по одному файлу на товар (type Product) — 36 шт.
│     └─ organic-strawberries.ts #  slug, name, category, description, ingredients,
│                                #  storage, weight, images[], benefits[], faq[]
├─ types/index.ts                #  Product, Category, CartItem, ...
├─ public/
│  ├─ bg/light.avif  bg/dark.avif   # бесшовные фоны (§4), + webp-fолбэк
│  ├─ icons/                     #  PWA: 192/512/maskable из логотипа
│  └─ img/products/…             #  оптимизированные фото (WebP/AVIF, транслит-имена)
└─ scripts/
   └─ assets.mjs                 #  разовая миграция картинок из old/ (переименование,
                                 #  конвертация sharp → AVIF+WebP, resize, blurDataURL)
```

Правила модульности:
- `app/*` не содержит логики — только данные → компоненты → metadata.
- Компоненты не импортируют `data/` напрямую (кроме секций главной) — получают props.
- Корзина знает только `CartProduct` (id, slug, name, image, weight) — не весь `Product`.
- Всё, что про сайт (телефон, email, адрес), — только из `data/site.ts` (правка в одном месте).

## 3. Дизайн-система (кратко)

- Цвет: ягодная палитра — `berry` (основной, тёмно-малиновый #7A1E3F-подобный), акцент
  `juice` (яркo-ягодный), нейтралы тёплые; всё в `@theme` Tailwind c CSS-переменными,
  для dark-темы переменные переопределяются в `.dark` — компоненты не меняются.
- Типографика: заголовки — display-шрифт с характером (например, *Fraunces* или
  *Bricolage Grotesque* через `next/font`), текст — системный стек или *Inter*; `next/font`
  = self-hosted, нулевой CLS.
- Радиусы крупные, «сочные» тени, glass-хедер (backdrop-blur) над анимированным фоном.
- Карточки товара: фото (next/image, aspect-square), название, вес, кнопка «В корзину»
  (lucide `ShoppingBag`), hover-lift. Бейджи: «Unsulfured», «Non-GMO», «European Import».

## 4. Анимированный фон (все страницы)

**Задача:** бесшовная картинка-фон (dark- и light-версии), которая медленно и плавно
движется в случайном направлении; по завершении движения выбирает новый угол и новую
длительность (3–10 с) и едет снова. Дёшево для слабых устройств.

**Реализация — CSS-transition + ~30 строк JS (без rAF-цикла, без repaints):**

1. Слой `.bg-layer`: `position: fixed; inset: -25%` (запас по всем сторонам),
   `background-image` — бесшовный тайл, `background-repeat: repeat`,
   `transform: translate3d(var(--bx), var(--by), 0); will-change: transform;`
   `transition: transform var(--bg-dur, 6s) cubic-bezier(.45,.05,.55,.95);`
   (кривая ease-in-out → плавный разгон и плавная остановка, как просили).
2. JS (`AnimatedBackground.tsx`, клиентский, ~30 строк):
   - `next()`: `angle = Math.random() * 2π`; `dist = 60–140 px` (random);
     `dur = 3 + Math.random() * 7` сек; цель `bx/by = cos(angle)*d, sin(angle)*d`,
     но с клампом в «окно» ±20% (чтобы слой никогда не уехал за край — при выходе
     за границу цель принудительно наклоняется обратно к центру);
   - записать `--bg-dur`, затем в следующем кадре — `--bx/--by` (запуск transition);
   - слушать `transitionend` → снова `next()`. Бесконечный цикл «движение → пауза-стоп → новое движение».
3. Темы: два слоя (light/dark), переключение `opacity .6s` по `.dark` — кросс-фейд
   при смене темы; само изображение выбирает CSS, JS не трогает.
4. Дёшево: единственное, что анимируется — `transform` (композитинг на GPU, 0 layout/paint);
   нет таймеров, нет rAF-лупа; вкладка скрыта — transition не работает, CPU не тратится.
   `@media (prefers-reduced-motion: reduce)` → фон статичен.

**Требования к ассетам** (положить в `public/bg/`, сырьё уже в `imgs/to-upscale/`):
- бесшовные (tileable) 1600–2000 px, лёгкий паттерн без крупных контрастных пятен;
- AVIF (≤ 250 КБ) + WebP-фолбэк; `light.avif` — светлый тёплый, `dark.avif` — приглушённый тёмный;
- контент поверх фона — на `Container` c лёгким полупрозрачным фоном, читаемость в обеих темах.

## 5. Тема ночь/день

- `next-themes`: `attribute="class"`, `defaultTheme="system"`, `enableSystem` —
  автоопределение темы браузера/ОС из коробки; `<suppressHydrationWarning>` на `<html>`.
- `ThemeToggle` в хедере: 3 состояния (light / dark / system, lucide `Sun · Moon · Monitor`)
  с dropdown; выбор хранится в localStorage, live-реагирует на смену системной темы.
- Все цвета/фоны — только через токены `@theme` (`bg-background`, `text-foreground`,
  `bg-surface`…), в `.dark` меняются переменные. Запрет хардкода hex в компонентах.
- Кросс-фейд фонов — §4.3; `color-scheme: light dark` — нативные скроллбары/формы под тему.

## 6. Мини-корзина (заказ-заявка)

Цен и онлайн-оплаты на проекте нет и не планируется на старте → корзина = **quote-cart**,
но модель сразу с полем `price?` — включить цены позже = поменять данные, не код.

- **Store** (`lib/cart-store.ts`): `items: CartItem[]` (`id=slug`, qty, snapshot), persist в
  `localStorage` (ключ `cb-cart`), actions `add/remove/setQty/clear`, hydrate-safe для SSG.
- **UI:** `CartButton` в хедере (иконка + бейдж количества, микро-анимация «поп»),
  `CartDrawer` — slide-over справа (Esc/клик-вне — закрыть), внутри — строки с qty-степпером,
  итог по позициям, кнопка «Оформить заявку» → `/cart` с `CheckoutForm`
  (имя, телефон/e-mail, комментарий) → `POST /api/order`.
- **`app/api/order/route.ts`:** собирает письмо (состав заявки, контакты) → Resend/SMTP
  на CrazyBerriesInc@gmail.com + показ успеха. Фолбэк — mailto-ссылка и WhatsApp-кнопка
  (телефон с сайта). Rate-limit + honeypot от спама.
- Кнопка «В корзину» на карточке и на странице товара; состояние «уже в корзине ✓».

## 7. PWA

- `app/manifest.ts`: name/short_name, `theme_color`/`background_color` под обе темы,
  иконки 192/512 + maskable (из `logo_0.png`), `display: standalone`, RU+EN локали.
- `@serwist/next`: precache всего статического (SSG-страницы, CSS/JS, иконки, фоны);
  runtime-кэш `CacheFirst` для `/img/*` (картинки доступны офлайн), `NetworkFirst` для страниц.
- `app/offline/page.tsx` — офлайн-фолбэк; страница корзины работает офлайн (данные в localStorage).
- Кнопка «Установить приложение» (beforeinstallprompt) в футере/на мобильном хедере.
- iOS: apple-touch-icon, splash не критичен.

## 8. SEO — переопределение с нуля

### 8.1 Что чиним (сейчас: 0 meta description, дубли, нет sitemap/robots/JSON-LD)

- Полный `generateMetadata` на каждой странице: уникальные title (≤ 60 зн.) и
  description (≤ 155 зн., с CTA), canonical, OG + Twitter-карточки; динамические
  OG-картинки (`opengraph-image.tsx` → ImageResponse: фото ягоды + логотип + слоган).
- Убиваем дубли: `node/*`, `taxonomy/*` не переносим; в `next.config` — редиректы 301
  со ВСЕХ старых URL (`/catalog/x.html` → `/catalog/x`, `/content/y.html` → `/product/y`,
  `/node/*` и `/taxonomy/*` → в категорию/главную) — трафик и бэклинки не теряем.
- `sitemap.ts` (все страницы + хабы + блог), `robots.ts` (allow all, sitemap, disallow /api),
  `not-found.tsx` (красивая 404 с кнопкой в каталог).
- JSON-LD: `Organization` (+logo, контакты), `WebSite`+`SearchAction`, `BreadcrumbList`,
  `Product` (image, brand, category, `Offers` с `availability` и `priceCurrency=USD`
  даже без цены — через `PriceSpecification` или добавив "запрос цены"), `FAQPage` на хабах.
- Семантика: один `h1` на страницу, хлебные крошки, alt у всех изображений, читаемые
  slug-URL (`/product/dried-wild-lingonberries`), транслит и переименование всех картинок.

### 8.2 Анализ конкуренции (рынок США)

Рынок сушёных ягод: ~$20.8 млрд (2024) → $30.1 млрд к 2030, CAGR ~6.3–6.4%;
арония как категория растёт на ~7% CAGR; 67% потребителей выбирают снеки по критерию
здоровья. Ниша **фрагментирована — доминирующего бренда в «суперъягодах» нет**:

| Конкурент | Сила | Слабость, которую бьём |
|---|---|---|
| Northwest Wild Foods | широкий ассортимент диких ягод, свой магазин+Amazon | сухой «магазинный» контент, нет бренда-характера, нет соков/шоколада |
| Powbab | фокус на аронии, суперфуд-аудитория | узкий ассортимент (1 ягода) |
| Loov Food (ЕС) | скандинавская эстетика, прямые продажи в США | мало SKU, дорогая доставка, слабый контент под US-поиск |
| Aronia Original (DE) | эксперт по аронии | импорт из ЕС = долго/дорого, англ. контент средний |
| Amazon/Walmart/Target | охват | безликие листинги, нет истории бренда, нет редких позиций (облепиха, брусника, нут в шоколаде) |

**Позиционирование Crazy Berries:** «Редкие европейские ягоды — арония, брусника,
облепиха, дикая черника — без серы и ГМО, семейный импортёр из Нью-Йорка с 2016 г.
Соки и шоколадные наборы, которых нет у других. Розница и опт.»
Уникальное преимущество для контента: **ассортимент, который негде больше купить рядом**
+ оптовое направление (B2B-запросы из поиска = самые тёплые продажи).

### 8.3 Контент-стратегия (продажы без рекламы)

Ключевые кластеры (низкая конкуренция × коммерческий интент):

- `[dried aronia berries] / [aronia berries benefits] / [where to buy aronia berries]`
- `[dried lingonberries] · [dried sea buckthorn berries] · [dried wild blueberries]`
- `[dried strawberries no added sugar] · [unsulfured dried fruit]`
- `[chocolate covered berries gift] · [healthy gift box]` (сезон: праздники)
- `[dried fruit wholesale NYC] · [berry supplier wholesale]` ← B2B, самая высокая маржа

Страницы:

1. **Переписать все 36 карточек** по формуле: выгода в первом абзаце → вкус/текстура →
   как использовать (снек, овсянка, выпечка, смузи) → состав → хранение → мини-FAQ
   (3 вопроса) → «похожие товары». Уникальный текст, никакого копипаста поставщиков.
2. **Ягоды-хабы** `/berries/[slug]` (арония, брусника, облепиха, дикая черника, клюква…):
   польза (с ссылками на исследования), питание на 100 г, сравнение с другими ягодами,
   рецепты, все товары этой ягоды + сок/шоколад. Это главные SEO-магниты.
3. **Блог** (ФАЗА 2, 2–4 статьи/мес): «Aronia vs. other superberries», «Что такое
   unsulfured и почему это важно», «Гайд по подарочным наборам», рецепты.
4. **Wholesale-страница** `/wholesale`: MOQ, категории покупателей (кафе, магазины,
   корпоративные подарки), форма B2B-заявки → отдельный_topic в письме.
5. **Локальное SEO:** Google Business Profile (адрес/тел из `data/site.ts`), страница
   «Where to buy in NYC», NAP-консистентность.
6. **Доверие:** блок «Импортируем из Европы с 2016» + сертификации (если есть:
   USDA Organic уже заявован на части товаров) + отзывы (виджет, ФАЗА 2).

### 8.4 Аналитика

Vercel Analytics (или Plausible, без cookie-баннера) + события: add_to_cart,
begin_checkout, order_sent, click_phone/click_email. Цель —micro-конверсии в заявки.

## 9. Адаптивность и производительность

Адаптив (mobile-first):
- хедер: desktop — горизонтальное меню; ≤ 768 px — бургер + выдвижное меню,
  CartButton и ThemeToggle всегда видны; внизу мобильных — опц. таб-бар (Каталог · Корзина);
- сетки: `ProductGrid` 2 кол. (моб) / 3 (md) / 4 (xl); карточка — квадратное фото + min-info;
- тач-цели ≥ 44 px; safe-area (iPhone notch); `Drawer` на мобиле = full-height.
-container queries для карточек (Tailwind v4 `@container`).

Производительность (бюджет: Lighthouse ≥ 95 / LCP < 2.0 с / CLS ≈ 0):
- всё SSG + ISR не нужен (контент статичен); картинки `next/image` (AVIF/WebP,
  `sizes` под сетку, `placeholder="blur"` через blurDataURL из `scripts/assets.mjs`);
  шрифты `next/font`; нулевой клиентский JS на страницах каталога кроме корзины/темы;
  `priority` только для hero-изображения.

## 10. План работ (фазы, каждая — рабочая и проверяемая)

| Фаза | Что делаем | Критерий готовности |
|---|---|---|
| **0. Ассеты** | `scripts/assets.mjs`: вытащить фото из `old/.../sites/default/files`, переименовать в slug-имена, sharp → AVIF+WebP+blur; подготовить фоны `bg/light|dark.avif` (из `imgs/to-upscale/`, апскейл + бесшовность); иконки PWA из логотипа | все картинки в `public/`, фоновая пара готова |
| **1. Каркас** | create-next-app (TS, Tailwind 4, App Router), установить next-themes/zustand/lucide/serwist; `AnimatedBackground`, Header/Footer/MobileNav/ThemeToggle, `data/site.ts` | все страницы-заглушки рендерятся, фон анимируется, тема переключается |
| **2. Данные** | `types` + `data/categories.ts` + 36 файлов `data/products/` (перенос текстов из дампа, переписанные описания — §8.3) | `lib/products.ts` отдаёт весь каталог, типы сходятся |
| **3. Каталог** | страницы `/catalog`, `/catalog/[category]`, `/product/[slug]`; UI-кит, ProductCard/Grid, крошки | весь каталог кликается, metadata+JSON-LD на месте |
| **4. Корзина** | cart-store, CartButton/Drawer, `/cart` + CheckoutForm, `/api/order` | заявка уходит на e-mail, корзина живёт после перезагрузки |
| **5. PWA** | manifest, Serwist SW, offline-страница, install-prompt | Lighthouse PWA-чек, офлайн-доступ к просмотренному |
| **6. SEO-контент** | редиректы всех старых URL, sitemap/robots, OG-картинки, ягоды-хабы (5 шт.), wholesale-страница, GBP | Search Console без ошибок, хабы проиндексированы |
| **7. Полировка** | perf-аудит (Lighthouse ≥ 95/90/100/100), a11y (контраст поверх фона, focus-states), кросс-браузер, финальный контент-ревью | деплой в прод на crazyberries.vercel.app, старые URL — 301 |

Дальше (отдельно): онлайн-цены и Stripe, отзывы, блог-каденция, RU-локализация.

## 11. Что НЕ переносим из old/

`node/*`, `taxonomy/*`, `misc/`, `modules/`, `sites/all/` (jQuery/FlexSlider/Colorbox/тема),
`.idea/`, `*.zip` — весь этот мусор Drupal остаётся в `old/` навсегда. Из дампа берём
**только**: тексты страниц, изображения из `sites/default/files`, контакты и структуру каталога.
