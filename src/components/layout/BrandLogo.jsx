import React from 'react';
import { BrandIcon } from './BrandIcon';

/**
 * BrandLogo — chevron + "Accenture NFR Practice" + "AI Risk Dashboard" sub-text.
 */
export function BrandLogo() {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      <BrandIcon size={32} />
      <div className="flex flex-col leading-tight">
        <span className="text-white font-display font-semibold text-sm tracking-wide">
          Accenture NFR Practice
        </span>
        <span className="text-brand-pink-light text-xs font-body tracking-wider uppercase opacity-80">
          AI Risk Dashboard
        </span>
      </div>
    </div>
  );
}
