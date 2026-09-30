import { education } from '@/content/profile';

export function Education() {
  const { degree, learning } = education;
  return (
    <section
      id="education"
      aria-labelledby="education-title"
      className="mx-auto flex max-w-[1440px] scroll-mt-16 flex-col gap-10 px-5 py-24 sm:px-12 lg:px-[120px] lg:py-32"
    >
      <header className="flex flex-col gap-4">
        <h2 id="education-title" className="reveal text-5xl font-bold tracking-[-0.035em] sm:text-7xl lg:text-[80px] lg:leading-none">
          Education
        </h2>
        <p className="reveal max-w-[36em] text-lg leading-relaxed text-muted sm:text-[21px]">A degree in computer science, and still learning.</p>
      </header>

      <div className="grid gap-5 lg:grid-cols-2">
        <article className="reveal flex flex-col gap-3 rounded-[28px] border border-line p-7 sm:p-10">
          <span className="font-mono text-sm text-muted">{degree.years}</span>
          <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.015em] sm:text-[32px]">{degree.degree}</h3>
          <p className="text-[17px] leading-relaxed text-muted">{degree.school}, Kyiv.</p>
          <p className="text-[17px] leading-relaxed">{degree.extra}</p>
        </article>

        <article className="reveal flex flex-col items-start gap-3 rounded-[28px] border border-[var(--ring)] bg-[var(--highlight)] p-7 sm:p-10">
          <span className="rounded-full border border-line px-3 py-1 font-mono text-xs uppercase tracking-wider text-muted">Now learning</span>
          <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.015em] sm:text-[32px]">
            {learning.name}
            <span className="text-muted">, {learning.by}</span>
          </h3>
          <p className="max-w-[36em] text-[17px] leading-relaxed text-muted">{learning.body}</p>
          <a
            href={learning.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 flex min-h-11 items-center rounded-full border border-line bg-bg px-5 text-[15px] transition-colors hover:border-muted"
          >
            Course <span aria-hidden="true">&nbsp;↗</span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </article>
      </div>
    </section>
  );
}
