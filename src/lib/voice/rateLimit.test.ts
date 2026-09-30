import { describe, expect, it } from 'vitest';
import { createLimiter } from './rateLimit';

describe('createLimiter', () => {
  it('allows up to max hits per window, then blocks', () => {
    const l = createLimiter(2, 1000);
    expect([l.hit('a', 0), l.hit('a', 1), l.hit('a', 2)]).toEqual([true, true, false]);
  });

  it('tracks keys separately and resets after the window', () => {
    const l = createLimiter(1, 1000);
    expect(l.hit('a', 0)).toBe(true);
    expect(l.hit('b', 0)).toBe(true);
    expect(l.hit('a', 500)).toBe(false);
    expect(l.hit('a', 1000)).toBe(true);
  });
});
