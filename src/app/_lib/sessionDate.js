function zoneOffsetMinutes(date, timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(date);
  const map = {};
  parts.forEach((part) => {
    if (part.type !== "literal") map[part.type] = part.value;
  });
  const asUtc = Date.UTC(+map.year, +map.month - 1, +map.day, +map.hour % 24, +map.minute, +map.second);
  return (asUtc - date.getTime()) / 60000;
}

function zonedDate(year, month, day, hour, minute, timeZone) {
  let utc = Date.UTC(year, month - 1, day, hour, minute, 0);
  for (let i = 0; i < 2; i += 1) {
    const offset = zoneOffsetMinutes(new Date(utc), timeZone);
    utc = Date.UTC(year, month - 1, day, hour, minute, 0) - offset * 60000;
  }
  return new Date(utc);
}

export function icsStamp(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
}

// A session `days` ahead of today in `timeZone`, at a fixed local time.
export function sessionDaysOut({
  days = 3,
  hour = 8,
  minute = 30,
  durationMinutes = 40,
  timeZone = "America/Denver",
} = {}) {
  const nowParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const map = {};
  nowParts.forEach((part) => {
    if (part.type !== "literal") map[part.type] = part.value;
  });
  const start = zonedDate(+map.year, +map.month, +map.day + days, hour, minute, timeZone);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const whenLabel = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(start);
  return { start, end, whenLabel, starts: icsStamp(start), ends: icsStamp(end) };
}
