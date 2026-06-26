import { supabase } from "./supabase";
import { todayStr, addDaysStr } from "./dateUtils";

const USDA_API_BASE = "https://api.nal.usda.gov/fdc/v1";
const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || "DEMO_KEY";

export const NUTRITION_TARGETS = {
  protein: { min: 160, max: 185, label: "160-185g" },
  carbs: { min: 300, max: 380, label: "300-380g" },
  fat: { min: 70, max: 90, label: "70-90g" },
  calories: { min: 2800, max: 3000, label: "2800-3000" },
};

// Pre-calculated macros so go-to meals can be logged in one tap without a
// search round-trip. Estimates — nudge the numbers here if you want them
// closer to your actual recipes.
export const MEAL_BANK = [
  { id: "eggs-oats-banana", name: "Eggs + oats + banana", protein_g: 35, carbs_g: 65, fat_g: 18, calories: 560 },
  { id: "yogurt-granola-berries", name: "Greek yogurt + granola + berries", protein_g: 30, carbs_g: 55, fat_g: 10, calories: 430 },
  { id: "chicken-rice-avocado", name: "Chicken rice bowl + avocado", protein_g: 50, carbs_g: 70, fat_g: 20, calories: 680 },
  { id: "beef-burrito-bowl", name: "Ground beef burrito bowl", protein_g: 45, carbs_g: 60, fat_g: 25, calories: 660 },
  { id: "salmon-sweet-potato-greens", name: "Salmon + sweet potato + greens", protein_g: 42, carbs_g: 45, fat_g: 22, calories: 570 },
  { id: "protein-shake-banana", name: "Protein shake + banana", protein_g: 35, carbs_g: 35, fat_g: 5, calories: 320 },
  { id: "steak-rice-veg", name: "Steak + rice + veg", protein_g: 48, carbs_g: 65, fat_g: 20, calories: 640 },
];

const NUTRIENT_IDS = { protein: 1003, fat: 1004, carbs: 1005, calories: 1008 };

function nutrientValue(food, id) {
  const n = (food.foodNutrients ?? []).find((fn) => fn.nutrientId === id);
  return n?.value ?? 0;
}

function extractMacrosPer100g(food) {
  const protein = nutrientValue(food, NUTRIENT_IDS.protein);
  const fat = nutrientValue(food, NUTRIENT_IDS.fat);
  const carbs = nutrientValue(food, NUTRIENT_IDS.carbs);
  const calories = nutrientValue(food, NUTRIENT_IDS.calories) || Math.round(protein * 4 + carbs * 4 + fat * 9);
  return { protein, fat, carbs, calories };
}

export async function searchFoods(query) {
  const url = `${USDA_API_BASE}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(query)}&pageSize=15`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("USDA search failed");
  const data = await res.json();
  return (data.foods ?? []).map((f) => ({
    fdcId: f.fdcId,
    description: f.description,
    brandName: f.brandOwner ?? f.brandName ?? null,
    dataType: f.dataType,
    per100g: extractMacrosPer100g(f),
  }));
}

// All USDA macros above are per 100g, so portions are always entered in
// grams — the only way to keep "automatic calculation" actually automatic
// across wildly inconsistent serving-size data.
export function scaleMacros(per100g, grams) {
  const factor = grams / 100;
  return {
    protein_g: Math.round(per100g.protein * factor),
    carbs_g: Math.round(per100g.carbs * factor),
    fat_g: Math.round(per100g.fat * factor),
    calories: Math.round(per100g.calories * factor),
  };
}

export async function fetchMealsForDate(userId, date) {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function fetchMealsInRange(userId, startDate, endDate) {
  const { data, error } = await supabase
    .from("meals")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate);
  if (error) throw error;
  return data ?? [];
}

export async function logMeal({ userId, date, name, protein_g, carbs_g, fat_g, calories }) {
  const { data, error } = await supabase
    .from("meals")
    .insert({ user_id: userId, date, name, protein_g, carbs_g, fat_g, calories })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMeal(id) {
  const { error } = await supabase.from("meals").delete().eq("id", id);
  if (error) throw error;
}

export function sumMacros(meals) {
  return meals.reduce(
    (acc, m) => ({
      protein_g: acc.protein_g + (m.protein_g ?? 0),
      carbs_g: acc.carbs_g + (m.carbs_g ?? 0),
      fat_g: acc.fat_g + (m.fat_g ?? 0),
      calories: acc.calories + (m.calories ?? 0),
    }),
    { protein_g: 0, carbs_g: 0, fat_g: 0, calories: 0 },
  );
}

export async function weeklyProteinAverage(userId) {
  const end = todayStr();
  const start = addDaysStr(end, -6);
  const meals = await fetchMealsInRange(userId, start, end);
  const total = meals.reduce((sum, m) => sum + (m.protein_g ?? 0), 0);
  return Math.round(total / 7);
}
