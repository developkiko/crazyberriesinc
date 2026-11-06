export type CategorySlug =
  | "berry-juices"
  | "dried-berries"
  | "dried-fruits"
  | "dark-chocolate-covered-fruits";

export interface Category {
  slug: CategorySlug;
  title: string;
  short: string;
  description: string;
  image: string;
}

export interface Product {
  slug: string;
  name: string;
  category: CategorySlug;
  /** ягода-фасет для фильтра внутри категории (опционально) */
  berry?: string;
  /** вес/объём: "3.5 oz (100 g)" | "200 ml" | "720 ml" */
  weight?: string;
  /** одна строка для карточки */
  short: string;
  /** абзацы описания */
  description: string[];
  ingredients?: string;
  storage?: string;
  /** бейджи: Unsulfured, Non-GMO, European Import… */
  tags: string[];
  image: string;
  imageAlt: string;
  /** картинка Nutrition Facts (если есть в старом каталоге) */
  nutritionImage?: string;
}

export interface CartItem {
  slug: string;
  name: string;
  weight?: string;
  image: string;
  imageAlt: string;
  qty: number;
}

/** строка таблицы Nutrition Facts */
export interface NutritionRow {
  label: string;
  amount: string;
  /** % Daily Value, если указан на этикетке */
  dv?: string;
  /** сдвиг вправо (Saturated Fat, Fiber, Sugars…) как на FDA-этикетке */
  indent?: boolean;
}

/** распознанные данные этикетки (см. scripts/nutrition-ocr.mjs) */
export interface NutritionFacts {
  servingSize: string;
  servingsPerContainer?: string;
  calories?: number;
  caloriesFromFat?: number;
  rows: NutritionRow[];
  /** витамины/минералы — только % Daily Value */
  micronutrients: NutritionRow[];
}
