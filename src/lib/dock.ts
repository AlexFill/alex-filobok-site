/**
 * Geometry for the dockable voice orb. Pure functions, so the snapping rules
 * are testable without a browser.
 *
 * The orb floats anywhere; released near an edge it docks there and tucks
 * most of itself off-screen. On narrow screens it only docks to the two
 * bottom corners, where thumbs can reach it.
 */

export type Dock = 'left' | 'right' | 'top' | 'bottom' | 'corner-left' | 'corner-right';

export interface OrbState {
  dock: Dock | null;
  /** Top-left of the orb in viewport px; for side docks, the free axis. */
  x: number;
  y: number;
}

export interface Viewport {
  w: number;
  h: number;
}

/** Share of the orb left visible when tucked into a side. */
export const VISIBLE = 0.38;
/** Share visible (on each axis) when tucked into a bottom corner. */
export const CORNER_VISIBLE = 0.62;
/** Release closer than this to an edge, and the orb docks. */
export const SNAP_DISTANCE = 220;
/** Keep the free axis clear of the fixed nav and the screen edges. */
const NAV = 72;
const MARGIN = 16;

export const COMPACT_BREAKPOINT = 768;
export const isCompact = (vp: Viewport) => vp.w < COMPACT_BREAKPOINT;

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function defaultState(vp: Viewport, size: number): OrbState {
  if (isCompact(vp)) return { dock: 'corner-right', x: 0, y: 0 };
  return { dock: 'right', x: 0, y: Math.round(vp.h / 2 - size / 2) };
}

/** Where a released orb ends up. */
export function snapToEdge(x: number, y: number, size: number, vp: Viewport): OrbState {
  const cx = x + size / 2;
  const cy = y + size / 2;

  if (isCompact(vp)) return { dock: cx < vp.w / 2 ? 'corner-left' : 'corner-right', x: 0, y: 0 };

  const fx = clamp(x, MARGIN, vp.w - size - MARGIN);
  const fy = clamp(y, NAV, vp.h - size - MARGIN);
  const dist: Record<'left' | 'right' | 'top' | 'bottom', number> = {
    left: cx,
    right: vp.w - cx,
    top: cy,
    bottom: vp.h - cy,
  };
  const nearest = (Object.keys(dist) as (keyof typeof dist)[]).reduce((a, b) => (dist[b] < dist[a] ? b : a));
  return { dock: dist[nearest] < SNAP_DISTANCE ? nearest : null, x: fx, y: fy };
}

/** The orb's on-screen top-left for a state. */
export function placement(s: OrbState, size: number, vp: Viewport): { left: number; top: number } {
  const hidden = size * (1 - VISIBLE);
  switch (s.dock) {
    case 'right':
      return { left: vp.w - size * VISIBLE, top: clamp(s.y, NAV, vp.h - size - MARGIN) };
    case 'left':
      return { left: -hidden, top: clamp(s.y, NAV, vp.h - size - MARGIN) };
    case 'top':
      return { left: clamp(s.x, MARGIN, vp.w - size - MARGIN), top: -hidden };
    case 'bottom':
      return { left: clamp(s.x, MARGIN, vp.w - size - MARGIN), top: vp.h - size * VISIBLE };
    case 'corner-left':
      return { left: -size * (1 - CORNER_VISIBLE), top: vp.h - size * CORNER_VISIBLE };
    case 'corner-right':
      return { left: vp.w - size * CORNER_VISIBLE, top: vp.h - size * CORNER_VISIBLE };
    default:
      return { left: clamp(s.x, MARGIN, vp.w - size - MARGIN), top: clamp(s.y, NAV, vp.h - size - MARGIN) };
  }
}

/** Arrow keys move the orb between docks (the non-drag way to place it). */
export function dockForKey(key: string, vp: Viewport): Dock | null {
  if (isCompact(vp)) {
    if (key === 'ArrowLeft') return 'corner-left';
    if (key === 'ArrowRight') return 'corner-right';
    return null;
  }
  const map: Record<string, Dock> = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'top', ArrowDown: 'bottom' };
  return map[key] ?? null;
}

const DOCKS: readonly string[] = ['left', 'right', 'top', 'bottom', 'corner-left', 'corner-right'];

/** Parse a saved state defensively; storage may hold anything. */
export function parseSaved(raw: string | null): OrbState | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as Partial<OrbState>;
    if (v.dock !== null && !DOCKS.includes(String(v.dock))) return null;
    if (typeof v.x !== 'number' || typeof v.y !== 'number') return null;
    return { dock: (v.dock ?? null) as Dock | null, x: v.x, y: v.y };
  } catch {
    return null;
  }
}
