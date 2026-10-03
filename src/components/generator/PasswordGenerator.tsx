import { Hash, KeyRound, ShieldCheck, TriangleAlert, Type } from 'lucide-react';
import { LIMITS } from '../../lib/password-generator';
import { usePasswordGenerator } from '../../hooks/usePasswordGenerator';
import { PasswordDisplay } from './PasswordDisplay';
import { PasswordLength } from './PasswordLength';
import { CharacterOptions } from './CharacterOptions';
import { AdvancedOptions } from './AdvancedOptions';
import { StrengthIndicator } from './StrengthIndicator';
import { PresetSelector } from './PresetSelector';
import { HistoryPanel } from './HistoryPanel';
import { SectionCard } from '../ui/SectionCard';
import type { PasswordMode } from '../../types/password';

const MODES: { id: PasswordMode; label: string; icon: typeof Type }[] = [
  { id: 'password', label: 'Password', icon: Type },
  { id: 'pin', label: 'PIN', icon: Hash },
  { id: 'passphrase', label: 'Passphrase', icon: KeyRound },
];

/**
 * The full SecurePass generator: one React island so only this part of the
 * page hydrates. Static header/footer/pages stay pure HTML.
 */
export function PasswordGenerator() {
  const {
    config,
    updateConfig,
    applyPreset,
    activePresetId,
    password,
    error,
    entropyBits,
    strength,
    regenerate,
    history,
    historyEnabled,
    toggleHistory,
    clearHistory,
    removeHistoryEntry,
  } = usePasswordGenerator();

  const isPassphrase = config.mode === 'passphrase';
  const isPin = config.mode === 'pin';

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* Main column: display + controls */}
      <div className="min-w-0 space-y-6">
        <SectionCard
          title="Generator"
          description="Your passwords are generated locally in your browser. They are not sent to our servers."
        >
          <div role="tablist" aria-label="Generation mode" className="mb-6 grid grid-cols-3 gap-1 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
            {MODES.map((mode) => {
              const Icon = mode.icon;
              const active = config.mode === mode.id;
              return (
                <button
                  key={mode.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => updateConfig({ mode: mode.id })}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
                    active
                      ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-50'
                      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {mode.label}
                </button>
              );
            })}
          </div>

          {error ? (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </div>
          ) : null}

          <PasswordDisplay password={password} onRegenerate={regenerate} disabled={!!error} />

          <div className="mt-6 space-y-6">
            {!isPassphrase ? (
              <PasswordLength
                value={config.length}
                onChange={(length) => updateConfig({ length })}
                min={isPin ? LIMITS.minPinLength : LIMITS.minLength}
                max={LIMITS.maxLength}
              />
            ) : null}
            {!isPassphrase && !isPin ? (
              <CharacterOptions config={config} onChange={updateConfig} />
            ) : null}
            {isPin ? (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                PIN mode uses digits only. Adjust the length above, or open advanced options to exclude specific
                digits.
              </p>
            ) : null}
            <AdvancedOptions config={config} onChange={updateConfig} />
          </div>
        </SectionCard>

        <SectionCard title="How it stays private">
          <ul className="space-y-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" aria-hidden="true" />
              Randomness comes from your browser’s Web Crypto API — never from predictable generators.
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" aria-hidden="true" />
              Everything runs on this page. No account, no analytics, no network requests with your passwords.
            </li>
            <li className="flex gap-2">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-500" aria-hidden="true" />
              Generated passwords are never saved — not in this browser’s storage, not in the page address, nowhere.
            </li>
          </ul>
        </SectionCard>
      </div>

      {/* Secondary column: strength, presets, history */}
      <div className="min-w-0 space-y-6">
        <SectionCard title="Strength">
          <StrengthIndicator config={config} bits={entropyBits} label={strength} />
        </SectionCard>

        <SectionCard title="Presets" description="One click applies a full configuration.">
          <PresetSelector activePresetId={activePresetId} onSelect={applyPreset} />
        </SectionCard>

        <SectionCard title="History">
          <HistoryPanel
            enabled={historyEnabled}
            onToggle={toggleHistory}
            entries={history}
            onRemove={removeHistoryEntry}
            onClear={clearHistory}
          />
        </SectionCard>
      </div>
    </div>
  );
}
