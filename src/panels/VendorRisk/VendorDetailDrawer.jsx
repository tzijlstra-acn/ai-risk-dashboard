import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, AlertTriangle } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { FoundationModelBadge } from '../../components/ui/FoundationModelBadge';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { formatDate, isStale } from '../../utils/date';

function doraSeverity(status) {
  switch (status) {
    case 'Registered': return 'Healthy';
    case 'Pending': return 'Medium';
    case 'Non-Compliant': return 'Critical';
    default: return 'Grey';
  }
}

export function VendorDetailDrawer({ vendor, open, onClose }) {
  if (!vendor) return null;

  const contractNearExpiry = vendor.contractEndDate && isStale(vendor.contractEndDate, -90);

  return (
    <Transition show={open} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
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
                <Dialog.Panel className="pointer-events-auto w-[520px] flex flex-col bg-surface-800 border-l border-surface-600 h-full">
                  {/* Header */}
                  <div className="flex items-start justify-between px-6 py-5 border-b border-surface-600 flex-shrink-0">
                    <div>
                      <Dialog.Title className="text-white font-display font-semibold text-base">
                        {vendor.name}
                      </Dialog.Title>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-white/40 text-xs">{vendor.category}</span>
                        <Badge severity={doraSeverity(vendor.doraStatus)} label={`DORA: ${vendor.doraStatus}`} size="sm" />
                      </div>
                    </div>
                    <button onClick={onClose} className="text-white/40 hover:text-white transition-colors p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Risk score */}
                    <div>
                      <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Risk Score</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-surface-600 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              vendor.riskScore >= 70 ? 'bg-severity-critical' :
                              vendor.riskScore >= 50 ? 'bg-severity-high' :
                              vendor.riskScore >= 30 ? 'bg-severity-medium' : 'bg-severity-healthy'
                            }`}
                            style={{ width: `${vendor.riskScore}%` }}
                          />
                        </div>
                        <span className={`text-sm font-bold font-mono ${
                          vendor.riskScore >= 70 ? 'text-severity-critical' :
                          vendor.riskScore >= 50 ? 'text-severity-high' :
                          vendor.riskScore >= 30 ? 'text-severity-medium' : 'text-severity-healthy'
                        }`}>{vendor.riskScore}/100</span>
                      </div>
                      {vendor.singleProviderDependency && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-severity-high">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Single-provider dependency — concentration risk
                        </div>
                      )}
                    </div>

                    {/* Foundation models */}
                    <div>
                      <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Foundation Models Supplied</p>
                      <div className="flex flex-wrap gap-2">
                        {vendor.foundationModelsSupplied.map((m) => (
                          <FoundationModelBadge key={m} model={m} flagged={!vendor.acceptableUsePolicyCompliant} />
                        ))}
                      </div>
                      {!vendor.acceptableUsePolicyCompliant && (
                        <p className="text-severity-critical text-xs mt-2 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Contains model(s) not covered by bank AUP
                        </p>
                      )}
                    </div>

                    {/* AI Services */}
                    <div>
                      <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">AI Services</p>
                      <div className="space-y-2">
                        {vendor.services.map((svc) => (
                          <div key={svc.name} className="flex items-center justify-between bg-surface-700 rounded-lg px-3 py-2">
                            <div>
                              <p className="text-white text-sm">{svc.name}</p>
                              <p className="text-white/40 text-xs">{svc.type}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-white/40 font-mono">Renewal</p>
                              <p className={`text-xs font-mono ${isStale(svc.renewalDate, -90) ? 'text-severity-critical' : 'text-white/70'}`}>
                                {formatDate(svc.renewalDate)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contract end date */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Contract End Date</p>
                        <p className={`text-sm font-mono ${isStale(vendor.contractEndDate, -90) ? 'text-severity-critical font-bold' : 'text-white'}`}>
                          {formatDate(vendor.contractEndDate)}
                          {isStale(vendor.contractEndDate, -90) && ' ⚠'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-1">Last Assessment</p>
                        <FreshnessStamp timestamp={vendor.lastAssessmentDate} status="confirmed" compact />
                      </div>
                    </div>

                    {/* DORA subcontractors */}
                    <div>
                      <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">DORA Subcontractors</p>
                      <ul className="space-y-1">
                        {vendor.doraSubcontractors.map((sub) => (
                          <li key={sub} className="text-white/70 text-sm flex items-center gap-2">
                            <span className="w-1 h-1 rounded-full bg-brand-purple" />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="px-6 py-3 border-t border-surface-600 flex-shrink-0">
                    <FreshnessStamp timestamp={vendor.dataFreshness} status="confirmed" />
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
