'use client';

import { useEffect } from 'react';

/** Feeds the pointer position to `.spot` cards so their glow follows the cursor. */
export function SpotlightTracker() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const onMove = (e: PointerEvent) => {
      const card = e.target instanceof Element ? e.target.closest<HTMLElement>('.spot') : null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => document.removeEventListener('pointermove', onMove);
  }, []);

  return null;
}
