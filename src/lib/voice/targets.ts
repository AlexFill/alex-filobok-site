import { chapters, nextxi, pageSections } from '@/content/profile';

/**
 * Every id Basil may scroll to: whole sections, company chapters, single
 * entries and the NextXI card. Anything else from the agent is ignored.
 */
export const GUIDE_TARGETS: ReadonlySet<string> = new Set([
  ...pageSections.map((s) => s.id),
  ...chapters.flatMap((c) => [c.id, ...c.entries.map((e) => e.id)]),
  nextxi.name.toLowerCase(),
]);

/** Agents sometimes add stray quotes, brackets or casing; normalize before lookup. */
export function normalizeTarget(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const id = raw.trim().replace(/^[\s"'[(]+|[\s"'\])]+$/g, '').toLowerCase();
  return GUIDE_TARGETS.has(id) ? id : null;
}
