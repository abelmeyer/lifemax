import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Avatar, { METRICS } from "../components/avatar/Avatar";
import AvatarBody from "../components/avatar/AvatarBody";
import { ChevronLeftIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { useCustomization } from "../lib/CustomizationContext";
import { fetchAvatarState } from "../lib/avatar";
import {
  SKIN_TONES,
  HAIR_STYLES,
  HAIR_COLORS,
  FACIAL_HAIR,
  DEFAULT_CUSTOMIZATION,
  STAGE_LEVEL_THRESHOLDS,
  STAGE_LABELS,
  getStageForLevel,
} from "../lib/avatarConfig";

// Small cropped render of just the head, used as live thumbnails inside the
// hair-style and facial-hair pickers.
function HeadPreview({ values }) {
  return (
    <svg viewBox="82 16 56 64" width="100%" height="100%" aria-hidden="true">
      <AvatarBody level={1} metrics={METRICS} customization={values} />
    </svg>
  );
}

function SectionLabel({ children }) {
  return <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted">{children}</p>;
}

function Swatch({ color, selected, label, onSelect }) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={selected}
      onClick={onSelect}
      className="h-9 w-9 shrink-0 rounded-full transition-transform duration-200 active:scale-90"
      style={{
        background: color,
        border: selected ? "2px solid #5ab4ff" : "2px solid rgba(255,255,255,0.1)",
        boxShadow: selected ? "0 0 0 3px rgba(90,180,255,0.25)" : "none",
      }}
    />
  );
}

