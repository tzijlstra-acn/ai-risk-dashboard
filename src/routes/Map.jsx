import React from 'react';
import { ModelInventoryPanel } from '../panels/ModelInventory';
import { ShadowAIPanel } from '../panels/ShadowAI';
import { RoleGuard } from '../auth/RoleGuard';

export function Map({ searchTerm = '' }) {
  return (
    <div className="space-y-8">
      {/* Model Inventory */}
      <RoleGuard permission="canViewInventory">
        <section>
          <h2 className="text-white font-display font-semibold text-base mb-4">
            AI Model Inventory
          </h2>
          <ModelInventoryPanel searchTerm={searchTerm} />
        </section>
      </RoleGuard>

      {/* Shadow AI */}
      <RoleGuard permission="canViewShadowAI">
        <section>
          <h2 className="text-white font-display font-semibold text-base mb-4">
            Shadow AI Detection
          </h2>
          <ShadowAIPanel />
        </section>
      </RoleGuard>
    </div>
  );
}
