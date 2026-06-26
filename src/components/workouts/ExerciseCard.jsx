import { useState } from "react";
import { ChevronIcon, TrophyIcon } from "../icons";
import { fetchExerciseHistory, logSet, summarizeHistory } from "../../lib/workouts";
import { todayStr } from "../../lib/dateUtils";

export default function ExerciseCard({ exercise, userId }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(null);
  const [adding, setAdding] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [justHitPR, setJustHitPR] = useState(false);

  async function toggleExpand() {
    const next = !expanded;
    setExpanded(next);
    if (next && !history) {
      setLoading(true);
      try {
        const sets = await fetchExerciseHistory(exercise.id);
        setHistory(summarizeHistory(sets, todayStr()));
      } catch {
        setError("Couldn't load history");
      } finally {
        setLoading(false);
      }
    }
  }

  async function handleLogSet(e) {
    e.preventDefault();
    if (!weight || !reps) return;

    setSaving(true);
    setError("");

    const weightNum = parseFloat(weight);
    const repsNum = parseInt(reps, 10);
    const priorBest = history?.bestWeight ?? 0;
    const setNumber = (history?.todaysSets.length ?? 0) + 1;

    try {
      const newSet = await logSet({
        userId,
        exerciseId: exercise.id,
        setNumber,
        weightLbs: weightNum,
        reps: repsNum,
      });

      setHistory((h) => ({
        ...h,
        todaysSets: [...(h?.todaysSets ?? []), newSet],
        bestWeight: Math.max(priorBest, weightNum),
      }));

      if (weightNum > priorBest) {
        setJustHitPR(true);
        setTimeout(() => setJustHitPR(false), 2500);
      }

      setWeight("");
      setReps("");
      setAdding(false);
    } catch {
      setError("Couldn't save set");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="mb-3 overflow-hidden rounded-card border border-border bg-surface"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <button
        type="button"
        onClick={toggleExpand}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-medium text-body">{exercise.name}</h3>
          <p className="mt-0.5 font-mono text-[12px] text-muted">
            {exercise.default_sets} × {exercise.rep_scheme}
          </p>
        </div>
        <ChevronIcon
          width={18}
          height={18}
          className="shrink-0 text-muted transition-transform duration-200"
          style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {expanded && (
        <div className="border-t border-border px-5 py-4">
          <p className="mb-4 text-[13px] leading-relaxed text-muted">{exercise.cue}</p>

          {loading ? (
            <div className="flex justify-center py-4">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          ) : (
            <>
              {history?.lastBest && (
                <div className="mb-3 flex items-center justify-between rounded-btn bg-white/[0.03] px-3 py-2">
                  <span className="text-[12px] text-muted">Last session</span>
                  <span className="font-mono text-[13px] text-body">
                    {history.lastBest.weight_lbs} lbs × {history.lastBest.reps}
                  </span>
                </div>
              )}

              <div className="mb-3 flex flex-col gap-1.5">
                {history?.todaysSets?.length > 0 ? (
                  history.todaysSets.map((s, i) => (
                    <div
                      key={s.id ?? i}
                      className="flex items-center justify-between rounded-btn border px-3 py-2"
                      style={{
                        borderColor: "rgba(52,211,153,0.3)",
                        background: "rgba(52,211,153,0.08)",
                      }}
                    >
                      <span className="font-mono text-[12px]" style={{ color: "#34d399" }}>
                        Set {i + 1}
                      </span>
                      <span className="font-mono text-[13px] text-body">
                        {s.weight_lbs} lbs × {s.reps}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-muted">No sets logged today yet</p>
                )}
              </div>

              {adding ? (
                <form onSubmit={handleLogSet} className="flex items-end gap-2">
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-[10px] font-medium uppercase tracking-wide text-muted">
                      lbs
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      autoFocus
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full rounded-btn border border-border bg-bg px-3 py-2.5 font-mono text-[15px] text-body outline-none transition-colors duration-200 focus:border-accent"
                      placeholder="0"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-[10px] font-medium uppercase tracking-wide text-muted">
                      reps
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={reps}
                      onChange={(e) => setReps(e.target.value)}
                      className="w-full rounded-btn border border-border bg-bg px-3 py-2.5 font-mono text-[15px] text-body outline-none transition-colors duration-200 focus:border-accent"
                      placeholder="0"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={saving || !weight || !reps}
                    className="rounded-btn bg-accent px-4 py-2.5 text-[14px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-40"
                  >
                    Log
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="w-full rounded-btn border border-border py-2.5 text-[14px] font-medium text-accent transition-colors duration-200 hover:bg-white/[0.03]"
                >
                  + Add Set
                </button>
              )}

              {justHitPR && (
                <div
                  className="mt-3 flex items-center gap-1.5 text-[13px] font-medium"
                  style={{ color: "#34d399" }}
                >
                  <TrophyIcon width={15} height={15} />
                  New PR — heaviest set yet
                </div>
              )}

              {error && <p className="mt-2 text-[12px] text-[#ff6b6b]">{error}</p>}
            </>
          )}
        </div>
      )}
    </div>
  );
}
