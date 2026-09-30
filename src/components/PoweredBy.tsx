import { guide } from '@/content/profile';

/** The ElevenLabs credit, shown wherever Basil appears. */
export function PoweredBy({ className = '' }: { className?: string }) {
  return (
    <a
      href={guide.poweredBy.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-11 items-center gap-2 text-xs tracking-wide text-muted transition-colors hover:text-fg ${className}`}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true" className="shrink-0">
        <rect x="3" y="1" width="2" height="10" rx="1" fill="currentColor" />
        <rect x="7" y="1" width="2" height="10" rx="1" fill="currentColor" />
      </svg>
      {guide.poweredBy.label}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
