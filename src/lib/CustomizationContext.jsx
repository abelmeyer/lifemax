import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchCustomization, saveCustomization } from "./avatarCustomization";

export const CustomizationContext = createContext(undefined);

// Loads the signed-in user's avatar customization once and exposes it to the
// whole authed app. needsSetup drives the first-login "Create your avatar"
// gate: true only when the table exists but this user has no row yet.
export function CustomizationProvider({ children }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customization, setCustomization] = useState(null);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    (async () => {
      try {
        const { customization: row, tableMissing } = await fetchCustomization(user.id);
        if (!mounted) return;
        setCustomization(row);
        setNeedsSetup(!row && !tableMissing);
      } catch (e) {
        // Render with defaults rather than blocking the whole app on a
        // transient fetch failure; setup stays reachable from the Dashboard.
        console.error("Failed to load avatar customization", e);
        if (!mounted) return;
        setCustomization(null);
        setNeedsSetup(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user.id]);

  const save = useCallback(
    async (values) => {
      const row = await saveCustomization(user.id, values);
      setCustomization(row);
      setNeedsSetup(false);
      return row;
    },
    [user.id],
  );

  const value = { loading, customization, needsSetup, save };
  return <CustomizationContext.Provider value={value}>{children}</CustomizationContext.Provider>;
}

export function useCustomization() {
  const ctx = useContext(CustomizationContext);
  if (ctx === undefined) {
    throw new Error("useCustomization must be used within a CustomizationProvider");
  }
  return ctx;
}
