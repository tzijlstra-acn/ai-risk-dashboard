import React from 'react';
import { Shield, FileText, Link } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { FoundationModelBadge } from '../components/ui/FoundationModelBadge';
import { FEATURE_FLAGS } from '../featureFlags';
import { REGULATIONS, FOUNDATION_MODELS } from '../brand';
import { useInventory } from '../hooks/useInventory';
import { useVendors } from '../hooks/useVendors';
import { RoleGuard } from '../auth/RoleGuard';
import { formatDate } from '../utils/date';

const GENAI_MODELS = ['GPT-4', 'Claude 3.7', 'Gemini Ultra', 'Llama 3', 'Mistral Large'];

const REGULATION_INFO = {
  DORA: {
    full: 'Digital Operational Resilience Act',
    description: 'EU regulation requiring financial entities to manage ICT risks. AI systems classified as critical ICT functions must undergo annual testing and third-party risk assessments.',
    status: 'In Force (Jan 2025)',
    severity: 'Critical',
    lastReviewed: '2025-03-01',
  },
  'SR 11-7': {
    full: 'SR Letter 11-7 — Model Risk Management',
    description: 'Federal Reserve guidance establishing standards for model risk management. All High-tier models require independent validation, challenger models, and documented governance.',
    status: 'Active',
    severity: 'High',
    lastReviewed: '2025-02-20',
  },
  GDPR: {
    full: 'General Data Protection Regulation',
    description: 'EU data protection regulation. AI systems processing personal data must implement data minimisation, purpose limitation, and automated decision-making disclosures (Art. 22).',
    status: 'Active',
    severity: 'High',
    lastReviewed: '2025-02-10',
  },
  GLBA: {
    full: 'Gramm-Leach-Bliley Act',
    description: 'US federal law requiring financial institutions to explain data sharing practices and protect customer information used in AI/ML model training and inference.',
    status: 'Active',
    severity: 'Medium',
    lastReviewed: '2024-12-15',
  },
  'ECOA/Reg B': {
    full: 'Equal Credit Opportunity Act / Regulation B',
    description: 'Prohibits discrimination in credit decisions. AI credit models must produce explainable adverse action reasons and undergo disparate impact testing.',
    status: 'Active',
    severity: 'High',
    lastReviewed: '2025-01-30',
  },
  'PCI-DSS': {
    full: 'Payment Card Industry Data Security Standard',
    description: 'Security standards for payment data. AI models processing cardholder data must operate within PCI-DSS scope with appropriate access controls and audit logging.',
    status: 'v4.0 Active (Mar 2024)',
    severity: 'Medium',
    lastReviewed: '2024-11-25',
  },
};

const MATURITY_LEVELS = [
  { level: 1, name: 'Basic Inventory', description: 'AI asset register created. Manual tracking in spreadsheets.', current: false, delivered: false },
  { level: 2, name: 'Governance Foundation', description: 'MRM policy established. SR 11-7 tier classification applied. Basic validation workflow.', current: false, delivered: false },
  { level: 3, name: 'Integrated Risk Dashboard', description: 'Real-time dashboard: inventory, shadow AI, regulatory heat-map, vendor risk, audit trail. DORA mapping. Foundation model registry.', current: true, delivered: true },
  { level: 4, name: 'Predictive Risk Intelligence', description: 'SIEM/CSPM live feeds. Predictive risk scoring. Continuous bias monitoring. Automated escalations.', current: false, delivered: false },
  { level: 5, name: 'Autonomous Governance', description: 'Hallucination testing pipelines. Board scenario simulators. Self-healing control framework.', current: false, delivered: false },
];

