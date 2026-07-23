import { useQuery } from '@tanstack/react-query';

// TODO: Replace with live vendor risk management API endpoint
const VENDORS_URL = `${import.meta.env.BASE_URL}mock-api/vendors.json`;

const fetchWithDelay = (url, ms) =>
  new Promise((resolve) =>
    setTimeout(() => fetch(url).then((r) => r.json()).then(resolve), ms)
  );

/**
 * useVendors — fetches vendor risk data.
 * 700ms simulated latency.
 */
export function useVendors() {
  return useQuery({
    queryKey: ['vendors'],
    queryFn: () => fetchWithDelay(VENDORS_URL, 700),
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * useVendorById — fetches a single vendor by id.
 */
export function useVendorById(id) {
  const query = useVendors();
  const item = query.data?.find((vendor) => vendor.id === id) ?? null;
  return { ...query, data: item };
}
