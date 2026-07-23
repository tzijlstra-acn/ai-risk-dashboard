import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

/**
 * DataGrid — generic sortable table.
 * @param {Array} columns - [{key, label, render?, sortable?}]
 * @param {Array} data
 * @param {Function} onRowClick
 * @param {string|number} selectedId
 * @param {string} searchTerm - highlights matches in string cells
 * @param {boolean} loading
 * @param {string} emptyMessage
 */
export function DataGrid({
  columns = [],
  data = [],
  onRowClick,
  selectedId,
  searchTerm = '',
  loading = false,
  emptyMessage = 'No data available',
}) {
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState('asc');

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const cmp = String(aVal).localeCompare(String(bVal), undefined, { numeric: true });
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [data, sortKey, sortDir]);

  function highlight(text, term) {
    if (!term || !text) return text;
    const str = String(text);
    const idx = str.toLowerCase().indexOf(term.toLowerCase());
    if (idx === -1) return str;
    return (
      <>
        {str.slice(0, idx)}
        <mark className="bg-brand-purple/30 text-brand-pink-light rounded px-0.5">
          {str.slice(idx, idx + term.length)}
        </mark>
        {str.slice(idx + term.length)}
      </>
    );
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-surface-700 rounded-lg" />
        ))}
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="text-center py-12 text-white/30 text-sm">{emptyMessage}</div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-600">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-600 bg-surface-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={[
                  'px-4 py-3 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider whitespace-nowrap',
                  col.sortable !== false ? 'cursor-pointer select-none hover:text-white/70' : '',
                ].join(' ')}
                onClick={() => col.sortable !== false && handleSort(col.key)}
              >
                <div className="flex items-center gap-1">
                  {col.label}
                  {col.sortable !== false && (
                    <span className="text-white/20">
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ChevronUp className="w-3 h-3" />
                        ) : (
                          <ChevronDown className="w-3 h-3" />
                        )
                      ) : (
                        <ChevronsUpDown className="w-3 h-3" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIdx) => {
            const isSelected = row.id != null && row.id === selectedId;
            return (
              <tr
                key={row.id ?? rowIdx}
                onClick={() => onRowClick && onRowClick(row)}
                className={[
                  'border-b border-surface-600/50 transition-colors',
                  onRowClick ? 'cursor-pointer' : '',
                  rowIdx % 2 === 0 ? 'bg-surface-800' : 'bg-surface-800/60',
                  isSelected
                    ? 'border-l-2 border-brand-purple bg-brand-purple/5'
                    : 'hover:bg-surface-700/50',
                  row._rowClassName || '',
                ].join(' ')}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3 text-white/80 whitespace-nowrap">
                    {col.render
                      ? col.render(row[col.key], row)
                      : highlight(row[col.key], searchTerm)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
