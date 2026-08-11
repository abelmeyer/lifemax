import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon, ChevronRightIcon, LogoutIcon } from "../components/icons";
import { METRICS } from "../components/avatar/Avatar";
import AvatarBody from "../components/avatar/AvatarBody";
import { useAuth } from "../lib/AuthContext";
import { useCustomization } from "../lib/CustomizationContext";
import {
  fetchHabitSettings,
  upsertPullupTarget,
  HABIT_TARGETS,
  WEEKLY_SWIM_TARGET,
} from "../lib/habits";

const MIN_PULLUP_TARGET = 1;
const MAX_PULLUP_TARGET = 50;

function Row({ label, value, children }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border py-3 last:border-b-0">
      <span className="text-[13px] text-body">{label}</span>
      {children ?? <span className="font-mono text-[13px] text-muted">{value}</span>}
    </div>
  );
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const { customization } = useCustomization();
  const [pullupTarget, setPullupTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    fetchHabitSettings(user.id)
      .then((s) => {
        if (mounted) setPullupTarget(s.pullup_target);
      })
      .catch((e) => {
        if (mounted) setError(e.message);
      });
    return () => {
      mounted = false;
    };
  }, [user.id]);

  async function changeTarget(next) {
    const clamped = Math.min(MAX_PULLUP_TARGET, Math.max(MIN_PULLUP_TARGET, next));
    if (clamped === pullupTarget) return;
    const previous = pullupTarget;
    setPullupTarget(clamped);
    setError(null);
    setSaving(true);
    try {
      await upsertPullupTarget(user.id, clamped);
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 900);
    } catch (e) {
      setPullupTarget(previous);
      setError(e.message);
    } finally {
      setSaving(false);
    }
  }

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
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">Settings</h1>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">Targets, appearance, and your account.</p>
        </div>
      </div>

      {error && (
        <div
          className="fade-in mb-4 rounded-card border px-4 py-3 text-[13px]"
          style={{ borderColor: "rgba(248,113,113,0.3)", background: "rgba(248,113,113,0.08)", color: "#f87171" }}
        >
          {error}
        </div>
      )}

      <Link
        to="/avatar"
        className="card-shadow mb-3 flex items-center gap-3 rounded-card border border-border bg-surface p-4 transition-colors duration-200 hover:bg-white/[0.03]"
      >
        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-[10px] border border-border bg-bg/60">
          <svg viewBox="80 14 60 66" width="100%" height="100%" aria-hidden="true">
            <AvatarBody level={1} metrics={METRICS} customization={customization} />
          </svg>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-medium text-body">Avatar appearance</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
            Skin tone, hair, and facial hair. Progress is never affected.
          </p>
        </div>
        <ChevronRightIcon width={16} height={16} className="shrink-0 text-muted" />
      </Link>

      <div className="card-shadow mb-3 rounded-card border border-border bg-surface p-5">
        <h3 className="mb-1 text-[15px] font-medium text-body">Daily habit targets</h3>
        <p className="mb-3 text-[12px] leading-relaxed text-muted">
          Pushups and situps use fixed ranges. Your pullup target is personal — hitting it counts the day.
        </p>

        <div className="flex items-center justify-between gap-3 border-b border-border py-3">
          <div>
            <p className="text-[13px] text-body">Pullup target</p>
            <p className="mt-0.5 text-[11px] text-muted">reps per day</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease pullup target"
              disabled={saving || pullupTarget === null || pullupTarget <= MIN_PULLUP_TARGET}
              onClick={() => changeTarget(pullupTarget - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-btn border border-border text-[18px] text-body transition-colors duration-200 hover:bg-white/[0.04] disabled:opacity-40 active:scale-95"
            >
              −
            </button>
            <span
              className={`w-10 text-center font-mono text-[18px] font-semibold ${savedFlash ? "pop-in" : ""}`}
              style={{ color: savedFlash ? "#34d399" : "#e8eaf0" }}
            >
              {pullupTarget ?? "—"}
            </span>
            <button
              type="button"
              aria-label="Increase pullup target"
              disabled={saving || pullupTarget === null || pullupTarget >= MAX_PULLUP_TARGET}
              onClick={() => changeTarget(pullupTarget + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-btn border border-border text-[18px] text-body transition-colors duration-200 hover:bg-white/[0.04] disabled:opacity-40 active:scale-95"
            >
              +
            </button>
          </div>
        </div>

        <Row label="Pushups" value={HABIT_TARGETS.pushups.label} />
        <Row label="Situps" value={HABIT_TARGETS.situps.label} />
        <Row label="Swims" value={`${WEEKLY_SWIM_TARGET}/week`} />
      </div>

      <div className="card-shadow mb-3 rounded-card border border-border bg-surface p-5">
        <h3 className="mb-2 text-[15px] font-medium text-body">Account</h3>
        <Row label="Signed in as" value={user.email} />
        <button
          type="button"
          onClick={signOut}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-btn border py-3 text-[13px] font-medium transition-colors duration-200 active:scale-95"
          style={{ borderColor: "rgba(248,113,113,0.3)", color: "#f87171" }}
        >
          <LogoutIcon width={15} height={15} />
          Sign out
        </button>
      </div>
    </>
  );
}
