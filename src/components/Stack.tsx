import { stack } from '@/content/profile';

/** The stack at a glance, right after the hero. */
export function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="mx-auto flex max-w-[1440px] scroll-mt-16 flex-col gap-8 px-5 pt-24 sm:px-12 lg:px-[120px] lg:pt-32"
    >
      <h2 id="stack-title" className="reveal max-w-[18em] text-3xl font-semibold leading-tight tracking-[-0.025em] text-balance sm:text-5xl">
        Nine years of shipping across phone, desktop, web and backend.
      </h2>
      <dl className="reveal grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
        {stack.map((g) => (
          <div key={g.label} className="flex flex-col gap-3">
            <dt className="text-[15px] text-muted">{g.label}</dt>
            <dd className="text-xl font-medium leading-snug tracking-[-0.01em] sm:text-2xl">{g.tools.join(' · ')}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
