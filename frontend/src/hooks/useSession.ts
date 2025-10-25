import { useMutation } from '@tanstack/react-query';
import { useSession } from '@/contexts/SessionContext';

export function useCreateSession() {
  const { setSessionId } = useSession();

  return useMutation({
    mutationFn: async () => {
      // Call Next.js API route which proxies to backend
      const response = await fetch('/api/session/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create session');
      }

      const result = await response.json();
      return result.data.sessionId;
    },
    onSuccess: (sessionId) => {
      // Update session context (which also updates localStorage and sessionStorage for isLoggedIn)
      setSessionId(sessionId);
    },
  });
}
