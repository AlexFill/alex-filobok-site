'use client';

import { useCallback, useEffect, useReducer, useRef, useState, type RefObject } from 'react';
import { useConversation } from '@elevenlabs/react';
import { highlightEntry } from './highlight';
import { initialVoiceState, isLive, voiceReducer, type VoiceErrorKind } from './state';

export interface TranscriptLine {
  id: number;
  who: 'you' | 'guide';
  text: string;
}

const MAX_LINES = 6;

async function fetchSignedUrl(): Promise<string | VoiceErrorKind> {
  try {
    const res = await fetch('/api/voice/session', { cache: 'no-store' });
    if (res.status === 503) return 'unavailable';
    if (!res.ok) return 'network';
    const data: unknown = await res.json();
    if (typeof data === 'object' && data !== null && 'signedUrl' in data && typeof data.signedUrl === 'string') {
      return data.signedUrl;
    }
    return 'network';
  } catch {
    return 'network';
  }
}

/** Ask for the microphone up front so a refusal is reported clearly, not as a dropped socket. */
async function micAllowed(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return true;
  } catch {
    return false;
  }
}

/**
 * Drives one voice conversation. `levelTarget` receives a `--level` CSS
 * variable (0 to 1) that follows the live input or output volume.
 */
export function useVoiceGuide(levelTarget: RefObject<HTMLElement | null>) {
  const [state, dispatch] = useReducer(voiceReducer, initialVoiceState);
  const [lines, setLines] = useState<TranscriptLine[]>([]);
  const lineId = useRef(0);

  const conversation = useConversation({
    onConnect: () => dispatch({ type: 'connected' }),
    onDisconnect: () => dispatch({ type: 'disconnected' }),
    onError: () => dispatch({ type: 'failed', error: 'network' }),
    onModeChange: ({ mode }) => dispatch({ type: 'agent-mode', mode }),
    onMessage: ({ message, role }) => {
      const who: TranscriptLine['who'] = role === 'user' ? 'you' : 'guide';
      if (who === 'you') dispatch({ type: 'user-spoke' });
      setLines((prev) => [...prev, { id: lineId.current++, who, text: message }].slice(-MAX_LINES));
    },
    clientTools: { highlight_section: ({ id }: { id?: unknown }) => (highlightEntry(id) ? 'highlighted' : 'not found') },
  });
  const { getInputVolume, getOutputVolume, startSession, endSession, setMuted } = conversation;

  const start = useCallback(async () => {
    if (state.phase !== 'idle' && state.phase !== 'error') return;
    dispatch({ type: 'start' });
    setLines([]);
    // Check the server first so a missing config never triggers a microphone prompt.
    const signedUrl = await fetchSignedUrl();
    if (signedUrl === 'unavailable' || signedUrl === 'network') return dispatch({ type: 'failed', error: signedUrl });
    if (!(await micAllowed())) return dispatch({ type: 'failed', error: 'mic-denied' });
    startSession({ signedUrl, connectionType: 'websocket' });
  }, [startSession, state.phase]);

  const stop = useCallback(() => {
    endSession();
    dispatch({ type: 'disconnected' });
  }, [endSession]);

  const toggleMute = useCallback(() => {
    const next = !state.muted;
    setMuted(next);
    dispatch({ type: 'mute', muted: next });
  }, [setMuted, state.muted]);

  // Feed the orb the live audio level, once per frame, without re-rendering React.
  useEffect(() => {
    const el = levelTarget.current;
    if (!el || !isLive(state.phase)) return;
    let raf = 0;
    // Two stages of smoothing: the target follows the raw volume, the shown
    // level follows the target, so the orb swells and settles without flicker.
    let target = 0;
    let level = 0;
    const tick = () => {
      const raw = state.phase === 'speaking' ? getOutputVolume() : state.phase === 'listening' && !state.muted ? getInputVolume() : 0;
      target += (Math.min(1, raw * 1.6) - target) * 0.3;
      level += (target - level) * 0.14;
      el.style.setProperty('--level', level.toFixed(3));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.style.setProperty('--level', '0');
    };
  }, [state.phase, state.muted, levelTarget, getInputVolume, getOutputVolume]);

  // End the session if the component goes away mid-conversation.
  useEffect(() => () => endSession(), [endSession]);

  return { state, lines, start, stop, toggleMute, dismiss: () => dispatch({ type: 'dismiss' }) };
}
