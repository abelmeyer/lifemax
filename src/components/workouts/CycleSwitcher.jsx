import { CYCLES } from "../../lib/cycles";

// Segmented control for the active training cycle. Switching only changes
// which program the tab shows — logged sets stay on their exercises.
export default function CycleSwitcher({ cycle, onChange, disabled }) {
  return (
    <div
      role="radiogroup"
      aria-label="Training cycle"
      className="flex rounded-btn border border-border bg-surface p-0.5"
    >
      {CYCLES.map((c) => {
        const active = c.id === cycle;
        return (
          <button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={c.label}
            disabled={disabled}
            onClick={() => !active && onChange(c.id)}
            className="rounded-[8px] px-2.5 py-1.5 text-[12px] font-medium transition-colors duration-200 disabled:opacity-50"
            style={{
              background: active ? "#5AB4FF" : "transparent",
              color: active ? "#0d0d12" : "#6e7a8a",
            }}
          >
            {c.short}
          </button>
        );
      })}
    </div>
  );
}
