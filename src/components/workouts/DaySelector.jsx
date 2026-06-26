import { PPL_DAYS } from "../../lib/ppl";

export default function DaySelector({ day, onChange }) {
  return (
    <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1">
      {PPL_DAYS.map((d) => {
        const active = d.day === day;
        return (
          <button
            key={d.day}
            type="button"
            onClick={() => onChange(d.day)}
            className="flex shrink-0 flex-col items-center gap-1 rounded-btn px-3.5 py-2 transition-colors duration-200"
            style={{
              background: active ? "#5AB4FF" : "#16161e",
              border: active ? "1px solid #5AB4FF" : "1px solid rgba(255,255,255,0.07)",
            }}
          >
            <span
              className="font-mono text-[10px] uppercase tracking-wide"
              style={{ color: active ? "#0d0d12" : "#6e7a8a" }}
            >
              Day {d.day}
            </span>
            <span
              className="text-[13px] font-medium"
              style={{ color: active ? "#0d0d12" : "#e8eaf0" }}
            >
              {d.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
