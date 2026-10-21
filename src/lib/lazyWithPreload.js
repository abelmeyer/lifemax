import { lazy } from "react";

const RELOAD_FLAG = "lifemaxx_chunk_reload";

// A page opened before a deploy still references the old build's chunk
// names, which no longer exist after it — the import 404s and the screen
// would go blank. Reload once to pick up the new build; the flag stops a
// genuinely broken chunk from turning into a reload loop.
function importWithReload(factory) {
  return factory().then(
    (mod) => {
      try {
        sessionStorage.removeItem(RELOAD_FLAG);
      } catch {
        // Storage unavailable — nothing to clear.
      }
      return mod;
    },
    (err) => {
      let reloaded = false;
      try {
        reloaded = sessionStorage.getItem(RELOAD_FLAG) === "1";
        if (!reloaded) sessionStorage.setItem(RELOAD_FLAG, "1");
      } catch {
        reloaded = true;
      }
      if (!reloaded) {
        window.location.reload();
        return new Promise(() => {});
      }
      throw err;
    },
  );
}

// React.lazy plus a .preload() that starts fetching the chunk early. The
// promise is shared, so a preloaded screen renders without suspending.
export function lazyWithPreload(factory) {
  let promise = null;
  const load = () => {
    promise ??= importWithReload(factory).catch((err) => {
      promise = null;
      throw err;
    });
    return promise;
  };
  const Component = lazy(load);
  Component.preload = load;
  return Component;
}

// Fetches screen chunks once the browser is idle after first paint, so the
// split costs nothing when the user actually switches tabs.
export function preloadWhenIdle(components) {
  if (typeof window === "undefined") return;
  const run = () => {
    for (const c of components) c.preload().catch(() => {});
  };
  if ("requestIdleCallback" in window) window.requestIdleCallback(run, { timeout: 3000 });
  else setTimeout(run, 1500);
}
