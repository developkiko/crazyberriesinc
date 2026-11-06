import type { NutritionFacts } from "@/types";

/**
 * Текстовая таблица Nutrition Facts в стиле FDA-этикетки
 * (данные распознаны OCR — scripts/nutrition-ocr.mjs).
 */
export default function NutritionTable({ facts }: { facts: NutritionFacts }) {
  return (
    <div className="mx-auto w-full max-w-xs text-sm">
      <p className="font-display text-2xl font-bold leading-none">Nutrition Facts</p>
      <p className="mt-1.5 text-xs">{facts.servingSize}</p>
      {facts.servingsPerContainer && (
        <p className="text-xs">Servings per Container {facts.servingsPerContainer}</p>
      )}

      <div className="mt-1.5 border-t-8 border-fg" />

      <div className="flex items-end justify-between border-b-4 border-fg py-1">
        <span className="text-xs font-bold uppercase tracking-wide">Amount per serving</span>
        {facts.calories !== undefined && (
          <span className="font-display text-xl font-bold leading-none">
            {facts.calories} <span className="text-xs font-semibold">Calories</span>
          </span>
        )}
      </div>

      <p className="border-b-2 border-fg py-1 text-right text-[10px] font-semibold">
        % Daily Value*
      </p>

      <ul>
        {facts.rows.map((row) => (
          <li
            key={row.label}
            className={`flex justify-between border-b border-fg/25 py-1 leading-tight ${
              row.indent ? "pl-3" : "font-semibold"
            }`}
          >
            <span>
              <span className={row.indent ? "" : "font-bold"}>{row.label}</span>{" "}
              {row.amount}
            </span>
            {row.dv && <span className="font-semibold">{row.dv}</span>}
          </li>
        ))}
      </ul>

      {facts.micronutrients.length > 0 && (
        <>
          <div className="border-t-4 border-fg" />
          <ul className="border-b-4 border-fg">
            {facts.micronutrients.map((m) => (
              <li
                key={m.label}
                className="flex justify-between border-b border-fg/25 py-1 leading-tight"
              >
                <span>{m.label}</span>
                <span className="font-semibold">{m.amount}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="pt-1.5 text-[10px] leading-snug text-fg-muted">
        * Percent Daily Values are based on a 2,000 calorie diet.
      </p>
    </div>
  );
}
