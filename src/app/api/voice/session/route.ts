import { createLimiter } from '@/lib/voice/rateLimit';

// Keep the API key on the server: the browser only ever receives a short-lived signed URL.
const limiter = createLimiter(8, 60_000);

const json = (body: Record<string, unknown>, status: number) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

export async function GET(request: Request) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  const agentId = process.env.ELEVENLABS_AGENT_ID;
  if (!apiKey || !agentId) return json({ error: 'unavailable' }, 503);

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (!limiter.hit(ip)) return json({ error: 'rate-limited' }, 429);

  try {
    const res = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/get-signed-url?agent_id=${encodeURIComponent(agentId)}`,
      { headers: { 'xi-api-key': apiKey }, cache: 'no-store' },
    );
    if (!res.ok) return json({ error: 'upstream' }, 502);
    const data: unknown = await res.json();
    const signedUrl = typeof data === 'object' && data !== null && 'signed_url' in data ? data.signed_url : null;
    if (typeof signedUrl !== 'string') return json({ error: 'upstream' }, 502);
    return json({ signedUrl }, 200);
  } catch {
    return json({ error: 'upstream' }, 502);
  }
}
