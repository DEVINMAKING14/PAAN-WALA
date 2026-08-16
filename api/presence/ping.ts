import type { VercelRequest, VercelResponse } from '@vercel/node';

// Shared session store (same module reference as count.ts in warm instances)
interface Session {
  lastSeen: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __paanSessions: Map<string, Session> | undefined;
}

// Use global to share state across API files in the same serverless instance
if (!global.__paanSessions) {
  global.__paanSessions = new Map<string, Session>();
}
const sessions = global.__paanSessions;

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const visitorId = req.body?.id as string | undefined;

  if (visitorId && sessions.has(visitorId)) {
    const session = sessions.get(visitorId)!;
    session.lastSeen = Date.now();
  }

  return res.status(200).json({ ok: true, count: Math.max(1, sessions.size) });
}