export function Govern() {
  const { data: inventory } = useInventory();
  const { data: vendors } = useVendors();

  // Regulation compliance summary
  const complianceRows = React.useMemo(() => {
    if (!inventory) return [];
    return REGULATIONS.map((reg) => {
      const inScope = inventory.filter((a) => a.regulations?.includes(reg));
      const gaps = inScope.filter(
        (a) => a.validationStatus === 'Overdue' || a.governanceStatus === 'Non-Compliant'
      );
      const status = gaps.length === 0 ? 'Compliant' : gaps.length <= 2 ? 'At Risk' : 'Action Required';
      return {
        reg,
        info: REGULATION_INFO[reg],
        inScope: inScope.length,
        gaps: gaps.length,
        status,
        severity: gaps.length === 0 ? 'Healthy' : gaps.length <= 2 ? 'Medium' : 'Critical',
      };
    });
  }, [inventory]);

  // Foundation model registry — unique models in use with vendor/AUP/concentration detail
  const modelsInUse = React.useMemo(() => {
    if (!inventory) return [];
    const vendorByName = {};
    (vendors ?? []).forEach((v) => { vendorByName[v.name] = v; });

    const modelMap = {};
    inventory.forEach((asset) => {
      if (!modelMap[asset.foundationModel]) {
        modelMap[asset.foundationModel] = {
          model: asset.foundationModel, assets: [], vendors: new Set(),
        };
      }
      modelMap[asset.foundationModel].assets.push(asset.name);
      if (asset.vendor) modelMap[asset.foundationModel].vendors.add(asset.vendor);
    });

    return Object.values(modelMap).map((m) => {
      const vendorRecords = [...m.vendors].map((n) => vendorByName[n]).filter(Boolean);
      const aupCompliant = vendorRecords.length === 0 || vendorRecords.every((v) => v.acceptableUsePolicyCompliant);
      const concentration = vendorRecords.some((v) => v.singleProviderDependency);
      return {
        ...m,
        isGenAI: GENAI_MODELS.includes(m.model),
        aupCompliant,
        concentration,
      };
    }).sort((a, b) => b.assets.length - a.assets.length);
  }, [inventory, vendors]);

  return (
    <div className="space-y-6">
      {/* Client story banner */}
      <a
        href="/ai-risk-dashboard/client-story.html"
        className="flex items-center justify-between bg-gradient-to-r from-brand-black to-brand-violet border border-brand-purple/30 rounded-xl p-4 hover:border-brand-purple/60 transition-colors group"
      >
        <div>
          <p className="text-xs font-mono text-brand-pink uppercase tracking-widest mb-1">Client Story</p>
          <p className="text-white font-display font-semibold">AI Risk Management — Why Your Bank Needs This</p>
          <p className="text-white/50 text-xs mt-1">Regulatory landscape · Accenture framework · Business case · 14-week delivery approach</p>
        </div>
        <FileText className="w-5 h-5 text-brand-purple/60 group-hover:text-brand-purple transition-colors flex-shrink-0 ml-4" />
      </a>

      {/* Regulation compliance summary table */}
      <Card
        title="Regulation Compliance Summary"
        subtitle="Coverage and gaps across the AI asset portfolio, per regulation"
      >
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-700">
                <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Regulation</th>
                <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-4 py-2.5 text-right text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Assets in Scope</th>
                <th className="px-4 py-2.5 text-right text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Gaps</th>
                <th className="px-4 py-2.5 text-right text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Last Reviewed</th>
              </tr>
            </thead>
            <tbody>
              {complianceRows.map((row) => (
                <tr key={row.reg} className="border-b border-surface-600/50 hover:bg-surface-700/40">
                  <td className="px-4 py-3">
                    <span className="text-white font-medium text-sm">{row.reg}</span>
                    <p className="text-white/40 text-[11px]">{row.info.full}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge severity={row.severity} label={row.status} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-right text-white font-mono text-sm">{row.inScope}</td>
                  <td className={`px-4 py-3 text-right font-mono text-sm font-bold ${row.gaps > 0 ? 'text-severity-critical' : 'text-severity-healthy'}`}>{row.gaps}</td>
                  <td className="px-4 py-3 text-right text-white/50 font-mono text-xs">{formatDate(row.info.lastReviewed)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Policy framework */}
      <div>
        <h2 className="text-white font-display font-semibold text-base mb-4 flex items-center gap-2">
          <Shield className="w-4 h-4 text-brand-purple" />
          Regulatory Policy Framework
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REGULATIONS.map((reg) => {
            const info = REGULATION_INFO[reg];
            return (
              <Card key={reg} className="h-full">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-display font-semibold text-sm">{reg}</h3>
                    <p className="text-white/40 text-xs mt-0.5">{info.full}</p>
                  </div>
                  <Badge severity={info.severity} label={info.severity} size="sm" />
                </div>
                <p className="text-white/60 text-xs leading-relaxed">{info.description}</p>
                <div className="mt-3 pt-3 border-t border-surface-600">
                  <span className="text-white/30 text-xs font-mono">{info.status}</span>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* AI Acceptable Use Policy */}
      <RoleGuard permission="canViewGovernance">
        <Card title="AI Acceptable Use Policy (AUP)" subtitle="Bank-wide policy for AI tool usage">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="bg-surface-700 rounded-lg p-3">
              <p className="text-white/40 text-xs font-mono mb-1">Policy Version</p>
              <p className="text-white font-medium">v2.3 — March 2025</p>
            </div>
            <div className="bg-surface-700 rounded-lg p-3">
              <p className="text-white/40 text-xs font-mono mb-1">Approved By</p>
              <p className="text-white font-medium">Board Risk Committee</p>
            </div>
            <div className={`rounded-lg p-3 ${inventory?.some((a) => a.governanceStatus === 'Non-Compliant') ? 'bg-severity-critical/10 border border-severity-critical/30' : 'bg-severity-healthy/10'}`}>
              <p className="text-white/40 text-xs font-mono mb-1">Non-Compliant Assets</p>
              <p className={`font-bold ${inventory?.some((a) => a.governanceStatus === 'Non-Compliant') ? 'text-severity-critical' : 'text-severity-healthy'}`}>
                {inventory?.filter((a) => a.governanceStatus === 'Non-Compliant').length ?? 0}
              </p>
            </div>
          </div>
        </Card>
      </RoleGuard>

      {/* Foundation Model Registry */}
      <Card
        title="Foundation Model Registry"
        subtitle="All LLM/GenAI foundation models in use across the AI asset portfolio"
        actions={<Badge severity="Healthy" label={`${modelsInUse.length} models`} size="sm" />}
      >
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-700">
                <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Foundation Model</th>
                <th className="px-4 py-2.5 text-right text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Assets</th>
                <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">Vendor(s)</th>
                <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">AUP</th>
                <th className="px-4 py-2.5 text-left text-xs font-mono font-medium text-white/40 uppercase tracking-wider">DORA Concentration</th>
              </tr>
            </thead>
            <tbody>
              {modelsInUse.map((m) => (
                <tr key={m.model} className="border-b border-surface-600/50 hover:bg-surface-700/40">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <FoundationModelBadge model={m.model} />
                      {m.isGenAI && <Badge severity="Grey" label="GenAI" size="sm" />}
                    </div>
                    <p className="text-white/30 text-[11px] mt-1 truncate max-w-xs">
                      {m.assets.slice(0, 2).join(', ')}{m.assets.length > 2 ? ` +${m.assets.length - 2} more` : ''}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-right text-white font-mono font-bold">{m.assets.length}</td>
                  <td className="px-4 py-3 text-white/60 text-xs">
                    {m.vendors.size > 0 ? [...m.vendors].join(', ') : 'In-house'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge severity={m.aupCompliant ? 'Healthy' : 'Critical'} label={m.aupCompliant ? 'Compliant' : 'Not covered'} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    {m.concentration ? (
                      <span className="flex items-center gap-1.5 text-severity-high text-xs"><Link className="w-3 h-3" /> Single-provider</span>
                    ) : (
                      <span className="text-white/30 text-xs">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Maturity Model */}
      <Card title="AI Risk Management Maturity Model" subtitle="5-Level framework — Level 3 is current target">
        <div className="space-y-2">
          {MATURITY_LEVELS.map((lvl) => (
            <div
              key={lvl.level}
              className={[
                'flex items-start gap-4 p-4 rounded-xl transition-all',
                lvl.current
                  ? 'bg-brand-purple/10 border border-brand-purple/40'
                  : lvl.delivered
                  ? 'bg-severity-healthy/5 border border-severity-healthy/20'
                  : 'bg-surface-700 border border-surface-600 opacity-60',
              ].join(' ')}
            >
              <div
                className={[
                  'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0',
                  lvl.current
                    ? 'bg-brand-purple text-white'
                    : lvl.delivered
                    ? 'bg-severity-healthy/20 text-severity-healthy'
                    : 'bg-surface-600 text-white/30',
                ].join(' ')}
              >
                {lvl.level}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium text-sm">{lvl.name}</p>
                  {lvl.current && (
                    <Badge severity="Healthy" label="TARGET / DELIVERED" size="sm" />
                  )}
                </div>
                <p className="text-white/50 text-xs mt-1 leading-relaxed">{lvl.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Level 4/5 stubs */}
      {!FEATURE_FLAGS.predictiveRiskScoring && (
        <div className="opacity-40 pointer-events-none border border-dashed border-white/20 rounded-xl p-4">
          <p className="text-white/50 text-sm">Predictive Risk Scoring — Level 4 Feature</p>
          <p className="text-white/30 text-xs mt-1">
            {/* TODO: Level 4 — integrate SIEM/CSPM predictive feed here */}
            Coming in Level 4: Real-time risk scoring using SIEM event streams and CSPM findings
          </p>
        </div>
      )}

      {!FEATURE_FLAGS.boardScenarioSimulator && (
        <div className="opacity-40 pointer-events-none border border-dashed border-white/20 rounded-xl p-4">
          <p className="text-white/50 text-sm">Board Scenario Simulator — Level 5 Feature</p>
          <p className="text-white/30 text-xs mt-1">
            {/* TODO: Level 5 — hallucination pipelines, board scenario simulators */}
            Coming in Level 5: Interactive stress-testing of AI risk posture for board-level presentations
          </p>
        </div>
      )}
    </div>
  );
}
