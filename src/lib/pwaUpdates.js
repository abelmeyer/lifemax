import { registerSW } from "virtual:pwa-register";

// How long after the app opens (or comes back to the foreground) a reload is
// still harmless — nothing has been typed yet.
const FRESH_WINDOW_MS = 8000;
const HOURLY = 60 * 60 * 1000;

// A home-screen PWA on iOS is rarely cold-started: it resumes a page that may
// be days old, so a new deploy never showed up without force-quitting the
// app. This checks for a new build whenever the app comes to the foreground
// (and hourly while it stays open), and swaps it in at a moment that can't
// cost unsaved input: right away if the app was only just opened, otherwise
// the next time it goes to the background.
export function setupPwaUpdates() {
  if (!("serviceWorker" in navigator)) return;

  let visibleSince = Date.now();
  let reloadPending = false;

  function applyUpdate() {
    if (Date.now() - visibleSince < FRESH_WINDOW_MS) window.location.reload();
    else reloadPending = true;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
      if (reloadPending) window.location.reload();
    } else {
      visibleSince = Date.now();
    }
  });

  registerSW({
    immediate: true,
    // autoUpdate activates the new service worker straight away; this hook
    // replaces the plugin's default of reloading the page that very instant.
    onNeedReload: applyUpdate,
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => registration.update().catch(() => {});
      setInterval(check, HOURLY);
      document.addEventListener("visibilitychange", () => {
        if (document.visibilityState === "visible") check();
      });
    },
  });
}
