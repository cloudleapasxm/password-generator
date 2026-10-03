import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { LIMITS } from '../../lib/password-generator';
import type { GeneratorConfig } from '../../types/password';

interface AdvancedOptionsProps {
  config: GeneratorConfig;
  onChange: (patch: Partial<GeneratorConfig>) => void;
}

/**
 * Collapsible advanced settings: per-group guarantee, custom exclusions,
 * and (in passphrase mode) word count / separator / capitalization.
 */
export function AdvancedOptions({ config, onChange }: AdvancedOptionsProps) {
  const [open, setOpen] = useState(false);
  const isPassphrase = config.mode === 'passphrase';

  return (
    <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="advanced-options-panel"
        className="flex min-h-[44px] w-full items-center justify-between px-4 py-2 text-sm font-medium text-zinc-800 transition-colors hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
      >
        Advanced options
        <ChevronDown
          className={`h-4 w-4 transition-transform duration-200 motion-reduce:transition-none ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>
      <div
        id="advanced-options-panel"
        hidden={!open}
        className="border-t border-zinc-200 px-4 py-4 dark:border-zinc-800"
      >
        {!isPassphrase ? (
          <div className="space-y-4">
            <label
              htmlFor="opt-require-each"
              className="flex min-h-[44px] cursor-pointer items-start gap-3 rounded-lg px-1 py-1"
            >
              <input
                id="opt-require-each"
                type="checkbox"
                checked={config.requireEachGroup}
                onChange={(e) => onChange({ requireEachGroup: e.target.checked })}
                className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-blue-700 dark:accent-blue-500"
              />
              <span>
                <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Require one character from each group
                </span>
                <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                  Guarantees coverage, then shuffles everything into random positions.
                </span>
              </span>
            </label>
            <div>
              <label
                htmlFor="opt-custom-exclusions"
                className="block text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                Exclude these characters
              </label>
              <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                Any characters typed here are removed from every group. Leave empty for none.
              </p>
              <input
                id="opt-custom-exclusions"
                type="text"
                value={config.customExclusions}
                onChange={(e) => onChange({ customExclusions: e.target.value })}
                placeholder="e.g. $&"
                autoComplete="off"
                spellCheck={false}
                maxLength={64}
                className="mt-2 h-11 w-full rounded-lg border border-zinc-200 bg-white px-3 font-mono text-sm text-zinc-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="pp-words" className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  Words
                </label>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">{config.wordCount}</span>
              </div>
              <input
                id="pp-words"
                type="range"
                min={LIMITS.minWords}
                max={LIMITS.maxWords}
                step={1}
                value={config.wordCount}
                onChange={(e) => onChange({ wordCount: Number(e.target.value) })}
                aria-valuetext={`${config.wordCount} words`}
                className="pw-slider mt-2 w-full"
              />
            </div>
            <div>
              <label htmlFor="pp-separator" className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Word separator
              </label>
              <input
                id="pp-separator"
                type="text"
                value={config.separator}
                onChange={(e) => onChange({ separator: e.target.value.slice(0, LIMITS.maxSeparatorLength) })}
                autoComplete="off"
                spellCheck={false}
                maxLength={LIMITS.maxSeparatorLength}
                className="mt-2 h-11 w-28 rounded-lg border border-zinc-200 bg-white px-3 font-mono text-sm text-zinc-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
              />
            </div>
            <label htmlFor="pp-capitalize" className="flex min-h-[44px] cursor-pointer items-center gap-3">
              <input
                id="pp-capitalize"
                type="checkbox"
                checked={config.capitalizeWords}
                onChange={(e) => onChange({ capitalizeWords: e.target.checked })}
                className="h-5 w-5 shrink-0 cursor-pointer rounded accent-blue-700 dark:accent-blue-500"
              />
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Capitalize each word</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
