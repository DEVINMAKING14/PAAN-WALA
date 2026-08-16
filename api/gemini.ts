import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * 🔒 SECURE GEMINI API PROXY
 *
 * This is the ONLY place the GEMINI_API_KEY is used.
 * It lives in Vercel environment variables (server-side only).
 * The browser NEVER sees the key — it only sends prompts here and
 * receives back the AI text response.
 *
 * Browser → POST /api/gemini { prompt } → [Server reads key] → Gemini API → Response
 */

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  // Add your Vercel domain here after deploy e.g. 'https://your-app.vercel.app'
];

const MAX_PROMPT_LENGTH = 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS — only allow known origins
  const origin = req.headers.origin || '';
  const isAllowed =
    ALLOWED_ORIGINS.some((o) => origin.startsWith(o)) ||
    process.env.NODE_ENV === 'development';

  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 🔒 Read API key from SERVER environment — never from client
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[gemini] GEMINI_API_KEY not configured in environment');
    return res.status(500).json({ error: 'AI service not configured' });
  }

  const { prompt, model = 'gemini-2.0-flash' } = req.body || {};

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'prompt is required' });
  }

  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(400).json({ error: `prompt too long (max ${MAX_PROMPT_LENGTH} chars)` });
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 512, temperature: 0.7 },
        }),
      }
    );

    if (!geminiRes.ok) {
      const err = await geminiRes.text();
      console.error('[gemini] API error:', geminiRes.status, err);
      return res.status(502).json({ error: 'AI request failed' });
    }

    const data = await geminiRes.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response generated.';

    return res.status(200).json({ text });
  } catch (err) {
    console.error('[gemini] Network error:', err);
    return res.status(503).json({ error: 'AI service unavailable' });
  }
}
