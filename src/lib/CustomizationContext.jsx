import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { fetchCustomization, saveCustomization } from "./avatarCustomization";
import { readCache, writeCache } from "./cache";

export const CustomizationContext = createContext(undefined);

// Loads the signed-in user's avatar customization once and exposes it to the
// whole authed app.
//
// needsSetup drives the first-login "Create your avatar" gate. Getting this
// wrong is expensive: the gate replaces the ENTIRE app, so any state where it
// can neither be satisfied nor dismissed locks the user out of workouts,
// habits, nutrition and photos over a cosmetic feature. Hence:
//
//   - tableMissing (migration not run)  -> no gate, and callers can explain why
//   - loadFailed (transient/RLS error)  -> no gate, and the editor warns
//     before overwriting a row it never managed to read
//   - skipSetup()                       -> always available as an escape
//
// The RLS case is the subtle one: Postgres FILTERS rows rather than erroring,
// so a table with RLS enabled but no policy returns zero rows with no error —
// indistinguishable from "new user". That's why the escape hatch exists rather
// than relying on error detection alone.
//
// A saved customization is cached locally, so on every launch after the first
// the gate opens immediately instead of holding the whole app behind a
// network round trip; the row is still re-read in the background. Only a
// cached *saved* row skips the wait — a user who still needs setup always
// gets the real answer before anything renders.
export function CustomizationProvider({ children }) {
  const { user } = useAuth();
  const [cachedRow] = useState(() => readCache("customization", user.id));
  const [loading, setLoading] = useState(!cachedRow);
  const [customization, setCustomization] = useState(cachedRow);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [tableMissing, setTableMissing] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { customization: row, tableMissing: missing } = await fetchCustomization(user.id);
        if (!mounted) return;
        if (row) writeCache("customization", user.id, row);
        setCustomization(row);
        setTableMissing(missing);
        setLoadFailed(false);
        setNeedsSetup(!row && !missing);
      } catch (e) {
        // Render with defaults rather than blocking the whole app on a
        // transient fetch failure — but remember that we never actually read
        // the row, so the editor can warn before overwriting it.
        console.error("Failed to load avatar customization", e);
        if (!mounted) return;
        // A cached row is still the best available answer offline.
        if (cachedRow) return;
        setCustomization(null);
        setTableMissing(false);
        setLoadFailed(true);
        setNeedsSetup(false);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user.id, cachedRow]);

  const save = useCallback(
    async (values) => {
      const row = await saveCustomization(user.id, values);
      writeCache("customization", user.id, row);
      setCustomization(row);
      setLoadFailed(false);
      setNeedsSetup(false);
      return row;
    },
    [user.id],
  );

  // Dismiss the first-login gate without saving. The avatar renders with
  // default appearance and the editor stays reachable from Settings.
  const skipSetup = useCallback(() => setNeedsSetup(false), []);

  const value = { loading, customization, needsSetup, tableMissing, loadFailed, save, skipSetup };
  return <CustomizationContext.Provider value={value}>{children}</CustomizationContext.Provider>;
}

export function useCustomization() {
  const ctx = useContext(CustomizationContext);
  if (ctx === undefined) {
    throw new Error("useCustomization must be used within a CustomizationProvider");
  }
  return ctx;
}
