import Image from 'next/image';
import { identity } from '@/content/profile';
import portrait from '../../public/alex.jpeg';

/** Alex's photo, round. The intro loads it eagerly as the first thing on screen. */
export function Portrait({ className, sizes, eager = false }: { className: string; sizes: string; eager?: boolean }) {
  return (
    <Image
      src={portrait}
      alt={`Portrait of ${identity.name}`}
      placeholder="blur"
      // `priority` is deprecated in Next 16; eager loading with high fetch priority is the recommended LCP setup.
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      sizes={sizes}
      className={`shrink-0 rounded-full object-cover object-[50%_35%] ${className}`}
    />
  );
}