// mode="setup": forced first-login flow (no back button, "Enter Lifemaxx").
// mode="edit": reachable any time from the Dashboard avatar card.
export default function AvatarSetup({ mode = "setup" }) {
  const { user, signOut } = useAuth();
  const { customization, save, skipSetup, tableMissing, loadFailed } = useCustomization();
  const navigate = useNavigate();
  const [values, setValues] = useState({ ...DEFAULT_CUSTOMIZATION, ...(customization ?? {}) });
  const [level, setLevel] = useState(1);
  const [levelUnknown, setLevelUnknown] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [saveFailed, setSaveFailed] = useState(false);

  const isEdit = mode === "edit";

  // The preview always shows your real level. Setup isn't only reached by
  // brand-new accounts — an existing user with no customization row (the day
  // the migration lands) sees it too, and rendering them at level 1 would
  // misreport their physique stage.
  useEffect(() => {
    let mounted = true;
    fetchAvatarState(user.id)
      .then((s) => {
        if (mounted) setLevel(s.level);
      })
      .catch(() => {
        if (mounted) setLevelUnknown(true);
      });
    return () => {
      mounted = false;
    };
  }, [user.id]);

  function set(key, id) {
    setValues((v) => ({ ...v, [key]: id }));
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      await save(values);
      setSaveFailed(false);
      if (isEdit) navigate("/");
    } catch (e) {
      setError(e.message ?? "Could not save your avatar — try again.");
      setSaveFailed(true);
    } finally {
      setSaving(false);
    }
  }

  // Leaving setup without saving. Without this the gate is a dead end: it
  // replaces the whole app, and a write that can never succeed (unrun
  // migration, missing RLS policy) would otherwise lock the user out of
  // everything, not just the avatar.
  function handleSkip() {
    skipSetup();
    if (isEdit) navigate("/");
  }

  const currentStage = getStageForLevel(level);

  const body = (
    <>
      <div className="mb-5 flex items-center gap-3">
        {isEdit && (
          <Link
            to="/"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn border border-border bg-surface text-muted transition-colors duration-200 hover:text-body active:scale-95"
          >
            <ChevronLeftIcon width={18} height={18} />
          </Link>
        )}
        <div className="flex-1">
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">
            {isEdit ? "Edit avatar" : "Create your avatar"}
          </h1>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {isEdit
              ? "Change how your avatar looks — progress stays untouched."
              : "This is you on day one. Train, and it evolves."}
          </p>
        </div>
      </div>

      {tableMissing && (
        <div
          className="mb-4 rounded-card border px-4 py-3 text-[12px] leading-relaxed"
          style={{ borderColor: "rgba(227,189,84,0.3)", background: "rgba(227,189,84,0.07)", color: "#e3bd54" }}
        >
          Appearance can't be saved yet — run <span className="font-mono">supabase/sprint10_migration.sql</span> in the
          Supabase SQL editor first. You can still look around; your avatar uses the default look until then.
        </div>
      )}

      {loadFailed && !tableMissing && (
        <div
          className="mb-4 rounded-card border px-4 py-3 text-[12px] leading-relaxed"
          style={{ borderColor: "rgba(227,189,84,0.3)", background: "rgba(227,189,84,0.07)", color: "#e3bd54" }}
        >
          Couldn't load your saved appearance, so these are the defaults — saving now would replace whatever is stored.
          Reload the app first if you'd rather not risk that.
        </div>
      )}

      <div className="card-shadow mb-4 rounded-card border border-border bg-surface p-4">
        <div className="mx-auto" style={{ maxWidth: 230, aspectRatio: "300 / 290" }}>
          <Avatar level={level} habitStreaks={{}} customization={values} />
        </div>
        <p className="text-center text-[12px] text-muted">
          {STAGE_LABELS[currentStage - 1]}
          {levelUnknown ? "" : ` · Level ${level}`}
        </p>
      </div>

      <div className="card-shadow mb-4 rounded-card border border-border bg-surface p-5">
        <SectionLabel>Skin tone</SectionLabel>
        <div className="mb-5 flex flex-wrap gap-2.5">
          {SKIN_TONES.map((t) => (
            <Swatch
              key={t.id}
              color={t.base}
              label={t.label}
              selected={values.skin_tone === t.id}
              onSelect={() => set("skin_tone", t.id)}
            />
          ))}
        </div>

        <SectionLabel>Hair</SectionLabel>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {HAIR_STYLES.map((s) => {
            const selected = values.hair_style === s.id;
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={selected}
                onClick={() => set("hair_style", s.id)}
                className="flex flex-col items-center gap-1 rounded-btn border py-2 transition-colors duration-200 active:scale-95"
                style={{
                  borderColor: selected ? "rgba(90,180,255,0.5)" : "rgba(255,255,255,0.07)",
                  background: selected ? "rgba(90,180,255,0.08)" : "transparent",
                }}
              >
                <div className="h-12 w-11">
                  <HeadPreview values={{ ...values, hair_style: s.id, facial_hair: "none" }} />
                </div>
                <span className="text-[11px]" style={{ color: selected ? "#5ab4ff" : "#6e7a8a" }}>
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mb-5 flex flex-wrap gap-2.5">
          {HAIR_COLORS.map((c) => (
            <Swatch
              key={c.id}
              color={c.base}
              label={c.label}
              selected={values.hair_color === c.id}
              onSelect={() => set("hair_color", c.id)}
            />
          ))}
        </div>

        <SectionLabel>Facial hair</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {FACIAL_HAIR.map((f) => {
            const selected = values.facial_hair === f.id;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={selected}
                onClick={() => set("facial_hair", f.id)}
                className="flex flex-col items-center gap-1 rounded-btn border py-2 transition-colors duration-200 active:scale-95"
                style={{
                  borderColor: selected ? "rgba(90,180,255,0.5)" : "rgba(255,255,255,0.07)",
                  background: selected ? "rgba(90,180,255,0.08)" : "transparent",
                }}
              >
                <div className="h-11 w-10">
                  <HeadPreview values={{ ...values, facial_hair: f.id }} />
                </div>
                <span className="text-[11px]" style={{ color: selected ? "#5ab4ff" : "#6e7a8a" }}>
                  {f.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-shadow mb-4 rounded-card border border-border bg-surface p-5">
        <SectionLabel>Evolutions</SectionLabel>
        <p className="mb-3 text-[12px] leading-relaxed text-muted">
          Every day you work out and hit your habits, your avatar levels up and its physique evolves through six
          stages. Miss a day and it slips back.
        </p>
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1">
          {STAGE_LEVEL_THRESHOLDS.map((lvl, i) => {
            const isCurrent = i + 1 === currentStage;
            return (
              <div
                key={lvl}
                className="flex shrink-0 flex-col items-center gap-1 rounded-btn border px-1.5 pt-1"
                style={{
                  width: 76,
                  borderColor: isCurrent ? "rgba(90,180,255,0.4)" : "transparent",
                  background: isCurrent ? "rgba(90,180,255,0.06)" : "transparent",
                }}
              >
                <svg viewBox="30 10 160 250" width="52" height="82" aria-hidden="true">
                  <AvatarBody level={lvl} metrics={METRICS} customization={values} />
                </svg>
                <span className="pb-1.5 text-center text-[10px] leading-tight text-muted">{STAGE_LABELS[i]}</span>
              </div>
            );
          })}
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

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || tableMissing}
        className="w-full rounded-btn bg-accent py-3.5 text-[15px] font-medium text-[#0d0d12] transition-colors duration-200 hover:bg-accent-hover disabled:opacity-50"
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Enter Lifemaxx"}
      </button>

      {!isEdit && (
        <div className="mt-3 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleSkip}
            className="text-[13px] text-muted transition-colors duration-200 hover:text-body"
          >
            {saveFailed || tableMissing ? "Continue without saving" : "Skip for now"}
          </button>
          <button
            type="button"
            onClick={signOut}
            className="text-[12px] text-muted transition-colors duration-200 hover:text-body"
          >
            Sign out
          </button>
        </div>
      )}
    </>
  );

  if (isEdit) return body;

  // Setup mode renders standalone (no tab bar) — the user can't wander into
  // the app until their avatar exists.
  return (
    <div
      className="mx-auto min-h-screen w-full max-w-md px-5 pb-10"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 24px)" }}
    >
      {body}
    </div>
  );
}
