import { FileKey2, KeyRound, Lock, ScanText, ShieldCheck, Zap } from 'lucide-react';
import { PRESETS } from '../../lib/presets';

interface PresetSelectorProps {
  activePresetId: string | null;
  onSelect: (presetId: string) => void;
}

const ICONS: Record<string, typeof Zap> = {
  strong: Zap,
  'extra-long': ShieldCheck,
  developer: FileKey2,
  'easy-read': ScanText,
  pin: Lock,
  passphrase: KeyRound,
};

/** Six one-click configurations that reconfigure the generator. */
export function PresetSelector({ activePresetId, onSelect }: PresetSelectorProps) {
  return (
    <div role="group" aria-label="Password presets" className="grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 xl:grid-cols-2">
      {PRESETS.map((preset) => {
        const Icon = ICONS[preset.id] ?? Zap;
        const active = preset.id === activePresetId;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onSelect(preset.id)}
            aria-pressed={active}
            title={preset.description}
            className={`flex min-h-[44px] items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              active
                ? 'border-accent bg-accent/10'
                : 'border-line bg-raised can-hover:hover:border-line-strong can-hover:hover:bg-surface active:bg-surface'
            }`}
          >
            <Icon
              className={`h-5 w-5 shrink-0 transition-colors duration-150 ${active ? 'text-accent' : 'text-muted'}`}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium text-ink">{preset.name}</span>
              <span className="block truncate text-xs text-muted">{preset.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
