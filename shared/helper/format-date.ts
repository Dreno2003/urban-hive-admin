/**
 * format-date.ts
 *
 * Shared date formatting helpers.
 * All helpers accept ISO 8601 date strings (e.g. "2026-06-01") and return
 * human-readable representations consistent across the Urban Hive UI.
 *
 * @example
 * formatDate("2026-06-01")              // "Jun 1, 2026"
 * formatDateRange("2026-06-01", "2026-06-05") // "Jun 1 – Jun 5, 2026"
 */

/**
 * Formats an ISO date string to a short, readable date.
 * Output example: "Jun 1, 2026"
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Formats an ISO date string to month + day only (no year).
 * Output example: "Jun 1"
 */
export function formatDateShort(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a check-in / check-out range.
 * Output example: "Jun 1 – Jun 5, 2026"
 */
export function formatDateRange(checkIn: string, checkOut: string): string {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);

  const sameYear = inDate.getFullYear() === outDate.getFullYear();

  const inStr = inDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const outStr = outDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: sameYear ? "numeric" : undefined,
  });

  return sameYear
    ? `${inStr} – ${outStr}`
    : `${inStr}, ${inDate.getFullYear()} – ${outStr}`;
}
