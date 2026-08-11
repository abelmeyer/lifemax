import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import { CustomizationProvider, useCustomization } from "./lib/CustomizationContext";
import { RestTimerProvider } from "./lib/RestTimerContext";
import { AccomplishmentsProvider } from "./lib/AccomplishmentsContext";
import AppShell from "./components/AppShell";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Workouts from "./screens/Workouts";
import Habits from "./screens/Habits";
import Nutrition from "./screens/Nutrition";
import Photos from "./screens/Photos";
import Store from "./screens/Store";
import AvatarSetup from "./screens/AvatarSetup";
import Settings from "./screens/Settings";
import Accomplishments from "./screens/Accomplishments";
import Gratitude from "./screens/Gratitude";
import DevPreview, {
  DevSetupPreview,
  DevSettingsPreview,
  DevBadgesPreview,
  DevWorkoutPreview,
  DevDayDetailPreview,
  DevJournalPreview,
  DevDashboardPreview,
} from "./screens/DevPreview";

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

  if (needsSetup) return <AvatarSetup mode="setup" />;

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
      {import.meta.env.DEV && <Route path="/preview" element={<DevPreview />} />}
      {import.meta.env.DEV && <Route path="/preview/setup" element={<DevSetupPreview />} />}
      {import.meta.env.DEV && <Route path="/preview/settings" element={<DevSettingsPreview />} />}
      {import.meta.env.DEV && <Route path="/preview/badges" element={<DevBadgesPreview />} />}
      {import.meta.env.DEV && <Route path="/preview/workout" element={<DevWorkoutPreview />} />}
      {import.meta.env.DEV && <Route path="/preview/day" element={<DevDayDetailPreview />} />}
      {import.meta.env.DEV && <Route path="/preview/journal" element={<DevJournalPreview />} />}
      {import.meta.env.DEV && <Route path="/preview/dashboard" element={<DevDashboardPreview />} />}
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
