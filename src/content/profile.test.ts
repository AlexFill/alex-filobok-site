import { describe, expect, it } from 'vitest';
import * as profile from './profile';

const allText = JSON.stringify(profile);

describe('profile content', () => {
  // Claims that were checked and ruled out; see the CV fact log.
  it.each([
    ['solo', /\bsolo\b/i],
    ['sole engineer', /\bsole\b/i],
    ['CoreML', /core\s?ml/i],
    ['crash-free', /crash-free/i],
    ['Genesis Tech posts', /genesis/i],
    ['invented A/B results', /conversion (rose|increased|up)/i],
  ])('never claims %s', (_, pattern) => {
    expect(allText).not.toMatch(pattern);
  });

  it('credits NextXI as co-founded, with the web app to the co-founder', () => {
    expect(profile.nextxi.role).toMatch(/co-founder/i);
    expect(profile.nextxi.body).toMatch(/my co-founder built the web app/i);
  });

  it('has a working href for every link', () => {
    for (const link of profile.links) expect(link.href).toMatch(/^https:\/\//);
  });

  it('gives every chapter and entry a unique id (the voice agent highlights by id)', () => {
    const ids = profile.chapters.flatMap((c) => [c.id, ...c.entries.map((e) => e.id)]);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('tags every chapter, without duplicates', () => {
    for (const c of profile.chapters) {
      expect(c.tags.length).toBeGreaterThan(0);
      expect(new Set(c.tags).size).toBe(c.tags.length);
    }
  });

  it('links the course over https', () => {
    expect(profile.education.learning.href).toMatch(/^https:\/\//);
  });

  it('tells the journey in the first person', () => {
    for (const j of profile.journey) expect(j.caption).toMatch(/^(I|Then I|Now I)\b/);
  });

  it('uses American spelling', () => {
    expect(allText).not.toMatch(/optimis|colour|behaviour|organis/i);
  });
});
