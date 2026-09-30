/**
 * Headline stats such as "2,200+", "−50%" or "0 → 3" count up from zero when
 * they scroll in. The number is the last run of digits, so "0 → 3" animates
 * the 3 and keeps "0 → " as a prefix.
 */
export interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  /** Whether the source used thousands separators ("2,200"). */
  grouped: boolean;
}

export function parseStat(raw: string): Stat | null {
  const matches = [...raw.matchAll(/\d[\d,]*/g)];
  const last = matches.at(-1);
  if (!last || last.index === undefined) return null;
  const digits = last[0];
  const value = Number(digits.replace(/,/g, ''));
  // Counting to 1 reads as a glitch ("0 tap"), so tiny values stay still.
  if (!Number.isFinite(value) || value <= 1) return null;
  return {
    prefix: raw.slice(0, last.index),
    value,
    suffix: raw.slice(last.index + digits.length),
    grouped: digits.includes(','),
  };
}

export function formatStat(stat: Stat, n: number): string {
  const rounded = Math.round(n);
  return `${stat.prefix}${stat.grouped ? rounded.toLocaleString('en-US') : rounded}${stat.suffix}`;
}

/** Fast start, long soft landing. */
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - 2 ** (-10 * t));
