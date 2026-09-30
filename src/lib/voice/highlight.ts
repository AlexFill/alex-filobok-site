/** How long a spoken-about entry stays highlighted, in milliseconds. */
const HIGHLIGHT_MS = 6000;

/**
 * Scroll to a content entry and mark it as spoken about. The id comes from the
 * agent, so it is looked up by exact id and ignored when nothing matches.
 * Returns whether an element was found, which the agent sees as the tool result.
 */
export function highlightEntry(id: unknown, doc: Document = document): boolean {
  if (typeof id !== 'string' || id.length === 0) return false;
  const el = doc.getElementById(id);
  if (!el || !el.classList.contains('entry')) return false;

  doc.querySelectorAll('[data-spoken]').forEach((n) => n.removeAttribute('data-spoken'));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  el.setAttribute('data-spoken', '');
  window.setTimeout(() => el.removeAttribute('data-spoken'), HIGHLIGHT_MS);
  return true;
}
