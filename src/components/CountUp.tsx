'use client';

import { useEffect, useRef } from 'react';
import { easeOutExpo, formatStat, parseStat } from '@/lib/countUp';

const DURATION = 1600;

/**
 * A stat that counts up the first time it scrolls into view, then glows.
 * The server renders the final value, so it reads correctly without JS and
 * with reduced motion; the animation only rewrites text it already shows.
 */
export function CountUp({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const stat = parseStat(value);
    if (!el) return;
    const lit = () => el.setAttribute('data-lit', '');
    if (!stat || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver(([e]) => e.isIntersecting && (lit(), io.disconnect()), { threshold: 0.6 });
      io.observe(el);
      return () => io.disconnect();
    }

    let raf = 0;
    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        el.textContent = formatStat(stat, stat.value * easeOutExpo(t));
        if (t < 1) raf = requestAnimationFrame(step);
        else lit();
      };
      el.textContent = formatStat(stat, 0);
      raf = requestAnimationFrame(step);
    };
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        run();
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.textContent = value;
    };
  }, [value]);

  return (
    <span ref={ref} className={`stat ${className ?? ''}`}>
      {value}
    </span>
  );
}
