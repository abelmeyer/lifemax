import { Suspense } from "react";
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
        {/* Screens are code-split; this only shows if a tab is opened before
            its chunk finished prefetching. */}
        <Suspense
          fallback={
            <div className="flex justify-center py-16">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
      <RestTimerBar />
      <TabBar />
    </div>
  );
}
