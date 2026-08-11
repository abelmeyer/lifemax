import AchievementBadge from "./AchievementBadge";
import { TIERS } from "../../lib/accomplishments";

// The few-seconds unlock overlay. Tapping it dismisses early; otherwise the
// provider clears it on a timer.
export default function AchievementToast({ achievement, onDismiss }) {
  if (!achievement) return null;
  const tier = TIERS[achievement.tier] ?? TIERS.bronze;

  return (
    <div
      className="fixed inset-x-0 z-[60] flex justify-center px-4"
      style={{ top: "calc(env(safe-area-inset-top) + 12px)" }}
      onClick={onDismiss}
      role="status"
      aria-live="polite"
    >
      <div
        className="achievement-pop card-shadow flex w-full max-w-md items-center gap-3 rounded-card border bg-surface px-4 py-3"
        style={{ borderColor: tier.glow, boxShadow: `0 8px 32px ${tier.glow}, 0 4px 24px rgba(0,0,0,0.5)` }}
      >
        <div className="achievement-badge-shine shrink-0">
          <AchievementBadge achievement={achievement} size={52} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium uppercase tracking-[0.12em]" style={{ color: tier.color }}>
            {tier.label} unlocked
          </p>
          <p className="mt-0.5 truncate text-[15px] font-semibold text-body">{achievement.name}</p>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{achievement.description}</p>
        </div>
      </div>
    </div>
  );
}
