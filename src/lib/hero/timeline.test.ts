import { describe, expect, it } from 'vitest';
import { damp, heroFrame, toClipPath } from './timeline';

describe('heroFrame', () => {
  it('starts as a phone with the first headline and scene', () => {
    const f = heroFrame(0);
    expect(f.device).toBe(toClipPath({ inset: [1, 35, 1, 35], radius: [5.4, 5.4, 5.4, 5.4] }));
    expect(f.captions.map((c) => c.opacity)).toEqual([1, 0, 0]);
    expect(f.scenes).toEqual([1, 0, 0]);
    expect(f.island).toBe(1);
  });

  it('ends as a browser with the final headline, matching the no-JS frame', () => {
    const f = heroFrame(1);
    expect(f.device).toBe('inset(2cqw 0cqw 2cqw 0cqw round 1.6cqw 1.6cqw 1.6cqw 1.6cqw)');
    expect(f.captions.map((c) => c.opacity)).toEqual([0, 0, 1]);
    expect(f.scenes).toEqual([0, 0, 1]);
    expect(f.chrome).toBe(1);
    expect(f.deck).toBe(0);
  });

  it('never leaves the screen without a headline for long, and never shows two at once', () => {
    let gap = 0;
    for (let i = 0; i <= 1000; i++) {
      const o = heroFrame(i / 1000).captions.map((c) => c.opacity);
      gap = Math.max(...o) < 0.3 ? gap + 1 : 0;
      expect(gap).toBeLessThanOrEqual(40);
      expect(o.filter((v) => v > 0.3).length).toBeLessThanOrEqual(1);
    }
  });

  it('starts moving almost immediately instead of holding', () => {
    expect(heroFrame(0.1).device).not.toBe(heroFrame(0).device);
  });

  it('clamps progress outside 0 to 1', () => {
    expect(heroFrame(-1)).toEqual(heroFrame(0));
    expect(heroFrame(2)).toEqual(heroFrame(1));
  });
});

describe('damp', () => {
  it('moves part of the way and snaps when close', () => {
    expect(damp(0, 1, 0.1)).toBeCloseTo(0.1);
    expect(damp(0.9999, 1, 0.1)).toBe(1);
  });
});
