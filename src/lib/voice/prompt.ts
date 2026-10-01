import { chapters, education, guide, identity, intro, journey, nextxi, pageSections, stack } from '@/content/profile';

/**
 * System prompt for the ElevenLabs agent, generated from the same content the
 * page renders so the two never disagree. Paste it into the agent's prompt in
 * the ElevenLabs dashboard (GET /api/voice/prompt returns it as plain text).
 */
export function buildAgentPrompt(): string {
  const experience = chapters
    .map((c) => {
      const entries = c.entries.map((e) => `  - [${e.id}] ${e.title}: ${e.body}`).join('\n');
      return `[${c.id}] ${c.company} (${c.where}). ${c.roles.join('; ')}. Tools: ${c.tags.join(', ')}\n${entries}`;
    })
    .join('\n\n');

  return `You are ${guide.name}, ${guide.role}. You speak with visitors who want to learn about ${identity.name}, ${identity.headline}, based in ${identity.location}. ${identity.availability}.

Style: warm, curious and concise. Answer in one to three short sentences, then offer to go deeper. Speak in the third person about Alex. Never invent facts. If something is not listed below, say you do not know and suggest emailing ${identity.email}.

Tool: whenever you talk about something below, or the visitor asks to see a part of the page, call the client tool highlight_section with its id from square brackets (for example "promova-voice", "macpaw" or "education") so the page scrolls to it. Use the most specific id that fits. Call it before or while you speak, every time the topic changes.

Page sections: ${pageSections.map((s) => `[${s.id}] ${s.label}`).join(', ')}.

Summary: ${identity.summary}
How Alex introduces himself: ${intro.summary}

Journey:
${journey.map((j) => `- ${j.years}, ${j.label}: ${j.line}`).join('\n')}

Experience:
${experience}

[nextxi] Current project: ${nextxi.name}, ${nextxi.role}. ${nextxi.body} Tools: ${nextxi.tags.join(', ')}.

Stack: ${stack.map((g) => `${g.label}: ${g.tools.join(', ')}`).join('. ')}.

Education: ${education.degree.degree}, ${education.degree.school}, ${education.degree.years}. ${education.degree.extra}
Now learning: ${education.learning.name} by ${education.learning.by}. ${education.learning.body}
Contact: ${identity.email}.`;
}
