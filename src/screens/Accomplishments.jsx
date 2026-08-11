import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeftIcon } from "../components/icons";
import AchievementBadge from "../components/accomplishments/AchievementBadge";
import { useAuth } from "../lib/AuthContext";
import { useAccomplishments } from "../lib/AccomplishmentsContext";
import { ACHIEVEMENTS, CATEGORIES, TIERS, syncAccomplishments, fetchEarned } from "../lib/accomplishments";
import { fetchAvatarState } from "../lib/avatar";
import { fetchEconomy } from "../lib/economy";
import { fetchHabitStreaks, fetchHabitSettings } from "../lib/habits";

function formatEarned(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export default function Accomplishments() {
  const { user } = useAuth();
  const { celebrate } = useAccomplishments();
  const [earnedById, setEarnedById] = useState({});
  const [tableMissing, setTableMissing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [avatarState, economy, habitStreaks, settings] = await Promise.all([
          fetchAvatarState(user.id),
          fetchEconomy(user.id),
          fetchHabitStreaks(user.id),
          fetchHabitSettings(user.id),
        ]);
        const result = await syncAccomplishments(user.id, {
          avatarState,
          economy,
          habitStreaks,
          pullupTarget: settings.pullup_target,
        });
        if (!mounted) return;

        if (result.tableMissing) {
          setTableMissing(true);
        } else {
          // Re-read after syncing so anything unlocked just now shows its
          // earned date rather than appearing locked until the next visit.
          const { earned } = await fetchEarned(user.id);
          if (!mounted) return;
          setEarnedById(Object.fromEntries(earned.map((e) => [e.achievement_id, e])));
          celebrate(result.newlyEarned);
        }
      } catch (e) {
        console.error("Failed to load accomplishments", e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user.id, celebrate]);

  const earnedCount = Object.keys(earnedById).length;
  const total = ACHIEVEMENTS.length;

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
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-body">Accomplishments</h1>
          <p className="mt-1 text-[13px] leading-relaxed text-muted">
            {loading ? "Checking your record…" : `${earnedCount} of ${total} earned.`}
          </p>
        </div>
      </div>

      {tableMissing && (
        <div
          className="mb-4 rounded-card border px-4 py-3 text-[12px] leading-relaxed"
          style={{ borderColor: "rgba(227,189,84,0.3)", background: "rgba(227,189,84,0.07)", color: "#e3bd54" }}
        >
          Badges aren't being recorded yet — run <span className="font-mono">supabase/sprint11_migration.sql</span> in
          the Supabase SQL editor to switch them on.
        </div>
      )}

      {!loading && !tableMissing && (
        <div className="card-shadow mb-5 rounded-card border border-border bg-surface p-4">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-[12px] text-muted">Collection</span>
            <span className="font-mono text-[13px] text-body">
              {earnedCount}/{total}
            </span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(earnedCount / total) * 100}%`, background: "#5ab4ff" }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {CATEGORIES.map((category) => {
            const items = ACHIEVEMENTS.filter((a) => a.category === category);
            if (items.length === 0) return null;
            const got = items.filter((a) => earnedById[a.id]).length;
            return (
              <div key={category}>
                <div className="mb-2.5 flex items-baseline justify-between">
                  <h3 className="text-[15px] font-medium text-body">{category}</h3>
                  <span className="font-mono text-[11px] text-muted">
                    {got}/{items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {items.map((a) => {
                    const record = earnedById[a.id];
                    const earned = Boolean(record);
                    const tier = TIERS[a.tier] ?? TIERS.bronze;
                    return (
                      <div
                        key={a.id}
                        className="card-shadow flex items-center gap-3 rounded-card border bg-surface p-4 transition-opacity duration-200"
                        style={{
                          borderColor: earned ? tier.glow : "rgba(255,255,255,0.07)",
                          opacity: earned ? 1 : 0.62,
                        }}
                      >
                        <div className="shrink-0">
                          <AchievementBadge achievement={a} earned={earned} size={46} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-[13px] font-medium text-body">{a.name}</p>
                            <span
                              className="shrink-0 rounded-pill px-1.5 py-0.5 text-[9px] uppercase tracking-wide"
                              style={{
                                color: earned ? tier.color : "#6e7a8a",
                                background: earned ? tier.glow : "rgba(255,255,255,0.04)",
                              }}
                            >
                              {tier.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{a.description}</p>
                          {earned && record.earned_date && (
                            <p className="mt-1 font-mono text-[10px]" style={{ color: tier.color }}>
                              Earned {formatEarned(record.earned_date)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
