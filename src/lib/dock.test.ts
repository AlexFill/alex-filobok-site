import { describe, expect, it } from 'vitest';
import { VISIBLE, defaultState, dockForKey, parseSaved, placement, snapToEdge } from './dock';

const desktop = { w: 1440, h: 900 };
const phone = { w: 390, h: 844 };
const S = 140;

describe('snapToEdge', () => {
  it('docks to the nearest edge when released close to it', () => {
    expect(snapToEdge(1350, 400, S, desktop).dock).toBe('right');
    expect(snapToEdge(10, 400, S, desktop).dock).toBe('left');
    expect(snapToEdge(700, 790, S, desktop).dock).toBe('bottom');
    expect(snapToEdge(700, 80, S, desktop).dock).toBe('top');
  });

  it('floats freely when released in the middle', () => {
    const s = snapToEdge(650, 380, S, desktop);
    expect(s.dock).toBeNull();
    expect(s).toMatchObject({ x: 650, y: 380 });
  });

  it('keeps a floating orb on screen and clear of the nav', () => {
    const s = snapToEdge(500, -50, S, { w: 3000, h: 3000 });
    expect(s.y).toBeGreaterThanOrEqual(72);
  });

  it('only uses the bottom corners on a phone', () => {
    expect(snapToEdge(20, 100, 110, phone).dock).toBe('corner-left');
    expect(snapToEdge(300, 400, 110, phone).dock).toBe('corner-right');
  });
});

describe('placement', () => {
  it('tucks a right-docked orb so only a slice shows', () => {
    const p = placement({ dock: 'right', x: 0, y: 400 }, S, desktop);
    expect(desktop.w - p.left).toBeCloseTo(S * VISIBLE);
  });

  it('hides most of a left-docked orb off-screen', () => {
    expect(placement({ dock: 'left', x: 0, y: 400 }, S, desktop).left).toBeLessThan(0);
  });

  it('starts docked right on desktop and in the bottom-right corner on a phone', () => {
    expect(defaultState(desktop, S).dock).toBe('right');
    expect(defaultState(phone, 110).dock).toBe('corner-right');
  });
});

describe('dockForKey', () => {
  it('maps arrow keys to docks', () => {
    expect(dockForKey('ArrowLeft', desktop)).toBe('left');
    expect(dockForKey('ArrowUp', desktop)).toBe('top');
    expect(dockForKey('ArrowUp', phone)).toBeNull();
    expect(dockForKey('ArrowLeft', phone)).toBe('corner-left');
  });
});

describe('parseSaved', () => {
  it('accepts a valid saved state', () => {
    expect(parseSaved('{"dock":"left","x":0,"y":300}')).toEqual({ dock: 'left', x: 0, y: 300 });
  });

  it('rejects junk', () => {
    expect(parseSaved(null)).toBeNull();
    expect(parseSaved('nope')).toBeNull();
    expect(parseSaved('{"dock":"sideways","x":0,"y":0}')).toBeNull();
    expect(parseSaved('{"dock":"left"}')).toBeNull();
  });
});
