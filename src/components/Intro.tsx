import { guide, identity, intro } from '@/content/profile';
import { OpenGuideButton } from './OpenGuideButton';
import { Portrait } from './Portrait';

/** The opening screen: Alex introduces himself before the story begins. */
export function Intro() {
  return (
    <section
      id="top"
      aria-labelledby="intro-title"
      className="intro mx-auto flex min-h-svh max-w-[1440px] flex-col items-center justify-center gap-5 px-5 pt-24 pb-16 text-center sm:px-12"
    >
      <Portrait
        eager
        sizes="(min-width: 640px) 168px, 128px"
        className="size-32 shadow-[0_0_0_6px_var(--bg),0_0_0_7px_var(--line),0_30px_80px_-20px_var(--glow)] sm:size-[168px]"
      />
      <p className="text-[15px] text-muted">
        {identity.headline} · {identity.location.split(',')[0]}
      </p>
      <h1 id="intro-title" className="text-6xl font-bold leading-[0.95] tracking-[-0.045em] sm:text-8xl lg:text-[128px]">
        {intro.greeting}
      </h1>
      <p className="max-w-[34em] text-lg leading-relaxed text-pretty text-muted sm:text-[22px]">{intro.summary}</p>
      <div className="mt-2 flex flex-wrap justify-center gap-2.5">
        <a href="#journey" className="btn-glow flex min-h-12 items-center rounded-full bg-fg px-6 font-semibold text-bg">
          See my story
        </a>
        <OpenGuideButton className="flex min-h-12 items-center rounded-full border border-line px-6 transition-colors hover:border-muted">
          Talk to {guide.name}
        </OpenGuideButton>
      </div>
      <p className="mt-6 flex flex-col items-center gap-1.5 text-sm text-muted" aria-hidden="true">
        {intro.cue}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 6l5 5 5-5" />
        </svg>
      </p>
    </section>
  );
}
