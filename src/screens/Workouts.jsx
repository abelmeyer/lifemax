import { useCallback, useEffect, useState } from "react";
import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import DaySelector from "../components/workouts/DaySelector";
import CycleSwitcher from "../components/workouts/CycleSwitcher";
import FullBodyDayPicker from "../components/workouts/FullBodyDayPicker";
import SupersetGroup from "../components/workouts/SupersetGroup";
import ExerciseCard from "../components/workouts/ExerciseCard";
import CardioLogger from "../components/workouts/CardioLogger";
import LiftProgressChart from "../components/workouts/LiftProgressChart";
import WorkoutSessionCard from "../components/workouts/WorkoutSessionCard";
import { HabitsIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { useAccomplishments } from "../lib/AccomplishmentsContext";
import { fetchExercises, fetchSetsForDate } from "../lib/workouts";
import { syncAccomplishments } from "../lib/accomplishments";
import { todayStr } from "../lib/dateUtils";
import { PPL_DAYS, CATEGORY_TO_SLOT } from "../lib/ppl";
import {
  fullBodyDay,
  nextFullBodyKey,
  resolveFullBodyDay,
  pplProgramDay,
  fullBodyProgramDay,
  FULL_BODY_KEYS,
} from "../lib/cycles";
import {
  fetchActiveCycle,
  saveActiveCycle,
  localActiveCycle,
  fetchLastFullBodyDay,
  rememberFullBodyDay,
} from "../lib/training";

const DAY_STORAGE_KEY = "lifemaxx_workout_day";
// A manual Full Body pick only holds for the day it was made — tomorrow the
// rotation decides again.
const FB_PICK_STORAGE_KEY = "lifemaxx_fb_pick";

function readFullBodyPick() {
  try {
    const pick = JSON.parse(localStorage.getItem(FB_PICK_STORAGE_KEY) ?? "null");
    return pick?.date === todayStr() && FULL_BODY_KEYS.includes(pick.key) ? pick.key : null;
  } catch {
    return null;
  }
}

export default function Workouts() {
  const { user } = useAuth();
  const [day, setDay] = useState(() => {
    const saved = Number(localStorage.getItem(DAY_STORAGE_KEY));
    return saved >= 1 && saved <= 7 ? saved : 1;
  });
  const { celebrate } = useAccomplishments();
  const [exercises, setExercises] = useState([]);
  const [todaysSets, setTodaysSets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cycle, setCycle] = useState(null);
  const [cycleError, setCycleError] = useState("");
  const [lastFullBody, setLastFullBody] = useState(null);
  const [fullBodyPick, setFullBodyPick] = useState(readFullBodyPick);

  useEffect(() => {
    fetchExercises()
      .then(setExercises)
      .catch(() => setError("Couldn't load exercises"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchActiveCycle(user.id)
      .then(setCycle)
      .catch(() => setCycle(localActiveCycle()));
  }, [user.id]);

  const refreshLastFullBody = useCallback(() => {
    fetchLastFullBodyDay(user.id)
      .then(setLastFullBody)
      .catch(() => {});
  }, [user.id]);

  useEffect(() => {
    refreshLastFullBody();
  }, [refreshLastFullBody]);

  const refreshSession = useCallback(() => {
    fetchSetsForDate(user.id, todayStr())
      .then(setTodaysSets)
      .catch(() => {});
  }, [user.id]);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  // Logging a set is where "First Blood" and the volume/timing badges become
  // true, so the check runs here rather than waiting for the next Dashboard
  // visit.
  const handleSetsChanged = useCallback(() => {
    refreshSession();
    syncAccomplishments(user.id)
      .then((r) => celebrate(r.newlyEarned))
      .catch(() => {});
  }, [refreshSession, user.id, celebrate]);

  useEffect(() => {
    localStorage.setItem(DAY_STORAGE_KEY, String(day));
  }, [day]);

  async function handleCycleChange(next) {
    const prev = cycle;
    setCycle(next);
    setCycleError("");
    try {
      await saveActiveCycle(user.id, next);
    } catch {
      setCycle(prev);
      setCycleError("Couldn't switch cycle — try again");
    }
  }

  // Rotation: the day after the last full-body day with sets — unless that
  // day was today, in which case today's session is still the one to show.
  const today = todayStr();
  const fullBodyInProgress = lastFullBody?.date === today;
  const suggestedKey = fullBodyInProgress ? lastFullBody.key : nextFullBodyKey(lastFullBody?.key);
  const fullBodyKey = fullBodyPick ?? suggestedKey;

  function handleFullBodyPick(key) {
    const pick = key === suggestedKey ? null : key;
    setFullBodyPick(pick);
    try {
      if (pick) localStorage.setItem(FB_PICK_STORAGE_KEY, JSON.stringify({ key: pick, date: today }));
      else localStorage.removeItem(FB_PICK_STORAGE_KEY);
    } catch {
      // Storage blocked — the pick just won't survive a reload.
    }
  }

  const handleFullBodySetLogged = useCallback(() => {
    rememberFullBodyDay(fullBodyKey, todayStr());
    setLastFullBody({ key: fullBodyKey, date: todayStr() });
    // Training the picked day makes it today's rotation day, so the override
    // has done its job.
    setFullBodyPick(null);
    try {
      localStorage.removeItem(FB_PICK_STORAGE_KEY);
    } catch {
      // Nothing to clean up if storage is blocked.
    }
  }, [fullBodyKey]);

  const handleFullBodySetsChanged = useCallback(() => {
    handleSetsChanged();
    // An edit or delete can remove the last set of today's day.
    refreshLastFullBody();
  }, [handleSetsChanged, refreshLastFullBody]);

  const isFullBody = cycle === "full_body";
  const dayInfo = PPL_DAYS.find((d) => d.day === day);
  const isRest = dayInfo.category === "rest";
  const slot = CATEGORY_TO_SLOT[dayInfo.category];
  const dayExercises = exercises
    .filter((e) => e.day_slot === slot)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const fbInfo = fullBodyDay(fullBodyKey);
  const fbResolved = resolveFullBodyDay(fullBodyKey, exercises);

  const subtitle = cycle === null ? "" : isFullBody ? `Full Body · Day ${fbInfo.key}` : `Day ${day} · ${dayInfo.label}`;

  function renderFullBodyCard(ex, supersetNext) {
    return (
      <ExerciseCard
        key={`${fullBodyKey}-${ex.id}`}
        exercise={ex}
        userId={user.id}
        programDay={fullBodyProgramDay(fullBodyKey)}
        supersetNext={supersetNext}
        onSetLogged={handleFullBodySetLogged}
        onSetsChanged={handleFullBodySetsChanged}
      />
    );
  }

  return (
    <>
      <ScreenHeader
        title="Workouts"
        subtitle={subtitle}
        right={cycle !== null && <CycleSwitcher cycle={cycle} onChange={handleCycleChange} />}
      />
      {cycleError && <p className="-mt-3 mb-4 text-[12px] text-[#ff6b6b]">{cycleError}</p>}

      {cycle !== null &&
        (isFullBody ? (
          <FullBodyDayPicker
            suggestedKey={suggestedKey}
            inProgress={fullBodyInProgress}
            selectedKey={fullBodyKey}
            onChange={handleFullBodyPick}
          />
        ) : (
          <DaySelector day={day} onChange={setDay} />
        ))}
      <WorkoutSessionCard sets={todaysSets} />
      <LiftProgressChart userId={user.id} />

      {loading || cycle === null ? (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : error ? (
        <p className="mb-4 text-[13px] text-[#ff6b6b]">{error}</p>
      ) : isFullBody ? (
        <>
          {fbResolved.blocks.map((block) =>
            block.kind === "superset" ? (
              <SupersetGroup key={`${fullBodyKey}-${block.id}`} rounds={block.exercises[0].default_sets}>
                {block.exercises.map((ex, i) => renderFullBodyCard(ex, block.exercises[i + 1]?.name))}
              </SupersetGroup>
            ) : (
              renderFullBodyCard(block.exercise)
            ),
          )}
          {fbResolved.missing.length > 0 && (
            <p className="mb-4 text-[12px] text-muted">
              Not in your exercise library yet: {fbResolved.missing.join(", ")}
            </p>
          )}
        </>
      ) : isRest ? (
        <div className="mb-6">
          <EmptyState
            icon={<HabitsIcon width={22} height={22} />}
            title="Rest day"
            message="Recovery is part of the program. Log a light swim or walk below if you'd like."
          />
        </div>
      ) : (
        dayExercises.map((ex) => (
          <ExerciseCard
            key={ex.id}
            exercise={ex}
            userId={user.id}
            programDay={pplProgramDay(day)}
            onSetsChanged={handleSetsChanged}
          />
        ))
      )}

      <CardioLogger userId={user.id} />
    </>
  );
}
