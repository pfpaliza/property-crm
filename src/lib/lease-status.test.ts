import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { deriveLeaseStatus } from "./lease-status";

describe("deriveLeaseStatus", () => {
  // Pin "today" so the date-relative logic is deterministic.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-05T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("is upcoming when the start date is in the future", () => {
    expect(
      deriveLeaseStatus({ startDate: "2026-08-01", endDate: null }),
    ).toBe("upcoming");
  });

  it("is active for an open-ended lease that has already started", () => {
    expect(
      deriveLeaseStatus({ startDate: "2026-01-01", endDate: null }),
    ).toBe("active");
  });

  it("is active when today falls within the lease window", () => {
    expect(
      deriveLeaseStatus({ startDate: "2026-01-01", endDate: "2026-12-31" }),
    ).toBe("active");
  });

  it("is active on the start date itself (start is inclusive)", () => {
    expect(
      deriveLeaseStatus({ startDate: "2026-07-05", endDate: "2026-12-31" }),
    ).toBe("active");
  });

  it("is ended on the end date itself (end is exclusive)", () => {
    // The comment in lease-status.ts specifies this so that ending a lease —
    // which sets end date to today — takes effect immediately.
    expect(
      deriveLeaseStatus({ startDate: "2026-01-01", endDate: "2026-07-05" }),
    ).toBe("ended");
  });

  it("is ended after the end date has passed", () => {
    expect(
      deriveLeaseStatus({ startDate: "2026-01-01", endDate: "2026-06-01" }),
    ).toBe("ended");
  });
});
