import type { VercelRequest, VercelResponse } from '@vercel/node';

interface Session {
  lastSeen: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __paanSessions: Map<string, Session> | undefined;
}

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
    sessions.delete(visitorId);
  }

  return res.status(200).json({ ok: true });
}
