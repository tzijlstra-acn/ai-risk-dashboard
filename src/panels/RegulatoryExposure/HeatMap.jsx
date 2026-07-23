import React, { useState } from 'react';
import { REGULATIONS, ASSET_TYPES } from '../../brand';
import { Badge } from '../../components/ui/Badge';

function cellColor(count) {
  if (count === 0) return 'bg-surface-600 text-white/40 hover:bg-surface-500';
  if (count <= 2) return 'bg-severity-medium/30 text-severity-medium hover:bg-severity-medium/40 cursor-pointer';
  return 'bg-severity-critical/30 text-severity-critical hover:bg-severity-critical/40 cursor-pointer';
}

/**
 * HeatMap — regulatory exposure grid.
 * Rows: REGULATIONS, Columns: ASSET_TYPES
 * Cell click → show filtered asset list below.
 */
export function HeatMap({ data = [], modelFilter = '' }) {
  const [selectedCell, setSelectedCell] = useState(null);

  const filtered = modelFilter
    ? data.filter((asset) => asset.foundationModel === modelFilter)
    : data;

  function getCount(regulation, assetType) {
    return filtered.filter(
      (asset) =>
        asset.regulations?.includes(regulation) &&
        asset.type === assetType
    ).length;
  }

  function getAssets(regulation, assetType) {
    return filtered.filter(
      (asset) =>
        asset.regulations?.includes(regulation) &&
        asset.type === assetType
    );
  }

  const handleCellClick = (regulation, assetType) => {
    const count = getCount(regulation, assetType);
    if (count === 0) return;

    const key = `${regulation}:${assetType}`;
    setSelectedCell((prev) => (prev === key ? null : key));
  };

  const selectedAssets = selectedCell
    ? getAssets(...selectedCell.split(':'))
    : [];

  return (
    <div className="space-y-4">
      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr>
              <th className="px-3 py-2 text-left text-white/30 font-mono uppercase tracking-wider w-32">
                Regulation
              </th>
              {ASSET_TYPES.map((type) => (
                <th key={type} className="px-2 py-2 text-center text-white/30 font-mono uppercase tracking-wider">
                  {type}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {REGULATIONS.map((reg) => (
              <tr key={reg}>
                <td className="px-3 py-2 text-white font-mono text-xs font-medium border-r border-surface-600">
                  {reg}
                </td>
                {ASSET_TYPES.map((type) => {
                  const count = getCount(reg, type);
                  const key = `${reg}:${type}`;
                  const isSelected = selectedCell === key;
                  return (
                    <td
                      key={type}
                      className="px-2 py-2 text-center"
                    >
                      <div
                        onClick={() => handleCellClick(reg, type)}
                        className={[
                          'w-12 h-10 rounded-lg flex items-center justify-center mx-auto font-bold transition-all',
                          cellColor(count),
                          isSelected ? 'ring-2 ring-white/30' : '',
                        ].join(' ')}
                        title={`${reg} × ${type}: ${count} asset(s)`}
                      >
                        {count || '—'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs text-white/40">
        <span className="font-mono">Legend:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-surface-600" />
          <span>0 assets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-severity-medium/30" />
          <span>1–2 assets</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded bg-severity-critical/30" />
          <span>3+ assets</span>
        </div>
      </div>

      {/* Selected cell detail */}
      {selectedCell && selectedAssets.length > 0 && (
        <div className="bg-surface-700 rounded-xl p-4 border border-surface-500">
          <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">
            {selectedCell.replace(':', ' × ')} — {selectedAssets.length} asset(s)
          </p>
          <div className="space-y-2">
            {selectedAssets.map((asset) => (
              <div key={asset.id} className="flex items-center justify-between text-sm">
                <span className="text-white">{asset.name}</span>
                <div className="flex items-center gap-2">
                  <Badge
                    severity={
                      asset.validationStatus === 'Validated' ? 'Healthy' :
                      asset.validationStatus === 'Overdue' ? 'Critical' : 'Medium'
                    }
                    label={asset.validationStatus}
                    size="sm"
                  />
                  <span className="text-white/40 text-xs">{asset.department}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
