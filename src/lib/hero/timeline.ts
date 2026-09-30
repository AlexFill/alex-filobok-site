/**
 * The hero's device journey as a pure function of scroll progress (0 to 1).
 * The phone starts moving almost at once, holds as a laptop, then opens into
 * a browser. Headlines hand over mid-morph with only a brief dip, and
 * scene text fades out before the shape moves and back in once it settles.
 * Lengths are in cqw (the rig is 100 × 64 cqw), matching HeroJourney.module.css.
 */

/** [top, right, bottom, left] insets, then [top-left, top-right, bottom-right, bottom-left] radii. */
type Shape = { inset: [number, number, number, number]; radius: [number, number, number, number] };

const DEVICE: Record<'phone' | 'laptop' | 'browser', Shape> = {
  phone: { inset: [1, 35, 1, 35], radius: [5.4, 5.4, 5.4, 5.4] },
  laptop: { inset: [4, 9, 8.8, 9], radius: [2.2, 2.2, 2.2, 2.2] },
  browser: { inset: [2, 0, 2, 0], radius: [1.6, 1.6, 1.6, 1.6] },
};

const SCREEN: typeof DEVICE = {
  phone: { inset: [2.2, 36.2, 2.2, 36.2], radius: [4.2, 4.2, 4.2, 4.2] },
  laptop: { inset: [5.4, 10.4, 10.2, 10.4], radius: [0.8, 0.8, 0.8, 0.8] },
  browser: { inset: [6, 0, 2, 0], radius: [0, 0, 1.6, 1.6] },
};

/** Where each morph starts and ends, as fractions of the scroll. */
export const MORPH_1 = [0.06, 0.4] as const;
export const MORPH_2 = [0.54, 0.88] as const;

export interface Fade {
  opacity: number;
  /** Vertical offset in px. */
  y: number;
}

export interface HeroFrame {
  device: string;
  screen: string;
  captions: [Fade, Fade, Fade];
  scenes: [number, number, number];
  island: number;
  deck: number;
  chrome: number;
  hint: number;
  /** Hue shift for the glow behind the device, in degrees. */
  glowHue: number;
}

const clamp = (x: number) => Math.min(1, Math.max(0, x));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const seg = (p: number, from: number, to: number) => clamp((p - from) / (to - from));
/** Quadratic ease-in-out: soft start and soft landing for each morph. */
export const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function mix(a: Shape, b: Shape, c: Shape, m1: number, m2: number): Shape {
  const at = (i: number, key: keyof Shape) => lerp(lerp(a[key][i], b[key][i], m1), c[key][i], m2);
  const four = (key: keyof Shape) => [0, 1, 2, 3].map((i) => at(i, key)) as Shape['inset'];
  return { inset: four('inset'), radius: four('radius') };
}

const cq = (n: number) => `${+n.toFixed(3)}cqw`;
export const toClipPath = ({ inset, radius }: Shape) =>
  `inset(${inset.map(cq).join(' ')} round ${radius.map(cq).join(' ')})`;

export function heroFrame(progress: number): HeroFrame {
  const p = clamp(progress);
  const m1 = easeInOut(seg(p, ...MORPH_1));
  const m2 = easeInOut(seg(p, ...MORPH_2));
  // Each headline leaves just before the next arrives: overlapping text reads as a smear.
  const out1 = seg(p, 0.13, 0.2);
  const in2 = seg(p, 0.19, 0.27);
  const out2 = seg(p, 0.63, 0.7);
  const in3 = seg(p, 0.69, 0.77);

  return {
    device: toClipPath(mix(DEVICE.phone, DEVICE.laptop, DEVICE.browser, m1, m2)),
    screen: toClipPath(mix(SCREEN.phone, SCREEN.laptop, SCREEN.browser, m1, m2)),
    captions: [
      { opacity: 1 - out1, y: -14 * out1 },
      { opacity: in2 * (1 - out2), y: 14 * (1 - in2) - 14 * out2 },
      { opacity: in3, y: 14 * (1 - in3) },
    ],
    scenes: [1 - seg(p, 0.06, 0.16), seg(p, 0.3, 0.4) * (1 - seg(p, 0.54, 0.64)), seg(p, 0.78, 0.88)],
    island: 1 - seg(p, 0.06, 0.14),
    deck: seg(p, 0.3, 0.4) * (1 - seg(p, 0.54, 0.62)),
    chrome: seg(p, 0.8, 0.88),
    hint: 1 - seg(p, 0, 0.04),
    glowHue: lerp(lerp(0, 38, m1), -62, m2),
  };
}

/**
 * Moves `current` a fraction of the way to `target`, so motion glides after
 * the wheel instead of jumping with it. Snaps once close enough to stop.
 */
export function damp(current: number, target: number, factor: number, epsilon = 0.0005): number {
  const next = current + (target - current) * factor;
  return Math.abs(target - next) < epsilon ? target : next;
}
