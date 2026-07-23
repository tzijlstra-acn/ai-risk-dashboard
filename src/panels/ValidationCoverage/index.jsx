import React, { useState } from 'react';
import { useValidation } from '../../hooks/useValidation';
import { useInventory } from '../../hooks/useInventory';
import { CoverageGauges } from './CoverageGauges';
import { Card } from '../../components/ui/Card';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { Badge } from '../../components/ui/Badge';
import { AnimatedBar } from '../../components/ui/AnimatedBar';
import { formatDate, daysUntil } from '../../utils/date';

function tierSeverity(tier) {
  return tier === 'High' ? 'Critical' : tier === 'Medium' ? 'Medium' : 'Low';
}

function OverdueTable({ rows }) {
  const max = Math.max(...rows.map((r) => r.days), 1);
  return (
    <div>
      <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Most Overdue</p>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.name} className="flex items-center gap-2">
            <div className="w-40 flex-shrink-0 flex items-center gap-2 min-w-0">
              <Badge severity={tierSeverity(r.tier)} label={r.tier} size="sm" />
              <span className="text-white text-xs truncate">{r.name}</span>
            </div>
            <div className="flex-1">
              <AnimatedBar
                pct={(r.days / max) * 100}
                height="h-4"
                className="bg-surface-700"
                color={r.days > 90 ? 'rgba(239,68,68,0.6)' : 'rgba(245,158,11,0.6)'}
              />
            </div>
            <span className={`w-14 text-right text-xs font-mono font-bold flex-shrink-0 ${r.days > 90 ? 'text-severity-critical' : 'text-severity-stale'}`}>
              {r.days}d
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComingDueTable({ rows }) {
  return (
    <div>
      <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-2">Coming Due</p>
      <div className="space-y-1.5">
        {rows.map((r) => {
          const dleft = daysUntil(r.dueDate);
          return (
            <div key={r.name} className="flex items-center justify-between gap-2 bg-surface-700 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <Badge severity={tierSeverity(r.tier)} label={r.tier} size="sm" />
                <span className="text-white text-xs truncate">{r.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-white/40 text-[11px] font-mono">{formatDate(r.dueDate)}</span>
                <span className={`text-xs font-mono font-bold ${dleft < 14 ? 'text-severity-stale' : 'text-white/50'}`}>
                  {dleft < 0 ? `${Math.abs(dleft)}d late` : `${dleft}d`}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ValidationCoveragePanel() {
  const { data: validationData, isLoading: valLoading } = useValidation();
  const { data: inventoryData } = useInventory();
  const [activeGauge, setActiveGauge] = useState(null);

  const handleGaugeClick = (key) => {
    setActiveGauge((prev) => (prev === key ? null : key));
  };

  // Filter inventory by gauge selection
  const filteredInventory = React.useMemo(() => {
    if (!inventoryData || !activeGauge) return [];
    const genAIModels = ['GPT-4', 'Claude 3.7', 'Gemini Ultra', 'Llama 3', 'Mistral Large'];
    if (activeGauge === 'genAI_LLM') {
      return inventoryData.filter((a) => genAIModels.includes(a.foundationModel));
    }
    if (activeGauge === 'traditionalML') {
      return inventoryData.filter((a) => !genAIModels.includes(a.foundationModel));
    }
    return inventoryData;
  }, [inventoryData, activeGauge]);

  return (
    <Card
      title="Validation Coverage"
      subtitle="MRM validation status across AI model portfolio"
      actions={
        validationData?.dataFreshness && (
          <FreshnessStamp timestamp={validationData.dataFreshness} status="confirmed" compact />
        )
      }
    >
      {valLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-40 bg-surface-700 rounded-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-20 bg-surface-700 rounded-xl" />
            <div className="h-20 bg-surface-700 rounded-xl" />
          </div>
        </div>
      ) : (
        <>
          <CoverageGauges data={validationData} onGaugeClick={handleGaugeClick} />

          {/* Overdue + Coming Due tables */}
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5 border-t border-surface-600 pt-4">
            {validationData?.overdueByDays?.length > 0 && (
              <OverdueTable rows={validationData.overdueByDays} />
            )}
            {validationData?.upcomingDue?.length > 0 && (
              <ComingDueTable rows={validationData.upcomingDue} />
            )}
          </div>

          {/* Filtered inventory table */}
          {activeGauge && filteredInventory.length > 0 && (
            <div className="mt-4 border-t border-surface-600 pt-4">
              <p className="text-xs font-mono text-white/40 uppercase tracking-wider mb-3">
                {activeGauge === 'genAI_LLM' ? 'GenAI/LLM Models' :
                 activeGauge === 'traditionalML' ? 'Traditional ML Models' : 'All Models'} — {filteredInventory.length} assets
              </p>
              <div className="space-y-2">
                {filteredInventory.map((asset) => (
                  <div key={asset.id} className="flex items-center justify-between text-sm bg-surface-700 rounded-lg px-3 py-2">
                    <span className="text-white font-medium">{asset.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        severity={
                          asset.validationStatus === 'Validated' ? 'Healthy' :
                          asset.validationStatus === 'Overdue' ? 'Critical' :
                          asset.validationStatus === 'Pending' ? 'Medium' : 'Stale'
                        }
                        label={asset.validationStatus}
                        size="sm"
                      />
                      <span className="text-white/40 text-xs font-mono">
                        {asset.lastValidatedDate ? formatDate(asset.lastValidatedDate) : 'Never'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
}
