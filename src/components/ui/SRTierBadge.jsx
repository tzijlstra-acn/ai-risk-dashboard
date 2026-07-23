import React from 'react';
import { SR_TIER_CLASSES } from '../../theme';

/**
 * SRTierBadge — outlined pill for SR 11-7 tiers.
 * Visually distinct from filled severity badges.
 * @param {'High'|'Medium'|'Low'} tier
 */
export function SRTierBadge({ tier }) {
  const classes = SR_TIER_CLASSES[tier] || SR_TIER_CLASSES.Low;

  return (
    <span
      className={[
        'inline-flex items-center rounded-md text-xs font-mono font-medium px-2 py-0.5 bg-transparent',
        classes,
      ].join(' ')}
    >
      SR 11-7 · {tier}
    </span>
  );
}
