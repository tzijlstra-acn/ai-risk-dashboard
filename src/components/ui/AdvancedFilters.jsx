import React, { useState } from 'react';
import { ChevronDown, ChevronUp, SlidersHorizontal, X } from 'lucide-react';
import { FOUNDATION_MODELS, ASSET_TYPES, DATA_CLASSIFICATIONS, REGULATIONS, SR11_TIERS } from '../../brand';

const VALIDATION_STATUSES = ['Validated', 'Pending', 'Overdue', 'In Progress'];

function MultiCheckbox({ label, options, selected, onChange }) {
  return (
    <div>
      <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() =>
                onChange(
                  active ? selected.filter((s) => s !== opt) : [...selected, opt]
                )
              }
              className={[
                'text-xs px-2 py-1 rounded-md border transition-colors font-body',
                active
                  ? 'bg-brand-purple/20 border-brand-purple text-brand-pink-light'
                  : 'bg-surface-700 border-surface-500 text-white/50 hover:text-white hover:border-white/30',
              ].join(' ')}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * AdvancedFilters — collapsible filter panel.
 * @param {object} filters - current filter state
 * @param {Function} onChange - called with updated filters object
 */
export function AdvancedFilters({ filters = {}, onChange }) {
  const [open, setOpen] = useState(false);

  const f = {
    srTiers: [],
    validationStatuses: [],
    dataClassifications: [],
    regulations: [],
    foundationModels: [],
    assetTypes: [],
    ...filters,
  };

  const update = (key, val) => onChange({ ...f, [key]: val });

  const activeCount = [
    f.srTiers.length,
    f.validationStatuses.length,
    f.dataClassifications.length,
    f.regulations.length,
    f.foundationModels.length,
    f.assetTypes.length,
  ].reduce((a, b) => a + b, 0);

  const clearAll = () =>
    onChange({
      srTiers: [],
      validationStatuses: [],
      dataClassifications: [],
      regulations: [],
      foundationModels: [],
      assetTypes: [],
    });

  return (
    <div className="bg-surface-800 border border-surface-600 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-surface-700/50 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm text-white/70">
          <SlidersHorizontal className="w-4 h-4" />
          <span className="font-medium">Advanced Filters</span>
          {activeCount > 0 && (
            <span className="bg-brand-purple text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); clearAll(); }}
              className="text-xs text-white/30 hover:text-severity-critical flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-surface-600 pt-4">
          <MultiCheckbox
            label="SR 11-7 Tier"
            options={SR11_TIERS}
            selected={f.srTiers}
            onChange={(v) => update('srTiers', v)}
          />
          <MultiCheckbox
            label="Validation Status"
            options={VALIDATION_STATUSES}
            selected={f.validationStatuses}
            onChange={(v) => update('validationStatuses', v)}
          />
          <MultiCheckbox
            label="Data Classification"
            options={DATA_CLASSIFICATIONS}
            selected={f.dataClassifications}
            onChange={(v) => update('dataClassifications', v)}
          />
          <MultiCheckbox
            label="Regulation"
            options={REGULATIONS}
            selected={f.regulations}
            onChange={(v) => update('regulations', v)}
          />
          <MultiCheckbox
            label="Foundation Model"
            options={FOUNDATION_MODELS}
            selected={f.foundationModels}
            onChange={(v) => update('foundationModels', v)}
          />
          <MultiCheckbox
            label="Asset Type"
            options={ASSET_TYPES}
            selected={f.assetTypes}
            onChange={(v) => update('assetTypes', v)}
          />
        </div>
      )}
    </div>
  );
}
