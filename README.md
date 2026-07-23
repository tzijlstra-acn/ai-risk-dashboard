# AI Risk Dashboard — Accenture NFR Practice

**Level 3 Baseline | NIST AI RMF Aligned | Dark Theme**

A production-ready React dashboard for managing AI model risk in a large European bank. Built by the Accenture Non-Financial Risk (NFR) Practice.

---

## Project Overview

The AI Risk Dashboard provides a unified control plane for:

- **AI Model Inventory** — 360° view of all AI assets with SR 11-7 tier classification
- **Shadow AI Detection** — Incidents of unsanctioned AI use with customer data exposure flags
- **Regulatory Heat-Map** — Coverage across DORA, SR 11-7, GDPR, GLBA, ECOA/Reg B, PCI-DSS
- **Vendor Risk Management** — DORA-aligned third-party AI risk with concentration flags
- **Validation Coverage** — Gauges for Traditional ML and GenAI/LLM coverage rates
- **Immutable Audit Trail** — 48-hour rule enforcement for pending approvals

The dashboard follows the **NIST AI Risk Management Framework** (NIST AI RMF 1.0) top-level phases as its primary navigation:

| Phase | Tab | Content |
|-------|-----|---------|
| Govern | `/govern` | Policies, AUP, Foundation Model Registry, Maturity Model |
| Map | `/map` | Model Inventory + Shadow AI Detection |
| Measure | `/measure` | Validation Coverage + Regulatory Exposure + Vendor Risk |
| Manage | `/manage` | Audit Trail + Pending Approvals |

---

## Quick Start

```bash
git clone https://github.com/YOUR_ORG/ai-risk-dashboard.git
cd ai-risk-dashboard
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) — lands on `/measure` (CRO cockpit).

---

## GitHub Setup Commands

```bash
# Option A — Create repo from scratch:
git init
git add .
git commit -m "feat: initial AI Risk Dashboard — Level 3 baseline"
gh repo create ai-risk-dashboard --public --source=. --remote=origin --push

