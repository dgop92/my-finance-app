import { describe, expect, it } from "vitest";
import { formatFormDate, parseFormDate } from "./ledger-entry-form-date";

describe("formatFormDate", () => {
  it("pads single-digit month and day", () => {
    expect(formatFormDate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });
});

describe("parseFormDate", () => {
  it("round-trips through formatFormDate without shifting the day", () => {
    const value = "2026-01-05";
    expect(formatFormDate(parseFormDate(value))).toBe(value);
  });

  it("parses as local midnight, not UTC", () => {
    const parsed = parseFormDate("2026-01-05");
    expect(parsed.getFullYear()).toBe(2026);
    expect(parsed.getMonth()).toBe(0);
    expect(parsed.getDate()).toBe(5);
  });
});
