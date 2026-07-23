import React, { useState } from 'react';
import { useInventory } from '../../hooks/useInventory';
import { ReconciliationWidget } from './ReconciliationWidget';
import { InventoryGrid } from './InventoryGrid';
import { ModelDetailDrawer } from './ModelDetailDrawer';
import { AdvancedFilters } from '../../components/ui/AdvancedFilters';
import { FreshnessStamp } from '../../components/ui/FreshnessStamp';
import { Card } from '../../components/ui/Card';

export function ModelInventoryPanel({ searchTerm = '' }) {
  const { data, isLoading } = useInventory();
  const [selectedModel, setSelectedModel] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [filters, setFilters] = useState({});

  const handleRowClick = (row) => {
    setSelectedModel(row);
    setShowDrawer(true);
  };

  const dataFreshness = data?.[0]?.dataFreshness;

  return (
    <div className="space-y-4">
      {/* Reconciliation widget */}
      <ReconciliationWidget totalInDashboard={data?.length ?? 0} />

      {/* Inventory section */}
      <Card
        title="AI Model Inventory"
        subtitle={`${data?.length ?? 0} assets registered`}
        actions={
          dataFreshness && (
            <FreshnessStamp timestamp={dataFreshness} status="confirmed" compact />
          )
        }
      >
        <div className="space-y-3">
          <AdvancedFilters filters={filters} onChange={setFilters} />
          <InventoryGrid
            data={data}
            loading={isLoading}
            selectedId={selectedModel?.id}
            onRowClick={handleRowClick}
            searchTerm={searchTerm}
            filters={filters}
          />
        </div>
      </Card>

      {/* Detail drawer */}
      <ModelDetailDrawer
        model={selectedModel}
        open={showDrawer}
        onClose={() => setShowDrawer(false)}
      />
    </div>
  );
}
