import { Monitor, Moon, ShieldCheck, Sun } from 'lucide-react';
import { useTheme, type Theme } from '../../hooks/useTheme';

const THEMES: { id: Theme; label: string; icon: typeof Sun }[] = [
  { id: 'light', label: 'Light', icon: Sun },
  { id: 'dark', label: 'Dark', icon: Moon },
  { id: 'system', label: 'System', icon: Monitor },
];

/** Compact header: logo, name, nav, and the light/dark/system selector. */
export function Header() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <a href="/" className="flex min-h-[44px] items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white dark:bg-blue-600">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="leading-tight">
            <span className="block text-base font-bold text-zinc-900 dark:text-zinc-50">SecurePass</span>
            <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
              Secure passwords, generated locally.
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="ml-2 hidden items-center gap-1 md:flex">
          <a href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">Generator</a>
          <a href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">About</a>
          <a href="/privacy" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">Privacy</a>
        </nav>

        <div className="ml-auto flex items-center">
          <div role="group" aria-label="Color theme" className="flex rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
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
                  className={`flex h-9 min-w-[44px] items-center justify-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
                    active
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
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
      {/* Mobile nav row */}
      <nav aria-label="Primary mobile" className="flex items-center gap-1 border-t border-zinc-100 px-4 py-1 md:hidden dark:border-zinc-800/60">
        <a href="/" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Generator</a>
        <a href="/about" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">About</a>
        <a href="/privacy" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">Privacy</a>
      </nav>
    </header>
  );
}
