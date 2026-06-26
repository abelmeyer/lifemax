import { useEffect, useMemo, useState } from "react";
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

export default function MonthModal({ userId, onClose }) {
  const now = new Date();
  const [viewedYear, setViewedYear] = useState(now.getFullYear());
  const [viewedMonth, setViewedMonth] = useState(now.getMonth());
  const [summary, setSummary] = useState(null);
  const [exercisesById, setExercisesById] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

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

  useEffect(() => {
    setLoading(true);
    setSelectedDate(null);
    const inMonthCells = grid.filter((c) => c.inMonth);
    const start = inMonthCells[0].dateStr;
    const end = inMonthCells[inMonthCells.length - 1].dateStr;
    fetchRangeSummary(userId, start, end).then((data) => {
      setSummary(data);
      setLoading(false);
    });
  }, [userId, viewedYear, viewedMonth, grid]);

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
          ) : dayDetail ? (
            <DayDetail detail={dayDetail} />
          ) : (
            <>
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
                      className="flex flex-col items-center gap-1.5 rounded-btn py-2 transition-colors duration-200 hover:bg-white/[0.04]"
                    >
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
