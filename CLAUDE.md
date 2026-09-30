@AGENTS.md

# Project guide

A personal site for Alex Filobok (Full-Stack Product Engineer), kept general rather than tuned to one employer. Next.js 16 App Router, React 19, Tailwind 4, strict TypeScript, Vitest. The centerpiece is a draggable voice guide built on ElevenLabs Agents.

## Commands

- `npm run dev` starts the dev server.
- `npm run lint`, `npx tsc --noEmit`, `npm test` and `npm run build` must all pass before work counts as done.
- Do not edit `AGENTS.md`: `next dev` rewrites it. Put project rules here.

## Next.js 16 rules

- Read the relevant guide in `node_modules/next/dist/docs/` before using an API. Training data is out of date for this version.
- Request APIs (`params`, `searchParams`, `cookies()`, `headers()`) are async. Use `proxy`, not `middleware`.
- Server Components by default. Add `'use client'` only for interactivity, and keep client components small and leaf-level.
- Use `next/font` for fonts and `next/image` for images. `priority` is deprecated in Next 16: give only the LCP image (the intro portrait) `loading="eager"` and `fetchPriority="high"`.
- Env vars: secrets stay server-only and are never prefixed `NEXT_PUBLIC_`. Document every variable in `.env.example`.

## TypeScript rules

- `strict` is on. No `any`; use `unknown` and narrow. No non-null assertions to silence errors.
- Model states as discriminated unions. Put logic that can be pure in `src/lib` and cover it with Vitest.
- Name types after the domain (`VoicePhase`), not the implementation. Prefer small functions and early returns.
- Match the surrounding code: naming, comment density and idiom. Comments explain why, not what.

## Content rules

- `src/content/profile.ts` is the single source of truth for every claim about Alex. The voice agent's prompt is generated from it (`/api/voice/prompt`).
- Every claim must match his CV. `src/content/profile.test.ts` guards ruled-out claims; keep it passing.
- American spelling. Entry ids are stable: the agent's `highlight_section` tool targets them.

## Design requirements

- Direction: Apple-like. Neutral canvas (`--bg`, `--fg`), one violet accent, the orb is the only saturated element. Glow is used sparingly: settled stats, card spotlights, the primary button, the contact sheen and chapter tints.
- Colors come from the tokens in `src/app/globals.css`. No raw hex in components. The site follows the system theme, with a manual override via `data-theme`.
- Contrast at least 4.5:1 for text. Every interactive element has a visible `:focus-visible` state and a 44px minimum target.
- Motion: animate `transform` and `opacity` only. Reveals 500-800 ms with expo-out, hovers 150-250 ms. Pin at most one or two sections. Never parallax body copy.
- Every animation has a `prefers-reduced-motion` fallback that shows the final state. Nothing waits at `opacity: 0` for JavaScript.
- Use CSS scroll-driven animation where it works. The hero is the exception: `HeroMotion` drives the pure timeline in `src/lib/hero/timeline.ts` from damped scroll progress, because CSS scroll timelines cannot ease against the wheel. Keep its loop running only while it catches up, and test timeline changes.
- Check 375, 768, 1024 and 1440 px wide, in light and dark. No horizontal scroll. No emoji as icons; use the SVGs in `Icon.tsx`.

## Voice guide rules

- The ElevenLabs API key never reaches the browser. `GET /api/voice/session` returns a short-lived signed URL and is rate limited.
- Conversation phase lives in the pure reducer `src/lib/voice/state.ts`. The hook (`useVoiceGuide`) translates SDK events into it. Add a reducer test with every new event.
- Fail softly: with no key, no microphone or no network the panel explains what happened and offers email.
- Required env: `ELEVENLABS_API_KEY`, `ELEVENLABS_AGENT_ID`. The agent needs a client tool named `highlight_section` with one string parameter, `id`.
- Basil's name, intro, greeting and example questions live in `profile.ts` (`guide`). Any button can open Basil with `openGuide()` from `src/lib/voice/events.ts`.
