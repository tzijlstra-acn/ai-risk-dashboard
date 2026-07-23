import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// TODO: Replace fetch URL with live MRM API endpoint
const INVENTORY_URL = `${import.meta.env.BASE_URL}mock-api/inventory.json`;

const fetchWithDelay = (url, ms) =>
  new Promise((resolve) =>
    setTimeout(() => fetch(url).then((r) => r.json()).then(resolve), ms)
  );

/**
 * useInventory — fetches all AI inventory assets.
 * 600ms simulated latency.
 */
export function useInventory() {
  return useQuery({
    queryKey: ['inventory'],
    queryFn: () => fetchWithDelay(INVENTORY_URL, 600),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * useInventoryById — fetches a single asset by id.
 */
export function useInventoryById(id) {
  const query = useInventory();
  const item = query.data?.find((asset) => asset.id === id) ?? null;
  return { ...query, data: item };
}

/**
 * useUpdateGovernanceStatus — optimistic mutation to update governance status.
 * TODO: Replace with live MRM API PATCH endpoint
 */
export function useUpdateGovernanceStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, governanceStatus }) => {
      // TODO: Replace with real API call
      await new Promise((r) => setTimeout(r, 400));
      return { id, governanceStatus };
    },
    onMutate: async ({ id, governanceStatus }) => {
      await queryClient.cancelQueries({ queryKey: ['inventory'] });
      const previous = queryClient.getQueryData(['inventory']);

      queryClient.setQueryData(['inventory'], (old) =>
        old?.map((asset) =>
          asset.id === id ? { ...asset, governanceStatus } : asset
        )
      );

      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['inventory'], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
    },
  });
}
