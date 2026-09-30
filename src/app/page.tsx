import { Contact } from '@/components/Contact';
import { Experience } from '@/components/Experience';
import { HeroJourney } from '@/components/HeroJourney';
import { Nav } from '@/components/Nav';
import { Projects } from '@/components/Projects';
import { VoiceOrb } from '@/components/VoiceOrb';
import { identity, links } from '@/content/profile';

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: identity.name,
  jobTitle: identity.title,
  email: `mailto:${identity.email}`,
  url: identity.siteUrl,
  image: `${identity.siteUrl}/alex.jpeg`,
  address: { '@type': 'PostalAddress', addressLocality: 'Warsaw', addressCountry: 'PL' },
  alumniOf: identity.education.school,
  sameAs: links.map((l) => l.href),
};

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <HeroJourney />
        <Experience />
        <Projects />
      </main>
      <Contact />
      <VoiceOrb />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
