export function atNoon(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}
export function makeDate(y: number, m: number, day: number) {
  return new Date(y, m, day, 12, 0, 0, 0);
}
export function addDays(d: Date, days: number) {
  const x = atNoon(d);
  x.setDate(x.getDate() + days);
  return x;
}
export function startOfMonth(d: Date) {
  return makeDate(d.getFullYear(), d.getMonth(), 1);
}
export function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
export function toKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
export function parseDate(input: Date | string) {
  if (input instanceof Date) return atNoon(input);
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(input);
  if (m) return makeDate(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
  return atNoon(new Date(input));
}
export function startOfWeek(d: Date, weekStartsOn: 0 | 1) {
  const x = atNoon(d);
  const dow = x.getDay();
  const diff = (dow - weekStartsOn + 7) % 7;
  return addDays(x, -diff);
}
export function buildMonthGrid(cursor: Date, weekStartsOn: 0 | 1) {
  const first = startOfMonth(cursor);
  const gridStart = startOfWeek(first, weekStartsOn);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

export function formatCurrency(amount: number, currency: string = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}
