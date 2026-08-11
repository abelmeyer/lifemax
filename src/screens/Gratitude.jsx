import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import {
  GRATITUDE_SLOTS,
  fetchGratitude,
  fetchGratitudeRange,
  saveGratitude,
  normalizeItems,
  countFilled,
  isComplete,
  gratitudeStreak,
} from "../lib/gratitude";
import { todayStr, addDaysStr } from "../lib/dateUtils";

const HISTORY_DAYS = 30;

const PROMPTS = [
  "Someone who made today easier",
  "Something your body did for you",
  "A small thing that went right",
];

function formatDay(dateStr) {
  const d = new Date(dateStr + "T00:00:00");
  const today = todayStr();
  if (dateStr === today) return "Today";
  if (dateStr === addDaysStr(today, -1)) return "Yesterday";
  return d.toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" });
}

export default function Gratitude() {
  const { user } = useAuth();
  const today = todayStr();
  const [items, setItems] = useState(() => normalizeItems([]));
  const [history, setHistory] = useState([]);
  const [tableMissing, setTableMissing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState(null);
  const [error, setError] = useState(null);
  const lastSavedRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [{ entry, tableMissing: missing }, { entries }] = await Promise.all([
          fetchGratitude(user.id, today),
          fetchGratitudeRange(user.id, addDaysStr(today, -HISTORY_DAYS), today),
        ]);
        if (!mounted) return;
        setTableMissing(missing);
        const initial = normalizeItems(entry?.items);
        setItems(initial);
        lastSavedRef.current = JSON.stringify(initial);
        setHistory(entries);
      } catch (e) {
        if (mounted) setError(e.message ?? "Couldn't load your journal.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user.id, today]);

  const streak = useMemo(() => {
    const withToday = [{ date: today, items }, ...history.filter((h) => h.date !== today)];
    return gratitudeStreak(withToday, today);
  }, [history, items, today]);

  const filled = countFilled(items);
  const complete = isComplete(items);

  async function persist(next) {
    const serialized = JSON.stringify(next);
    if (serialized === lastSavedRef.current) return;
    setSaving(true);
    setError(null);
    try {
      const row = await saveGratitude(user.id, today, next);
      lastSavedRef.current = serialized;
      setSavedAt(Date.now());
      setHistory((h) => [row, ...h.filter((e) => e.date !== today)]);
    } catch (e) {
      setError(e.message ?? "Couldn't save — your text is still here, try again.");
    } finally {
      setSaving(false);
    }
  }

  function updateItem(index, value) {
    setItems((prev) => prev.map((t, i) => (i === index ? value : t)));
  }

  const pastEntries = history.filter((e) => e.date !== today && countFilled(e.items) > 0);

  return (
    <>
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-border bg-surface text-muted transition-colors duration-200 hover:text-body active:scale-95"
        >
          <ChevronLeftIcon width={18} height={18} />
        </Link>
        <div className="flex-1">
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">Gratitude</h1>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Three things, every day. Small ones count.</p>
        </div>
      </div>

      {tableMissing && (
        <div
          className="mb-4 rounded-card border px-4 py-3 text-[12px] leading-relaxed"
          style={{ borderColor: "rgba(227,189,84,0.3)", background: "rgba(227,189,84,0.07)", color: "#e3bd54" }}
        >
          Journal entries can't be saved yet — run <span className="font-mono">supabase/sprint11_migration.sql</span> in
          the Supabase SQL editor first.
        </div>
      )}

      {error && (
        <div
          className="fade-in mb-4 rounded-card border px-4 py-3 text-[13px]"
          style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : (
        <>
          <div
            className="card-shadow mb-3 rounded-card border bg-surface p-5"
            style={{ borderColor: complete ? "rgba(52,211,153,0.28)" : "rgba(255,255,255,0.07)" }}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <h3 className="text-[15px] font-medium text-body">{formatDay(today)}</h3>
              <span
                className={`font-mono text-[12px] ${complete ? "pop-in" : ""}`}
                style={{ color: complete ? "#34d399" : "#6e7a8a" }}
              >
                {complete ? "Complete ✓" : `${filled}/${GRATITUDE_SLOTS}`}
              </span>
            </div>

            <div className="flex flex-col gap-3">
              {items.map((text, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-medium uppercase tracking-wide text-muted">
                    {i + 1} · {PROMPTS[i]}
                  </label>
                  <textarea
                    rows={2}
                    value={text}
                    onChange={(e) => updateItem(i, e.target.value)}
                    onBlur={() => persist(items)}
                    disabled={tableMissing}
                    className="w-full resize-none rounded-btn border border-border bg-bg px-3 py-2.5 text-[14px] leading-relaxed text-body outline-none transition-colors duration-200 focus:border-accent disabled:opacity-50"
                    placeholder="I'm grateful for…"
                  />
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between gap-3">
              <span className="text-[11px] text-muted">
                {saving ? "Saving…" : savedAt ? "Saved" : "Saves when you tap away"}
              </span>
              <button
                type="button"
                onClick={() => persist(items)}
                disabled={saving || tableMissing}
                className="rounded-btn bg-accent px-4 py-2.5 text-[13px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>

          <div className="card-shadow mb-5 flex items-center justify-between rounded-card border border-border bg-surface px-5 py-4">
            <span className="text-[13px] text-muted">Gratitude streak</span>
            <span className="font-mono text-[20px] font-semibold" style={{ color: streak > 0 ? "#34d399" : "#6e7a8a" }}>
              {streak} {streak === 1 ? "day" : "days"}
            </span>
          </div>

          {pastEntries.length > 0 && (
            <div>
              <h3 className="mb-2.5 text-[15px] font-medium text-body">Recent entries</h3>
              <div className="flex flex-col gap-2.5">
                {pastEntries.map((entry) => (
                  <div key={entry.date} className="card-shadow rounded-card border border-border bg-surface p-4">
                    <div className="mb-2 flex items-baseline justify-between">
                      <p className="text-[13px] font-medium text-body">{formatDay(entry.date)}</p>
                      {isComplete(entry.items) && (
                        <span className="text-[11px]" style={{ color: "#34d399" }}>
                          ✓
                        </span>
                      )}
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {normalizeItems(entry.items)
                        .filter((t) => t.trim())
                        .map((t, i) => (
                          <li key={i} className="flex gap-2 text-[12px] leading-relaxed text-muted">
                            <span className="shrink-0 font-mono text-accent">{i + 1}</span>
                            <span>{t}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
