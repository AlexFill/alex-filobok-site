# alexfilobok.com

The personal site of Alex Filobok, Software Engineer at Google. It opens with "Hi, I'm Alex" and tells nine
years of work as one first-person scroll: a device morphs from a phone to a laptop to a browser as the story
moves from iOS to macOS to full stack.
Basil, a voice guide built on ElevenLabs Agents, answers questions about the work out loud and scrolls to
whatever you talk about.

## How it's built

- **Next.js 16** (App Router), **React 19**, strict **TypeScript**, **Tailwind CSS 4**, **Vitest**.
- **One source of truth for content:** `src/content/profile.ts`. The page and Basil's system prompt are both
  generated from it. `profile.test.ts` guards it against ruled-out claims and checks ids and links.
- **Motion:**
  - The hero journey is a pure, tested timeline (`src/lib/hero/timeline.ts`) driven from scroll by
    `HeroMotion`, which damps progress so the device glides after the wheel. A pre-paint class shows the
    phone on first paint; small screens, reduced motion and no-JS get the final frame.
  - Reveals use CSS scroll-driven animation. Stats count up once (`CountUp`), chapters tint as they pass,
    and cards carry a cursor spotlight. Everything has a reduced-motion fallback.
- **Voice guide (Basil):**
  - `GET /api/voice/session` exchanges the server-only ElevenLabs key for a short-lived signed URL
    (rate limited). The key never reaches the browser.
  - Conversation phase lives in a pure reducer (`src/lib/voice/state.ts`); `useVoiceGuide` wraps the
    ElevenLabs React SDK, feeds the live audio level to the orb, and exposes a `highlight_section` client
    tool.
  - The orb is draggable and docks to any edge (`src/lib/dock.ts`, tested). Without a key, a microphone or
    a network, the panel says so and offers email.
- **Themes:** follows the OS, with a toggle applied before first paint.

## Setup

```bash
npm install
cp .env.example .env.local   # add ELEVENLABS_API_KEY and ELEVENLABS_AGENT_ID
npm run dev                  # http://localhost:3000
```

To configure the agent in the ElevenLabs dashboard, paste the prompt from `GET /api/voice/prompt` and add a
client tool named `highlight_section` with one string parameter, `id`.

## Checks

```bash
npm test          # content guard, hero timeline, count-up, voice state, dock geometry
npx tsc --noEmit
npm run lint
npm run build
```
