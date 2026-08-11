import { useState } from "react";
import { ChevronIcon, TrophyIcon, PencilIcon, XIcon } from "../icons";
import { fetchExerciseHistory, logSet, updateSet, deleteSet, summarizeHistory } from "../../lib/workouts";
import { todayStr } from "../../lib/dateUtils";
import { useRestTimer } from "../../lib/RestTimerContext";
import { restSecondsFor, formatClock } from "../../lib/rest";

export default function ExerciseCard({ exercise, userId, onSetsChanged }) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState(null);
  const [adding, setAdding] = useState(false);
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [justHitPR, setJustHitPR] = useState(false);
  const [justLoggedId, setJustLoggedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editWeight, setEditWeight] = useState("");
  const [editReps, setEditReps] = useState("");

  const restTimer = useRestTimer();
  const restSeconds = restSecondsFor(exercise);

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
    // Next number past the highest already used, not count+1: after deleting a
    // middle set the count no longer matches the numbering, and count+1 would
    // collide with an existing set_number.
    const setNumber = Math.max(0, ...(history?.todaysSets ?? []).map((s) => s.set_number ?? 0)) + 1;

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

      setJustLoggedId(newSet.id);
      setTimeout(() => setJustLoggedId(null), 360);

      if (weightNum > priorBest) {
        setJustHitPR(true);
        setTimeout(() => setJustHitPR(false), 2500);
      }

      // Rest starts the moment the set lands — that's when the clock really
      // starts, and it saves a tap during the part of the session where you
      // least want to be fiddling with a phone.
      restTimer.start(restSeconds, `Rest · ${exercise.name}`);

      setWeight("");
      setReps("");
      setAdding(false);
      onSetsChanged?.();
    } catch {
      setError("Couldn't save set");
    } finally {
      setSaving(false);
    }
  }

  function beginEdit(set) {
    setEditingId(set.id);
    setEditWeight(String(set.weight_lbs ?? ""));
    setEditReps(String(set.reps ?? ""));
    setError("");
  }

  async function handleSaveEdit(e) {
    e.preventDefault();
    if (!editWeight || !editReps) return;
    setSaving(true);
    setError("");
    try {
      const updated = await updateSet(editingId, {
        weightLbs: parseFloat(editWeight),
        reps: parseInt(editReps, 10),
      });
      setHistory((h) => {
        const todaysSets = (h?.todaysSets ?? []).map((s) => (s.id === updated.id ? updated : s));
        return {
          ...h,
          todaysSets,
          // bestWeight can move down when a mistyped PR is corrected, so it's
          // recomputed rather than max()'d upward.
          bestWeight: Math.max(h?.pastBestWeight ?? 0, ...todaysSets.map((s) => s.weight_lbs ?? 0), 0),
        };
      });
      setEditingId(null);
      onSetsChanged?.();
    } catch {
      setError("Couldn't update set");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(setId) {
    setSaving(true);
    setError("");
    try {
      await deleteSet(setId);
      setHistory((h) => {
        const todaysSets = (h?.todaysSets ?? []).filter((s) => s.id !== setId);
        return {
          ...h,
          todaysSets,
          bestWeight: Math.max(h?.pastBestWeight ?? 0, ...todaysSets.map((s) => s.weight_lbs ?? 0), 0),
        };
      });
      setEditingId(null);
      onSetsChanged?.();
    } catch {
      setError("Couldn't delete set");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card-shadow mb-3 overflow-hidden rounded-card border border-border bg-surface">
      <button
        type="button"
        onClick={toggleExpand}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-medium text-body">{exercise.name}</h3>
          <p className="mt-0.5 font-mono text-[12px] text-muted">
            {exercise.default_sets} × {exercise.rep_scheme} · rest {formatClock(restSeconds)}
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
        <div className="fade-in border-t border-border px-5 py-4">
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
                  history.todaysSets.map((s, i) =>
                    editingId === s.id ? (
                      <form
                        key={s.id}
                        onSubmit={handleSaveEdit}
                        className="flex items-center gap-2 rounded-btn border border-accent/40 bg-accent/[0.06] px-2.5 py-2"
                      >
                        <span className="shrink-0 font-mono text-[11px] text-muted">#{i + 1}</span>
                        <input
                          type="number"
                          inputMode="decimal"
                          autoFocus
                          aria-label="Weight in pounds"
                          value={editWeight}
                          onChange={(e) => setEditWeight(e.target.value)}
                          className="w-full min-w-0 rounded-btn border border-border bg-bg px-2 py-1.5 font-mono text-[13px] text-body outline-none focus:border-accent"
                        />
                        <span className="shrink-0 text-[11px] text-muted">×</span>
                        <input
                          type="number"
                          inputMode="numeric"
                          aria-label="Reps"
                          value={editReps}
                          onChange={(e) => setEditReps(e.target.value)}
                          className="w-full min-w-0 rounded-btn border border-border bg-bg px-2 py-1.5 font-mono text-[13px] text-body outline-none focus:border-accent"
                        />
                        <button
                          type="submit"
                          disabled={saving}
                          className="shrink-0 rounded-btn bg-accent px-2.5 py-1.5 text-[12px] font-medium text-[#0d0d12] disabled:opacity-40"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id)}
                          disabled={saving}
                          aria-label={`Delete set ${i + 1}`}
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-btn border disabled:opacity-40"
                          style={{ borderColor: "rgba(248,113,113,0.3)", color: "#f87171" }}
                        >
                          <XIcon width={12} height={12} />
                        </button>
                      </form>
                    ) : (
                      <button
                        key={s.id ?? i}
                        type="button"
                        onClick={() => beginEdit(s)}
                        className={`group flex items-center justify-between rounded-btn border px-3 py-2 text-left transition-colors duration-200 ${s.id === justLoggedId ? "pop-in" : ""}`}
                        style={{ borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)" }}
                      >
                        <span className="font-mono text-[12px]" style={{ color: "#34d399" }}>
                          Set {i + 1}
                        </span>
                        <span className="flex items-center gap-2">
                          <span className="font-mono text-[13px] text-body">
                            {s.weight_lbs} lbs × {s.reps}
                          </span>
                          <PencilIcon width={11} height={11} className="text-muted" />
                        </span>
                      </button>
                    ),
                  )
                ) : (
                  <p className="text-[12px] text-muted">No sets logged today yet</p>
                )}
              </div>

              {adding ? (
                <form onSubmit={handleLogSet} className="flex items-end gap-2">
                  <div className="flex flex-1 flex-col gap-1">
                    <label className="text-[10px] font-medium uppercase tracking-wide text-muted">lbs</label>
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
                    <label className="text-[10px] font-medium uppercase tracking-wide text-muted">reps</label>
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
                    className="rounded-btn bg-accent px-4 py-2.5 text-[14px] font-medium text-[#0d0d12] transition duration-200 hover:bg-accent-hover active:scale-95 disabled:opacity-40"
                  >
                    Log
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setAdding(true)}
                  className="w-full rounded-btn border border-border py-2.5 text-[14px] font-medium text-accent transition duration-200 hover:bg-white/[0.03] active:scale-[0.99]"
                >
                  + Add Set
                </button>
              )}

              {justHitPR && (
                <div className="mt-3 flex items-center gap-1.5 text-[13px] font-medium" style={{ color: "#34d399" }}>
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
