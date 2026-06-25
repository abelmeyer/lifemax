import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import { HabitsIcon } from "../components/icons";

export default function Habits() {
  return (
    <>
      <ScreenHeader
        title="Habits"
        subtitle="Build streaks that stick."
      />
      <EmptyState
        icon={<HabitsIcon width={22} height={22} />}
        title="No habits tracked yet"
        message="Pushups, situps, pullups — log your daily reps and watch your streak grow."
      />
    </>
  );
}
