/**
 * The voice guide's state, kept as a pure reducer so it can be tested without
 * a browser or the ElevenLabs SDK. The hook translates SDK events into these.
 */

export type VoicePhase = 'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking' | 'error';

export type VoiceErrorKind = 'mic-denied' | 'unavailable' | 'refused' | 'network';

export interface VoiceState {
  phase: VoicePhase;
  muted: boolean;
  error: VoiceErrorKind | null;
}

export type VoiceEvent =
  | { type: 'start' }
  | { type: 'connected' }
  | { type: 'disconnected' }
  | { type: 'failed'; error: VoiceErrorKind }
  | { type: 'user-spoke' }
  | { type: 'agent-mode'; mode: 'speaking' | 'listening' }
  | { type: 'mute'; muted: boolean }
  | { type: 'dismiss' };

export const initialVoiceState: VoiceState = { phase: 'idle', muted: false, error: null };

/** Phases in which a live session exists. */
const LIVE: ReadonlySet<VoicePhase> = new Set(['listening', 'thinking', 'speaking']);

export const isLive = (phase: VoicePhase): boolean => LIVE.has(phase);

export function voiceReducer(state: VoiceState, event: VoiceEvent): VoiceState {
  switch (event.type) {
    case 'start':
      // Ignore taps while a session is starting or running.
      return state.phase === 'idle' || state.phase === 'error'
        ? { phase: 'connecting', muted: false, error: null }
        : state;
    case 'connected':
      return state.phase === 'connecting' ? { ...state, phase: 'listening' } : state;
    case 'disconnected':
      // A failure that ends the socket must keep its error message.
      return state.phase === 'error' ? state : { ...state, phase: 'idle' };
    case 'failed':
      return { ...state, phase: 'error', error: event.error };
    case 'user-spoke':
      // The user's turn finished; the agent is now working on a reply.
      return state.phase === 'listening' ? { ...state, phase: 'thinking' } : state;
    case 'agent-mode':
      if (!isLive(state.phase)) return state;
      if (event.mode === 'speaking') return { ...state, phase: 'speaking' };
      // Back to listening. Do not undo "thinking" for a stray mode update.
      return state.phase === 'speaking' ? { ...state, phase: 'listening' } : state;
    case 'mute':
      return { ...state, muted: event.muted };
    case 'dismiss':
      return state.phase === 'error' ? initialVoiceState : state;
  }
}

/**
 * Maps an SDK `onError` call to a failure, or `null` when the session keeps
 * running. The SDK also reports client tool problems and cleanup hiccups
 * through `onError`; those must not end the conversation on screen.
 */
export function classifySdkError(message: string, context: unknown): VoiceErrorKind | null {
  const ctx = typeof context === 'object' && context !== null ? (context as Record<string, unknown>) : {};
  if ('clientToolName' in ctx || 'toolCallId' in ctx) return null;
  if (message.startsWith('Failed to end session')) return null;
  // A server error event from ElevenLabs, such as quota or an agent misconfiguration.
  if ('errorType' in ctx) return 'refused';
  return 'network';
}

/** Plain-language messages, one per failure. Each says what to do next. */
export const ERROR_COPY: Record<VoiceErrorKind, string> = {
  'mic-denied': 'The microphone is blocked. Allow access in your browser settings and try again, or email me instead.',
  unavailable: 'The voice guide is not switched on right now. Email me and I will get back to you.',
  refused: 'Basil could not reach ElevenLabs just now. Try again in a moment, or email me.',
  network: 'The connection dropped. Check your network and try again.',
};

/** The label a screen reader hears for the orb button in each phase. */
export function orbLabel(state: VoiceState): string {
  switch (state.phase) {
    case 'idle':
      return 'Talk to the voice guide';
    case 'connecting':
      return 'Connecting to the voice guide';
    case 'listening':
      return state.muted ? 'Voice guide is listening. Microphone muted' : 'Voice guide is listening. Tap to end';
    case 'thinking':
      return 'Voice guide is thinking. Tap to end';
    case 'speaking':
      return 'Voice guide is speaking. Tap to end';
    case 'error':
      return 'Voice guide error. Tap to try again';
  }
}
