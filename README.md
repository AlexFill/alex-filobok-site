# alexfilobok.vercel.app

The personal site of Alex Filobok, Full-Stack Product Engineer. It tells nine years of work as one scroll:
a device morphs from a phone to a laptop to a browser as the story moves from iOS to macOS to full stack.
A voice orb you can drag and dock to any edge of the screen is the entry point to a voice guide
(coming in v2).

## How it's built

- **Next.js 16** (App Router, fully static), **React 19**, **TypeScript**, **Tailwind CSS 4**, **Vitest**.
- **No animation library.** The hero morph and the reveals are native CSS scroll-driven animations
  (`view-timeline`, `animation-timeline: view()`). The morph animates `clip-path` in container units, so it
  scales with the window and never animates layout. Browsers without support, and anyone with reduced
  motion turned on, get the final frame.
- **One source of truth for content:** `src/content/profile.ts`. A test (`profile.test.ts`) guards it against
  claims that were ruled out and checks that every id is unique and every link is real.
- **Dockable orb:** `src/components/VoiceOrb.tsx`. Pointer Events drag, snapping to the nearest edge, and tucking
  in with a spring. The geometry is pure and tested in `src/lib/dock.ts`. It works without a mouse (the arrow keys
  dock it, Enter opens it), docks only to the bottom corners on phones, and its colour follows the chapter on
  screen.
- **Themes:** it follows the OS, and the toggle's choice is applied before first paint (no flash).

```bash
npm install
npm run dev     # http://localhost:3000
npm test        # content guard + orb geometry
npm run lint
npm run build
```

## Roadmap: v2, the voice guide

The orb opens a "coming soon" panel today. v2 connects it to an ElevenLabs agent:

- **Talk to my CV:** the agent answers from `profile.ts` and highlights the entry it's talking about (every
  entry already has an id for this).
- **Read my CV aloud:** the agent walks through the chapters, scrolling along as it reads.
- **The career song and the fantasy tale:** pre-generated from the CV, reviewed, and hosted as audio.
  The mic pauses while music plays.

The server pieces (short-lived conversation tokens, rate limiting, agent-as-code setup) come from
Captain's Call, my voice assistant for FPL teams, where the same pattern already runs.
