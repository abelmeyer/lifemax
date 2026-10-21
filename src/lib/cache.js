// Last-known-good snapshots in localStorage, so a cold start can paint real
// numbers immediately and refresh them in the background instead of showing
// a spinner for every round trip. Never a source of truth: anything read from
// here is replaced as soon as the network answers.
//
// Keys are per user and versioned — bump VERSION when a cached shape changes,
// and old entries are simply ignored.
const VERSION = 1;

function key(name, userId) {
  return `lifemaxx_cache_v${VERSION}_${name}_${userId}`;
}

export function readCache(name, userId) {
  try {
    const raw = localStorage.getItem(key(name, userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeCache(name, userId, value) {
  try {
    localStorage.setItem(key(name, userId), JSON.stringify(value));
  } catch {
    // Full or blocked storage just means no instant paint next time.
  }
}
