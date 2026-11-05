/* CrazyBerries service worker — минимальный, без зависимостей.
   Стратегии:
   - навигация: NetworkFirst (свежие страницы) с офлайн-фолбэком
   - статика Next (/​_next/static), картинки, шрифты: CacheFirst
   - остальное: сеть */
const VERSION = "cb-v1";
const STATIC_CACHE = `${VERSION}-static`;
const PAGES_CACHE = `${VERSION}-pages`;

const PRECACHE = [
  "/",
  "/offline",
  "/manifest.webmanifest",
  "/bg/bg-anim-light.jpg",
  "/bg/bg-anim-dark.jpg",
  "/logo-flat.svg",
  "/icons/icon-192.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // страницы (навигация)
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGES_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached ?? caches.match("/offline");
        })
    );
    return;
  }

  // статика и картинки: cache-first
  const isStatic =
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/img/") ||
    url.pathname.startsWith("/bg/") ||
    url.pathname.startsWith("/icons/") ||
    /\.(?:css|js|woff2?|png|jpg|jpeg|webp|avif|svg|ico)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ??
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
            return res;
          })
      )
    );
  }
});
