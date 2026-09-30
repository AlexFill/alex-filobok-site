import { describe, expect, it } from 'vitest';
import { initialVoiceState, isLive, orbLabel, voiceReducer, type VoiceEvent, type VoiceState } from './state';

const run = (events: VoiceEvent[], from: VoiceState = initialVoiceState) => events.reduce(voiceReducer, from);

describe('voiceReducer', () => {
  it('walks a full conversation', () => {
    const steps: [VoiceEvent, string][] = [
      [{ type: 'start' }, 'connecting'],
      [{ type: 'connected' }, 'listening'],
      [{ type: 'user-spoke' }, 'thinking'],
      [{ type: 'agent-mode', mode: 'speaking' }, 'speaking'],
      [{ type: 'agent-mode', mode: 'listening' }, 'listening'],
      [{ type: 'disconnected' }, 'idle'],
    ];
    let s = initialVoiceState;
    for (const [event, phase] of steps) {
      s = voiceReducer(s, event);
      expect(s.phase).toBe(phase);
    }
  });

  it('ignores a second start while connecting or live', () => {
    const connecting = run([{ type: 'start' }]);
    expect(voiceReducer(connecting, { type: 'start' })).toBe(connecting);
    const live = run([{ type: 'start' }, { type: 'connected' }]);
    expect(voiceReducer(live, { type: 'start' })).toBe(live);
  });

  it('lets the user interrupt while the agent speaks', () => {
    const s = run([{ type: 'start' }, { type: 'connected' }, { type: 'user-spoke' }, { type: 'agent-mode', mode: 'speaking' }]);
    expect(voiceReducer(s, { type: 'agent-mode', mode: 'listening' }).phase).toBe('listening');
  });

  it('does not leave thinking on a stray listening mode update', () => {
    const s = run([{ type: 'start' }, { type: 'connected' }, { type: 'user-spoke' }]);
    expect(voiceReducer(s, { type: 'agent-mode', mode: 'listening' }).phase).toBe('thinking');
  });

  it('ignores agent mode events when no session is live', () => {
    expect(voiceReducer(initialVoiceState, { type: 'agent-mode', mode: 'speaking' })).toBe(initialVoiceState);
  });

  it('keeps the error when the socket closes after a failure', () => {
    const s = run([{ type: 'start' }, { type: 'failed', error: 'network' }, { type: 'disconnected' }]);
    expect(s).toMatchObject({ phase: 'error', error: 'network' });
  });

  it('starts fresh from an error and clears it', () => {
    const failed = run([{ type: 'start' }, { type: 'failed', error: 'mic-denied' }]);
    expect(voiceReducer(failed, { type: 'start' })).toEqual({ phase: 'connecting', muted: false, error: null });
  });

  it('dismiss only clears an error', () => {
    const live = run([{ type: 'start' }, { type: 'connected' }]);
    expect(voiceReducer(live, { type: 'dismiss' })).toBe(live);
    const failed = run([{ type: 'failed', error: 'unavailable' }]);
    expect(voiceReducer(failed, { type: 'dismiss' })).toEqual(initialVoiceState);
  });

  it('tracks mute independently of the phase', () => {
    const s = run([{ type: 'start' }, { type: 'connected' }, { type: 'mute', muted: true }]);
    expect(s).toMatchObject({ phase: 'listening', muted: true });
  });
});

describe('isLive and orbLabel', () => {
  it('marks only conversation phases as live', () => {
    expect(['idle', 'connecting', 'error'].some((p) => isLive(p as never))).toBe(false);
    expect(['listening', 'thinking', 'speaking'].every((p) => isLive(p as never))).toBe(true);
  });

  it('gives every phase a non-empty label', () => {
    for (const phase of ['idle', 'connecting', 'listening', 'thinking', 'speaking', 'error'] as const) {
      expect(orbLabel({ ...initialVoiceState, phase }).length).toBeGreaterThan(0);
    }
  });
});
