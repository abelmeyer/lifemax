import { useState } from "react";
import { MEAL_BANK } from "../../lib/nutrition";

export default function MealBank({ onLog }) {
  const [loggingId, setLoggingId] = useState(null);

  async function handleTap(meal) {
    setLoggingId(meal.id);
    try {
      await onLog({
        name: meal.name,
        protein_g: meal.protein_g,
        carbs_g: meal.carbs_g,
        fat_g: meal.fat_g,
        calories: meal.calories,
      });
    } finally {
      setLoggingId(null);
    }
  }

  return (
    <div
      className="mb-3 rounded-card border border-border bg-surface p-5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <h3 className="mb-3 text-[15px] font-medium text-body">Go-to meals</h3>
      <div className="flex flex-col gap-1.5">
        {MEAL_BANK.map((meal) => (
          <button
            key={meal.id}
            type="button"
            onClick={() => handleTap(meal)}
            disabled={loggingId === meal.id}
            className="flex items-center justify-between rounded-btn border border-border bg-white/[0.03] px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/[0.06] disabled:opacity-50"
          >
            <span className="text-[13px] text-body">{meal.name}</span>
            <span className="font-mono text-[11px] text-muted">
              {loggingId === meal.id ? "Logging…" : `${meal.calories} cal`}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
