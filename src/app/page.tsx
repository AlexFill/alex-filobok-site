import { Contact } from '@/components/Contact';
import { Education } from '@/components/Education';
import { Experience } from '@/components/Experience';
import { HeroJourney } from '@/components/HeroJourney';
import { Nav } from '@/components/Nav';
import { Projects } from '@/components/Projects';
import { SpotlightTracker } from '@/components/SpotlightTracker';
import { Stack } from '@/components/Stack';
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
        <Stack />
        <Experience />
        <Projects />
        <Education />
      </main>
      <Contact />
      <VoiceOrb />
      <SpotlightTracker />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
