import { describe, expect, it } from 'vitest';
import { chapters } from '@/content/profile';
import { buildAgentPrompt } from './prompt';

describe('buildAgentPrompt', () => {
  const prompt = buildAgentPrompt();

  it('lists every entry id so the highlight tool can target it', () => {
    for (const c of chapters) for (const e of c.entries) expect(prompt).toContain(`[${e.id}]`);
  });

  it('tells the agent to stay grounded and to use the tool', () => {
    expect(prompt).toContain('Never invent facts');
    expect(prompt).toContain('highlight_section');
  });
});
