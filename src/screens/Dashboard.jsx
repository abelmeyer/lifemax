import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScreenHeader from "../components/ScreenHeader";
import Avatar from "../components/avatar/Avatar";
import MacroBar from "../components/MacroBar";
import WeekStrip from "../components/calendar/WeekStrip";
import { TrophyIcon, PhotosIcon, SparkleIcon, StarIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { syncAvatarProgress } from "../lib/avatar";
import { getStageLabel } from "../lib/avatarConfig";
import { todayStr } from "../lib/dateUtils";
import { syncEconomy } from "../lib/economy";
import { fetchMealsForDate, sumMacros, weeklyProteinAverage, NUTRITION_TARGETS } from "../lib/nutrition";
import { fetchPhotos, getSignedUrls } from "../lib/photos";

export default function Dashboard() {
  const { user } = useAuth();
  const [avatarState, setAvatarState] = useState(null);
  const [habitStreaks, setHabitStreaks] = useState({});
  const [justLeveledUp, setJustLeveledUp] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState([]);
  const [economy, setEconomy] = useState(null);
  const [auraGained, setAuraGained] = useState(0);
  const [totals, setTotals] = useState({ protein_g: 0, carbs_g: 0, fat_g: 0, calories: 0 });
  const [weeklyProtein, setWeeklyProtein] = useState(0);
  const [latestPhotoUrl, setLatestPhotoUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [avatarResult, economyResult, meals, weeklyAvg, photos] = await Promise.all([
        syncAvatarProgress(user.id),
        syncEconomy(user.id),
        fetchMealsForDate(user.id, todayStr()),
        weeklyProteinAverage(user.id),
        fetchPhotos(user.id),
      ]);
      if (!mounted) return;

      setAvatarState(avatarResult.avatarState);
      setHabitStreaks(avatarResult.habitStreaks);
      if (avatarResult.leveledUpToday) {
        setJustLeveledUp(true);
        setTimeout(() => setJustLeveledUp(false), 700);
      }
      if (avatarResult.unlockedGear.length > 0) {
        setJustUnlocked(avatarResult.unlockedGear);
        setTimeout(() => setJustUnlocked([]), 1500);
      }

      setEconomy(economyResult.economy);
      if (economyResult.auraGained > 0) {
        setAuraGained(economyResult.auraGained);
        setTimeout(() => setAuraGained(0), 2000);
      }

      setTotals(sumMacros(meals));
      setWeeklyProtein(weeklyAvg);

      if (photos.length > 0) {
        const latest = photos[photos.length - 1];
        const urls = await getSignedUrls([latest.storage_path]);
        if (mounted) setLatestPhotoUrl(urls[latest.storage_path]);
      }

      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  if (loading) {
    return (
      <>
        <ScreenHeader title="Dashboard" subtitle="Your daily overview at a glance." />
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Dashboard" subtitle="Your daily overview at a glance." />

      <Link
        to="/store"
        className="mb-3 flex items-center justify-between rounded-card border border-border bg-surface px-4 py-2.5 transition-colors duration-200 hover:bg-white/[0.03]"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <div className="flex items-center gap-1.5 text-accent">
          <SparkleIcon width={15} height={15} />
          <span className="font-mono text-[15px] font-semibold">{economy.aura_balance}</span>
          <span className="text-[11px] text-muted">aura</span>
          {auraGained > 0 && <span className="text-[11px] font-medium text-success">+{auraGained}</span>}
        </div>
        <span className="text-[11px] text-muted">Visit Store →</span>
      </Link>

      <div className="mb-3 flex items-stretch gap-3">
        <div
          className="relative flex-1 rounded-card border border-border bg-surface p-2"
          style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
        >
          {economy.prestige_level >= 1 && (
            <div
              className="absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-medium"
              style={{ borderColor: "rgba(90,180,255,0.3)", background: "rgba(13,13,18,0.85)", color: "#5ab4ff" }}
            >
              <StarIcon width={11} height={11} />
              {economy.prestige_level}
            </div>
          )}
          <div style={{ aspectRatio: "300 / 290" }}>
            <Avatar
              level={avatarState.level}
              habitStreaks={habitStreaks}
              justLeveledUp={justLeveledUp}
              justUnlocked={justUnlocked}
            />
          </div>
        </div>

        <div className="flex w-[104px] flex-col gap-2.5">
          <div
            className="rounded-card border border-border bg-surface px-2 py-3 text-center"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
          >
            <p className="font-mono text-[24px] font-semibold text-accent">{avatarState.streak}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted">day streak</p>
          </div>

          <div
            className="rounded-card border border-border bg-surface px-2 py-3 text-center"
            style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
          >
            <p className="font-mono text-[20px] font-semibold text-body">Lv {avatarState.level}</p>
            <p className="text-[10px] uppercase tracking-wide text-muted">level</p>
          </div>

          <Link
            to="/photos"
            className="relative flex flex-1 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-card border border-dashed border-border py-3 text-muted transition-colors duration-200 hover:bg-white/[0.03]"
          >
            {latestPhotoUrl ? (
              <img src={latestPhotoUrl} alt="Latest progress photo" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <>
                <PhotosIcon width={18} height={18} />
                <span className="text-center text-[10px] leading-tight">Add progress photo</span>
              </>
            )}
          </Link>
        </div>
      </div>

      <p className="mb-6 text-center text-[13px] text-muted">{getStageLabel(avatarState.level)}</p>

      {justLeveledUp && (
        <div
          className="fade-in mb-4 flex items-center justify-center gap-2 rounded-card border px-4 py-3 text-[13px] font-medium"
          style={{ borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", color: "#34d399" }}
        >
          <TrophyIcon width={16} height={16} />
          Leveled up — now level {avatarState.level}
        </div>
      )}

      <WeekStrip userId={user.id} />

      <div
        className="mb-3 flex flex-col gap-3 rounded-card border border-border bg-surface p-5"
        style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
      >
        <h3 className="text-[15px] font-medium text-body">Today's nutrition</h3>
        <MacroBar label="Protein" value={totals.protein_g} target={NUTRITION_TARGETS.protein} />
        <MacroBar label="Carbs" value={totals.carbs_g} target={NUTRITION_TARGETS.carbs} />
        <MacroBar label="Fat" value={totals.fat_g} target={NUTRITION_TARGETS.fat} />
        <MacroBar label="Calories" value={totals.calories} unit="" target={NUTRITION_TARGETS.calories} />
        <div className="mt-1 flex items-baseline justify-between border-t border-border pt-3">
          <span className="text-[12px] text-muted">7-day avg protein</span>
          <span className="font-mono text-[13px] text-body">{weeklyProtein}g</span>
        </div>
      </div>
    </>
  );
}
