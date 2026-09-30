import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { identity } from '@/content/profile';
import './globals.css';

const instrument = Instrument_Sans({
  variable: '--font-instrument',
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  metadataBase: new URL(identity.siteUrl),
  title: `${identity.name}, ${identity.title}`,
  description: identity.summary,
  openGraph: {
    title: `${identity.name}, ${identity.title}`,
    description: identity.summary,
    url: identity.siteUrl,
    siteName: identity.name,
    type: 'profile',
  },
  twitter: { card: 'summary_large_image', creator: '@alex_filobok' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfbfd' },
    { media: '(prefers-color-scheme: dark)', color: '#050506' },
  ],
};

// Apply a saved theme choice before the first paint, so there's no flash.
// It also marks <html> when the hero journey will run, so the first paint shows the phone.
const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")d.setAttribute("data-theme",t)}catch(e){}if(window.matchMedia&&matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)").matches)d.classList.add("hero-motion")})()`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={instrument.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
