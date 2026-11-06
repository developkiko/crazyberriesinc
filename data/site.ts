export const site = {
  name: "Crazy Berries",
  legalName: "Crazy Berries Inc.",
  domain: "https://crazyberries.vercel.app",
  tagline: "Rare European berries — unsulfured, non-GMO, wildly delicious",
  description:
    "Imported European dried berries, fruits, cold-pressed berry juices and dark-chocolate covered treats. Unsulfured, non-GMO. Retail and wholesale from Staten Island, NY.",
  phone: "(917) 818-1864",
  phoneHref: "+19178181864",
  email: "CrazyBerriesInc@gmail.com",
  address: "Staten Island, NY 10304, P.O. Box 40803",
  mapsUrl: "https://maps.app.goo.gl/C3CNsNnniJqgewdy9",
  founded: "2016",
  nav: [
    { href: "/", label: "Home" },
    { href: "/catalog", label: "Products" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact Us" },
  ] as const,
} as const;
