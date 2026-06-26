import MacroBar from "../MacroBar";
import { HABIT_TARGETS } from "../../lib/habits";
import { NUTRITION_TARGETS, sumMacros } from "../../lib/nutrition";

function formatDate(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
}

export default function DayDetail({ detail }) {
  const { date, exerciseGroups, cardio, habitLog, pullupTarget, meals } = detail;
  const totals = sumMacros(meals);
  const hasAnything = exerciseGroups.length > 0 || cardio.length > 0 || habitLog || meals.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-[18px] font-semibold text-body">{formatDate(date)}</h2>

      {!hasAnything && <p className="text-[13px] text-muted">Nothing logged on this day.</p>}

      {exerciseGroups.length > 0 && (
        <div className="rounded-card border border-border bg-surface p-4">
          <h3 className="mb-3 text-[12px] font-medium uppercase tracking-wide text-muted">Workout</h3>
          <div className="flex flex-col gap-3">
            {exerciseGroups.map((g) => (
              <div key={g.name}>
                <p className="mb-1.5 text-[14px] text-body">{g.name}</p>
                <div className="flex flex-wrap gap-1.5">
                  {g.sets.map((s) => (
                    <span
                      key={s.id}
                      className="rounded-pill border border-border bg-white/[0.03] px-2 py-1 font-mono text-[12px] text-body"
                    >
                      {s.weight_lbs}×{s.reps}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {habitLog && (
        <div className="rounded-card border border-border bg-surface p-4">
          <h3 className="mb-3 text-[12px] font-medium uppercase tracking-wide text-muted">Habits</h3>
          <div className="flex flex-col gap-2">
            {[
              { key: "pushups", label: "Pushups", target: HABIT_TARGETS.pushups.min },
              { key: "situps", label: "Situps", target: HABIT_TARGETS.situps.min },
              { key: "pullups", label: "Pullups", target: pullupTarget },
            ].map(({ key, label, target }) => {
              const value = habitLog[key] ?? 0;
              const met = value >= target;
              return (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-[13px] text-body">{label}</span>
                  <span className="font-mono text-[13px]" style={{ color: met ? "#34d399" : "#6e7a8a" }}>
                    {value} / {target}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {cardio.length > 0 && (
        <div className="rounded-card border border-border bg-surface p-4">
          <h3 className="mb-3 text-[12px] font-medium uppercase tracking-wide text-muted">Cardio</h3>
          <div className="flex flex-col gap-1.5">
            {cardio.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-btn bg-white/[0.03] px-3 py-2 text-[13px]"
              >
                <span className="text-body">{c.type}</span>
                <span className="font-mono text-muted">{c.duration_min} min</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {meals.length > 0 && (
        <div className="rounded-card border border-border bg-surface p-4">
          <h3 className="mb-3 text-[12px] font-medium uppercase tracking-wide text-muted">Nutrition</h3>
          <div className="flex flex-col gap-3">
            <MacroBar label="Protein" value={totals.protein_g} target={NUTRITION_TARGETS.protein} />
            <MacroBar label="Carbs" value={totals.carbs_g} target={NUTRITION_TARGETS.carbs} />
            <MacroBar label="Fat" value={totals.fat_g} target={NUTRITION_TARGETS.fat} />
            <MacroBar label="Calories" value={totals.calories} unit="" target={NUTRITION_TARGETS.calories} />
          </div>
        </div>
      )}
    </div>
  );
}
