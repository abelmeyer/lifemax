import ScreenHeader from "../components/ScreenHeader";
import EmptyState from "../components/EmptyState";
import { DashboardIcon } from "../components/icons";

export default function Dashboard() {
  return (
    <>
      <ScreenHeader
        title="Dashboard"
        subtitle="Your daily overview at a glance."
      />
      <EmptyState
        icon={<DashboardIcon width={22} height={22} />}
        title="Nothing logged yet"
        message="Once you start logging workouts and habits, your daily summary will show up here."
      />
    </>
  );
}
