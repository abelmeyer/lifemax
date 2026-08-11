import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "../icons";
import { getMonthGrid, fetchRangeSummary, classifyDay, buildDayDetail } from "../../lib/calendar";
import { todayStr } from "../../lib/dateUtils";
import { fetchExercises } from "../../lib/workouts";
import StatusDot from "./StatusDot";
import DayDetail from "./DayDetail";

const WEEKDAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function MonthModal({ userId, initialDate = null, onClose }) {
  const now = new Date();
  const initial = initialDate ? new Date(initialDate + "T00:00:00") : now;
  const [viewedYear, setViewedYear] = useState(initial.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(initial.getMonth());
  const [summary, setSummary] = useState(null);
  const [exercisesById, setExercisesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const today = todayStr();
  const isCurrentMonth = viewedYear === now.getFullYear() && viewedMonth === now.getMonth();
  const grid = useMemo(() => getMonthGrid(viewedYear, viewedMonth), [viewedYear, viewedMonth]);

  useEffect(() => {
    fetchExercises().then((exs) => {
      const map = {};
      for (const e of exs) map[e.id] = e;
      setExercisesById(map);
    });
  }, []);

  // Changing month clears the drill-down, but the first load must keep the day
  // the caller asked to open on. Tracked as "which month the selection belongs
  // to" rather than "is this the first run": StrictMode double-invokes this
  // effect on mount, and a first-run flag reads the second invocation as a
  // month change and throws away initialDate.
  const selectionMonthRef = useRef(`${viewedYear}-${viewedMonth}`);
  useEffect(() => {
    const monthKey = `${viewedYear}-${viewedMonth}`;
    if (selectionMonthRef.current !== monthKey) {
      selectionMonthRef.current = monthKey;
      setSelectedDate(null);
    }
    setLoading(true);
    setLoadFailed(false);
    const inMonthCells = grid.filter((c) => c.inMonth);
    const start = inMonthCells[0].dateStr;
    const end = inMonthCells[inMonthCells.length - 1].dateStr;
    // Fast month-switching can land these out of order, so only the fetch the
    // modal is still showing is allowed to paint.
    let current = true;
    fetchRangeSummary(userId, start, end)
      .then((data) => {
        if (!current) return;
        setSummary(data);
        setLoading(false);
      })
      .catch(() => {
        if (!current) return;
        setLoadFailed(true);
        setLoading(false);
      });
    return () => {
      current = false;
    };
  }, [userId, viewedYear, viewedMonth, grid, reloadToken]);

  function goPrevMonth() {
    if (viewedMonth === 0) {
      setViewedYear((y) => y - 1);
      setViewedMonth(11);
    } else {
      setViewedMonth((m) => m - 1);
    }
  }

  function goNextMonth() {
    if (isCurrentMonth) return;
    if (viewedMonth === 11) {
      setViewedYear((y) => y + 1);
      setViewedMonth(0);
    } else {
      setViewedMonth((m) => m + 1);
    }
  }

  const dayDetail = selectedDate && summary ? buildDayDetail(selectedDate, summary, exercisesById) : null;

  const monthStats = useMemo(() => {
    if (!summary) return { fullDays: 0, workoutDays: 0, volume: 0, badges: 0 };
    const inMonth = grid.filter((c) => c.inMonth).map((c) => c.dateStr);
    const monthDates = new Set(inMonth);
    return {
      fullDays: inMonth.filter((d) => classifyDay(d, summary, today) === "full").length,
      workoutDays: new Set(summary.sets.filter((s) => monthDates.has(s.date)).map((s) => s.date)).size,
      volume: summary.sets
        .filter((s) => monthDates.has(s.date))
        .reduce((sum, s) => sum + (s.weight_lbs ?? 0) * (s.reps ?? 0), 0),
      badges: (summary.badges ?? []).filter((b) => monthDates.has(b.earned_date)).length,
    };
  }, [summary, grid, today]);

  const badgeDates = useMemo(
    () => new Set((summary?.badges ?? []).map((b) => b.earned_date)),
    [summary],
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="sheet-slide-up flex max-h-[88vh] w-full max-w-md flex-col rounded-t-[16px] bg-bg"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 pb-3 pt-5">
          {dayDetail ? (
            <button
              type="button"
              onClick={() => setSelectedDate(null)}
              className="text-[13px] font-medium text-accent"
            >
              ← Month
            </button>
          ) : (
            <button
              type="button"
              onClick={goPrevMonth}
              className="rounded-full p-1.5 text-muted transition-colors duration-200 hover:bg-white/[0.06]"
            >
              <ChevronLeftIcon width={18} height={18} />
            </button>
          )}

          {!dayDetail && (
            <h2 className="text-[16px] font-semibold text-body">
              {MONTH_NAMES[viewedMonth]} {viewedYear}
            </h2>
          )}

          {!dayDetail ? (
            <button
              type="button"
              onClick={goNextMonth}
              disabled={isCurrentMonth}
              className="rounded-full p-1.5 text-muted transition-colors duration-200 hover:bg-white/[0.06] disabled:opacity-30"
            >
              <ChevronRightIcon width={18} height={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-muted transition-colors duration-200 hover:bg-white/[0.06]"
            >
              <XIcon width={16} height={16} />
            </button>
          )}
        </div>

        <div
          className="flex-1 overflow-y-auto px-5 pb-6"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)" }}
        >
          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          ) : loadFailed ? (
            <div
              className="flex items-center justify-between gap-3 rounded-card border px-4 py-3 text-[13px]"
              style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171" }}
            >
              <span className="leading-relaxed">Couldn't load this month.</span>
              <button
                type="button"
                onClick={() => setReloadToken((t) => t + 1)}
                className="shrink-0 rounded-btn border px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-200 hover:bg-white/[0.04]"
                style={{ borderColor: "rgba(248,113,113,0.3)" }}
              >
                Retry
              </button>
            </div>
          ) : dayDetail ? (
            <DayDetail detail={dayDetail} />
          ) : (
            <>
              <div className="mb-4 grid grid-cols-4 gap-2">
                {[
                  { label: "Full days", value: monthStats.fullDays, color: "#34d399" },
                  { label: "Workouts", value: monthStats.workoutDays, color: "#5ab4ff" },
                  { label: "Volume", value: `${Math.round(monthStats.volume / 1000)}k`, color: "#e8eaf0" },
                  { label: "Badges", value: monthStats.badges, color: "#e3bd54" },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-btn border border-border bg-surface px-2 py-2.5 text-center">
                    <p className="font-mono text-[16px] font-semibold" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-wide text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1">
                {WEEKDAY_LABELS.map((l, i) => (
                  <div key={i} className="text-center text-[11px] text-muted">
                    {l}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {grid.map((cell, i) => {
                  if (!cell.inMonth) {
                    return (
                      <div key={i} className="flex flex-col items-center gap-1.5 py-2 opacity-30">
                        <span className="font-mono text-[12px] text-muted">{cell.day}</span>
                      </div>
                    );
                  }
                  const status = classifyDay(cell.dateStr, summary, today);
                  const isToday = cell.dateStr === today;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setSelectedDate(cell.dateStr)}
                      className="relative flex flex-col items-center gap-1.5 rounded-btn py-2 transition-colors duration-200 hover:bg-white/[0.04]"
                    >
                      {badgeDates.has(cell.dateStr) && (
                        <span
                          className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full"
                          style={{ background: "#e3bd54" }}
                          aria-label="Badge earned"
                        />
                      )}
                      <span className="font-mono text-[12px]" style={{ color: isToday ? "#5ab4ff" : "#e8eaf0" }}>
                        {cell.day}
                      </span>
                      <StatusDot status={status} />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-4 text-[11px] text-muted">
                <span className="flex items-center gap-1.5">
                  <StatusDot status="full" /> Full
                </span>
                <span className="flex items-center gap-1.5">
                  <StatusDot status="partial" /> Partial
                </span>
                <span className="flex items-center gap-1.5">
                  <StatusDot status="rest" /> Rest
                </span>
                <span className="flex items-center gap-1.5">
                  <StatusDot status="missed" /> Missed
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
