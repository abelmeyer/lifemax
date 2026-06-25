import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import { WorkoutsIcon } from "../components/icons";

export default function Workouts() {
  return (
    <>
      <ScreenHeader
        title="Workouts"
        subtitle="Track your lifts, sets, and cardio."
      />
      <EmptyState
        icon={<WorkoutsIcon width={22} height={22} />}
        title="No workouts logged"
        message="Your exercises, sets, and reps will show up here once you start training."
      />
    </>
  );
}
