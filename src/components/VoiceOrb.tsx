'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { ConversationProvider } from '@elevenlabs/react';
import { guide } from '@/content/profile';
import { OPEN_GUIDE_EVENT } from '@/lib/voice/events';
import { orbLabel } from '@/lib/voice/state';
import { useVoiceGuide } from '@/lib/voice/useVoiceGuide';
import { defaultState, dockForKey, isCompact, parseSaved, placement, snapToEdge, type OrbState, type Viewport } from '@/lib/dock';
import type { Platform } from '@/content/profile';
import { GuidePanel } from './GuidePanel';
import s from './VoiceOrb.module.css';

const STORAGE_KEY = 'voice-orb';
const GREETED_KEY = 'basil-greeted';
const GREETING_MS = 6000;
const BUBBLE_W = 240;
const HUE: Record<Platform, string> = { ios: '0deg', macos: '38deg', web: '-62deg' };
/** How far a pointer must travel before a press counts as a drag, not a tap. */
const TAP_SLOP = 6;

// The viewport as an external store, so size changes re-render without effects.
let vpCache = '';
const subscribeViewport = (cb: () => void) => {
  window.addEventListener('resize', cb);
  return () => window.removeEventListener('resize', cb);
};
const viewportSnapshot = () => (vpCache = `${window.innerWidth}x${window.innerHeight}`);
const noSubscribe = () => () => {};

