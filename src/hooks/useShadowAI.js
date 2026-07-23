import { useQuery } from '@tanstack/react-query';

// TODO: Replace with live CASB/SIEM API endpoint
const SHADOW_AI_URL = `${import.meta.env.BASE_URL}mock-api/shadowAI.json`;

const fetchWithDelay = (url, ms) =>
  new Promise((resolve) =>
    setTimeout(() => fetch(url).then((r) => r.json()).then(resolve), ms)
  );

/**
 * useShadowAI — fetches shadow AI incidents.
 * 800ms simulated latency.
 * Rule: any item touching customer data OR credit/lending is forced to Critical severity.
 */
export function useShadowAI() {
  return useQuery({
    queryKey: ['shadowAI'],
    queryFn: async () => {
      const data = await fetchWithDelay(SHADOW_AI_URL, 800);
      // Enforce Critical severity rule regardless of stored value
      return data.map((item) =>
        item.touchesCustomerData || item.touchesCreditLending
          ? { ...item, severity: 'Critical' }
          : item
      );
    },
    staleTime: 5 * 60 * 1000,
  });
}
