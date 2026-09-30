import { identity } from '@/content/profile';
import { ThemeToggle } from './ThemeToggle';

export function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-transparent bg-bg/70 backdrop-blur-xl supports-[backdrop-filter]:bg-bg/60">
      <nav aria-label="Main" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-12">
        <a href="#top" className="text-[17px] font-semibold tracking-tight">
          {identity.name}
        </a>
        <div className="flex items-center gap-2 text-[15px] text-muted sm:gap-8">
          <a href="#work" className="hidden px-1 py-3 transition-colors hover:text-fg sm:block">Work</a>
          <a href="#projects" className="hidden px-1 py-3 transition-colors hover:text-fg sm:block">Projects</a>
          <a href="#contact" className="px-1 py-3 transition-colors hover:text-fg">Contact</a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