function readSaved(): OrbState | null {
  try {
    return parseSaved(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

function greetedBefore(): boolean {
  try {
    return localStorage.getItem(GREETED_KEY) === '1';
  } catch {
    return true;
  }
}

function markGreeted() {
  try {
    localStorage.setItem(GREETED_KEY, '1');
  } catch {
    // Storage blocked: the greeting may show again next visit, which is harmless.
  }
}

function save(state: OrbState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Storage blocked: the orb just starts from its default dock next time.
  }
}

export function VoiceOrb() {
  return (
    <ConversationProvider>
      <VoiceOrbInner />
    </ConversationProvider>
  );
}

function VoiceOrbInner() {
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  const vpKey = useSyncExternalStore(subscribeViewport, viewportSnapshot, () => vpCache || '1440x900');
  const [w, h] = vpKey.split('x').map(Number);
  const vp: Viewport = { w, h };
  const size = isCompact(vp) ? 104 : 140;

  const [saved, setSaved] = useState<OrbState | null>(readSaved);
  const [drag, setDrag] = useState<{ left: number; top: number } | null>(null);
  const [open, setOpen] = useState(false);
  const [platform, setPlatform] = useState<Platform>('ios');
  const [greeting, setGreeting] = useState(false);
  const pointer = useRef<{ id: number; sx: number; sy: number; ox: number; oy: number; moved: boolean } | null>(null);
  const orbRef = useRef<HTMLButtonElement>(null);
  const voice = useVoiceGuide(orbRef);
  const { start, stop } = voice;

  // A saved desktop dock makes no sense on a phone (and vice versa): fall back to the default.
  const compactDock = saved?.dock?.startsWith('corner') ?? false;
  const state = saved && compactDock === isCompact(vp) ? saved : defaultState(vp, size);

  // Follow the chapter on screen to tint the orb.
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('[data-platform]');
    // Callbacks only report sections whose visibility changed, so keep every
    // section's latest ratio and pick the most visible one overall.
    const ratios = new Map<Element, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.set(e.target, e.isIntersecting ? e.intersectionRatio : 0);
        let best: Element | null = null;
        for (const [el, r] of ratios) if (r > 0 && (!best || r > (ratios.get(best) ?? 0))) best = el;
        const p = best?.getAttribute('data-platform') as Platform | null;
        if (p) setPlatform(p);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] },
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  // "Say hi to Basil" buttons elsewhere on the page open the guide.
  useEffect(() => {
    const onOpen = () => {
      setGreeting(false);
      if (open) return;
      setOpen(true);
      void start();
    };
    window.addEventListener(OPEN_GUIDE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_GUIDE_EVENT, onOpen);
  }, [open, start]);

  // Say hello once per visitor, as the hero gives way to the page.
  useEffect(() => {
    const anchor = document.getElementById('stack');
    if (!anchor || greetedBefore()) return;
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      markGreeted();
      setGreeting(true);
      timer = window.setTimeout(() => setGreeting(false), GREETING_MS);
    });
    io.observe(anchor);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  if (!mounted) return null;

  const openPos = isCompact(vp)
    ? { left: vp.w / 2 - size / 2, top: vp.h - 420 - size * 0.45 }
    : { left: vp.w - 24 - 200 - size / 2, top: 150 - size * 0.45 };
  const pos = drag ?? (open ? openPos : placement(state, size, vp));

  // Opening the panel starts a hands-free conversation; closing it ends the conversation.
  const toggle = () => {
    setGreeting(false);
    if (open) {
      stop();
      setOpen(false);
    } else {
      setOpen(true);
      void start();
    }
  };

  const commit = (next: OrbState) => {
    setSaved(next);
    save(next);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    pointer.current = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: pos.left, oy: pos.top, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const p = pointer.current;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.sx;
    const dy = e.clientY - p.sy;
    if (!p.moved && Math.hypot(dx, dy) < TAP_SLOP) return;
    p.moved = true;
    if (open) {
      stop();
      setOpen(false);
    }
    setDrag({ left: p.ox + dx, top: p.oy + dy });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const p = pointer.current;
    pointer.current = null;
    if (!p || p.id !== e.pointerId) return;
    if (!p.moved) {
      toggle();
      return;
    }
    const at = drag ?? { left: p.ox, top: p.oy };
    setDrag(null);
    commit(snapToEdge(at.left, at.top, size, vp));
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    const dock = dockForKey(e.key, vp);
    if (dock) {
      e.preventDefault();
      if (open) {
        stop();
        setOpen(false);
      }
      commit({ dock, x: state.x || vp.w / 2 - size / 2, y: state.y || vp.h / 2 - size / 2 });
    } else if (e.key === 'Escape') {
      stop();
      setOpen(false);
    }
  };

  // Keyboard activation (Enter/Space) arrives as a click with detail 0; pointer taps are handled on pointerup.
  const onClick = (e: React.MouseEvent) => {
    if (e.detail === 0) toggle();
  };

  const close = () => {
    stop();
    setOpen(false);
    orbRef.current?.focus();
  };

  return (
    <>
      <button
        ref={orbRef}
        type="button"
        className={`${s.orb} ${drag ? s.dragging : ''}`}
        data-dock={open || drag ? undefined : state.dock ?? 'free'}
        // Not being set up yet is not a failure, so the orb stays calm.
        data-phase={voice.state.error === 'unavailable' ? 'idle' : voice.state.phase}
        style={{ '--size': `${size}px`, transform: `translate3d(${pos.left}px, ${pos.top}px, 0)` } as React.CSSProperties}
        aria-label={open ? orbLabel(voice.state) : `${orbLabel(voice.state)}. Drag it anywhere, or use the arrow keys to dock it to an edge.`}
        aria-expanded={open}
        aria-controls="voice-guide"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          pointer.current = null;
          setDrag(null);
        }}
        onKeyDown={onKeyDown}
        onClick={onClick}
      >
        <span className={s.peek}>
          <span className={s.aura} />
          <span className={s.ring} aria-hidden="true" />
          <span className={s.arc} aria-hidden="true" />
          <span className={`orb-surface ${s.surface}`} style={{ '--hue': HUE[platform] } as React.CSSProperties} />
        </span>
      </button>
      {greeting && !open && !drag && (
        <div
          className={s.greeting}
          role="status"
          style={{
            // Beside the visible part of the orb, never under it (a docked orb is partly off screen).
            left: Math.min(
              vp.w - BUBBLE_W - 16,
              Math.max(16, pos.left + size / 2 > vp.w / 2 ? Math.min(pos.left, vp.w - size * 0.45) - BUBBLE_W - 12 : Math.max(pos.left + size, size * 0.6) + 12),
            ),
            top: Math.min(vp.h - 120, Math.max(72, pos.top + size * 0.15)),
            width: BUBBLE_W,
          }}
        >
          <p>{guide.greeting}</p>
          <p className={s.credit}>{guide.poweredBy.label}</p>
          <button type="button" onClick={() => setGreeting(false)} aria-label="Dismiss greeting" className={s.dismiss}>
            ×
          </button>
        </div>
      )}
      {open && <GuidePanel className={s.panel} voice={voice} onClose={close} />}
    </>
  );
}
