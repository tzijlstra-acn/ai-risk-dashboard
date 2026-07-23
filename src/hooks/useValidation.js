import { useQuery } from '@tanstack/react-query';

// TODO: Replace with live MRM validation tracking API endpoint
const VALIDATION_URL = `${import.meta.env.BASE_URL}mock-api/validation.json`;

const fetchWithDelay = (url, ms) =>
  new Promise((resolve) =>
    setTimeout(() => fetch(url).then((r) => r.json()).then(resolve), ms)
  );

/**
 * useValidation — fetches validation coverage statistics.
 * 500ms simulated latency.
 */
export function useValidation() {
  return useQuery({
    queryKey: ['validation'],
    queryFn: () => fetchWithDelay(VALIDATION_URL, 500),
    staleTime: 5 * 60 * 1000,
  });
}
