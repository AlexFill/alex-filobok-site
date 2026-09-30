'use client';

import { useEffect, useState } from 'react';

const WORD_MS = 70;

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Reveals a line word by word, like it is being spoken. Screen readers get the
 * whole line at once; the animated copy is hidden from them.
 */
export function StreamedText({ text }: { text: string }) {
  const words = text.split(' ');
  const [shown, setShown] = useState(() => (prefersReducedMotion() ? words.length : 0));

  useEffect(() => {
    if (shown >= words.length) return;
    const id = window.setTimeout(() => setShown((n) => n + 1), WORD_MS);
    return () => window.clearTimeout(id);
  }, [shown, words.length]);

  return (
    <>
      <span aria-hidden="true">{words.slice(0, shown).join(' ')}</span>
      <span className="sr-only">{text}</span>
    </>
  );
}
