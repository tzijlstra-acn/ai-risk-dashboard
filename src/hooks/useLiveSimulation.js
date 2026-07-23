import React from 'react';

/**
 * useLiveSimulation — gives the dashboard a "live" feel on top of static mock data.
 * Bumps `lastScan` / `scanCount` on a fixed interval so consumers can render a
 * live "last scan Xs ago" counter and rolling scan totals.
 */
export function useLiveSimulation() {
  const [lastScan, setLastScan] = React.useState(() => new Date());
  const [scanCount, setScanCount] = React.useState(0);
  const [liveEvent, setLiveEvent] = React.useState(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastScan(new Date());
      setScanCount((c) => c + 1);
      setLiveEvent({ ts: Date.now() });
    }, 30000); // refresh "last scan" every 30s
    return () => clearInterval(interval);
  }, []);

  return { lastScan, scanCount, liveEvent };
}

/**
 * useSecondsAgo — re-renders every second and returns whole seconds elapsed
 * since `since`. Used for the live "Xs ago" text.
 * @param {Date|number} since
 */
export function useSecondsAgo(since) {
  const [, tick] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, []);
  const ms = Date.now() - new Date(since).getTime();
  return Math.max(0, Math.floor(ms / 1000));
}
