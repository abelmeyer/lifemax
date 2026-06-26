import { useEffect, useState } from "react";
import ScreenHeader from "../components/ScreenHeader";
import MacroBar from "../components/MacroBar";
import FoodSearch from "../components/nutrition/FoodSearch";
import MealBank from "../components/nutrition/MealBank";
import ProteinTrendChart from "../components/nutrition/ProteinTrendChart";
import { XIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { todayStr } from "../lib/dateUtils";
import { fetchMealsForDate, logMeal, deleteMeal, sumMacros, NUTRITION_TARGETS } from "../lib/nutrition";

export default function Nutrition() {
  const { user } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMealsForDate(user.id, todayStr())
      .then(setMeals)
      .finally(() => setLoading(false));
  }, [user.id]);

  async function handleLog(meal) {
    const saved = await logMeal({ userId: user.id, date: todayStr(), ...meal });
    setMeals((m) => [...m, saved]);
  }

  async function handleDelete(id) {
    await deleteMeal(id);
    setMeals((m) => m.filter((meal) => meal.id !== id));
  }

  const totals = sumMacros(meals);

  if (loading) {
    return (
      <>
        <ScreenHeader title="Nutrition" subtitle="Protein and calories, tracked simply." />
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Nutrition" subtitle="Protein and calories, tracked simply." />

      <div
        className="mb-3 flex flex-col gap-3 rounded-card border border-border bg-surface p-5"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <MacroBar label="Protein" value={totals.protein_g} target={NUTRITION_TARGETS.protein} />
        <MacroBar label="Carbs" value={totals.carbs_g} target={NUTRITION_TARGETS.carbs} />
        <MacroBar label="Fat" value={totals.fat_g} target={NUTRITION_TARGETS.fat} />
        <MacroBar label="Calories" value={totals.calories} unit="" target={NUTRITION_TARGETS.calories} />
      </div>

      <ProteinTrendChart userId={user.id} />

      {meals.length > 0 && (
        <div
          className="mb-3 rounded-card border border-border bg-surface p-5"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        >
          <h3 className="mb-3 text-[15px] font-medium text-body">Today's meals</h3>
          <div className="flex flex-col gap-1.5">
            {meals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center justify-between rounded-btn bg-white/[0.03] px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-[13px] text-body">{meal.name}</p>
                  <p className="font-mono text-[11px] text-muted">
                    {meal.calories} cal · P{meal.protein_g} C{meal.carbs_g} F{meal.fat_g}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(meal.id)}
                  className="shrink-0 rounded-full p-1.5 text-muted transition-colors duration-200 hover:bg-white/[0.06]"
                  aria-label={`Remove ${meal.name}`}
                >
                  <XIcon width={14} height={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <FoodSearch onLog={handleLog} />
      <MealBank onLog={handleLog} />
    </>
  );
}
