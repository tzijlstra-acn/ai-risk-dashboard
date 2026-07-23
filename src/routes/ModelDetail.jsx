import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Tab } from '@headlessui/react';
import { ArrowLeft, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { useInventoryById } from '../hooks/useInventory';
import { Badge } from '../components/ui/Badge';
import { SRTierBadge } from '../components/ui/SRTierBadge';
import { FoundationModelBadge } from '../components/ui/FoundationModelBadge';
import { FreshnessStamp } from '../components/ui/FreshnessStamp';
import { formatDate, formatTimestamp, isStale } from '../utils/date';

const TABS = ['Validation History', 'Data Lineage', 'Vendor Details', 'Change Log'];

function getMockHistory() {
  return [
    { date: '2024-11-15', validator: 'Sophie van der Berg', result: 'Pass', notes: 'All performance metrics within tolerance. No material model risk issues identified.' },
    { date: '2023-11-10', validator: 'Lars Hendriksen', result: 'Pass with Conditions', notes: 'Minor data drift detected in Q3 cohort. Monitoring plan agreed.' },
    { date: '2022-09-20', validator: 'Annika Müller', result: 'Pass', notes: 'Initial validation completed. Model approved for production deployment.' },
  ];
}

function getMockChangeLog() {
  return [
    { ts: '2025-03-14T16:42:00Z', actor: 'Sophie van der Berg', change: 'Governance status → Approved' },
    { ts: '2025-01-10T09:00:00Z', actor: 'System', change: 'Annual re-validation initiated' },
    { ts: '2024-11-15T14:00:00Z', actor: 'Lars Hendriksen', change: 'Validation record submitted' },
    { ts: '2024-08-01T11:30:00Z', actor: 'Emma Johansson', change: 'Data classification updated' },
    { ts: '2024-03-15T09:00:00Z', actor: 'Pieter de Vries', change: 'Business owner changed' },
  ];
}

function validationSeverity(status) {
  switch (status) {
    case 'Validated': return 'Healthy';
    case 'Overdue': return 'Critical';
    case 'Pending': return 'Medium';
    default: return 'Stale';
  }
}

function governanceSeverity(status) {
  switch (status) {
    case 'Approved': return 'Healthy';
    case 'Non-Compliant': return 'Critical';
    case 'Pending Approval': return 'Medium';
    default: return 'Stale';
  }
}

export function ModelDetail() {
  const { id } = useParams();
  const { data: model, isLoading } = useInventoryById(id);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-surface-700 rounded w-64" />
        <div className="h-40 bg-surface-700 rounded-xl" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="text-center py-16">
        <p className="text-white/40 text-sm">Asset not found</p>
        <Link to="/map" className="text-brand-pink-light text-sm mt-2 inline-block hover:text-white">
          ← Back to Map
        </Link>
      </div>
    );
  }

  const history = getMockHistory();
  const changeLog = getMockChangeLog();
  const stale = model.lastValidatedDate && isStale(model.lastValidatedDate);

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          to="/map"
          className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Map / Inventory
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-white text-sm">{model.name}</span>
      </div>

      {/* Header */}
      <div className="bg-surface-800 border border-surface-600 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-white font-display font-bold text-xl">{model.name}</h1>
            <p className="text-white/50 text-sm mt-1">{model.description}</p>
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <SRTierBadge tier={model.mrm_tier} />
              <FoundationModelBadge model={model.foundationModel} />
              <Badge severity={validationSeverity(model.validationStatus)} label={model.validationStatus} />
              <Badge severity={governanceSeverity(model.governanceStatus)} label={model.governanceStatus} />
            </div>
          </div>
          {model.dataFreshness && (
            <FreshnessStamp timestamp={model.dataFreshness} status="confirmed" />
          )}
        </div>

        {/* Field grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-surface-600">
          {[
            { label: 'Business Owner', value: model.businessOwner },
            { label: 'Department', value: model.department },
            { label: 'Asset Type', value: model.type },
            { label: 'Data Classification', value: model.dataClassification },
            { label: 'Vendor', value: model.vendor || 'In-house' },
            {
              label: 'Last Validated',
              value: model.lastValidatedDate ? formatDate(model.lastValidatedDate) : 'Never',
              color: stale ? 'text-severity-critical' : 'text-white',
            },
            { label: 'Regulations', value: model.regulations?.join(', ') },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <p className="text-white/30 text-xs font-mono uppercase tracking-wider">{label}</p>
              <p className={`text-sm mt-0.5 ${color || 'text-white'}`}>{value || '—'}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-surface-800 border border-surface-600 rounded-xl overflow-hidden">
        <Tab.Group>
          <Tab.List className="flex border-b border-surface-600 px-6">
            {TABS.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  [
                    'px-4 py-4 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
                    selected
                      ? 'border-brand-purple text-brand-pink-light'
                      : 'border-transparent text-white/40 hover:text-white',
                  ].join(' ')
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>

          <Tab.Panels className="p-6">
            {/* Validation History */}
            <Tab.Panel>
              <div className="space-y-4">
                {history.map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        entry.result === 'Pass' ? 'bg-severity-healthy/20' : 'bg-severity-stale/20'
                      }`}>
                        {entry.result === 'Pass'
                          ? <CheckCircle className="w-4 h-4 text-severity-healthy" />
                          : <Clock className="w-4 h-4 text-severity-stale" />
                        }
                      </div>
                      {i < history.length - 1 && <div className="w-px flex-1 bg-surface-600 mt-2" />}
                    </div>
                    <div className="pb-6 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-white font-medium">{entry.result}</span>
                        <span className="text-white/40 text-sm font-mono">{formatDate(entry.date)}</span>
                      </div>
                      <p className="text-white/40 text-sm mt-0.5">{entry.validator}</p>
                      <p className="text-white/60 text-sm mt-2 leading-relaxed">{entry.notes}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>

            {/* Data Lineage */}
            <Tab.Panel>
              <div className="font-mono text-sm space-y-2 bg-surface-700 rounded-xl p-5">
                {[
                  { step: '[SOURCE]', label: 'Core Banking System (T24) → Transactional Data Lake', color: 'text-severity-low' },
                  { arrow: true },
                  { step: '[TRANSFORM]', label: 'ETL Pipeline → Feature Engineering → Databricks Feature Store', color: 'text-severity-medium' },
                  { arrow: true },
                  { step: '[MODEL]', label: model.name, color: 'text-brand-pink-light' },
                  { arrow: true },
                  { step: '[OUTPUT]', label: 'Decision API → Origination System / Core Banking', color: 'text-severity-healthy' },
                  { arrow: true },
                  { step: '[AUDIT]', label: 'Model Output Store (immutable) → Audit Trail', color: 'text-severity-grey' },
                ].map((item, i) =>
                  item.arrow ? (
                    <div key={i} className="pl-10 text-white/20">↓</div>
                  ) : (
                    <div key={i} className="flex items-baseline gap-3">
                      <span className="text-white/30 w-24 flex-shrink-0">{item.step}</span>
                      <span className={item.color}>{item.label}</span>
                    </div>
                  )
                )}
              </div>
              <p className="text-white/20 text-xs mt-3">
                Mock data lineage — replace with live data catalogue (Collibra / Alation)
              </p>
            </Tab.Panel>

            {/* Vendor Details */}
            <Tab.Panel>
              {model.vendor ? (
                <div className="space-y-4">
                  <div className="bg-surface-700 rounded-xl p-5">
                    <h3 className="text-white font-medium mb-4">{model.vendor}</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {[
                        { label: 'DORA Status', value: 'Registered', color: 'text-severity-healthy' },
                        { label: 'Data Residency', value: 'EU (Frankfurt / Dublin)' },
                        { label: 'AUP Compliant', value: 'Yes', color: 'text-severity-healthy' },
                        { label: 'Contract End', value: '31 Dec 2025' },
                      ].map(({ label, value, color }) => (
                        <div key={label}>
                          <p className="text-white/30 font-mono text-xs">{label}</p>
                          <p className={`mt-0.5 ${color || 'text-white'}`}>{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Link
                    to="/manage"
                    className="flex items-center gap-1.5 text-sm text-brand-pink-light hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View vendor risk profile in Manage
                  </Link>
                </div>
              ) : (
                <p className="text-white/40 text-sm">In-house model — no external vendor.</p>
              )}
            </Tab.Panel>

            {/* Change Log */}
            <Tab.Panel>
              <div className="space-y-0">
                {changeLog.map((entry, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-surface-600/50">
                    <span className="text-white/30 font-mono text-xs w-44 flex-shrink-0 mt-0.5">
                      {formatTimestamp(entry.ts)}
                    </span>
                    <div>
                      <p className="text-white text-sm">{entry.change}</p>
                      <p className="text-white/40 text-xs mt-0.5">{entry.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
}
