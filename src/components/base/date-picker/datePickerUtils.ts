export type WeekStartsOn = 0 | 1;

export function normalizeToNoon(date: Date): Date {
  const next = new Date(date.getTime());
  next.setHours(12, 0, 0, 0);
  return next;
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseIsoDateString(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!year || month < 1 || month > 12 || day < 1 || day > 31) return null;
  return normalizeToNoon(new Date(year, month - 1, day));
}

export function parseDateValue(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  if (value instanceof Date) return normalizeToNoon(value);
  return parseIsoDateString(value);
}

export function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function getMonthStart(date: Date): Date {
  return normalizeToNoon(new Date(date.getFullYear(), date.getMonth(), 1));
}

export function addCalendarMonths(date: Date, months: number): Date {
  return normalizeToNoon(new Date(date.getFullYear(), date.getMonth() + months, 1));
}

export function getWeekStart(date: Date, weekStartsOn: WeekStartsOn): Date {
  const cursor = normalizeToNoon(date);
  const dayOfWeek = cursor.getDay(); // 0..6
  const diff = (dayOfWeek - weekStartsOn + 7) % 7;
  cursor.setDate(cursor.getDate() - diff);
  return normalizeToNoon(cursor);
}

export function buildCalendarGrid(monthCursor: Date, weekStartsOn: WeekStartsOn): Date[] {
  const monthStart = getMonthStart(monthCursor);
  const gridStart = getWeekStart(monthStart, weekStartsOn);

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(gridStart.getTime());
    d.setDate(gridStart.getDate() + i);
    days.push(normalizeToNoon(d));
  }
  return days;
}

// Overloads: keep backward compatibility + allow (region, weekStartsOn)
export function getWeekdayShortLabels(weekStartsOn: WeekStartsOn): string[];
export function getWeekdayShortLabels(
  region: string | string[] | undefined,
  weekStartsOn: WeekStartsOn,
): string[];
export function getWeekdayShortLabels(
  a: WeekStartsOn | string | string[] | undefined,
  b?: WeekStartsOn,
): string[] {
  const weekStartsOn: WeekStartsOn =
    typeof a === 'number' ? a : (b ?? 0);

  const region: string | string[] | undefined =
    typeof a === 'number' ? undefined : a;

  // Stable generation: pick a known Sunday in UTC and format in UTC.
  const baseSundayUtcNoon = new Date(Date.UTC(2023, 0, 1, 12, 0, 0)); // 2023-01-01 is Sunday
  const formatter = new Intl.DateTimeFormat(region, { weekday: 'short', timeZone: 'UTC' });

  const sundayFirst: string[] = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(baseSundayUtcNoon.getTime() + i * 24 * 60 * 60 * 1000);
    return formatter.format(date);
  });

  if (weekStartsOn === 0) return sundayFirst;
  return sundayFirst.slice(1).concat(sundayFirst.slice(0, 1));
}

export function isDateInRange(date: Date, minDate: Date | null, maxDate: Date | null): boolean {
  if (minDate && date < minDate) return false;
  if (maxDate && date > maxDate) return false;
  return true;
}
