'use client';

import { useEffect } from 'react';

/** Marks the chapter crossing the middle of the screen, so its tint can fade in. */
export function ChapterWatcher() {
  useEffect(() => {
    const chapters = document.querySelectorAll<HTMLElement>('.chapter');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) e.target.toggleAttribute('data-active', e.isIntersecting);
      },
      // A thin band across the middle of the viewport: one chapter at a time.
      { rootMargin: '-45% 0px -45% 0px' },
    );
    chapters.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, []);

  return null;
}
