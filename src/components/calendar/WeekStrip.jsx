import { useEffect, useState } from "react";
import { getLastNDays, fetchRangeSummary, classifyDay } from "../../lib/calendar";
import { todayStr } from "../../lib/dateUtils";
import StatusDot from "./StatusDot";
import MonthModal from "./MonthModal";

const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];

export default function WeekStrip({ userId }) {
  const [days, setDays] = useState([]);
  const [statuses, setStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [monthInitialDate, setMonthInitialDate] = useState(null);
  const [showMonth, setShowMonth] = useState(false);

  useEffect(() => {
    let mounted = true;
    const range = getLastNDays(7);
    setDays(range);
    (async () => {
      const summary = await fetchRangeSummary(userId, range[0], range[range.length - 1]);
      if (!mounted) return;
      const today = todayStr();
      const map = {};
      for (const d of range) map[d] = classifyDay(d, summary, today);
      setStatuses(map);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [userId]);

  const today = todayStr();
  const fullDays = days.filter((d) => statuses[d] === "full").length;

  function openMonth(dateStr) {
    setMonthInitialDate(dateStr);
    setShowMonth(true);
  }

  return (
    <>
      <div className="card-shadow mb-3 rounded-card border border-border bg-surface p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <h3 className="text-[15px] font-medium text-body">Last 7 days</h3>
            {!loading && (
              <span className="font-mono text-[12px]" style={{ color: fullDays > 0 ? "#34d399" : "#6e7a8a" }}>
                {fullDays} full
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => openMonth(null)}
            className="text-[12px] text-accent transition-colors duration-200 hover:text-accent-hover"
          >
            View month →
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-2">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-border border-t-accent" />
          </div>
        ) : (
          <div className="flex justify-between">
            {days.map((d) => {
              const dayNum = Number(d.slice(8, 10));
              const dow = new Date(d + "T00:00:00").getDay();
              const isToday = d === today;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => openMonth(d)}
                  aria-label={`View ${d}`}
                  className="flex flex-col items-center gap-1.5 rounded-btn px-1.5 py-1 transition-colors duration-200 hover:bg-white/[0.04] active:scale-95"
                >
                  <span className="text-[10px] uppercase text-muted">{DAY_LETTERS[dow]}</span>
                  <span
                    className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-[12px]"
                    style={{
                      border: isToday ? "1.5px solid #5ab4ff" : "1.5px solid transparent",
                      color: isToday ? "#5ab4ff" : "#e8eaf0",
                    }}
                  >
                    {dayNum}
                  </span>
                  <StatusDot status={statuses[d]} />
                </button>
              );
            })}
          </div>
        )}
      </div>

      {showMonth && (
        <MonthModal userId={userId} initialDate={monthInitialDate} onClose={() => setShowMonth(false)} />
      )}
    </>
  );
}
