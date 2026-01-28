import type { CalendarDay, CalendarEvent } from "@/types.p";
import { addDays, makeDate } from "@/utils";

type MockOptions = {
  minEventsPerDay?: number; // default 0
  maxEventsPerDay?: number; // default 4
  includeEnd?: boolean; // default true
  asISO?: boolean; // default false (return Date objects)
  colorByType?: boolean; // default true
};

const debitTitles = [
  "Groceries",
  "Gas",
  "Coffee",
  "Rent",
  "Utilities",
  "Internet",
  "Restaurant",
  "Pharmacy",
  "Subscription",
  "Shopping",
];
const creditTitles = ["Salary", "Refund", "Cashback", "Transfer In", "Bonus", "Reimbursement"];

const debitColors = ["#ef4444", "#f97316", "#eab308", "#ec4899"];
const creditColors = ["#22c55e", "#14b8a6", "#3b82f6", "#a855f7"];

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]) {
  return arr[randInt(0, arr.length - 1)];
}
function uid(prefix = "id_") {
  // browser-safe unique-ish id
  return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

export function toKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function atNoon(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0, 0);
}

export function eachDay(from: Date, to: Date): Date[] {
  const start = atNoon(from);
  const end = atNoon(to);
  const out: Date[] = [];
  for (let cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 1)) {
    out.push(new Date(cur));
  }
  return out;
}

export function groupEventsByDay(events: CalendarEvent[]): Map<string, CalendarEvent[]> {
  const map = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const key = typeof e.start === "string" ? e.start.slice(0, 10) : toKey(e.start);
    const bucket = map.get(key) ?? [];
    bucket.push(e);
    map.set(key, bucket);
  }
  return map;
}

export function generateMockEvents(
  from: Date,
  to: Date,
  opts: MockOptions = {},
): CalendarEvent[] {
  const {
    minEventsPerDay = 0,
    maxEventsPerDay = 4,
    includeEnd = true,
    asISO = false,
    colorByType = true,
  } = opts;

  const days = eachDay(from, to);
  const events: CalendarEvent[] = [];

  for (const day of days) {
    const n = randInt(minEventsPerDay, maxEventsPerDay);
    for (let i = 0; i < n; i++) {
      const type: CalendarEvent["type"] = Math.random() < 0.7 ? "debit" : "credit";

      // random time during the day
      const start = new Date(
        day.getFullYear(),
        day.getMonth(),
        day.getDate(),
        randInt(7, 20),
        pick([0, 15, 30, 45]),
        0,
        0,
      );

      const durationMins = pick([15, 30, 45, 60, 90, 120]) ?? 15;
      const end = new Date(start.getTime() + durationMins * 60_000);

      const amount =
        type === "debit"
          ? Number((randInt(5, 250) + Math.random()).toFixed(2))
          : Number((randInt(50, 3500) + Math.random()).toFixed(2));

      const title = (type === "debit" ? pick(debitTitles) : pick(creditTitles)) ?? '';
      const color = !colorByType ? undefined : type === "debit" ? pick(debitColors) : pick(creditColors);

      const payloadStart = asISO ? start.toISOString() : start;
      const payloadEnd = asISO ? end.toISOString() : end;

      events.push({
        id: uid("evt_"),
        title,
        start: payloadStart,
        ...(includeEnd ? { end: payloadEnd } : {}),
        amount,
        type,
        ...(color ? { color } : {}),
      });
    }
  }

  return events;
}

export function buildCalendarDays(from: Date, to: Date, events: CalendarEvent[]): CalendarDay[] {
  const days = eachDay(from, to);
  const byDay = groupEventsByDay(events);

  return days.map((date) => {
    const key = toKey(date);
    const dayEvents = byDay.get(key) ?? [];

    const expense = dayEvents
      .filter((e) => e.type === "debit")
      .reduce((acc, e) => acc + (e.amount ?? 0), 0);

    const income = dayEvents
      .filter((e) => e.type === "credit")
      .reduce((acc, e) => acc + (e.amount ?? 0), 0);

    return {
      date,
      events: dayEvents,
      expense: Number(expense.toFixed(2)),
      income: Number(income.toFixed(2)),
      id: `day_${key}`,
    };
  });
}

/** Convenience: generate days + events in one call */
export function generateMockCalendarDays(month: number, opts: MockOptions = {}): CalendarDay[] {
  const d = atNoon(new Date());
  const from = makeDate(d.getFullYear(), month, 1);
  const to = addDays(makeDate(d.getFullYear(), month + 1, 1),-1);
  const events = generateMockEvents(from, to, opts);
  return buildCalendarDays(from, to, events);
}


export function generateMockCalendarEvents(month: number, opts: MockOptions = {}): CalendarEvent[] {
  const d = atNoon(new Date());
  const from = makeDate(d.getFullYear(), month, 1);
  const to = addDays(makeDate(d.getFullYear(), month + 1, 1), -1);
  return generateMockEvents(from, to, opts);
}
/* Example usage:

// Month of Jan 2026
const from = new Date(2026, 0, 1);
const to = new Date(2026, 0, 31);

const calendarDays = generateMockCalendarDays(from, to, {
  minEventsPerDay: 0,
  maxEventsPerDay: 5,
  asISO: false,       // keep start/end as Date
  includeEnd: true,
  colorByType: true,
});

*/
