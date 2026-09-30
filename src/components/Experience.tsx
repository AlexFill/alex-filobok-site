import { chapters, stack } from '@/content/profile';
import { CompanyLogo } from './CompanyLogo';
import { Tags } from './Tags';

export function Experience() {
  return (
    <section id="work" aria-labelledby="work-title" className="scroll-mt-16">
      <header className="mx-auto max-w-[1440px] px-5 pt-24 pb-10 sm:px-12 lg:px-[120px] lg:pt-36">
        <h2 id="work-title" className="reveal text-5xl font-bold tracking-[-0.035em] sm:text-7xl lg:text-[80px] lg:leading-none">
          Experience
        </h2>
        <p className="reveal mt-4 max-w-[36em] text-lg leading-relaxed text-muted sm:text-[21px]">
          Nine years across phone, desktop and web, from a first internship in Kyiv to Google in Warsaw.
        </p>
      </header>

      {chapters.map((c) => (
        <section
          key={c.id}
          id={c.id}
          data-platform={c.platform}
          aria-labelledby={`${c.id}-title`}
          className="chapter mx-auto grid max-w-[1440px] gap-10 border-t border-line px-5 py-16 sm:px-12 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-20 lg:px-[120px] lg:py-20"
        >
          <div className="flex flex-col gap-3 self-start lg:sticky lg:top-24">
            <span className="text-[15px] text-muted">{c.era}</span>
            <div className="flex items-center gap-4">
              {c.logo && <CompanyLogo logo={c.logo} />}
              <h3 id={`${c.id}-title`} className="text-5xl font-bold leading-none tracking-[-0.035em] lg:text-[64px]">
                {c.company}
              </h3>
            </div>
            <span className="text-[17px] text-muted">{c.where}</span>
            <ul className="mt-2 flex flex-col gap-1.5 text-[17px] leading-snug">
              {c.roles.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <div className="mt-2">
              <Tags tags={c.tags} label={`Tools used at ${c.company}`} />
            </div>
            {c.links && (
              <ul className="mt-2 flex flex-wrap gap-2" aria-label={`${c.company} links`}>
                {c.links.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-11 items-center rounded-full border border-line px-4 text-[15px] transition-colors hover:border-muted"
                    >
                      {l.label} <span aria-hidden="true">&nbsp;↗</span>
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex flex-col gap-12 lg:gap-14">
            {c.entries.map((e) => (
              <article
                key={e.id}
                id={e.id}
                className="entry reveal -mx-5 flex flex-col gap-3 rounded-3xl px-5 py-4 sm:-mx-8 sm:px-8 sm:py-7"
              >
                {e.big && <span className="text-6xl font-bold leading-[0.95] tracking-[-0.04em] sm:text-[88px]">{e.big}</span>}
                <h4 className="text-2xl font-semibold tracking-[-0.015em] sm:text-[28px]">{e.title}</h4>
                <p className="max-w-[40em] text-[17px] leading-relaxed text-pretty text-muted sm:text-[19px]">{e.body}</p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <div className="reveal mx-auto flex max-w-[1440px] flex-col gap-4 border-t border-line px-5 py-16 sm:px-12 lg:px-[120px] lg:py-20">
        <span className="text-[15px] text-muted">Stack</span>
        <p className="max-w-[28em] text-3xl font-semibold leading-tight tracking-[-0.025em] text-balance sm:text-4xl">
          Today: <span className="text-accent">{stack.today.join(', ')}.</span>
        </p>
        <p className="max-w-[40em] text-[17px] leading-relaxed text-muted sm:text-[19px]">{stack.before}</p>
      </div>
    </section>
  );
}
