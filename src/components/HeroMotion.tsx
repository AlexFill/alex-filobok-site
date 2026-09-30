'use client';

import { useEffect } from 'react';
import { damp, heroFrame } from '@/lib/hero/timeline';

export const HERO_MOTION_QUERY = '(min-width: 768px) and (prefers-reduced-motion: no-preference)';
/** Share of the gap to the scroll position covered each frame: lower glides more. */
const GLIDE = 0.1;

/**
 * Drives the hero journey from scroll. Progress is damped so the device
 * glides after the wheel, and the loop only runs while it is catching up.
 * Without JS, on small screens or with reduced motion the hero keeps its
 * server-rendered final frame.
 */
export function HeroMotion() {
  useEffect(() => {
    const hero = document.getElementById('journey');
    if (!hero) return;
    const q = <T extends HTMLElement>(name: string) => hero.querySelector<T>(`[data-hero="${name}"]`);
    const els = {
      rig: q('rig'),
      device: q('device'),
      screen: q('screen'),
      deck: q('deck'),
      island: q('island'),
      chrome: q('chrome'),
      hint: q('hint'),
      caps: [q('cap1'), q('cap2'), q('cap3')],
      scenes: [q('s1'), q('s2'), q('s3')],
    };
    const media = window.matchMedia(HERO_MOTION_QUERY);
    let shown = 0;
    let raf = 0;

    const target = () => {
      const travel = hero.offsetHeight - window.innerHeight;
      return travel > 0 ? Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / travel)) : 1;
    };

    const draw = (p: number) => {
      const f = heroFrame(p);
      if (els.device) els.device.style.clipPath = f.device;
      if (els.screen) els.screen.style.clipPath = f.screen;
      if (els.deck) els.deck.style.opacity = `${f.deck}`;
      if (els.island) els.island.style.opacity = `${f.island}`;
      if (els.chrome) els.chrome.style.opacity = `${f.chrome}`;
      if (els.hint) els.hint.style.opacity = `${f.hint}`;
      els.rig?.style.setProperty('--glow-hue', `${f.glowHue}deg`);
      els.caps.forEach((el, i) => {
        if (!el) return;
        el.style.opacity = `${f.captions[i].opacity}`;
        el.style.transform = `translateY(${f.captions[i].y}px)`;
      });
      els.scenes.forEach((el, i) => {
        if (el) el.style.opacity = `${f.scenes[i]}`;
      });
    };

    const clear = () => {
      for (const el of [els.device, els.screen, els.deck, els.island, els.chrome, els.hint, ...els.caps, ...els.scenes]) {
        el?.style.removeProperty('clip-path');
        el?.style.removeProperty('opacity');
        el?.style.removeProperty('transform');
      }
      els.rig?.style.removeProperty('--glow-hue');
    };

    const tick = () => {
      const t = target();
      shown = damp(shown, t, GLIDE);
      draw(shown);
      raf = shown === t ? 0 : requestAnimationFrame(tick);
    };
    const onScroll = () => {
      if (media.matches && !raf) raf = requestAnimationFrame(tick);
    };

    const apply = () => {
      document.documentElement.classList.toggle('hero-motion', media.matches);
      cancelAnimationFrame(raf);
      raf = 0;
      if (!media.matches) return clear();
      shown = target();
      draw(shown);
    };

    apply();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    media.addEventListener('change', apply);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      media.removeEventListener('change', apply);
    };
  }, []);

  return null;
}
