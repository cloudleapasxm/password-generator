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
    <div role="group" aria-label="Password presets" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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
            className={`flex min-h-[44px] items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
              active
                ? 'border-blue-600 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/40'
                : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:bg-zinc-800/60'
            }`}
          >
            <Icon
              className={`h-5 w-5 shrink-0 ${active ? 'text-blue-700 dark:text-blue-400' : 'text-zinc-500 dark:text-zinc-400'}`}
              aria-hidden="true"
            />
            <span className="min-w-0">
              <span className={`block text-sm font-medium ${active ? 'text-blue-900 dark:text-blue-200' : 'text-zinc-900 dark:text-zinc-100'}`}>
                {preset.name}
              </span>
              <span className="block truncate text-xs text-zinc-500 dark:text-zinc-400">{preset.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
