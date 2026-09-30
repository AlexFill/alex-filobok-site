import { guide } from '@/content/profile';
import { OpenGuideButton } from './OpenGuideButton';

/** Introduces Basil, the voice guide, as a friend you can talk to. */
export function MeetBasil() {
  return (
    <section id="basil" aria-labelledby="basil-title" className="mx-auto max-w-[1440px] scroll-mt-16 px-5 pt-16 sm:px-12 lg:px-[120px] lg:pt-24">
      <div className="spot reveal grid items-center gap-10 rounded-[36px] bg-surface p-7 sm:p-12 md:grid-cols-[auto_minmax(0,1fr)] lg:gap-20 lg:p-16">
        <div className="relative size-36 sm:size-44 lg:size-52" aria-hidden="true">
          <span className="basil-orb orb-surface absolute inset-0" />
          <span className="basil-hi absolute -right-2 top-[8%] rounded-[14px] rounded-bl-[4px] border border-line bg-bg px-3 py-1.5 text-[13px] font-semibold">
            Hi!
          </span>
        </div>
        <div className="flex flex-col items-start gap-4">
          <span className="text-[15px] text-muted">Meet {guide.name}</span>
          <h2 id="basil-title" className="text-4xl font-bold leading-[1.02] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
            {guide.intro.heading}
          </h2>
          <p className="max-w-[32em] text-lg leading-relaxed text-muted sm:text-[21px]">{guide.intro.body}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5">
            <OpenGuideButton className="btn-glow flex min-h-12 items-center rounded-full bg-fg px-6 font-semibold text-bg">
              Say hi to {guide.name}
            </OpenGuideButton>
            {guide.questions.slice(0, 2).map((q) => (
              <OpenGuideButton
                key={q}
                className="flex min-h-11 items-center rounded-full border border-dashed border-line px-4 text-sm text-muted transition-colors hover:border-muted hover:text-fg"
              >
                {q}
              </OpenGuideButton>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
