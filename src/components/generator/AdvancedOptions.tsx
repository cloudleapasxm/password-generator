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
 * Expands with a smooth grid-rows animation; `inert` keeps collapsed
 * controls out of the tab order and hidden from assistive tech.
 */
export function AdvancedOptions({ config, onChange }: AdvancedOptionsProps) {
  const [open, setOpen] = useState(false);
  const isPassphrase = config.mode === 'passphrase';

  return (
    <div
      data-open={open}
      className="overflow-hidden rounded-lg border border-line transition-colors duration-200 motion-reduce:transition-none"
    >      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="advanced-options-panel"
        className="flex min-h-[44px] w-full items-center justify-between gap-3 bg-surface px-4 py-2 text-sm font-medium text-ink transition-colors duration-150 can-hover:hover:bg-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent motion-reduce:transition-none"
      >
        Advanced options
        <ChevronDown className="sp-collapse-chevron h-4 w-4 shrink-0 text-muted" aria-hidden="true" />
      </button>
      <div id="advanced-options-panel" className="sp-collapse">
        <div className="sp-collapse-inner">
          <div inert={!open} className="border-t border-line px-4 py-4">
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
                    className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded accent-accent"
                  />
                  <span>
                    <span className="block text-sm font-medium text-ink">
                      Require one character from each group
                    </span>
                    <span className="block text-xs leading-relaxed text-muted">
                      Guarantees coverage, then shuffles everything into random positions.
                    </span>
                  </span>
                </label>
                <div>
                  <label
                    htmlFor="opt-custom-exclusions"
                    className="block text-sm font-medium text-ink"
                  >
                    Exclude these characters
                  </label>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
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
                    className="mt-2 h-11 min-h-[44px] w-full rounded-lg border border-line bg-raised px-3 font-mono text-sm text-ink transition-colors duration-150 placeholder:text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 motion-reduce:transition-none"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="pp-words" className="text-sm font-medium text-ink">
                      Words
                    </label>
                    <span className="font-mono text-sm tabular-nums text-muted">{config.wordCount}</span>
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
                    className="pw-slider mt-1 w-full"
                  />
                </div>
                <div>
                  <label htmlFor="pp-separator" className="block text-sm font-medium text-ink">
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
                    className="mt-2 h-11 min-h-[44px] w-28 rounded-lg border border-line bg-raised px-3 font-mono text-sm text-ink transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 motion-reduce:transition-none"
                  />
                </div>
                <label htmlFor="pp-capitalize" className="flex min-h-[44px] cursor-pointer items-center gap-3">
                  <input
                    id="pp-capitalize"
                    type="checkbox"
                    checked={config.capitalizeWords}
                    onChange={(e) => onChange({ capitalizeWords: e.target.checked })}
                    className="h-5 w-5 shrink-0 cursor-pointer rounded accent-accent"
                  />
                  <span className="text-sm font-medium text-ink">Capitalize each word</span>
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
