import { useEffect, useState } from "react";

export default function HabitCard({
  title,
  value,
  onSave,
  target,
  targetLabel,
  streak,
  editableTarget = false,
  onTargetChange,
}) {
  const [draft, setDraft] = useState(String(value ?? 0));
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState(String(target ?? ""));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setDraft(String(value ?? 0));
  }, [value]);

  useEffect(() => {
    setTargetDraft(String(target ?? ""));
  }, [target]);

  const met = (value ?? 0) >= target;
  const pct = target > 0 ? Math.min(100, Math.round(((value ?? 0) / target) * 100)) : 0;

  async function handleSave() {
    const num = parseInt(draft, 10);
    if (Number.isNaN(num) || num < 0) return;
    setSaving(true);
    try {
      await onSave(num);
    } finally {
      setSaving(false);
    }
  }

  async function handleTargetSave() {
    const num = parseInt(targetDraft, 10);
    if (Number.isNaN(num) || num <= 0) return;
    setEditingTarget(false);
    await onTargetChange(num);
  }

  return (
    <div
      className="mb-3 rounded-card border border-border bg-surface p-5"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[15px] font-medium text-body">{title}</h3>
        <div className="flex items-center gap-3 font-mono text-[12px] text-muted">
          {streak !== undefined && (
            <span style={{ color: streak.current_streak > 0 ? "#34d399" : undefined }}>
              {streak.current_streak}d streak
            </span>
          )}
          <span>best {streak?.best_streak ?? 0}</span>
        </div>
      </div>

      <div className="mb-2 flex items-end justify-between">
        <span className="font-mono text-[26px] font-semibold text-body">{value ?? 0}</span>
        {editableTarget && editingTarget ? (
          <div className="flex items-center gap-1.5">
            <input
              type="number"
              inputMode="numeric"
              autoFocus
              value={targetDraft}
              onChange={(e) => setTargetDraft(e.target.value)}
              className="w-16 rounded-btn border border-border bg-bg px-2 py-1 text-right font-mono text-[13px] text-body outline-none focus:border-accent"
            />
            <button
              type="button"
              onClick={handleTargetSave}
              className="rounded-pill bg-accent px-2 py-1 text-[11px] font-medium text-[#0d0d12]"
            >
              Set
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => editableTarget && setEditingTarget(true)}
            className="font-mono text-[12px] text-muted"
          >
            target {targetLabel ?? target}
            {editableTarget && " · edit"}
          </button>
        )}
      </div>

      <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${pct}%`, background: met ? "#34d399" : "#5ab4ff" }}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="number"
          inputMode="numeric"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 rounded-btn border border-border bg-bg px-3 py-2.5 font-mono text-[15px] text-body outline-none transition-colors duration-200 focus:border-accent"
          placeholder="0"
        />
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-btn bg-accent px-4 py-2.5 text-[14px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-40"
        >
          {saving ? "Saving…" : "Log"}
        </button>
      </div>
    </div>
  );
}
