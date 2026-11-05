import type { NextConfig } from "next";

/**
 * Редиректы со старых (Drupal-дамп) URL на новые маршруты.
 * Ссылки на старые .html не должны умирать — весь накопленный трафик
 * и бэклинки переносим 301-ми на новые страницы.
 */
const catalogSubToParent: Record<string, string> = {
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

const nextConfig: NextConfig = {
  redirects: async () => [
    { source: "/index.html", destination: "/", permanent: true },
    { source: "/catalog.html", destination: "/catalog", permanent: true },
    { source: "/content/crazy-berries.html", destination: "/", permanent: true },
    { source: "/content/about-us.html", destination: "/about", permanent: true },
    { source: "/content/contact-us.html", destination: "/contact", permanent: true },
    {
      source: "/content/:slug(.*).html",
      destination: "/product/:slug",
      permanent: true,
    },
    ...Object.entries(catalogSubToParent).map(([slug, parent]) => ({
      source: `/catalog/${slug}.html`,
      destination: `/catalog/${parent}`,
      permanent: true,
    })),
    { source: "/node/:path*", destination: "/", permanent: false },
    { source: "/taxonomy/:path*", destination: "/", permanent: false },
  ],
};

export default nextConfig;
