import { Outlet } from "react-router-dom";
import TabBar from "./TabBar";
import RestTimerBar from "./workouts/RestTimerBar";

export default function AppShell() {
  return (
    <div className="min-h-screen bg-bg">
      <main
        className="mx-auto max-w-md px-4 pb-28"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 20px)" }}
      >
        <Outlet />
      </main>
      <RestTimerBar />
      <TabBar />
    </div>
  );
}
