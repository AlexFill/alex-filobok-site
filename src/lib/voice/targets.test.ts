import { describe, expect, it } from 'vitest';
import { chapters } from '@/content/profile';
import { GUIDE_TARGETS, normalizeTarget } from './targets';

describe('guide targets', () => {
  it('covers sections, chapters, entries and NextXI', () => {
    for (const id of ['stack', 'work', 'projects', 'education', 'contact', 'nextxi']) expect(GUIDE_TARGETS.has(id)).toBe(true);
    for (const c of chapters) {
      expect(GUIDE_TARGETS.has(c.id)).toBe(true);
      for (const e of c.entries) expect(GUIDE_TARGETS.has(e.id)).toBe(true);
    }
  });

  it('forgives quotes, brackets and casing', () => {
    expect(normalizeTarget(' "[Promova-Voice]" ')).toBe('promova-voice');
    expect(normalizeTarget('Education')).toBe('education');
  });

  it('rejects anything else', () => {
    expect(normalizeTarget('top')).toBeNull();
    expect(normalizeTarget(42)).toBeNull();
    expect(normalizeTarget('')).toBeNull();
  });
});
