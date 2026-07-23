import React from 'react';
import { Gauge } from '../../components/ui/Gauge';
import { AlertTriangle } from 'lucide-react';
import { formatDate } from '../../utils/date';

function gaugeColor(pct) {
  if (pct >= 80) return '#22C55E'; // healthy
  if (pct >= 60) return '#EAB308'; // medium/amber
  return '#EF4444'; // critical/red
}

function tiersFromByTier(byTier) {
  if (!byTier) return [];
  return ['High', 'Medium', 'Low']
    .filter((t) => byTier[t])
    .map((t) => ({ tier: t, ...byTier[t] }));
}

export function CoverageGauges({ data, onGaugeClick }) {
  if (!data) return null;

  const { traditionalML, genAI_LLM, overall } = data;

  const nextDue = data.upcomingDue?.length
    ? formatDate([...data.upcomingDue].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))[0].dueDate)
    : null;

  const gauges = [
    {
      key: 'traditionalML',
      label: 'Traditional ML',
      sublabel: `${traditionalML.validated}/${traditionalML.total} models`,
      value: traditionalML.coveragePct,
      color: gaugeColor(traditionalML.coveragePct),
      tooltip: {
        models: traditionalML.total,
        tiers: tiersFromByTier(traditionalML.byTier),
        nextDue,
      },
    },
    {
      key: 'genAI_LLM',
      label: 'GenAI / LLM',
      sublabel: `${genAI_LLM.validated}/${genAI_LLM.total} models`,
      value: genAI_LLM.coveragePct,
      color: '#A100FF', // brand purple for GenAI
      tooltip: {
        models: genAI_LLM.total,
        tiers: [{ tier: 'Validated', validated: genAI_LLM.validated, total: genAI_LLM.total, overdue: genAI_LLM.overdue }],
        nextDue,
      },
    },
    {
      key: 'overall',
      label: 'Overall Coverage',
      sublabel: `${overall.validated}/${overall.total} total`,
      value: overall.coveragePct,
      color: gaugeColor(overall.coveragePct),
      tooltip: {
        models: overall.total,
        tiers: [{ tier: 'Validated', validated: overall.validated, total: overall.total, overdue: overall.overdue }],
        nextDue,
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Gauges */}
      <div className="flex items-start justify-around gap-6">
        {gauges.map((g) => (
          <div key={g.key} className="flex flex-col items-center">
            <Gauge
              value={g.value}
              label={g.label}
              sublabel={g.sublabel}
              color={g.color}
              tooltip={g.tooltip}
              onClick={() => onGaugeClick(g.key)}
            />
          </div>
        ))}
      </div>

      {/* GenAI note banner */}
      <div className="flex items-start gap-2 px-4 py-3 bg-brand-purple/10 border border-brand-purple/30 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-brand-pink flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-brand-pink-light text-xs font-medium">GenAI/LLM Note</p>
          <p className="text-white/60 text-xs mt-0.5">{data.note_genai}</p>
        </div>
      </div>

      {/* Stat boxes */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface-700 rounded-xl p-4 border border-surface-600">
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">Pending Validations</p>
          <p className="text-2xl font-display font-bold text-severity-medium">{overall.pending}</p>
          <p className="text-white/40 text-xs mt-1">Awaiting MRM review</p>
        </div>
        <div className="bg-severity-critical/10 rounded-xl p-4 border border-severity-critical/30">
          <p className="text-white/40 text-xs font-mono uppercase tracking-wider mb-1">Overdue Validations</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-display font-bold text-severity-critical">{overall.overdue}</p>
            <AlertTriangle className="w-4 h-4 text-severity-critical" />
          </div>
          <p className="text-white/40 text-xs mt-1">Past due date — immediate action required</p>
        </div>
      </div>
    </div>
  );
}
