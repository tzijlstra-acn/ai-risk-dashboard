import React from 'react';

/**
 * BrandIcon — Accenture-style chevron at 28×28 with purple-to-pink gradient.
 */
export function BrandIcon({ size = 28 }) {
  const id = 'brand-icon-grad';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#A100FF" />
          <stop offset="100%" stopColor="#FF50C8" />
        </linearGradient>
      </defs>
      <path
        d="M18 10 L58 50 L18 90 L32 90 L72 50 L32 10 Z"
        fill={`url(#${id})`}
      />
    </svg>
  );
}
