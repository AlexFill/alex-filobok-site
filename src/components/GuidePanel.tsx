'use client';

import { useEffect, useRef } from 'react';
import { identity } from '@/content/profile';
import { guide } from '@/lib/voice/prompt';
import { ERROR_COPY, isLive, type VoicePhase } from '@/lib/voice/state';
import type { useVoiceGuide } from '@/lib/voice/useVoiceGuide';

type Voice = ReturnType<typeof useVoiceGuide>;

const STATUS: Record<VoicePhase, string> = {
  idle: 'Ready',
  connecting: 'Connecting…',
  listening: 'Listening',
  thinking: 'Thinking…',
  speaking: 'Speaking',
  error: 'Something went wrong',
};

const SUGGESTIONS = ['What did Alex build at Promova?', 'Tell me about NextXI', 'Why voice AI?'];

/** The voice guide's panel: live status, a rolling transcript and the controls. */
export function GuidePanel({ className, voice, onClose }: { className: string; voice: Voice; onClose: () => void }) {
  const heading = useRef<HTMLHeadingElement>(null);
  const log = useRef<HTMLOListElement>(null);
  const { state, lines } = voice;
  useEffect(() => heading.current?.focus(), []);
  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight });
  }, [lines]);

  const live = isLive(state.phase);

  return (
    <section
      id="voice-guide"
      role="dialog"
      aria-labelledby="guide-title"
      className={className}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose();
      }}
    >
      <h2 id="guide-title" ref={heading} tabIndex={-1} className="text-center text-[22px] font-semibold outline-none">
        {guide.name}
      </h2>
      <p className="-mt-2 text-center text-[15px] text-muted" role="status" aria-live="polite">
        {state.muted && live ? 'Muted' : STATUS[state.phase]}
      </p>

      {state.error ? (
        <p className="text-base leading-relaxed" role="alert">
          {ERROR_COPY[state.error]}
        </p>
      ) : lines.length > 0 ? (
        <ol ref={log} className="flex max-h-44 flex-col gap-2 overflow-y-auto text-[15px] leading-snug" aria-label="Conversation">
          {lines.map((l) => (
            <li key={l.id} className={l.who === 'you' ? 'text-muted' : ''}>
              <span className="mr-1.5 font-semibold">{l.who === 'you' ? 'You' : guide.name}</span>
              {l.text}
            </li>
          ))}
        </ol>
      ) : (
        <>
          <p className="text-base leading-relaxed">
            {state.phase === 'idle'
              ? 'Ask me anything about Alex’s work. Just talk, no button to hold.'
              : 'Say hello. I will scroll to what we talk about.'}
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Things you could ask">
            {SUGGESTIONS.map((q) => (
              <li key={q} className="rounded-full border border-dashed border-line px-3.5 py-2 text-sm text-muted">
                {q}
              </li>
            ))}
          </ul>
        </>
      )}

      <div className="mt-2 flex flex-col gap-2.5">
        {live && (
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={voice.toggleMute}
              aria-pressed={state.muted}
              className="min-h-11 flex-1 rounded-full border border-line text-[15px]"
            >
              {state.muted ? 'Unmute' : 'Mute'}
            </button>
            <button type="button" onClick={voice.stop} className="min-h-11 flex-1 rounded-full bg-fg text-[15px] font-semibold text-bg">
              End
            </button>
          </div>
        )}
        {(state.phase === 'idle' || state.phase === 'error') && (
          <button
            type="button"
            onClick={() => void voice.start()}
            className="min-h-11 rounded-full bg-fg px-5 text-[15px] font-semibold text-bg"
          >
            {state.phase === 'error' ? 'Try again' : 'Start talking'}
          </button>
        )}
        <a
          href={`mailto:${identity.email}`}
          className="flex min-h-11 items-center justify-center rounded-full border border-line px-5 text-[15px]"
        >
          Email Alex
        </a>
        <button type="button" onClick={onClose} className="min-h-11 rounded-full text-[15px] text-muted">
          Tuck it away
        </button>
      </div>
    </section>
  );
}
