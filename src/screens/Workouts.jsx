import { useEffect, useState } from "react";
import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import DaySelector from "../components/workouts/DaySelector";
import ExerciseCard from "../components/workouts/ExerciseCard";
import CardioLogger from "../components/workouts/CardioLogger";
import LiftProgressChart from "../components/workouts/LiftProgressChart";
import { HabitsIcon } from "../components/icons";
import { useAuth } from "../lib/AuthContext";
import { fetchExercises } from "../lib/workouts";
import { PPL_DAYS, CATEGORY_TO_SLOT } from "../lib/ppl";

const DAY_STORAGE_KEY = "lifemaxx_workout_day";

export default function Workouts() {
  const { user } = useAuth();
  const [day, setDay] = useState(() => {
    const saved = Number(localStorage.getItem(DAY_STORAGE_KEY));
    return saved >= 1 && saved <= 7 ? saved : 1;
  });
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExercises()
      .then(setExercises)
      .catch(() => setError("Couldn't load exercises"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    localStorage.setItem(DAY_STORAGE_KEY, String(day));
  }, [day]);

  const dayInfo = PPL_DAYS.find((d) => d.day === day);
  const isRest = dayInfo.category === "rest";
  const slot = CATEGORY_TO_SLOT[dayInfo.category];
  const dayExercises = exercises
    .filter((e) => e.day_slot === slot)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <>
      <ScreenHeader title="Workouts" subtitle={`Day ${day} · ${dayInfo.label}`} />
      <DaySelector day={day} onChange={setDay} />
      <LiftProgressChart userId={user.id} />

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
        </div>
      ) : error ? (
        <p className="mb-4 text-[13px] text-[#ff6b6b]">{error}</p>
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
          <ExerciseCard key={ex.id} exercise={ex} userId={user.id} />
        ))
      )}

      <CardioLogger userId={user.id} />
    </>
  );
}
