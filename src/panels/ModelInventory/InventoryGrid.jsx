import React from 'react';
import {
  ChevronUp, ChevronDown, ChevronsUpDown, Eye, History, X,
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { SRTierBadge } from '../../components/ui/SRTierBadge';
import { FoundationModelBadge } from '../../components/ui/FoundationModelBadge';
import { StatusDot } from '../../components/ui/StatusDot';
import { AnimatedBar } from '../../components/ui/AnimatedBar';
import { formatDate, isStale, daysUntil } from '../../utils/date';

const GENAI_MODELS = ['GPT-4', 'Claude 3.7', 'Gemini Ultra', 'Llama 3', 'Mistral Large'];
const FILTERS = ['All', 'High Tier', 'GenAI', 'Overdue', 'Non-Compliant', 'Critical Shadow AI'];

const TIER_DESCRIPTIONS = {
  High: 'Material models with significant financial or regulatory impact. SR 11-7 requires full independent validation, effective challenge, and annual review.',
  Medium: 'Moderate-impact models. Standard validation scope with periodic (biennial) independent review.',
  Low: 'Low-impact models. Lightweight review, ongoing performance monitoring, and documentation.',
};

function validationSeverity(status) {
  switch (status) {
    case 'Validated': return 'Healthy';
    case 'Overdue': return 'Critical';
    case 'Pending': return 'Medium';
    case 'In Progress': return 'Stale';
    default: return 'Grey';
  }
}

function governanceSeverity(status) {
  switch (status) {
    case 'Approved': return 'Healthy';
    case 'Non-Compliant': return 'Critical';
    case 'Pending Approval': return 'Medium';
    case 'Under Review': return 'Stale';
    default: return 'Grey';
  }
}

function dataClassSeverity(cls) {
  switch (cls) {
    case 'Restricted': return 'Critical';
    case 'Customer Credit': return 'High';
    case 'PII': return 'High';
    case 'Confidential': return 'Medium';
    case 'Internal': return 'Low';
    case 'Public': return 'Healthy';
    default: return 'Grey';
  }
}

function riskColor(score) {
  if (score >= 61) return '#EF4444';
  if (score >= 31) return '#EAB308';
  return '#22C55E';
}
function riskText(score) {
  if (score >= 61) return 'text-severity-critical';
  if (score >= 31) return 'text-severity-medium';
  return 'text-severity-healthy';
}

const COLUMNS = [
  { key: 'name', label: 'Asset Name' },
  { key: 'type', label: 'Type' },
  { key: 'foundationModel', label: 'Foundation Model' },
  { key: 'businessOwner', label: 'Business Owner' },
  { key: 'mrm_tier', label: 'SR 11-7 Tier' },
  { key: 'validationStatus', label: 'Validation' },
  { key: 'riskScore', label: 'Risk' },
  { key: 'dataClassification', label: 'Data Class' },
  { key: 'governanceStatus', label: 'Governance' },
];

function matchesChip(chip, item) {
  switch (chip) {
    case 'High Tier': return item.mrm_tier === 'High';
    case 'GenAI': return GENAI_MODELS.includes(item.foundationModel);
    case 'Overdue': return item.validationStatus === 'Overdue';
    case 'Non-Compliant': return item.governanceStatus === 'Non-Compliant';
    case 'Critical Shadow AI': return (item.riskScore ?? 0) >= 70 || item.dataClassification === 'Restricted';
    default: return true;
  }
}

/**
 * AssetDetailDrawer — custom slide-in panel (no Headless UI, no focus trap).
 */
function AssetDetailDrawer({ asset, onClose }) {
  if (!asset) return null;
  const dueDays = daysUntil(asset.nextValidationDue);
  const score = asset.riskScore ?? 0;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div
        className="absolute right-0 top-0 h-screen w-[480px] max-w-full bg-surface-800 border-l border-surface-600 shadow-2xl flex flex-col animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-surface-600 flex-shrink-0">
          <div className="min-w-0 pr-4">
            <h3 className="text-white font-display font-semibold text-base leading-tight">{asset.name}</h3>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge severity="Grey" label={asset.type} size="sm" />
              <FoundationModelBadge model={asset.foundationModel} />
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scrollbar-dark p-6 space-y-6">
          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3">
            {[
              ['Business Owner', asset.businessOwner],
              ['Department', asset.department],
              ['Model Version', asset.modelVersion],
              ['Deployed', formatDate(asset.deploymentDate)],
              ['Traffic Volume', asset.trafficVolume],
              ['Vendor', asset.vendor || 'In-house'],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">{k}</p>
                <p className="text-white text-sm mt-0.5">{v || '—'}</p>
              </div>
            ))}
          </div>

          {/* SR 11-7 tier + description */}
          <div className="bg-surface-700 rounded-xl p-4 border border-surface-600">
            <div className="flex items-center gap-2 mb-2">
              <SRTierBadge tier={asset.mrm_tier} />
            </div>
            <p className="text-white/60 text-xs leading-relaxed">{TIER_DESCRIPTIONS[asset.mrm_tier]}</p>
          </div>

          {/* Risk score — large animated */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-xs font-mono uppercase tracking-wider">Risk Score</p>
              <span className={`text-lg font-display font-bold font-mono ${riskText(score)}`}>{score}<span className="text-white/30 text-sm">/100</span></span>
            </div>
            <AnimatedBar pct={score} color={riskColor(score)} height="h-3" />
          </div>

          {/* Regulations */}
          <div>
            <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Regulatory Exposure</p>
            <div className="flex flex-wrap gap-1.5">
              {(asset.regulations || []).map((r) => (
                <span key={r} className="inline-flex items-center rounded-md text-xs font-mono px-2 py-0.5 bg-brand-purple/10 text-brand-pink-light border border-brand-purple/30">
                  {r}
                </span>
              ))}
              {(!asset.regulations || asset.regulations.length === 0) && (
                <span className="text-white/30 text-xs">None mapped</span>
              )}
            </div>
          </div>

          {/* Data inputs */}
          <div>
            <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-2">Data Inputs</p>
            <ul className="space-y-1">
              {(asset.dataInputs || []).map((d) => (
                <li key={d} className="text-white/70 text-sm flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-purple flex-shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>

          {/* Validation + governance */}
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-surface-600">
            <div>
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Last Validated</p>
              <p className={`text-sm mt-0.5 ${asset.lastValidatedDate && isStale(asset.lastValidatedDate) ? 'text-severity-stale' : 'text-white'}`}>
                {asset.lastValidatedDate ? formatDate(asset.lastValidatedDate) : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider">Next Validation Due</p>
              <p className="text-white text-sm mt-0.5">{formatDate(asset.nextValidationDue)}</p>
              {!Number.isNaN(dueDays) && (
                <p className={`text-[11px] font-mono mt-0.5 ${dueDays < 0 ? 'text-severity-critical' : dueDays < 30 ? 'text-severity-stale' : 'text-white/40'}`}>
                  {dueDays < 0 ? `${Math.abs(dueDays)}d overdue` : `${dueDays}d remaining`}
                </p>
              )}
            </div>
            <div className="col-span-2">
              <p className="text-white/30 text-[10px] font-mono uppercase tracking-wider mb-1">Governance Status</p>
              <Badge severity={governanceSeverity(asset.governanceStatus)} label={asset.governanceStatus} size="sm" />
            </div>
          </div>

          {asset.description && (
            <p className="text-white/50 text-xs leading-relaxed border-t border-surface-600 pt-4">{asset.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * InventoryGrid — interactive, sortable, filterable grid of AI assets with a
 * slide-in detail drawer.
 */
export function InventoryGrid({ data, searchTerm, filters, loading }) {
  const [sort, setSort] = React.useState({ col: null, dir: null });
  const [chip, setChip] = React.useState('All');
  const [selectedAsset, setSelectedAsset] = React.useState(null);

  const cycleSort = (col) => {
    setSort((prev) => {
      if (prev.col !== col) return { col, dir: 'asc' };
      if (prev.dir === 'asc') return { col, dir: 'desc' };
      return { col: null, dir: null };
    });
  };

  const filtered = React.useMemo(() => {
    if (!data) return [];
    let result = data;

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter((item) =>
        [item.name, item.type, item.foundationModel, item.businessOwner, item.department,
         item.validationStatus, item.dataClassification, item.governanceStatus, item.vendor, ...(item.regulations || [])]
          .filter(Boolean)
          .some((f) => String(f).toLowerCase().includes(lower))
      );
    }

    if (filters) {
      if (filters.srTiers?.length) result = result.filter((i) => filters.srTiers.includes(i.mrm_tier));
      if (filters.validationStatuses?.length) result = result.filter((i) => filters.validationStatuses.includes(i.validationStatus));
      if (filters.dataClassifications?.length) result = result.filter((i) => filters.dataClassifications.includes(i.dataClassification));
      if (filters.regulations?.length) result = result.filter((i) => i.regulations?.some((r) => filters.regulations.includes(r)));
      if (filters.foundationModels?.length) result = result.filter((i) => filters.foundationModels.includes(i.foundationModel));
      if (filters.assetTypes?.length) result = result.filter((i) => filters.assetTypes.includes(i.type));
    }

    result = result.filter((i) => matchesChip(chip, i));
    return result;
  }, [data, searchTerm, filters, chip]);

  const sorted = React.useMemo(() => {
    if (!sort.col) return filtered;
    return [...filtered].sort((a, b) => {
      const av = a[sort.col];
      const bv = b[sort.col];
      if (av == null) return 1;
      if (bv == null) return -1;
      const cmp = String(av).localeCompare(String(bv), undefined, { numeric: true });
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [filtered, sort]);

  const chipCount = (c) => (data || []).filter((i) => matchesChip(c, i)).length;

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(6)].map((_, i) => <div key={i} className="h-10 bg-surface-700 rounded-lg" />)}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        {FILTERS.map((c) => {
          const active = chip === c;
          return (
            <button
              key={c}
              onClick={() => setChip(c)}
              className={[
                'px-3 py-1.5 text-xs font-medium rounded-full border transition-all duration-200',
                active
                  ? 'bg-brand-purple border-brand-purple text-white shadow-[0_0_12px_rgba(161,0,255,0.4)]'
                  : 'bg-transparent border-surface-500 text-white/50 hover:text-white hover:border-brand-purple/50',
              ].join(' ')}
            >
              {c}
              <span className={`ml-1.5 font-mono ${active ? 'text-white/70' : 'text-white/30'}`}>{chipCount(c)}</span>
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-surface-600">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-600 bg-surface-700">
              {COLUMNS.map((col) => {
                const isActive = sort.col === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => cycleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider whitespace-nowrap cursor-pointer select-none hover:text-white/70 transition-colors"
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <span className={isActive ? 'text-brand-pink-light' : 'text-white/20'}>
                        {isActive ? (
                          sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                        ) : <ChevronsUpDown className="w-3 h-3" />}
                      </span>
                    </div>
                  </th>
                );
              })}
              <th className="w-0" />
            </tr>
          </thead>
          <tbody>
            {sorted.map((row, i) => {
              const vSev = validationSeverity(row.validationStatus);
              const score = row.riskScore ?? 0;
              const isSelected = selectedAsset?.id === row.id;
              return (
                <tr
                  key={row.id ?? i}
                  onClick={() => setSelectedAsset(row)}
                  className={[
                    'group relative border-b border-surface-600/50 cursor-pointer transition-colors animate-fade-slide-up',
                    `stagger-${Math.min(i + 1, 8)}`,
                    i % 2 === 0 ? 'bg-surface-800' : 'bg-surface-800/60',
                    isSelected
                      ? 'bg-brand-purple/10 border-l-2 border-l-brand-purple'
                      : 'hover:bg-surface-700/60 border-l-2 border-l-transparent hover:border-l-brand-purple',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-white font-medium text-sm">{row.name}</span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge severity="Grey" label={row.type} size="sm" /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><FoundationModelBadge model={row.foundationModel} /></td>
                  <td className="px-4 py-3 whitespace-nowrap"><span className="text-white/70 text-xs">{row.businessOwner}</span></td>
                  <td className="px-4 py-3 whitespace-nowrap"><SRTierBadge tier={row.mrm_tier} /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {vSev !== 'Healthy' && <StatusDot severity={vSev} />}
                      <div className="flex flex-col gap-1">
                        <Badge severity={vSev} label={row.validationStatus} size="sm" />
                        <span className={`text-[11px] font-mono ${row.lastValidatedDate && isStale(row.lastValidatedDate) ? 'text-severity-stale' : 'text-white/40'}`}>
                          {row.lastValidatedDate ? formatDate(row.lastValidatedDate) : 'Never validated'}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="w-20">
                      <span className={`text-xs font-mono font-bold ${riskText(score)}`}>{score}</span>
                      <div className="mt-1">
                        <AnimatedBar pct={score} height="h-1.5" color={riskColor(score)} />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap"><Badge severity={dataClassSeverity(row.dataClassification)} label={row.dataClassification} size="sm" /></td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {governanceSeverity(row.governanceStatus) === 'Critical' && <StatusDot severity="Critical" />}
                      <Badge severity={governanceSeverity(row.governanceStatus)} label={row.governanceStatus} size="sm" />
                    </div>
                  </td>
                  {/* Hover actions */}
                  <td className="px-2 py-3 whitespace-nowrap w-0">
                    <div className="flex items-center gap-1.5 opacity-0 translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAsset(row); }}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-brand-purple/15 border border-brand-purple/30 text-brand-pink-light hover:bg-brand-purple/25 transition-colors"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedAsset(row); }}
                        className="flex items-center gap-1 px-2 py-1 text-[11px] rounded-md bg-surface-600 border border-surface-500 text-white/60 hover:text-white hover:bg-surface-500 transition-colors"
                      >
                        <History className="w-3 h-3" /> History
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sorted.length === 0 && (
          <div className="text-center py-12 text-white/30 text-sm">No assets match the current filters.</div>
        )}
      </div>

      <AssetDetailDrawer asset={selectedAsset} onClose={() => setSelectedAsset(null)} />
    </div>
  );
}
