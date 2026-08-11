import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export const RestTimerContext = createContext(undefined);

// A single app-wide rest countdown. It lives above the screens so it keeps
// running while you collapse an exercise card, scroll, or switch tabs.
//
// The countdown is derived from a wall-clock deadline rather than decremented
// on a tick, so a backgrounded phone (where timers are throttled or frozen)
// still shows the correct remaining time when you come back.
export function RestTimerProvider({ children }) {
  const [timer, setTimer] = useState(null); // { label, totalSeconds, endsAt, pausedRemaining }
  const [now, setNow] = useState(() => Date.now());
  const beepedForRef = useRef(null);
  const audioCtxRef = useRef(null);

  const isPaused = timer?.pausedRemaining != null;

  const remaining = useMemo(() => {
    if (!timer) return 0;
    if (timer.pausedRemaining != null) return timer.pausedRemaining;
    return Math.max(0, (timer.endsAt - now) / 1000);
  }, [timer, now]);

  const finished = Boolean(timer) && remaining <= 0;

  // The bar stays docked showing "Go" after the countdown ends, so `finished`
  // has to stop the tick — `timer` is still non-null and the interval would
  // otherwise re-render the whole app at 4 Hz until the bar is dismissed.
  useEffect(() => {
    if (!timer || isPaused || finished) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [timer, isPaused, finished]);

  // A short beep when rest is up. Web Audio rather than an asset so there's
  // nothing to bundle.
  useEffect(() => {
    if (!finished) return;
    const key = timer?.endsAt ?? null;
    if (beepedForRef.current === key) return;
    beepedForRef.current = key;

    const ctx = audioCtxRef.current;
    // No context means start() was never reached from a user gesture, so
    // there is nothing iOS would let us play anyway.
    if (!ctx) return;
    try {
      // Safari suspends the context when the tab is backgrounded; resuming is
      // permitted because it was created during a gesture.
      if (ctx.state === "suspended") ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
      osc.onended = () => {
        osc.disconnect();
        gain.disconnect();
      };
    } catch {
      // Audio is a nicety — a blocked context is not an error worth surfacing.
    }
  }, [finished, timer]);

  // One context for the app's lifetime, closed on unmount. Creating one per
  // beep leaked them (browsers cap concurrent contexts), and creating one
  // outside a user gesture is exactly what iOS refuses — start() is always
  // called from the tap that logged the set.
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close();
      audioCtxRef.current = null;
    };
  }, []);

  const start = useCallback((seconds, label) => {
    beepedForRef.current = null;
    if (!audioCtxRef.current) {
      try {
        const Ctx = window.AudioContext ?? window.webkitAudioContext;
        if (Ctx) audioCtxRef.current = new Ctx();
      } catch {
        audioCtxRef.current = null;
      }
    }
    setNow(Date.now());
    setTimer({
      label: label ?? "Rest",
      totalSeconds: seconds,
      endsAt: Date.now() + seconds * 1000,
      pausedRemaining: null,
    });
  }, []);

  const stop = useCallback(() => setTimer(null), []);

  const addSeconds = useCallback((delta) => {
    setTimer((t) => {
      if (!t) return t;
      if (t.pausedRemaining != null) {
        return { ...t, pausedRemaining: Math.max(0, t.pausedRemaining + delta), totalSeconds: t.totalSeconds + delta };
      }
      return { ...t, endsAt: t.endsAt + delta * 1000, totalSeconds: t.totalSeconds + delta };
    });
  }, []);

  const togglePause = useCallback(() => {
    setTimer((t) => {
      if (!t) return t;
      if (t.pausedRemaining != null) {
        return { ...t, endsAt: Date.now() + t.pausedRemaining * 1000, pausedRemaining: null };
      }
      return { ...t, pausedRemaining: Math.max(0, (t.endsAt - Date.now()) / 1000) };
    });
  }, []);

  const value = {
    active: Boolean(timer),
    label: timer?.label ?? null,
    remaining,
    totalSeconds: timer?.totalSeconds ?? 0,
    finished,
    isPaused,
    start,
    stop,
    addSeconds,
    togglePause,
  };

  return <RestTimerContext.Provider value={value}>{children}</RestTimerContext.Provider>;
}

export function useRestTimer() {
  const ctx = useContext(RestTimerContext);
  if (ctx === undefined) {
    throw new Error("useRestTimer must be used within a RestTimerProvider");
  }
  return ctx;
}
