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
    <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
      {/* Main column: display + controls */}
      <div className="min-w-0 space-y-5">
        <SectionCard
          title="Generator"
          description="Your passwords are generated locally in your browser. They are not sent to our servers."
        >
          <div role="tablist" aria-label="Generation mode" className="mb-6 grid grid-cols-3 gap-1 rounded-lg border border-line bg-surface p-1">
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
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-md px-2 text-sm font-medium transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    active
                      ? 'bg-raised text-ink shadow-[0_1px_2px_rgb(0_0_0/0.08)]'
                      : 'text-muted can-hover:hover:text-ink active:text-ink'
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {/* Icon-only on narrow screens: labels would truncate. */}
                  <span className="hidden truncate min-[480px]:inline">{mode.label}</span>
                </button>
              );
            })}
          </div>

          {error ? (
            <div
              role="alert"
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-ink"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
              <span>{error}</span>
            </div>
          ) : null}

          <PasswordDisplay password={password} onRegenerate={regenerate} disabled={!!error} />

          <div className="mt-7 space-y-7 border-t border-line pt-7">
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
              <p className="text-sm leading-relaxed text-muted">
                PIN mode uses digits only. Adjust the length above, or open advanced options to exclude specific
                digits.
              </p>
            ) : null}
            <AdvancedOptions config={config} onChange={updateConfig} />
          </div>
        </SectionCard>

        <SectionCard title="How it stays private">
          <ul className="space-y-2.5 text-sm leading-relaxed text-muted">
            <li className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              Randomness comes from your browser’s Web Crypto API — never from predictable generators.
            </li>
            <li className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              Everything runs on this page. No account, no analytics, no network requests with your passwords.
            </li>
            <li className="flex gap-2.5">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              Generated passwords are never saved — not in this browser’s storage, not in the page address, nowhere.
            </li>
          </ul>
        </SectionCard>
      </div>

      {/* Secondary column: strength, presets, history */}
      <div className="min-w-0 space-y-5">
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
