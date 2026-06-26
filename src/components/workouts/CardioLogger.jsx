import { useEffect, useState } from "react";
import { ActivityIcon, ChevronIcon } from "../icons";
import { fetchCardioToday, logCardio } from "../../lib/workouts";

const TYPES = ["Swim", "Run", "Bike", "Row", "Other"];

export default function CardioLogger({ userId }) {
  const [expanded, setExpanded] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [type, setType] = useState(TYPES[0]);
  const [duration, setDuration] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCardioToday(userId).then(setSessions);
  }, [userId]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!duration) return;

    setSaving(true);
    setError("");

    try {
      const saved = await logCardio({
        userId,
        type,
        durationMin: parseInt(duration, 10),
        notes: notes || null,
      });
      setSessions((s) => [saved, ...s]);
      setDuration("");
      setNotes("");
    } catch {
      setError("Couldn't save session");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="mb-6 overflow-hidden rounded-card border border-border bg-surface"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2.5">
          <ActivityIcon width={18} height={18} className="text-accent" />
          <div>
            <h3 className="text-[15px] font-medium text-body">Cardio</h3>
            <p className="mt-0.5 text-[12px] text-muted">
              {sessions.length > 0 ? `${sessions.length} logged today` : "Log a swim or cardio session"}
            </p>
          </div>
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
          {sessions.length > 0 && (
            <div className="mb-4 flex flex-col gap-1.5">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between rounded-btn bg-white/[0.03] px-3 py-2 text-[13px]"
                >
                  <span className="text-body">{s.type}</span>
                  <span className="font-mono text-muted">{s.duration_min} min</span>
                </div>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="flex gap-2 overflow-x-auto">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className="shrink-0 rounded-pill border px-3 py-1.5 text-[12px] font-medium transition-colors duration-200"
                  style={{
                    background: type === t ? "#5AB4FF" : "transparent",
                    borderColor: type === t ? "#5AB4FF" : "rgba(255,255,255,0.07)",
                    color: type === t ? "#0d0d12" : "#e8eaf0",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>

            <input
              type="number"
              inputMode="numeric"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Duration (min)"
              className="rounded-btn border border-border bg-bg px-3 py-2.5 font-mono text-[14px] text-body outline-none transition-colors duration-200 focus:border-accent"
            />
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes (optional)"
              className="rounded-btn border border-border bg-bg px-3 py-2.5 text-[14px] text-body outline-none transition-colors duration-200 focus:border-accent"
            />

            <button
              type="submit"
              disabled={saving || !duration}
              className="rounded-btn bg-accent py-2.5 text-[14px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-40"
            >
              {saving ? "Saving…" : "Log Session"}
            </button>
          </form>

          {error && <p className="mt-2 text-[12px] text-[#ff6b6b]">{error}</p>}
        </div>
      )}
    </div>
  );
}
