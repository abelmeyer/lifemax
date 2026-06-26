import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import AppShell from "./components/AppShell";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
import Workouts from "./screens/Workouts";
import Habits from "./screens/Habits";
import Nutrition from "./screens/Nutrition";
import Photos from "./screens/Photos";
import Store from "./screens/Store";

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

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/login"
        element={user ? <Navigate to="/" replace /> : <Login />}
      />
      <Route
        path="/"
        element={
          <RequireAuth>
            <AppShell />
          </RequireAuth>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="workouts" element={<Workouts />} />
        <Route path="habits" element={<Habits />} />
        <Route path="nutrition" element={<Nutrition />} />
        <Route path="photos" element={<Photos />} />
        <Route path="store" element={<Store />} />
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
