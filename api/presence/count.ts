import type { VercelRequest, VercelResponse } from '@vercel/node';

// Module-level in-memory store (shared across warm serverless instances)
interface Session {
  lastSeen: number;
}

const sessions = new Map<string, Session>();
const SESSION_TIMEOUT_MS = 45_000; // 45 seconds

function pruneStale(): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.lastSeen > SESSION_TIMEOUT_MS) {
      sessions.delete(id);
    }
  }
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for same-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  pruneStale();

  // Register or refresh this visitor session
  const visitorId =
    (req.query.id as string) ||
    `v_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;

  sessions.set(visitorId, { lastSeen: Date.now() });

  const count = Math.max(1, sessions.size);

  return res.status(200).json({ count, id: visitorId, timestamp: Date.now() });
}
