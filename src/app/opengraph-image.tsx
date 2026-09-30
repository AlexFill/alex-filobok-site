import { ImageResponse } from 'next/og';
import { identity } from '@/content/profile';

export const alt = `${identity.name}, ${identity.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// The share card: the site's dark mood, the name, and the voice orb.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 96px',
          background: '#050506',
          color: '#f5f5f7',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ fontSize: 88, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>{identity.name}</div>
          <div style={{ fontSize: 40, color: '#a1a1a6' }}>{identity.headline}</div>
          <div style={{ fontSize: 28, color: '#a1a1a6', marginTop: 24 }}>Hi, I’m Alex. Nine years of phone, desktop and web.</div>
        </div>
        <div
          style={{
            width: 280,
            height: 280,
            borderRadius: 9999,
            background: 'radial-gradient(circle at 34% 28%, #c9dcff 0%, #4f6ff0 42%, #2a1f6b 100%)',
            boxShadow: '0 0 120px rgba(96, 120, 255, 0.45)',
          }}
        />
      </div>
    ),
    size,
  );
}
