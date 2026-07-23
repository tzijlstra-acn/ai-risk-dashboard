import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { HeatMap } from './HeatMap';
import { Card } from '../../components/ui/Card';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { FOUNDATION_MODELS } from '../../brand';

export function RegulatoryExposurePanel() {
  const { data, isLoading } = useInventory();
  const [modelFilter, setModelFilter] = useState('');

  const dataFreshness = data?.[0]?.dataFreshness;

  return (
    <Card
      title="Regulatory Exposure Heat-Map"
      subtitle="Asset counts per regulation × asset type"
      actions={
        <div className="flex items-center gap-3">
          {dataFreshness && (
            <FreshnessStamp timestamp={dataFreshness} status="confirmed" compact />
          )}
          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="bg-surface-700 border border-surface-500 text-white text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-brand-purple"
          >
            <option value="">All Foundation Models</option>
            {FOUNDATION_MODELS.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      }
    >
      {isLoading ? (
        <div className="animate-pulse space-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-10 bg-surface-700 rounded-lg" />
          ))}
        </div>
      ) : (
        <HeatMap data={data ?? []} modelFilter={modelFilter} />
      )}
    </Card>
  );
}
