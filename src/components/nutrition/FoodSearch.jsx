import { useState } from "react";
import { SearchIcon } from "../icons";
import { searchFoods, scaleMacros } from "../../lib/nutrition";

export default function FoodSearch({ onLog }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [grams, setGrams] = useState("100");
  const [logging, setLogging] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setError("");
    setSelected(null);
    try {
      const foods = await searchFoods(query.trim());
      setResults(foods);
    } catch {
      setError("Search failed — try again in a moment.");
    } finally {
      setSearching(false);
    }
  }

  function selectFood(food) {
    setSelected(food);
    setGrams("100");
  }

  async function handleLog() {
    const gramsNum = parseFloat(grams);
    if (!selected || !gramsNum || gramsNum <= 0) return;
    setLogging(true);
    try {
      const macros = scaleMacros(selected.per100g, gramsNum);
      await onLog({ name: selected.description, ...macros });
      setSelected(null);
      setResults([]);
      setQuery("");
    } finally {
      setLogging(false);
    }
  }

  const preview = selected ? scaleMacros(selected.per100g, parseFloat(grams) || 0) : null;

  return (
    <div
      className="mb-3 rounded-card border border-border bg-surface p-5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <h3 className="mb-3 text-[15px] font-medium text-body">Search a food</h3>

      <form onSubmit={handleSearch} className="mb-3 flex gap-2">
        <div className="relative flex-1">
          <SearchIcon
            width={15}
            height={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. chicken breast"
            className="w-full rounded-btn border border-border bg-bg py-2.5 pl-9 pr-3 text-[14px] text-body outline-none transition-colors duration-200 focus:border-accent"
          />
        </div>
        <button
          type="submit"
          disabled={searching}
          className="rounded-btn bg-accent px-4 py-2.5 text-[14px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-40"
        >
          {searching ? "…" : "Go"}
        </button>
      </form>

      {error && <p className="mb-2 text-[12px] text-[#ff6b6b]">{error}</p>}

      {!selected && results.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {results.map((food) => (
            <button
              key={food.fdcId}
              type="button"
              onClick={() => selectFood(food)}
              className="rounded-btn border border-border bg-white/[0.03] px-3 py-2.5 text-left transition-colors duration-200 hover:bg-white/[0.06]"
            >
              <p className="text-[13px] text-body">{food.description}</p>
              <p className="mt-0.5 font-mono text-[11px] text-muted">
                {food.brandName ? `${food.brandName} · ` : ""}
                {Math.round(food.per100g.calories)} cal / 100g
              </p>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <div className="rounded-btn border border-border bg-white/[0.03] p-3">
          <p className="mb-2 text-[13px] text-body">{selected.description}</p>
          <div className="mb-3 flex items-center gap-2">
            <label className="text-[11px] text-muted">grams</label>
            <input
              type="number"
              inputMode="decimal"
              autoFocus
              value={grams}
              onChange={(e) => setGrams(e.target.value)}
              className="w-20 rounded-btn border border-border bg-bg px-2 py-1.5 font-mono text-[14px] text-body outline-none focus:border-accent"
            />
          </div>
          {preview && (
            <p className="mb-3 font-mono text-[12px] text-muted">
              {preview.calories} cal · P{preview.protein_g} C{preview.carbs_g} F{preview.fat_g}
            </p>
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="flex-1 rounded-btn border border-border py-2 text-[13px] text-muted transition-colors duration-200 hover:bg-white/[0.03]"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleLog}
              disabled={logging}
              className="flex-1 rounded-btn bg-accent py-2 text-[13px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-40"
            >
              {logging ? "Logging…" : "Log it"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
