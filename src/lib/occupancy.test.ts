import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  currentOccupiedCount,
  monthlyOccupancy,
  type OccupancyLease,
} from "./occupancy";

describe("occupancy", () => {
  // Pin "now" to mid-July 2026 so the month math is deterministic.
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-15T12:00:00Z"));
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  describe("currentOccupiedCount", () => {
    it("counts a property with an open-ended lease covering this month", () => {
      const leases: OccupancyLease[] = [
        { propertyId: "p1", startDate: "2026-01-01", endDate: null },
      ];
      expect(currentOccupiedCount(leases)).toBe(1);
    });

    it("ignores a lease that ended before this month", () => {
      const leases: OccupancyLease[] = [
        { propertyId: "p1", startDate: "2026-01-01", endDate: "2026-05-31" },
      ];
      expect(currentOccupiedCount(leases)).toBe(0);
    });

    it("ignores a lease that starts after this month", () => {
      const leases: OccupancyLease[] = [
        { propertyId: "p1", startDate: "2026-09-01", endDate: null },
      ];
      expect(currentOccupiedCount(leases)).toBe(0);
    });

    it("counts a property only once across overlapping leases", () => {
      const leases: OccupancyLease[] = [
        { propertyId: "p1", startDate: "2026-01-01", endDate: null },
        { propertyId: "p1", startDate: "2026-02-01", endDate: null },
        { propertyId: "p2", startDate: "2026-01-01", endDate: null },
      ];
      expect(currentOccupiedCount(leases)).toBe(2);
    });
  });

  describe("monthlyOccupancy", () => {
    it("returns one point per requested month, oldest first", () => {
      const series = monthlyOccupancy(1, [], 12);
      expect(series).toHaveLength(12);
      // Last point is the current month.
      expect(series.at(-1)?.label).toBe("Jul");
    });

    it("is 100% when every property is occupied all year", () => {
      const leases: OccupancyLease[] = [
        { propertyId: "p1", startDate: "2025-01-01", endDate: null },
      ];
      const series = monthlyOccupancy(1, leases, 3);
      expect(series.every((pt) => pt.rate === 100)).toBe(true);
    });

    it("reports 0% for every month when there are no properties", () => {
      const leases: OccupancyLease[] = [
        { propertyId: "p1", startDate: "2025-01-01", endDate: null },
      ];
      const series = monthlyOccupancy(0, leases, 3);
      expect(series.every((pt) => pt.rate === 0)).toBe(true);
    });

    it("rounds the rate to a whole percent", () => {
      // 1 of 3 properties occupied -> 33%.
      const leases: OccupancyLease[] = [
        { propertyId: "p1", startDate: "2025-01-01", endDate: null },
      ];
      const series = monthlyOccupancy(3, leases, 1);
      expect(series[0].rate).toBe(33);
    });
  });
});
