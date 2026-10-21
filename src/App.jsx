import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { CustomizationProvider, useCustomization } from "./lib/CustomizationContext";
import { RestTimerProvider } from "./lib/RestTimerContext";
import { AccomplishmentsProvider } from "./lib/AccomplishmentsContext";
import AppShell from "./components/AppShell";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import { lazyWithPreload, preloadWhenIdle } from "./lib/lazyWithPreload";

// Dashboard is where the app opens, so it ships in the main bundle; every
// other screen is its own chunk. They're all prefetched once the app is idle
// (preloadWhenIdle below), so switching tabs is still instant — the split
// just keeps them off the critical path of the first paint.
const Workouts = lazyWithPreload(() => import("./screens/Workouts"));
const Habits = lazyWithPreload(() => import("./screens/Habits"));
const Nutrition = lazyWithPreload(() => import("./screens/Nutrition"));
const Photos = lazyWithPreload(() => import("./screens/Photos"));
const Store = lazyWithPreload(() => import("./screens/Store"));
const AvatarSetup = lazyWithPreload(() => import("./screens/AvatarSetup"));
const Settings = lazyWithPreload(() => import("./screens/Settings"));
const Accomplishments = lazyWithPreload(() => import("./screens/Accomplishments"));
const Gratitude = lazyWithPreload(() => import("./screens/Gratitude"));

preloadWhenIdle([Workouts, Habits, Nutrition, Photos, Store, Gratitude, Accomplishments, Settings, AvatarSetup]);

// DEV-only visual harness. Loaded through a dynamic import that only exists
// in dev builds: a static import kept DevPreview in the production module
// graph, and with it every screen it renders (Workouts, Settings, ...),
// pulling them back into the main bundle even though no route used them.
const DEV_PREVIEW_ROUTES = import.meta.env.DEV
  ? [
      ["/preview", "default"],
      ["/preview/setup", "DevSetupPreview"],
      ["/preview/settings", "DevSettingsPreview"],
      ["/preview/badges", "DevBadgesPreview"],
      ["/preview/workout", "DevWorkoutPreview"],
      ["/preview/day", "DevDayDetailPreview"],
      ["/preview/journal", "DevJournalPreview"],
      ["/preview/dashboard", "DevDashboardPreview"],
      ["/preview/workouts", "DevWorkoutsScreenPreview"],
    ].map(([path, name]) => [path, lazy(() => import("./screens/DevPreview").then((m) => ({ default: m[name] })))])
  : [];

function FullScreenSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
}

function RequireAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}

// First-login gate: until an avatar_customization row exists, the whole app
// is the "Create your avatar" screen. Once saved (or if the table hasn't
// been migrated yet), the normal shell renders.
function SetupGate({ children }) {
  const { loading, needsSetup } = useCustomization();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }

  if (needsSetup) {
    return (
      <Suspense fallback={<FullScreenSpinner />}>
        <AvatarSetup mode="setup" />
      </Suspense>
    );
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      {DEV_PREVIEW_ROUTES.map(([path, Preview]) => (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<FullScreenSpinner />}>
              <Preview />
            </Suspense>
          }
        />
      ))}
      <Route
        path="/"
        element={
          <RequireAuth>
            <CustomizationProvider>
              <SetupGate>
                <RestTimerProvider>
                  <AccomplishmentsProvider>
                    <AppShell />
                  </AccomplishmentsProvider>
                </RestTimerProvider>
              </SetupGate>
            </CustomizationProvider>
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="habits" element={<Habits />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="photos" element={<Photos />} />
        <Route path="store" element={<Store />} />
        <Route path="avatar" element={<AvatarSetup mode="edit" />} />
        <Route path="settings" element={<Settings />} />
        <Route path="accomplishments" element={<Accomplishments />} />
        <Route path="gratitude" element={<Gratitude />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
