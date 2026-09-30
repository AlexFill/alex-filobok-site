'use client';

import type { ReactNode } from 'react';
import { openGuide } from '@/lib/voice/events';

/** A button anywhere on the page that opens a conversation with Basil. */
export function OpenGuideButton({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <button type="button" className={className} onClick={openGuide} aria-controls="voice-guide">
      {children}
    </button>
  );
}
