/**
 * Date utility functions for the AI Risk Dashboard.
 * All functions accept ISO 8601 date/timestamp strings.
 */

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