# Option B — Clone first, then push:
gh repo create ai-risk-dashboard --public --clone
cd ai-risk-dashboard
# copy files in, then:
git add .
git commit -m "feat: initial AI Risk Dashboard — Level 3 baseline"
git push -u origin main
```

---

## AI Risk Management Maturity Model

| Level | Name | Features | Status |
|-------|------|----------|--------|
| 1 | Basic Inventory | AI asset register, manual spreadsheet tracking | Complete |
| 2 | Governance Foundation | MRM policy, SR 11-7 tier classification, basic validation workflow | Complete |
| **3** | **Integrated Risk Dashboard** | **Real-time dashboard: inventory, shadow AI, regulatory heat-map, vendor risk, audit trail, DORA mapping, foundation model registry** | **TARGET / DELIVERED** |
| 4 | Predictive Risk Intelligence | SIEM/CSPM live feeds, predictive risk scoring, continuous bias monitoring, automated escalations | Roadmap |
| 5 | Autonomous Governance | Hallucination testing pipelines, board scenario simulators, self-healing control framework | Roadmap |

---

## Roadmap to Level 4/5

### Level 4 — Enable these feature flags in `src/featureFlags.js`:

```js
predictiveRiskScoring: true,   // SIEM/CSPM predictive feed → src/routes/Manage.jsx TODO block
siemLiveFeed: true,            // Splunk/Sentinel integration → src/panels/AuditTrail/
continuousBiasMonitoring: true, // ECOA/Reg B disparate impact → src/panels/ValidationCoverage/
```

Integrations needed:
- Splunk / Microsoft Sentinel API for real-time AI threat events
- Model monitoring platform (Fiddler AI, Evidently, Arize) for drift/bias feeds
- Replace `fetchWithDelay` in each hook with live API calls

### Level 5 — Enable these flags:

```js
hallucinationTestingPipeline: true, // src/routes/Govern.jsx TODO block
boardScenarioSimulator: true,       // New route: /scenario-simulator
```

---

## Architecture

```
src/
├── auth/
│   ├── AuthContext.jsx       — Mock auth context with 3 roles; localStorage persistence
│   └── RoleGuard.jsx         — Permission-gated component wrapper
├── components/
│   ├── layout/
│   │   ├── AppShell.jsx      — Full-height dark layout (sidebar + topbar)
│   │   ├── Sidebar.jsx       — NIST nav + role switcher
│   │   ├── TopBar.jsx        — Route title + global search + freshness indicator
│   │   ├── BrandLogo.jsx     — Accenture chevron + text
│   │   └── BrandIcon.jsx     — Chevron SVG (purple-to-pink gradient)
│   └── ui/
│       ├── Badge.jsx         — Severity pill with dot (filled)
│       ├── SRTierBadge.jsx   — SR 11-7 tier pill (outlined, visually distinct)
│       ├── FoundationModelBadge.jsx — Monospace model name pill
│       ├── Card.jsx          — Dark surface card
│       ├── DataGrid.jsx      — Sortable table with search highlighting
│       ├── Gauge.jsx         — recharts RadialBarChart gauge
│       ├── Modal.jsx         — Headless UI dialog
│       ├── SearchBar.jsx     — Cmd+K shortcut global search input
│       ├── AdvancedFilters.jsx — Collapsible multi-select filter panel
│       └── FreshnessStamp.jsx — Data-as-of timestamp with status-coded dot
├── panels/
│   ├── ModelInventory/       — Asset grid, reconciliation widget, detail drawer
│   ├── ShadowAI/             — Incident table, critical-item modal
│   ├── RegulatoryExposure/   — CSS grid heat-map, clickable cells
│   ├── VendorRisk/           — Vendor cards, detail drawer
│   ├── ValidationCoverage/   — 3 gauges + filtered inventory list
│   └── AuditTrail/           — Immutable log, approve/reject actions
├── routes/
│   ├── Govern.jsx            — Policies, AUP, Foundation Model Registry, Maturity Model
│   ├── Map.jsx               — Model Inventory + Shadow AI
│   ├── Measure.jsx           — Default landing: KPI row + all measure panels
│   ├── Manage.jsx            — Audit Trail + SIEM stub
│   └── ModelDetail.jsx       — Full-page asset detail with 4 tabs
├── hooks/
│   ├── useInventory.js       — Inventory CRUD (TanStack Query)
│   ├── useShadowAI.js        — Shadow AI with Critical enforcement rule
│   ├── useVendors.js         — Vendor risk data
│   ├── useValidation.js      — Coverage statistics
│   ├── useAuditLog.js        — Audit log + approve/reject mutations
│   └── useGlobalSearch.js    — Client-side search filter
└── utils/
    ├── encode.js             — escapeHtml() for XSS protection (OWASP A03)
    └── date.js               — formatDate, daysAgo, isStale, formatTimestamp
```

---

## Role-Based Access

| Permission | CRO | MRM Validator | SOC Analyst |
|-----------|-----|---------------|-------------|
| View Model Inventory | Yes | Yes | No |
| View Validation Details | Yes | Yes | No |
| View Audit Trail | Yes | Yes | No |
| View Governance (read) | Yes | Yes | No |
| Write Governance | Yes | No | No |
| Approve / Reject Changes | Yes | No | No |
| View Shadow AI | Yes | No | Yes |
| View Regulatory Exposure | Yes | Yes | Yes |
| View Vendor Risk | Yes | Yes | Yes |

Switch roles using the **Active Role** selector in the sidebar (persisted via localStorage).

---

## Security Checklist

- [x] **CSP header**: `default-src 'self'` implemented in `vite.config.js` server headers and `index.html` meta tag
- [x] **Output encoding**: `escapeHtml()` in `src/utils/encode.js`; React JSX auto-escaping for all dynamic data
- [x] **No secrets client-side**: All API keys belong server-side only; mock data served as static JSON
- [x] **RBAC**: `AuthContext` + `RoleGuard` components enforce role permissions on every protected section
- [x] **No dangerouslySetInnerHTML** without `escapeHtml()` wrapping (none used in this codebase)
- [x] **No PII in localStorage**: Only `ai_dashboard_role` string stored (not user data)

---

## Design System / ICS Alignment

**Brand palette:**

| Token | Hex | Usage |
|-------|-----|-------|
| `brand.purple` | `#A100FF` | Primary accent, active nav, CTA |
| `brand.violet` | `#3D0066` | Sidebar gradient deep |
| `brand.black` | `#160029` | Sidebar gradient top |
| `brand.pink` | `#FF50C8` | Accent highlights |
| `brand.pink-light` | `#FF8DE0` | Text on purple backgrounds |
| `surface.900` | `#0D0D18` | Page background |
| `surface.800` | `#12121F` | Card background |
| `surface.700` | `#1A1A2E` | Row hover, table headers |
| `surface.600` | `#22223A` | Borders |
| `surface.500` | `#2E2E50` | Active borders |

