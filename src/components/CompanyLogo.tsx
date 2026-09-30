import Image from 'next/image';
import type { Logo } from '@/content/profile';

const SIZE = 44;

/** A company mark beside its name. Decorative: the company name is always in the text next to it. */
export function CompanyLogo({ logo }: { logo: Logo }) {
  if (logo.kind === 'image') {
    return <Image src={logo.src} alt="" width={SIZE} height={SIZE} className="rounded-[10px]" />;
  }
  // Single-color SVGs are painted with the text color so they work in light and dark.
  return (
    <span
      aria-hidden="true"
      className="inline-block bg-current"
      style={{
        width: SIZE,
        height: SIZE,
        maskImage: `url(${logo.src})`,
        WebkitMaskImage: `url(${logo.src})`,
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
      }}
    />
  );
}
