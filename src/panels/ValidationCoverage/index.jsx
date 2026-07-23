import React, { useState } from 'react';
import { useValidation } from '../../hooks/useValidation';
import { useInventory } from '../../hooks/useInventory';
import { CoverageGauges } from './CoverageGauges';
import { Card } from '../../components/ui/Card';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../utils/date';

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
