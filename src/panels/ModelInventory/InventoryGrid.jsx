import React from 'react';
import { DataGrid } from '../../components/ui/DataGrid';
import { Badge } from '../../components/ui/Badge';
import { SRTierBadge } from '../../components/ui/SRTierBadge';
import { FoundationModelBadge } from '../../components/ui/FoundationModelBadge';
import { formatDate, isStale } from '../../utils/date';

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

const COLUMNS = [
  {
    key: 'name',
    label: 'Asset Name',
    render: (val) => (
      <span className="text-white font-medium text-sm">{val}</span>
    ),
  },
  {
    key: 'type',
    label: 'Type',
    render: (val) => (
      <Badge severity="Grey" label={val} size="sm" />
    ),
  },
  {
    key: 'foundationModel',
    label: 'Foundation Model',
    render: (val) => <FoundationModelBadge model={val} />,
  },
  {
    key: 'businessOwner',
    label: 'Business Owner',
    render: (val) => <span className="text-white/70 text-xs">{val}</span>,
  },
  {
    key: 'mrm_tier',
    label: 'SR 11-7 Tier',
    render: (val) => <SRTierBadge tier={val} />,
  },
  {
    key: 'validationStatus',
    label: 'Validation',
    render: (val, row) => (
      <div className="flex flex-col gap-1">
        <Badge severity={validationSeverity(val)} label={val} size="sm" />
        <span className={`text-[11px] font-mono ${row.lastValidatedDate && isStale(row.lastValidatedDate) ? 'text-severity-stale' : 'text-white/40'}`}>
          {row.lastValidatedDate ? formatDate(row.lastValidatedDate) : 'Never validated'}
        </span>
      </div>
    ),
  },
  {
    key: 'riskScore',
    label: 'Risk',
    render: (val) => {
      const score = val ?? 0;
      const color = score >= 70 ? 'bg-severity-critical' : score >= 50 ? 'bg-severity-high' : score >= 30 ? 'bg-severity-medium' : 'bg-severity-healthy';
      const text = score >= 70 ? 'text-severity-critical' : score >= 50 ? 'text-severity-high' : score >= 30 ? 'text-severity-medium' : 'text-severity-healthy';
      return (
        <div className="w-16">
          <span className={`text-xs font-mono font-bold ${text}`}>{score}</span>
          <div className="w-full bg-surface-600 rounded-full h-1 overflow-hidden mt-1">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
          </div>
        </div>
      );
    },
  },
  {
    key: 'dataClassification',
    label: 'Data Class',
    render: (val) => <Badge severity={dataClassSeverity(val)} label={val} size="sm" />,
  },
  {
    key: 'governanceStatus',
    label: 'Governance',
    render: (val) => <Badge severity={governanceSeverity(val)} label={val} size="sm" />,
  },
];

/**
 * InventoryGrid — sortable, filterable grid of AI assets.
 */
export function InventoryGrid({ data, selectedId, onRowClick, searchTerm, filters, loading }) {
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
      if (filters.srTiers?.length)
        result = result.filter((i) => filters.srTiers.includes(i.mrm_tier));
      if (filters.validationStatuses?.length)
        result = result.filter((i) => filters.validationStatuses.includes(i.validationStatus));
      if (filters.dataClassifications?.length)
        result = result.filter((i) => filters.dataClassifications.includes(i.dataClassification));
      if (filters.regulations?.length)
        result = result.filter((i) =>
          i.regulations?.some((r) => filters.regulations.includes(r))
        );
      if (filters.foundationModels?.length)
        result = result.filter((i) => filters.foundationModels.includes(i.foundationModel));
      if (filters.assetTypes?.length)
        result = result.filter((i) => filters.assetTypes.includes(i.type));
    }

    return result;
  }, [data, searchTerm, filters]);

  return (
    <DataGrid
      columns={COLUMNS}
      data={filtered}
      selectedId={selectedId}
      onRowClick={onRowClick}
      searchTerm={searchTerm}
      loading={loading}
      emptyMessage="No assets match the current filters."
    />
  );
}
