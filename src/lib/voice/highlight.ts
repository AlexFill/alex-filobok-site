import { normalizeTarget } from './targets';

/** How long a spoken-about entry stays highlighted, in milliseconds. */
const HIGHLIGHT_MS = 6000;

/**
 * Scroll to what Basil is talking about. The id comes from the agent, so only
 * known targets are accepted (see targets.ts). Single entries also get a
 * highlight; sections and chapters just scroll into view.
 * Returns whether something was found, which the agent sees as the tool result.
 */
export function highlightEntry(raw: unknown, doc: Document = document): boolean {
  const id = normalizeTarget(raw);
  const el = id ? doc.getElementById(id) : null;
  if (!el) return false;

  const isEntry = el.classList.contains('entry');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: isEntry ? 'center' : 'start' });
  if (isEntry) {
    doc.querySelectorAll('[data-spoken]').forEach((n) => n.removeAttribute('data-spoken'));
    el.setAttribute('data-spoken', '');
    window.setTimeout(() => el.removeAttribute('data-spoken'), HIGHLIGHT_MS);
  }
  return true;
}
