import React, { useState } from 'react';
import { useShadowAI } from '../../hooks/useShadowAI';
import { ShadowAITable } from './ShadowAITable';
import { ShadowAIModal } from './ShadowAIModal';
import { Card } from '../../components/ui/Card';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { AlertTriangle, Eye, Shield } from 'lucide-react';

export function ShadowAIPanel() {
  const { data, isLoading } = useShadowAI();
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleCriticalClick = (incident) => {
    setSelectedIncident(incident);
    setModalOpen(true);
  };

  const criticalCount = data?.filter((i) => i.touchesCustomerData || i.touchesCreditLending).length ?? 0;
  const underInvestigation = data?.filter((i) => i.status === 'Under Investigation').length ?? 0;
  const activeCount = data?.filter((i) => i.status === 'Active').length ?? 0;
  const dataFreshness = data?.[0]?.dataFreshness;

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Total Detected', value: data?.length ?? 0, icon: Eye, color: 'text-white' },
          { label: 'Critical', value: criticalCount, icon: AlertTriangle, color: 'text-severity-critical' },
          { label: 'Active', value: activeCount, icon: AlertTriangle, color: 'text-severity-high' },
          { label: 'Under Investigation', value: underInvestigation, icon: Shield, color: 'text-severity-stale' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-surface-800 border border-surface-600 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`w-3.5 h-3.5 ${color}`} />
              <span className="text-white/40 text-xs font-mono">{label}</span>
            </div>
            <div className={`text-2xl font-display font-bold ${color}`}>{isLoading ? '—' : value}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <Card
        title="Shadow AI Incidents"
        subtitle="Click Critical rows to view details"
        actions={
          dataFreshness && (
            <FreshnessStamp timestamp={dataFreshness} status="confirmed" compact />
          )
        }
      >
        {isLoading ? (
          <div className="animate-pulse space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 bg-surface-700 rounded-lg" />
            ))}
          </div>
        ) : (
          <ShadowAITable data={data ?? []} onCriticalClick={handleCriticalClick} />
        )}
      </Card>

      <ShadowAIModal
        incident={selectedIncident}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
