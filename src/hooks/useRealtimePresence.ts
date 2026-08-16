import { useState, useEffect, useRef } from 'react';

function getOrCreateSessionId(): string {
  try {
    let id = sessionStorage.getItem('paan_dukaan_visitor_id');
    if (!id) {
      id = `v_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
      sessionStorage.setItem('paan_dukaan_visitor_id', id);
    }
    return id;
  } catch {
    return `v_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
  }
}

/**
 * useRealtimePresence
 *
 * Polls /api/presence/count every 10 seconds to get the live visitor count.
 * Works on both local Express dev server (via Vite proxy) and Vercel serverless.
 *
 * SSE was replaced because Vercel serverless functions time out after ~10s,
 * making long-lived EventSource connections unreliable in production.
 */
export function useRealtimePresence() {
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const sessionIdRef = useRef<string>('');

  useEffect(() => {
    sessionIdRef.current = getOrCreateSessionId();
    const sessionId = sessionIdRef.current;
    let isMounted = true;

    // Fetch visitor count and register/refresh this session
    async function fetchCount() {
      try {
        const res = await fetch(
          `/api/presence/count?id=${encodeURIComponent(sessionId)}`,
          { cache: 'no-store' }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (isMounted && typeof data.count === 'number') {
          setVisitorCount(Math.max(1, data.count));
          setIsConnected(true);
        }
      } catch {
        if (isMounted) setIsConnected(false);
      }
    }

    // Initial fetch immediately on mount
    fetchCount();

    // Poll every 10 seconds
    const pollInterval = setInterval(fetchCount, 10_000);

    // Heartbeat ping every 25 seconds to keep session alive on server
    const pingInterval = setInterval(() => {
      fetch('/api/presence/ping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId }),
      }).catch(() => {/* ignore */});
    }, 25_000);

    // Graceful disconnect on tab close via Beacon API
    function handleLeave() {
      const payload = JSON.stringify({ id: sessionId });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/presence/leave',
          new Blob([payload], { type: 'application/json' })
        );
      } else {
        fetch('/api/presence/leave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {/* ignore */});
      }
    }

    window.addEventListener('beforeunload', handleLeave);
    window.addEventListener('pagehide', handleLeave);

    return () => {
      isMounted = false;
      clearInterval(pollInterval);
      clearInterval(pingInterval);
      handleLeave();
      window.removeEventListener('beforeunload', handleLeave);
      window.removeEventListener('pagehide', handleLeave);
    };
  }, []);

  return { visitorCount, isConnected };
}
