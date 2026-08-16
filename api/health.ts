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

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(200).json({
    status: 'ok',
    activeVisitors: Math.max(1, sessions.size),
    timestamp: new Date().toISOString(),
  });
}
