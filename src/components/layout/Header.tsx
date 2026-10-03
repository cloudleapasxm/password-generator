import { Monitor, Moon, ShieldCheck, Sun } from 'lucide-react';
import { useTheme, type Theme } from '../../hooks/useTheme';
import { link } from '../../lib/site';

const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

const NAV = [
  { href: link(''), label: 'Generator' },
  { href: link('about'), label: 'About' },
  { href: link('privacy'), label: 'Privacy' },
];

/** Compact header: brand mark, primary nav, and the light/dark/system selector. */
export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-line transition-colors duration-200 motion-reduce:transition-none">
      <div className="sp-container flex h-16 items-center gap-3">
        <a
          href={link('')}
          aria-label="SecurePass home"
          className="flex min-h-[44px] items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-ink transition-colors duration-150">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-bold tracking-tight text-ink">SecurePass</span>
            <span className="hidden text-xs text-muted sm:block">Password generator</span>
          </span>
        </a>

        <nav aria-label="Primary" className="ml-1 hidden items-center gap-0.5 md:flex">
          {NAV.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 can-hover:hover:bg-surface can-hover:hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center">
          <div
            role="group"
            aria-label="Color theme"
            className="flex rounded-lg border border-line bg-surface p-1 transition-colors duration-200 motion-reduce:transition-none"
          >
            {THEMES.map((t) => {
              const Icon = t.icon;
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  aria-pressed={active}
                  title={`${t.label} theme`}
                  aria-label={`${t.label} theme`}
                  className={`flex h-9 min-h-[36px] min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-all duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'bg-raised text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)]'
                      : 'text-muted can-hover:hover:text-ink'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden lg:inline">{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      {/* Mobile nav row — wraps instead of overflowing on very narrow screens. */}
      <nav
        aria-label="Primary mobile"
        className="sp-container flex flex-wrap items-center gap-0.5 border-t border-line py-1 md:hidden"
      >
        {NAV.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors duration-150 active:text-ink"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
