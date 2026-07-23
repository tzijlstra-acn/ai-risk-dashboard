import React, { useState } from 'react';
import { ModelInventoryPanel } from '../panels/ModelInventory';
import { ShadowAIPanel } from '../panels/ShadowAI';
import { RoleGuard } from '../auth/RoleGuard';
import { useInventory } from '../hooks/useInventory';
import { useShadowAI } from '../hooks/useShadowAI';
import { Database, EyeOff } from 'lucide-react';

const GENAI_MODELS = ['GPT-4', 'Claude 3.7', 'Gemini Ultra', 'Llama 3', 'Mistral Large'];

function StripStat({ value, label, color = 'text-white' }) {
  return (
    <div className="flex items-baseline gap-1.5">
      <span className={`font-display font-bold text-lg ${color}`}>{value}</span>
      <span className="text-white/40 text-xs">{label}</span>
    </div>
  );
}

export function Map({ searchTerm = '' }) {
  const [tab, setTab] = useState('inventory');
  const { data: inventory } = useInventory();
  const { data: shadowAI } = useShadowAI();

  const total = inventory?.length ?? 0;
  const overdue = inventory?.filter((a) => a.validationStatus === 'Overdue').length ?? 0;
  const highPending = inventory?.filter((a) => a.mrm_tier === 'High' && ['Pending', 'In Progress', 'Overdue'].includes(a.validationStatus)).length ?? 0;
  const genAI = inventory?.filter((a) => GENAI_MODELS.includes(a.foundationModel)).length ?? 0;
  const shadowCount = shadowAI?.length ?? 0;
  const shadowCritical = shadowAI?.filter((i) => i.touchesCustomerData || i.touchesCreditLending).length ?? 0;

  return (
    <div className="space-y-4">
      {/* Summary strip */}
      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 bg-surface-800 border border-surface-600 rounded-xl px-5 py-3">
        <StripStat value={total} label="assets" />
        <span className="text-white/15">·</span>
        <StripStat value={overdue} label="overdue" color={overdue > 0 ? 'text-severity-critical' : 'text-severity-healthy'} />
        <span className="text-white/15">·</span>
        <StripStat value={highPending} label="High-tier pending" color={highPending > 0 ? 'text-severity-high' : 'text-severity-healthy'} />
        <span className="text-white/15">·</span>
        <StripStat value={genAI} label="GenAI/LLM" color="text-brand-pink-light" />
        <span className="text-white/15">·</span>
        <StripStat value={shadowCritical} label="critical shadow AI" color={shadowCritical > 0 ? 'text-severity-critical' : 'text-severity-healthy'} />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-surface-600">
        <RoleGuard permission="canViewInventory">
          <button
            onClick={() => setTab('inventory')}
            className={[
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === 'inventory' ? 'border-brand-purple text-white' : 'border-transparent text-white/40 hover:text-white/70',
            ].join(' ')}
          >
            <Database className="w-4 h-4" /> AI Inventory
            <span className="text-xs font-mono bg-surface-600 text-white/60 rounded px-1.5 py-0.5">{total}</span>
          </button>
        </RoleGuard>
        <RoleGuard permission="canViewShadowAI">
          <button
            onClick={() => setTab('shadow')}
            className={[
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
              tab === 'shadow' ? 'border-brand-purple text-white' : 'border-transparent text-white/40 hover:text-white/70',
            ].join(' ')}
          >
            <EyeOff className="w-4 h-4" /> Shadow AI
            <span className={`text-xs font-mono rounded px-1.5 py-0.5 ${shadowCritical > 0 ? 'bg-severity-critical/20 text-severity-critical' : 'bg-surface-600 text-white/60'}`}>{shadowCount}</span>
          </button>
        </RoleGuard>
      </div>

      {/* Tab content */}
      {tab === 'inventory' && (
        <RoleGuard permission="canViewInventory">
          <ModelInventoryPanel searchTerm={searchTerm} />
        </RoleGuard>
      )}
      {tab === 'shadow' && (
        <RoleGuard permission="canViewShadowAI">
          <ShadowAIPanel />
        </RoleGuard>
      )}
    </div>
  );
}
