import { useEffect, useState } from "react";
import ScreenHeader from "../components/ScreenHeader";
import HabitCard from "../components/habits/HabitCard";
import SwimCard from "../components/habits/SwimCard";
import { TrophyIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { todayStr } from "../lib/dateUtils";
import {
  fetchHabitLog,
  upsertHabitLog,
  fetchHabitSettings,
  upsertPullupTarget,
  fetchSwimCountForWeek,
  currentWeekStart,
  HABIT_TARGETS,
} from "../lib/habits";
import { syncAvatarProgress } from "../lib/avatar";

const GEAR_LABELS = {
  situps: "Six-pack + sit-up bench",
  pullups: "Pull-up bar",
  swims: "Swim cap + goggles",
  pushups: "Defined chest & arms",
};

export default function Habits() {
  const { user } = useAuth();
  const [log, setLog] = useState({ pushups: 0, situps: 0, pullups: 0 });
  const [pullupTarget, setPullupTarget] = useState(10);
  const [streaks, setStreaks] = useState({});
  const [swimCount, setSwimCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const [todayLog, settings, swims] = await Promise.all([
        fetchHabitLog(user.id, todayStr()),
        fetchHabitSettings(user.id),
        fetchSwimCountForWeek(user.id, currentWeekStart()),
      ]);
      if (!mounted) return;
      if (todayLog) setLog({ pushups: todayLog.pushups, situps: todayLog.situps, pullups: todayLog.pullups });
      setPullupTarget(settings.pullup_target);
      setSwimCount(swims);

      const result = await syncAvatarProgress(user.id);
      if (!mounted) return;
      setStreaks(result.habitStreaks);
      applyBanner(result);
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  function applyBanner(result) {
    if (result.leveledUpToday) {
      setBanner({ type: "level", text: `Leveled up — now level ${result.avatarState.level}` });
      setTimeout(() => setBanner(null), 3500);
    } else if (result.unlockedGear.length > 0) {
      setBanner({
        type: "gear",
        text: `New gear unlocked: ${result.unlockedGear.map((g) => GEAR_LABELS[g]).join(", ")}`,
      });
      setTimeout(() => setBanner(null), 3500);
    }
  }

  async function handleSave(habitKey, value) {
    const nextLog = { ...log, [habitKey]: value };
    const saved = await upsertHabitLog({ userId: user.id, date: todayStr(), ...nextLog });
    setLog({ pushups: saved.pushups, situps: saved.situps, pullups: saved.pullups });

    const result = await syncAvatarProgress(user.id);
    setStreaks(result.habitStreaks);
    applyBanner(result);
  }

  async function handleTargetChange(value) {
    await upsertPullupTarget(user.id, value);
    setPullupTarget(value);

    const result = await syncAvatarProgress(user.id);
    setStreaks(result.habitStreaks);
    applyBanner(result);
  }

  if (loading) {
    return (
      <>
        <ScreenHeader title="Habits" subtitle="Build streaks that stick." />
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      </>
    );
  }

  return (
    <>
      <ScreenHeader title="Habits" subtitle="Build streaks that stick." />

      {banner && (
        <div
          className="mb-4 flex items-center gap-2 rounded-card border px-4 py-3 text-[13px] font-medium"
          style={{ borderColor: "rgba(52,211,153,0.3)", background: "rgba(52,211,153,0.08)", color: "#34d399" }}
        >
          <TrophyIcon width={16} height={16} />
          {banner.text}
        </div>
      )}

      <HabitCard
        title="Pushups"
        value={log.pushups}
        target={HABIT_TARGETS.pushups.min}
        targetLabel={HABIT_TARGETS.pushups.label}
        streak={streaks.pushups}
        onSave={(v) => handleSave("pushups", v)}
      />
      <HabitCard
        title="Situps"
        value={log.situps}
        target={HABIT_TARGETS.situps.min}
        targetLabel={HABIT_TARGETS.situps.label}
        streak={streaks.situps}
        onSave={(v) => handleSave("situps", v)}
      />
      <HabitCard
        title="Pullups"
        value={log.pullups}
        target={pullupTarget}
        streak={streaks.pullups}
        editableTarget
        onTargetChange={handleTargetChange}
        onSave={(v) => handleSave("pullups", v)}
      />
      <SwimCard count={swimCount} streak={streaks.swims} />
    </>
  );
}
