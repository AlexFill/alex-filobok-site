import { inProgress, nextxi } from '@/content/profile';
import { CountUp } from './CountUp';
import { Tags } from './Tags';

export function Projects() {
  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="mx-auto flex max-w-[1440px] scroll-mt-16 flex-col gap-12 px-5 py-24 sm:px-12 lg:px-[120px] lg:py-32"
    >
      <h2 id="projects-title" className="reveal text-5xl font-bold tracking-[-0.035em] sm:text-7xl lg:text-[80px] lg:leading-none">
        Projects
      </h2>

      <article
        id="nextxi"
        className="entry spot reveal grid items-center gap-10 rounded-[36px] bg-surface p-7 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16 lg:p-16"
      >
        <div className="flex flex-col gap-6">
          <span className="text-base text-muted">{nextxi.role}</span>
          <h3 className="text-5xl font-bold leading-none tracking-[-0.035em] lg:text-[64px]">{nextxi.name}</h3>
          <p className="max-w-[34em] text-[17px] leading-relaxed text-muted sm:text-[19px]">{nextxi.body}</p>
          <dl className="flex gap-12">
            {nextxi.stats.map((s) => (
              <div key={s.label} className="flex flex-col-reverse gap-1">
                <dt className="text-[15px] text-muted">{s.label}</dt>
                <dd className="text-[44px] font-bold tracking-[-0.03em]">
                  <CountUp value={s.value} />
                </dd>
              </div>
            ))}
          </dl>
          <Tags tags={nextxi.tags} label="Tools used on NextXI" />
          <div className="flex flex-wrap gap-4">
            <a
              href={nextxi.appStore}
              className="btn-glow flex min-h-12 items-center rounded-full bg-fg px-6 font-semibold text-bg"
            >
              View on the App Store
            </a>
            <a href={nextxi.googlePlay} className="flex min-h-12 items-center rounded-full border border-line px-6">
              Get it on Google Play
            </a>
          </div>
        </div>
        {/* A composed screenshot goes here once Alex picks the screens. */}
        <div className="grid aspect-[5/4] place-items-center rounded-[28px] border border-line bg-bg">
          <div className="flex items-end gap-4" aria-hidden="true">
            <div className="h-56 w-28 rounded-[22px] border-[6px] border-[var(--device)] bg-[var(--screen)] sm:h-72 sm:w-36" />
            <div className="h-64 w-32 rounded-[24px] border-[6px] border-[var(--device)] bg-[var(--screen)] sm:h-80 sm:w-40" />
          </div>
        </div>
      </article>

      <article className="reveal flex max-w-[560px] flex-col gap-2.5 border-t border-line pt-6">
        <small className="text-[15px] text-muted">{inProgress.status}</small>
        <h3 className="text-[26px] font-semibold tracking-[-0.015em]">{inProgress.name}</h3>
        <p className="text-[17px] leading-relaxed text-muted">{inProgress.body}</p>
      </article>
    </section>
  );
}
