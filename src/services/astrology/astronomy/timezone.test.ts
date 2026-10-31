import { describe, expect, it } from "vitest";

import { localToUtc } from "./timezone";

describe("localToUtc", () => {
  it("converts a fixed-offset zone (Asia/Thimphu, UTC+6, no DST)", () => {
    const utc = localToUtc("1998-04-12", "12:00", "Asia/Thimphu");
    expect(utc.toISOString()).toBe("1998-04-12T06:00:00.000Z");
  });

  it("applies summer DST offset (America/New_York, UTC-4 in July)", () => {
    const utc = localToUtc("2024-07-04", "12:00", "America/New_York");
    expect(utc.toISOString()).toBe("2024-07-04T16:00:00.000Z");
  });

  it("applies winter standard offset (America/New_York, UTC-5 in January)", () => {
    const utc = localToUtc("2024-01-04", "12:00", "America/New_York");
    expect(utc.toISOString()).toBe("2024-01-04T17:00:00.000Z");
  });

  it("handles a positive half-hour offset zone (Asia/Kolkata, UTC+5:30)", () => {
    const utc = localToUtc("2000-01-01", "05:30", "Asia/Kolkata");
    expect(utc.toISOString()).toBe("2000-01-01T00:00:00.000Z");
  });

  it("honors optional seconds in HH:mm:ss input", () => {
    const utc = localToUtc("1998-04-12", "12:00:45", "Asia/Thimphu");
    expect(utc.toISOString()).toBe("1998-04-12T06:00:45.000Z");
  });

  it("is exact just after a spring-forward transition (America/New_York, 2024-03-10)", () => {
    // 03:30 EDT = 07:30Z. A single-pass offset lands an hour late (08:30Z).
    const utc = localToUtc("2024-03-10", "03:30", "America/New_York");
    expect(utc.toISOString()).toBe("2024-03-10T07:30:00.000Z");
  });
});
