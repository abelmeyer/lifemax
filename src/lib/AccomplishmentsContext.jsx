import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import AchievementToast from "../components/accomplishments/AchievementToast";

export const AccomplishmentsContext = createContext(undefined);

const VISIBLE_MS = 3600;

// Owns the celebration queue so any screen can hand it newly-earned
// achievements and get the badge overlay, one at a time, without each screen
// re-implementing the timing.
export function AccomplishmentsProvider({ children }) {
  const [queue, setQueue] = useState([]);
  const [current, setCurrent] = useState(null);
  const seenRef = useRef(new Set());

  const celebrate = useCallback((achievements) => {
    if (!achievements || achievements.length === 0) return;
    // Guard against the same unlock being announced twice when two screens
    // sync in the same session.
    const fresh = achievements.filter((a) => !seenRef.current.has(a.id));
    if (fresh.length === 0) return;
    for (const a of fresh) seenRef.current.add(a.id);
    setQueue((q) => [...q, ...fresh]);
  }, []);

  useEffect(() => {
    if (current || queue.length === 0) return;
    setCurrent(queue[0]);
    setQueue((q) => q.slice(1));
  }, [current, queue]);

  useEffect(() => {
    if (!current) return;
    const id = setTimeout(() => setCurrent(null), VISIBLE_MS);
    return () => clearTimeout(id);
  }, [current]);

  return (
    <AccomplishmentsContext.Provider value={{ celebrate }}>
      {children}
      <AchievementToast achievement={current} onDismiss={() => setCurrent(null)} />
    </AccomplishmentsContext.Provider>
  );
}

export function useAccomplishments() {
  const ctx = useContext(AccomplishmentsContext);
  if (ctx === undefined) {
    throw new Error("useAccomplishments must be used within an AccomplishmentsProvider");
  }
  return ctx;
}
