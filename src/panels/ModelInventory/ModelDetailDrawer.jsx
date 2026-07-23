import React, { Fragment } from 'react';
import { Dialog, Tab, Transition } from '@headlessui/react';
import { X, CheckCircle, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { SRTierBadge } from '../../components/ui/SRTierBadge';
import { FoundationModelBadge } from '../../components/ui/FoundationModelBadge';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { formatDate, formatTimestamp, isStale } from '../../utils/date';

// Mock validation history per model
function getMockHistory(modelId) {
  return [
    {
      date: '2024-11-15',
      validator: 'Sophie van der Berg',
      result: 'Pass',
      notes: 'All performance metrics within tolerance. No material model risk issues identified.',
    },
    {
      date: '2023-11-10',
      validator: 'Lars Hendriksen',
      result: 'Pass with Conditions',
      notes: 'Minor data drift detected in Q3 cohort. Monitoring plan agreed. Re-validation in 6 months.',
    },
    {
      date: '2022-09-20',
      validator: 'Annika Müller',
      result: 'Pass',
      notes: 'Initial validation completed. Model approved for production deployment.',
    },
  ];
}

function getMockChangeLog(modelId) {
  return [
    { ts: '2025-03-14T16:42:00Z', actor: 'Sophie van der Berg', change: 'Governance status → Approved' },
    { ts: '2025-01-10T09:00:00Z', actor: 'System', change: 'Annual re-validation initiated' },
    { ts: '2024-11-15T14:00:00Z', actor: 'Lars Hendriksen', change: 'Validation record submitted' },
    { ts: '2024-08-01T11:30:00Z', actor: 'Emma Johansson', change: 'Data classification updated to Confidential' },
    { ts: '2024-03-15T09:00:00Z', actor: 'Pieter de Vries', change: 'Business owner changed' },
  ];
}

const TABS = ['Validation History', 'Data Lineage', 'Vendor Details', 'Change Log'];

export function ModelDetailDrawer({ model, open, onClose }) {
  if (!model) return null;

  const history = getMockHistory(model.id);
  const changeLog = getMockChangeLog(model.id);
  const stale = model.lastValidatedDate && isStale(model.lastValidatedDate);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        {/* Overlay */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        {/* Drawer panel */}
        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-[640px] flex flex-col bg-surface-800 border-l border-surface-600 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between px-6 py-5 border-b border-surface-600 flex-shrink-0">
                    <div className="flex-1 min-w-0 pr-4">
                      <Dialog.Title className="text-white font-display font-semibold text-base leading-tight truncate">
                        {model.name}
                      </Dialog.Title>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <SRTierBadge tier={model.mrm_tier} />
                        <FoundationModelBadge model={model.foundationModel} />
                        <Badge
                          severity={
                            model.validationStatus === 'Validated' ? 'Healthy' :
                            model.validationStatus === 'Overdue' ? 'Critical' :
                            model.validationStatus === 'Pending' ? 'Medium' : 'Stale'
                          }
                          label={model.validationStatus}
                          size="sm"
                        />
                      </div>
                    </div>
                    <button
                      onClick={onClose}
                      className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5 flex-shrink-0"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Summary strip */}
                  <div className="px-6 py-3 bg-surface-700 border-b border-surface-600 flex-shrink-0">
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <span className="text-white/30 font-mono uppercase tracking-wider">Owner</span>
                        <p className="text-white mt-0.5">{model.businessOwner}</p>
                      </div>
                      <div>
                        <span className="text-white/30 font-mono uppercase tracking-wider">Department</span>
                        <p className="text-white mt-0.5">{model.department}</p>
                      </div>
                      <div>
                        <span className="text-white/30 font-mono uppercase tracking-wider">Last Validated</span>
                        <p className={`mt-0.5 ${stale ? 'text-severity-critical' : 'text-white'}`}>
                          {model.lastValidatedDate ? formatDate(model.lastValidatedDate) : 'Never'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex-1 overflow-hidden flex flex-col">
                    <Tab.Group>
                      <Tab.List className="flex border-b border-surface-600 flex-shrink-0 px-6">
                        {TABS.map((tab) => (
                          <Tab
                            key={tab}
                            className={({ selected }) =>
                              [
                                'px-3 py-3 text-xs font-medium transition-colors border-b-2 -mb-px whitespace-nowrap',
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

                      <Tab.Panels className="flex-1 overflow-y-auto p-6">
                        {/* Tab 1: Validation History */}
                        <Tab.Panel>
                          <div className="space-y-4">
                            {history.map((entry, i) => (
                              <div key={i} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    entry.result === 'Pass' ? 'bg-severity-healthy/20' : 'bg-severity-stale/20'
                                  }`}>
                                    {entry.result === 'Pass'
                                      ? <CheckCircle className="w-3.5 h-3.5 text-severity-healthy" />
                                      : <Clock className="w-3.5 h-3.5 text-severity-stale" />
                                    }
                                  </div>
                                  {i < history.length - 1 && (
                                    <div className="w-px flex-1 bg-surface-600 mt-2" />
                                  )}
                                </div>
                                <div className="pb-4 flex-1">
                                  <div className="flex items-center justify-between">
                                    <span className="text-white text-sm font-medium">{entry.result}</span>
                                    <span className="text-white/40 text-xs font-mono">{formatDate(entry.date)}</span>
                                  </div>
                                  <p className="text-white/40 text-xs mt-0.5">{entry.validator}</p>
                                  <p className="text-white/70 text-xs mt-2 leading-relaxed">{entry.notes}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Tab.Panel>

                        {/* Tab 2: Data Lineage */}
                        <Tab.Panel>
                          <div className="space-y-3">
                            <p className="text-white/40 text-xs font-mono uppercase tracking-wider">Data Flow Diagram</p>
                            <div className="bg-surface-700 rounded-xl p-4 font-mono text-xs space-y-2">
                              {[
                                { step: 'SOURCE', label: 'Core Banking System (T24)', color: 'text-severity-low' },
                                { arrow: true },
                                { step: 'TRANSFORM', label: 'ETL Pipeline → Feature Store (Databricks)', color: 'text-severity-medium' },
                                { arrow: true },
                                { step: 'MODEL', label: model.name, color: 'text-brand-pink-light' },
                                { arrow: true },
                                { step: 'OUTPUT', label: 'Decision API → Origination System', color: 'text-severity-healthy' },
                                { arrow: true },
                                { step: 'AUDIT', label: 'Model Output Store → Audit Trail (immutable)', color: 'text-severity-grey' },
                              ].map((item, i) =>
                                item.arrow ? (
                                  <div key={i} className="text-white/20 pl-8">↓</div>
                                ) : (
                                  <div key={i} className="flex items-baseline gap-3">
                                    <span className="text-white/30 w-20 flex-shrink-0">[{item.step}]</span>
                                    <span className={item.color}>{item.label}</span>
                                  </div>
                                )
                              )}
                            </div>
                            <p className="text-white/20 text-xs">
                              Mock data lineage — replace with live data catalogue integration (Collibra / Alation)
                            </p>
                          </div>
                        </Tab.Panel>

                        {/* Tab 3: Vendor Details */}
                        <Tab.Panel>
                          {model.vendor ? (
                            <div className="space-y-4">
                              <div className="bg-surface-700 rounded-xl p-4">
                                <h4 className="text-white font-medium text-sm mb-3">{model.vendor}</h4>
                                <div className="grid grid-cols-2 gap-3 text-xs">
                                  <div>
                                    <span className="text-white/30">Category</span>
                                    <p className="text-white mt-0.5">Model Provider / SaaS</p>
                                  </div>
                                  <div>
                                    <span className="text-white/30">DORA Status</span>
                                    <p className="text-severity-healthy mt-0.5">Registered</p>
                                  </div>
                                  <div>
                                    <span className="text-white/30">Data Residency</span>
                                    <p className="text-white mt-0.5">EU (Frankfurt / Dublin)</p>
                                  </div>
                                  <div>
                                    <span className="text-white/30">AUP Compliant</span>
                                    <p className="text-severity-healthy mt-0.5">Yes</p>
                                  </div>
                                </div>
                              </div>
                              <a
                                href="/manage"
                                className="flex items-center gap-1.5 text-xs text-brand-pink-light hover:text-white transition-colors"
                              >
                                <ExternalLink className="w-3 h-3" />
                                View full vendor risk profile
                              </a>
                            </div>
                          ) : (
                            <div className="text-white/40 text-sm py-6 text-center">
                              In-house model — no external vendor
                            </div>
                          )}
                        </Tab.Panel>

                        {/* Tab 4: Change Log */}
                        <Tab.Panel>
                          <div className="space-y-2">
                            {changeLog.map((entry, i) => (
                              <div key={i} className="flex items-start gap-3 py-2 border-b border-surface-600/50">
                                <div className="text-white/20 font-mono text-xs mt-0.5 w-36 flex-shrink-0">
                                  {formatTimestamp(entry.ts)}
                                </div>
                                <div className="flex-1 min-w-0">
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

                  {/* Footer */}
                  <div className="px-6 py-3 border-t border-surface-600 flex-shrink-0">
                    <FreshnessStamp timestamp={model.dataFreshness} status="confirmed" />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