**Font stack:** Space Grotesk (display) / Inter (body) / JetBrains Mono (mono labels)

**Severity palette:**

| Token | Color | When to use |
|-------|-------|-------------|
| `severity.critical` | `#EF4444` | Immediate action required |
| `severity.high` | `#F97316` | Elevated risk |
| `severity.medium` | `#EAB308` | Watch / monitor |
| `severity.low` | `#3B82F6` | Low risk |
| `severity.healthy` | `#22C55E` | Compliant / validated |
| `severity.stale` | `#F59E0B` | Overdue / stale / scan-incomplete |
| `severity.grey` | `#6B7280` | Not applicable / unknown |

---

## Mock API → Live Integration

Replace each mock endpoint in the hooks:

| File | Mock URL | Live API |
|------|----------|---------|
| `useInventory.js` | `/mock-api/inventory.json` | MRM system REST API (e.g. Moody's MRC, Numerix) |
| `useShadowAI.js` | `/mock-api/shadowAI.json` | CASB API (Netskope, Microsoft Defender for Cloud Apps) |
| `useVendors.js` | `/mock-api/vendors.json` | TPRM platform API (Prevalent, OneTrust) |
| `useValidation.js` | `/mock-api/validation.json` | MRM validation tracking API |
| `useAuditLog.js` | `/mock-api/auditLog.json` | GRC platform API (Archer, ServiceNow GRC) |

Pattern — replace `fetchWithDelay` with authenticated fetch:

```js
// Before (mock):
queryFn: () => fetchWithDelay('/mock-api/inventory.json', 600)

// After (live):
queryFn: async () => {
  const res = await fetch(`${import.meta.env.VITE_API_BASE}/api/v1/models`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error('API error');
  return res.json();
}
```

---

## Foundation Model Registry

| Model | Provider | AUP Notes |
|-------|----------|-----------|
| GPT-4 | OpenAI | Covered by bank AUP. Enterprise data processing agreement in place. |
| Claude 3.7 | Anthropic | Covered by bank AUP. EU data residency via AWS Bedrock Frankfurt. |
| Gemini Ultra | Google DeepMind | **AUP issue flagged** — Legal review of updated data processing terms in progress. |
| Llama 3 | Meta AI | Self-hosted on Azure — no third-party data residency risk. AUP compliant. |
| Mistral Large | Mistral AI | Covered via Behavox contract. **Behavox DORA non-compliant** — see vendor risk. |
| Proprietary in-house | Internal | No third-party exposure. Governed by internal MRM framework. |
| Fine-tuned BERT | Various | Task-specific fine-tuned variants. Governed per hosting arrangement. |
| Other | Various | Case-by-case assessment required. |

---

## Development Notes

- All mock latency is intentional (simulates real API response times)
- The `_rowClassName` field on data rows enables custom CSS row classes in DataGrid
- `FreshnessStamp` never shows green for `scan-failed` status — amber is the minimum
- `SRTierBadge` is deliberately styled differently from `Badge` (outlined vs. filled)
- The 48-hour rule in `AuditEventRow` checks `event.pendingHours > 48` — this value should come from the live audit API

---

*Built by Accenture NFR Practice — AI Risk Dashboard v1.0.0 Level 3*
