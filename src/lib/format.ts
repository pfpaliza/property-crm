import type { Property } from "@/db/schema";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

// Shared field sets so the server (UTC) and client (local) formatters stay in
// lock-step. `date` shows a calendar day; `datetime` adds the clock time.
const DATE_FIELDS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};
const DATE_TIME_FIELDS: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  hour: "numeric",
  minute: "2-digit",
};

/** Formats a numeric string like "1500.00" as "$1,500". Returns "—" if empty. */
export function formatMoney(value: string | null): string {
  if (value === null) return "—";
  const n = Number(value);
  return Number.isFinite(n) ? currency.format(n) : "—";
}

// Lease start/end are stored as zone-less calendar dates ("2026-07-15"), which
// JS parses as UTC midnight. Pinning the formatter to UTC keeps them showing
// the stored day for every viewer — formatting them in a western local zone
// would slip them back to the previous day. Instants that SHOULD track the
// viewer's clock (created/updated, session start) render via <LocalTime>.
const calendarDateFmt = new Intl.DateTimeFormat("en-US", {
  ...DATE_FIELDS,
  timeZone: "UTC",
});

export function formatDate(value: Date): string {
  return calendarDateFmt.format(value);
}

/**
 * Formats an instant (a real point in time) as a date or date-time. Omit
 * `timeZone` to use the runtime's zone — on the client that's the viewer's
 * local time. Server/first-paint render passes "UTC" so SSR output is
 * deterministic; <LocalTime> then re-renders locally after mount.
 */
export function formatInstant(
  value: Date,
  mode: "date" | "datetime",
  timeZone?: string,
): string {
  const fields = mode === "datetime" ? DATE_TIME_FIELDS : DATE_FIELDS;
  return new Intl.DateTimeFormat("en-US", {
    ...fields,
    ...(timeZone ? { timeZone } : {}),
  }).format(value);
}

/** Single-line street address. */
export function formatAddressLine(p: Property): string {
  return [p.addressLine1, p.addressLine2].filter(Boolean).join(", ");
}

/** City, ST ZIP. */
export function formatCityLine(p: Property): string {
  return `${p.city}, ${p.state} ${p.zip}`;
}
