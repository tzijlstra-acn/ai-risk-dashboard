/**
 * Date utility functions for the AI Risk Dashboard.
 * All functions accept ISO 8601 date/timestamp strings.
 */

/**
 * REFERENCE_DATE — the "as-of" date for the mock data world.
 * All countdown / days-remaining calculations are measured relative to this
 * so the cockpit reads correctly against the seeded 2025 mock data.
 * TODO: Remove and use live clock once wired to real APIs.
 */
export const REFERENCE_DATE = '2025-03-15T09:00:00Z';

/**
 * Days from the reference date until the given ISO date.
 * Positive = in the future, negative = overdue/past.
 * @param {string} iso - ISO 8601 date string
 * @param {string} from - reference ISO date (defaults to REFERENCE_DATE)
 * @returns {number}
 */
export function daysUntil(iso, from = REFERENCE_DATE) {
  if (!iso) return NaN;
  try {
    const target = new Date(iso);
    const ref = new Date(from);
    return Math.round((target - ref) / (1000 * 60 * 60 * 24));
  } catch {
    return NaN;
  }
}

/**
 * Format an ISO date string as a human-readable date.
 * @param {string} iso - ISO 8601 date string
 * @returns {string} Formatted date, e.g. "15 Mar 2025"
 */
export function formatDate(iso) {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

/**
 * Returns number of days since the given ISO date.
 * @param {string} iso - ISO 8601 date string
 * @returns {number} Days since date
 */
export function daysAgo(iso) {
  if (!iso) return Infinity;
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now - date;
    return Math.floor(diffMs / (1000 * 60 * 60 * 24));
  } catch {
    return Infinity;
  }
}

/**
 * Returns true if the given ISO date is older than thresholdDays.
 * @param {string} iso - ISO 8601 date string
 * @param {number} thresholdDays - Threshold in days (default 90)
 * @returns {boolean}
 */
export function isStale(iso, thresholdDays = 90) {
  return daysAgo(iso) > thresholdDays;
}

/**
 * Format an ISO timestamp as a human-readable date + time.
 * @param {string} iso - ISO 8601 timestamp string
 * @returns {string} Formatted timestamp, e.g. "15 Mar 2025, 09:42"
 */
export function formatTimestamp(iso) {
  if (!iso) return '—';
  try {
    const date = new Date(iso);
    return date.toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

/**
 * Returns hours since the given ISO timestamp.
 * @param {string} iso - ISO 8601 timestamp string
 * @returns {number} Hours since timestamp
 */
export function hoursSince(iso) {
  if (!iso) return Infinity;
  try {
    const date = new Date(iso);
    const now = new Date();
    const diffMs = now - date;
    return diffMs / (1000 * 60 * 60);
  } catch {
    return Infinity;
  }
}
