import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

interface ConnectedClient {
  id: string;
  res: express.Response;
  lastSeen: number;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Active Anonymous Visitor Presence Registry
const activeClients = new Map<string, ConnectedClient>();

// Broadcast active count to all currently connected clients in real-time
function broadcastPresence() {
  const count = Math.max(1, activeClients.size);
  const payload = `data: ${JSON.stringify({ count, timestamp: Date.now() })}\n\n`;

  for (const [id, client] of activeClients.entries()) {
    try {
      client.res.write(payload);
    } catch (err) {
      activeClients.delete(id);
    }
  }
}

// 1. SSE Real-Time Visitor Presence Stream
app.get('/api/presence/stream', (req, res) => {
  const visitorId = (req.query.id as string) || `visitor_${Math.random().toString(36).substring(2, 9)}_${Date.now()}`;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable proxy buffering
  res.flushHeaders();

  // Register client
  activeClients.set(visitorId, {
    id: visitorId,
    res,
    lastSeen: Date.now(),
  });

  // Broadcast updated count immediately
  broadcastPresence();

  // Keep-alive heartbeat interval
  const keepAlive = setInterval(() => {
    try {
      res.write(': keepalive\n\n');
    } catch (e) {
      clearInterval(keepAlive);
    }
  }, 15000);

  // Handle client disconnect (tab closed, navigated away, connection dropped)
  req.on('close', () => {
    clearInterval(keepAlive);
    if (activeClients.has(visitorId)) {
      activeClients.delete(visitorId);
      broadcastPresence();
    }
  });
});

// 2. Heartbeat Ping Endpoint
app.post('/api/presence/ping', (req, res) => {
  const visitorId = req.body?.id as string;
  if (visitorId && activeClients.has(visitorId)) {
    const client = activeClients.get(visitorId)!;
    client.lastSeen = Date.now();
  }
  res.json({ ok: true, count: Math.max(1, activeClients.size) });
});

// 3. Graceful Beacon Disconnect (e.g. navigator.sendBeacon on tab close)
app.post('/api/presence/leave', (req, res) => {
  const visitorId = req.body?.id as string;
  if (visitorId && activeClients.has(visitorId)) {
    activeClients.delete(visitorId);
    broadcastPresence();
  }
  res.json({ ok: true });
});

// 4. Instant Count Snapshot Endpoint
app.get('/api/presence/count', (req, res) => {
  res.json({ count: Math.max(1, activeClients.size) });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', activeVisitors: Math.max(1, activeClients.size) });
});

// Stale connection cleanup reaper (every 30 seconds)
setInterval(() => {
  const now = Date.now();
  let changed = false;
  for (const [id, client] of activeClients.entries()) {
    // If no activity or connection broken for > 45s
    if (now - client.lastSeen > 45000) {
      activeClients.delete(id);
      changed = true;
    }
  }
  if (changed) {
    broadcastPresence();
  }
}, 30000);

// Vite middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Paan shop server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
