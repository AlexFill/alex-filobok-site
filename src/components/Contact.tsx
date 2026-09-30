import Image from 'next/image';
import { identity, links } from '@/content/profile';
import portrait from '../../public/alex.jpeg';
import { Icon } from './Icon';

function Portrait() {
  return (
    <Image
      src={portrait}
      alt={`Portrait of ${identity.name}`}
      placeholder="blur"
      sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 160px"
      className="size-40 shrink-0 rounded-full object-cover object-[50%_35%] sm:size-[220px] lg:size-[260px]"
    />
  );
}

export function Contact() {
  return (
    <footer
      id="contact"
      aria-labelledby="contact-title"
      className="mx-auto flex max-w-[1440px] scroll-mt-16 flex-col gap-16 px-5 pt-24 pb-12 sm:px-12 lg:px-[120px] lg:pt-32"
    >
      <div className="reveal flex flex-col gap-10 sm:flex-row sm:items-center lg:gap-[72px]">
        <Portrait />
        <div>
          <h2 id="contact-title" className="sheen text-6xl font-bold leading-[0.95] tracking-[-0.045em] sm:text-[104px]">
            Let’s talk.
          </h2>
          <p className="mt-5 max-w-[32em] text-lg leading-relaxed text-muted sm:text-[21px]">
            {identity.title} in {identity.location.split(',')[0]}, {identity.availability.toLowerCase()}.
          </p>
          <a
            href={`mailto:${identity.email}`}
            className="mt-7 inline-flex border-b-2 border-fg pb-1 text-2xl font-semibold tracking-[-0.02em] break-all sm:text-[34px]"
          >
            {identity.email}
          </a>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <nav aria-label="Elsewhere" className="flex flex-wrap gap-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              rel="me noopener"
              target="_blank"
              className="flex min-h-12 items-center gap-2.5 rounded-full border border-line px-5 transition-colors hover:border-muted"
            >
              <Icon name={l.icon} />
              {l.label}
              {l.handle && <span className="text-muted">{l.handle}</span>}
            </a>
          ))}
        </nav>
        <div className="border-t border-line pt-6 text-sm text-muted">
          © {new Date().getFullYear()} {identity.name}
        </div>
      </div>
    </footer>
  );
}
