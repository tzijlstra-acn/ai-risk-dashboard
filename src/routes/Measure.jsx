import React from 'react';
import { useInventory } from '../hooks/useInventory';
import { useShadowAI } from '../hooks/useShadowAI';
import { useValidation } from '../hooks/useValidation';
import { useVendors } from '../hooks/useVendors';
import { useAuditLog } from '../hooks/useAuditLog';
import { RegulatoryExposurePanel } from '../panels/RegulatoryExposure';
import { ValidationCoveragePanel } from '../panels/ValidationCoverage';
import { VendorRiskPanel } from '../panels/VendorRisk';
import { RoleGuard } from '../auth/RoleGuard';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { formatDate, formatTimestamp, daysUntil } from '../utils/date';
import {
  Database, AlertTriangle, Clock, Building2, ShieldCheck, ClipboardList,
  TrendingUp, TrendingDown, ArrowUpRight, CheckCircle, Zap,
} from 'lucide-react';

function tierSeverity(tier) {
  return tier === 'High' ? 'Critical' : tier === 'Medium' ? 'Medium' : 'Low';
}

function KPICard({ label, value, sub, icon: Icon, color = 'text-white', loading, trend, accent }) {
  return (
    <div className={`bg-surface-800 border rounded-xl p-4 ${accent || 'border-surface-600'}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-white/40 text-[11px] font-mono uppercase tracking-wider truncate">{label}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <p className={`text-3xl font-display font-bold ${color}`}>{loading ? '—' : value}</p>
            {trend && !loading && (
              <span className={`flex items-center gap-0.5 text-xs font-mono ${trend.dir === 'up' ? 'text-severity-healthy' : trend.dir === 'down' ? 'text-severity-critical' : 'text-white/40'}`}>
                {trend.dir === 'up' ? <TrendingUp className="w-3 h-3" /> : trend.dir === 'down' ? <TrendingDown className="w-3 h-3" /> : null}
                {trend.label}
              </span>
            )}
          </div>
          {sub && <div className="text-white/40 text-[11px] mt-1 leading-snug">{sub}</div>}
        </div>
        <div className={`p-2 rounded-lg bg-white/5 flex-shrink-0`}>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </div>
    </div>
  );
}

function SplitBar({ label, sublabel, pct, color }) {
  const pctColor = pct >= 80 ? 'text-severity-healthy' : pct >= 60 ? 'text-severity-medium' : 'text-severity-critical';
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1">
        <span className="text-white font-medium">{label}</span>
        <span className={`font-mono font-bold ${color === '#A100FF' ? 'text-brand-pink-light' : pctColor}`}>{pct}%</span>
      </div>
      <div className="w-full bg-surface-600 rounded-full h-2 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <p className="text-white/30 text-[11px] mt-1 font-mono">{sublabel}</p>
    </div>
  );
}

export function Measure() {
  const { data: inventory, isLoading: invLoading } = useInventory();
  const { data: shadowAI, isLoading: shadowLoading } = useShadowAI();
  const { data: validation, isLoading: valLoading } = useValidation();
  const { data: vendors, isLoading: venLoading } = useVendors();
  const { data: audit, isLoading: audLoading } = useAuditLog();

  const totalAssets = inventory?.length ?? 0;
  const highTier = inventory?.filter((a) => a.mrm_tier === 'High').length ?? 0;
  const genAICount = inventory?.filter((a) =>
    ['GPT-4', 'Claude 3.7', 'Gemini Ultra', 'Llama 3', 'Mistral Large'].includes(a.foundationModel)
  ).length ?? 0;

  const coverage = validation?.overall?.coveragePct ?? 0;
  const criticalShadow = shadowAI?.filter((i) => i.touchesCustomerData || i.touchesCreditLending).length ?? 0;
  const activeShadow = shadowAI?.filter((i) => i.status === 'Active').length ?? 0;
  const overdue = validation?.overall?.overdue ?? 0;
  const overdueHigh = (validation?.overdueByDays ?? []).filter((o) => o.tier === 'High').length;

  // DORA register gaps — inventory vendors not present in the vendor register
  const registerGaps = React.useMemo(() => {
    if (!inventory || !vendors) return [];
    const registered = new Set(vendors.map((v) => v.name));
    const gaps = new Set();
    inventory.forEach((a) => {
      if (a.vendor && !registered.has(a.vendor)) gaps.add(a.vendor);
    });
    return [...gaps];
  }, [inventory, vendors]);

  const doraNonCompliant = vendors?.filter((v) => v.doraStatus === 'Non-Compliant').length ?? 0;
  const aupIssues = vendors?.filter((v) => !v.acceptableUsePolicyCompliant).length ?? 0;
  const concentration = vendors?.filter((v) => v.singleProviderDependency).length ?? 0;
  const vendorAlerts = vendors?.filter((v) => v.doraStatus === 'Non-Compliant' || !v.acceptableUsePolicyCompliant || v.singleProviderDependency).length ?? 0;

  const topVendors = React.useMemo(() =>
    [...(vendors ?? [])].sort((a, b) => b.riskScore - a.riskScore).slice(0, 5),
  [vendors]);

  const recentAudit = React.useMemo(() =>
    [...(audit ?? [])].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 5),
  [audit]);

  return (
    <div className="space-y-5">
      {/* KPI Row — 6 cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KPICard
          label="Total AI Assets" value={totalAssets}
          sub={<><span className="text-severity-critical font-medium">{highTier}</span> High-tier SR 11-7 · {genAICount} GenAI</>}
          icon={Database} loading={invLoading}
        />
        <KPICard
          label="Validation Coverage" value={`${coverage}%`}
          sub="Overall MRM coverage"
          icon={ShieldCheck} loading={valLoading}
          color={coverage >= 80 ? 'text-severity-healthy' : coverage >= 60 ? 'text-severity-medium' : 'text-severity-critical'}
          trend={{ dir: 'up', label: '3% vs last month' }}
        />
        <KPICard
          label="Critical Shadow AI" value={criticalShadow}
          sub={<><span className="text-severity-high font-medium">{activeShadow}</span> active incidents</>}
          icon={AlertTriangle} loading={shadowLoading}
          color={criticalShadow > 0 ? 'text-severity-critical' : 'text-severity-healthy'}
          accent={criticalShadow > 0 ? 'border-severity-critical/30' : 'border-surface-600'}
        />
        <KPICard
          label="DORA Register Gaps" value={registerGaps.length}
          sub={registerGaps.length ? registerGaps.join(', ') : 'All vendors registered'}
          icon={ClipboardList} loading={venLoading || invLoading}
          color={registerGaps.length > 0 ? 'text-severity-high' : 'text-severity-healthy'}
        />
        <KPICard
          label="Overdue Validations" value={overdue}
          sub={<><span className="text-severity-critical font-medium">{overdueHigh} High-tier</span> past due</>}
          icon={Clock} loading={valLoading}
          color={overdue > 0 ? 'text-severity-critical' : 'text-severity-healthy'}
          accent={overdue > 0 ? 'border-severity-critical/30' : 'border-surface-600'}
        />
        <KPICard
          label="Vendor Risk Alerts" value={vendorAlerts}
          sub={<>{doraNonCompliant} DORA · {aupIssues} AUP · {concentration} concentration</>}
          icon={Building2} loading={venLoading}
          color={vendorAlerts > 0 ? 'text-severity-high' : 'text-severity-healthy'}
        />
      </div>

      {/* Second row — 3 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Validation split */}
        <Card title="Validation Split" subtitle="Coverage by model class">
          <div className="space-y-4">
            <SplitBar
              label="Traditional ML" pct={validation?.traditionalML?.coveragePct ?? 0}
              sublabel={`${validation?.traditionalML?.validated ?? 0}/${validation?.traditionalML?.total ?? 0} validated · ${validation?.traditionalML?.overdue ?? 0} overdue`}
              color="#22C55E"
            />
            <SplitBar
              label="GenAI / LLM" pct={validation?.genAI_LLM?.coveragePct ?? 0}
              sublabel={`${validation?.genAI_LLM?.validated ?? 0}/${validation?.genAI_LLM?.total ?? 0} validated · ${validation?.genAI_LLM?.overdue ?? 0} overdue`}
              color="#A100FF"
            />
            <div className="pt-3 border-t border-surface-600 grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/40 text-[11px] font-mono uppercase">Governance</p>
                <p className="text-xl font-display font-bold text-white">{validation?.overall?.governanceCoverage ?? 0}%</p>
              </div>
              <div>
                <p className="text-white/40 text-[11px] font-mono uppercase">Pending</p>
                <p className="text-xl font-display font-bold text-severity-medium">{validation?.overall?.pending ?? 0}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Top 5 overdue */}
        <Card title="Most Overdue Models" subtitle="Validation past due date">
          <div className="space-y-2">
            {(validation?.overdueByDays ?? []).map((o) => (
              <div key={o.name} className="flex items-center justify-between gap-2 bg-surface-700 rounded-lg px-3 py-2">
                <div className="min-w-0">
                  <p className="text-white text-xs font-medium truncate">{o.name}</p>
                  <Badge severity={tierSeverity(o.tier)} label={o.tier} size="sm" />
                </div>
                <span className={`text-xs font-mono font-bold flex-shrink-0 ${o.days > 90 ? 'text-severity-critical' : 'text-severity-stale'}`}>
                  {o.days}d
                </span>
              </div>
            ))}
            {!valLoading && (validation?.overdueByDays ?? []).length === 0 && (
              <p className="text-white/30 text-xs py-4 text-center">No overdue validations.</p>
            )}
          </div>
        </Card>

        {/* Upcoming due */}
        <Card title="Coming Due" subtitle="Next validations scheduled">
          <div className="space-y-2">
            {(validation?.upcomingDue ?? []).map((u) => {
              const dleft = daysUntil(u.dueDate);
              return (
                <div key={u.name} className="flex items-center justify-between gap-2 bg-surface-700 rounded-lg px-3 py-2">
                  <div className="min-w-0">
                    <p className="text-white text-xs font-medium truncate">{u.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <Badge severity={tierSeverity(u.tier)} label={u.tier} size="sm" />
                      <span className="text-white/40 text-[11px] font-mono">{formatDate(u.dueDate)}</span>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold flex-shrink-0 ${dleft < 14 ? 'text-severity-stale' : 'text-white/50'}`}>
                    {dleft < 0 ? `${Math.abs(dleft)}d late` : `${dleft}d`}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Third row — heat-map + vendor summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RoleGuard permission="canViewRegulatory">
          <RegulatoryExposurePanel />
        </RoleGuard>

        <RoleGuard permission="canViewVendors">
          <Card title="Vendor Risk Summary" subtitle="Top 5 vendors by risk score">
            <div className="space-y-2">
              {topVendors.map((v) => (
                <div key={v.id} className="flex items-center gap-3 bg-surface-700 rounded-lg px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-white text-xs font-medium truncate">{v.name}</p>
                      <span className={`text-xs font-mono font-bold ${v.riskScore >= 70 ? 'text-severity-critical' : v.riskScore >= 50 ? 'text-severity-high' : 'text-severity-medium'}`}>{v.riskScore}</span>
                    </div>
                    <div className="w-full bg-surface-600 rounded-full h-1 overflow-hidden mt-1">
                      <div className={`h-full rounded-full ${v.riskScore >= 70 ? 'bg-severity-critical' : v.riskScore >= 50 ? 'bg-severity-high' : 'bg-severity-medium'}`} style={{ width: `${v.riskScore}%` }} />
                    </div>
                    <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                      <Badge severity={v.doraStatus === 'Registered' ? 'Healthy' : v.doraStatus === 'Pending' ? 'Medium' : 'Critical'} label={`DORA: ${v.doraStatus}`} size="sm" />
                      {!v.acceptableUsePolicyCompliant && <Badge severity="High" label="AUP" size="sm" />}
                      {v.singleProviderDependency && <Badge severity="Stale" label="Concentration" size="sm" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </RoleGuard>
      </div>

      {/* Fourth row — recent audit events */}
      <RoleGuard permission="canViewAudit">
        <Card title="Recent Audit Events" subtitle="Last 5 governance actions">
          <div className="divide-y divide-surface-600/50">
            {recentAudit.map((e) => (
              <div key={e.id} className="flex items-start gap-3 py-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  {e.type === 'incident' ? <Zap className="w-3.5 h-3.5 text-severity-critical" />
                    : e.type === 'approval' ? <CheckCircle className="w-3.5 h-3.5 text-severity-healthy" />
                    : e.type === 'validation' ? <Clock className="w-3.5 h-3.5 text-severity-low" />
                    : <AlertTriangle className="w-3.5 h-3.5 text-severity-medium" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-white text-xs font-medium truncate">{e.event}</p>
                    <span className="text-white/30 text-[11px] font-mono flex-shrink-0">{formatTimestamp(e.timestamp)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-brand-pink-light text-[11px] truncate">{e.model}</span>
                    <span className="text-white/20">·</span>
                    <span className="text-white/40 text-[11px]">{e.actor}</span>
                    <Badge severity={e.status === 'approved' ? 'Healthy' : e.status === 'rejected' ? 'Critical' : e.status === 'pending' ? 'Medium' : 'High'} label={e.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
            {!audLoading && recentAudit.length === 0 && (
              <p className="text-white/30 text-xs py-4 text-center">No recent events.</p>
            )}
          </div>
        </Card>
      </RoleGuard>

      {/* Detailed analysis — full panels */}
      <div className="pt-2">
        <h2 className="text-white/50 font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
          <ArrowUpRight className="w-3.5 h-3.5" /> Detailed Analysis
        </h2>
        <div className="space-y-4">
          <RoleGuard permission="canViewValidation">
            <ValidationCoveragePanel />
          </RoleGuard>
          <RoleGuard permission="canViewVendors">
            <VendorRiskPanel />
          </RoleGuard>
        </div>
      </div>
    </div>
  );
}
