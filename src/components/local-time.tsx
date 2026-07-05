"use client";

import { useSyncExternalStore } from "react";
import { formatInstant } from "@/lib/format";

// A store that never changes — we only need useSyncExternalStore for its
// server/client snapshot split, not for subscriptions.
const subscribe = () => () => {};

/**
 * Renders an instant in the viewer's local time zone. The server snapshot
 * formats in UTC so SSR and hydration match; the client snapshot formats in
 * the viewer's local zone, so React swaps to local time right after hydration
 * without a mismatch. `iso` must be an ISO 8601 string.
 */
export function LocalTime({
  iso,
  mode = "datetime",
}: {
  iso: string;
  mode?: "date" | "datetime";
}) {
  const date = new Date(iso);
  const text = useSyncExternalStore(
    subscribe,
    () => formatInstant(date, mode),
    () => formatInstant(date, mode, "UTC"),
  );

  return (
    <time dateTime={iso} suppressHydrationWarning>
      {text}
    </time>
  );
}
