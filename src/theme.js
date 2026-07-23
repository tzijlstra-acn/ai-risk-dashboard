// Centralised severity → Tailwind class mappings
export const SEVERITY_CLASSES = {
  Critical: { bg: 'bg-severity-critical/20', text: 'text-severity-critical', border: 'border-severity-critical' },
  High:     { bg: 'bg-severity-high/20',     text: 'text-severity-high',     border: 'border-severity-high' },
  Medium:   { bg: 'bg-severity-medium/20',   text: 'text-severity-medium',   border: 'border-severity-medium' },
  Low:      { bg: 'bg-severity-low/20',      text: 'text-severity-low',      border: 'border-severity-low' },
  Healthy:  { bg: 'bg-severity-healthy/20',  text: 'text-severity-healthy',  border: 'border-severity-healthy' },
  Stale:    { bg: 'bg-severity-stale/20',    text: 'text-severity-stale',    border: 'border-severity-stale' },
  Grey:     { bg: 'bg-severity-grey/20',     text: 'text-severity-grey',     border: 'border-severity-grey' },
};

export const STATUS_COLOR = (status) => {
  if (status === 'confirmed') return 'text-severity-healthy';
  if (status === 'zero-confirmed') return 'text-severity-grey';
  return 'text-severity-stale'; // scan-failed / incomplete → amber, never green
};

export const SR_TIER_CLASSES = {
  High:   'border border-severity-critical text-severity-critical',
  Medium: 'border border-severity-medium text-severity-medium',
  Low:    'border border-severity-low text-severity-low',
};
