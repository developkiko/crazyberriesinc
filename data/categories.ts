import type { Category, CategorySlug } from "@/types";

export const categories: Category[] = [
  {
    slug: "berry-juices",
    title: "Berry Juices",
    short: "Cold-pressed aronia, blackberry & blueberry juices",
    description:
      "Cold-pressed berry juices straight from European orchards — aronia, blackberry, blueberry and our blackberry-blueberry blend. Nothing but berries: no added sugar, no concentrates, no preservatives.",
    image: "/img/categories/berry-juices.jpg",
  },
  {
    slug: "dried-berries",
    title: "Dried Berries",
    short: "Aronia, lingonberry, seaberry, wild blueberry & more",
    description:
      "The berries you won't find on every corner: dried aronia, wild lingonberries, seaberry (sea buckthorn), wild blueberries, black currants, raspberries, strawberries and tart cherries. Unsulfured, lightly sweetened with apple juice concentrate — nothing else.",
    image: "/img/categories/dried-berries.jpg",
  },
  {
    slug: "dried-fruits",
    title: "Dried Fruits",
    short: "Peaches, pears & plums the old-world way",
    description:
      "Slow-dried European peaches, pears and plums — soft, fragrant and naturally sweet. No sulfur, no preservatives, just fruit done right.",
    image: "/img/categories/dried-fruits.jpg",
  },
  {
    slug: "dark-chocolate-covered-fruits",
    title: "Dark Chocolate-Covered Fruits",
    short: "Berries & fruits embraced by dark chocolate",
    description:
      "Our rarest berries and fruits covered in smooth dark chocolate — from aronia and lingonberry to chickpeas and sunflower seeds. The gift that never sits uneaten.",
    image: "/img/categories/dark-chocolate.jpg",
  },
];

export const categoryBySlug = (slug: string): Category | undefined =>
  categories.find((c) => c.slug === slug);

export const categoryTitle = (slug: CategorySlug): string =>
  categoryBySlug(slug)?.title ?? slug;
