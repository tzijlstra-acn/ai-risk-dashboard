import React from 'react';

/**
 * useCountUp — animates a number from 0 to `target` over `duration` ms using
 * requestAnimationFrame. Re-runs whenever `target` changes.
 * @param {number} target
 * @param {number} duration - ms (default 800)
 * @returns {number} current animated value
 */
export function useCountUp(target = 0, duration = 800) {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    const end = Number(target) || 0;
    if (end === 0) {
      setValue(0);
      return undefined;
    }
    let raf;
    let start;
    const step = (ts) => {
      if (start == null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(end * eased);
      if (progress < 1) raf = requestAnimationFrame(step);
      else setValue(end);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}
