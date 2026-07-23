import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// TODO: Replace with live audit system API (Archer, ServiceNow, etc.)
const AUDIT_LOG_URL = `${import.meta.env.BASE_URL}mock-api/auditLog.json`;

const fetchWithDelay = (url, ms) =>
  new Promise((resolve) =>
    setTimeout(() => fetch(url).then((r) => r.json()).then(resolve), ms)
  );

/**
 * useAuditLog — fetches audit trail events.
 * 400ms simulated latency.
 */
export function useAuditLog() {
  return useQuery({
    queryKey: ['auditLog'],
    queryFn: () => fetchWithDelay(AUDIT_LOG_URL, 400),
    staleTime: 2 * 60 * 1000, // 2 minutes — audit data should be fresher
  });
}

function makeStatusMutation(newStatus) {
  return function useStatusMutation() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (id) => {
        // TODO: Replace with real API call to Archer/ServiceNow
        await new Promise((r) => setTimeout(r, 300));
        return { id, status: newStatus };
      },
      onMutate: async (id) => {
        await queryClient.cancelQueries({ queryKey: ['auditLog'] });
        const previous = queryClient.getQueryData(['auditLog']);

        queryClient.setQueryData(['auditLog'], (old) =>
          old?.map((event) =>
            event.id === id
              ? { ...event, status: newStatus, pendingHours: undefined }
              : event
          )
        );

        return { previous };
      },
      onError: (_err, _vars, context) => {
        if (context?.previous) {
          queryClient.setQueryData(['auditLog'], context.previous);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['auditLog'] });
      },
    });
  };
}

/**
 * useApproveChange — optimistic mutation to approve a pending audit event.
 * CRO only (enforced by RoleGuard in UI).
 */
export const useApproveChange = makeStatusMutation('approved');

/**
 * useRejectChange — optimistic mutation to reject a pending audit event.
 * CRO only (enforced by RoleGuard in UI).
 */
export const useRejectChange = makeStatusMutation('rejected');
