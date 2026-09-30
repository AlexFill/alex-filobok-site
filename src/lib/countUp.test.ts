import { describe, expect, it } from 'vitest';
import { easeOutExpo, formatStat, parseStat } from './countUp';

describe('parseStat and formatStat', () => {
  it.each([
    ['2,200+', { prefix: '', value: 2200, suffix: '+', grouped: true }],
    ['−50%', { prefix: '−', value: 50, suffix: '%', grouped: false }],
    ['0 → 3', { prefix: '0 → ', value: 3, suffix: '', grouped: false }],
    ['3 teams', { prefix: '', value: 3, suffix: ' teams', grouped: false }],
  ])('parses %s', (raw, expected) => {
    const stat = parseStat(raw);
    expect(stat).toEqual(expected);
    if (stat) expect(formatStat(stat, stat.value)).toBe(raw);
  });

  it('keeps separators while counting', () => {
    const stat = parseStat('2,200+');
    expect(stat && formatStat(stat, 1234.4)).toBe('1,234+');
  });

  it('skips values with nothing to count', () => {
    expect(parseStat('one tap')).toBeNull();
    expect(parseStat('1 tap')).toBeNull();
  });
});

describe('easeOutExpo', () => {
  it('runs from 0 to exactly 1', () => {
    expect(easeOutExpo(0)).toBe(0);
    expect(easeOutExpo(1)).toBe(1);
    expect(easeOutExpo(0.5)).toBeGreaterThan(0.9);
  });
});
