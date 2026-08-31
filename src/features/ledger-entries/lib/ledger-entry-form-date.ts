// Native <input type="date"> exchanges "YYYY-MM-DD" strings; parsing those
// with `new Date(string)` reads as UTC and can shift a day in negative-offset
// timezones, so dates are built/formatted from local components instead.
export function formatFormDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseFormDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayFormDate(): string {
  return formatFormDate(new Date());
}
