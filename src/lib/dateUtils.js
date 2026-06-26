export function todayStr() {
  return dateToStr(new Date());
}

export function dateToStr(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export function strToDate(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDaysStr(s, days) {
  const d = strToDate(s);
  d.setDate(d.getDate() + days);
  return dateToStr(d);
}

// Monday-start week containing the given date string.
export function weekStartStr(s) {
  const d = strToDate(s);
  const dow = d.getDay(); // 0 = Sunday
  const diffToMonday = dow === 0 ? -6 : 1 - dow;
  d.setDate(d.getDate() + diffToMonday);
  return dateToStr(d);
}

export function isBefore(a, b) {
  return a < b;
}
