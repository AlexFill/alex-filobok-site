import { buildAgentPrompt } from '@/lib/voice/prompt';

/** The agent's system prompt, generated from the site's content. Public data only. */
export function GET() {
  return new Response(buildAgentPrompt(), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
