import { AMBIGUOUS_CHARS, SYMBOLS } from '../../lib/password-generator';
import type { GeneratorConfig } from '../../types/password';

interface CharacterOptionsProps {
  config: GeneratorConfig;
  onChange: (patch: Partial<GeneratorConfig>) => void;
}

function Checkbox({
  id,
  checked,
  onChange,
  label,
  hint,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer rounded accent-blue-700 dark:accent-blue-500"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-zinc-900 dark:text-zinc-100">{label}</span>
        <span className="block truncate font-mono text-xs text-zinc-500 dark:text-zinc-400">{hint}</span>
      </span>
    </label>
  );
}

/** The four character-group toggles plus the ambiguous-character option. */
export function CharacterOptions({ config, onChange }: CharacterOptionsProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Characters</legend>
      <div className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2">
        <Checkbox
          id="opt-uppercase"
          checked={config.includeUppercase}
          onChange={(v) => onChange({ includeUppercase: v })}
          label="Uppercase"
          hint="A–Z"
        />
        <Checkbox
          id="opt-lowercase"
          checked={config.includeLowercase}
          onChange={(v) => onChange({ includeLowercase: v })}
          label="Lowercase"
          hint="a–z"
        />
        <Checkbox
          id="opt-digits"
          checked={config.includeDigits}
          onChange={(v) => onChange({ includeDigits: v })}
          label="Digits"
          hint="0–9"
        />
        <Checkbox
          id="opt-symbols"
          checked={config.includeSymbols}
          onChange={(v) => onChange({ includeSymbols: v })}
          label="Symbols"
          hint={SYMBOLS}
        />
      </div>
      <div className="mt-1">
        <Checkbox
          id="opt-ambiguous"
          checked={config.excludeAmbiguous}
          onChange={(v) => onChange({ excludeAmbiguous: v })}
          label="Exclude ambiguous characters"
          hint={[...AMBIGUOUS_CHARS].join(' ')}
        />
      </div>
    </fieldset>
  );
}
