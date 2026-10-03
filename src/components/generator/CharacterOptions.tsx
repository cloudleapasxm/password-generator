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
      className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg px-2.5 py-2 transition-colors duration-150 can-hover:hover:bg-surface active:bg-surface motion-reduce:transition-none"
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 cursor-pointer rounded accent-accent"
      />
      <span className="min-w-0">
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block truncate font-mono text-xs text-muted">{hint}</span>
      </span>
    </label>
  );
}

/** The four character-group toggles plus the ambiguous-character option. */
export function CharacterOptions({ config, onChange }: CharacterOptionsProps) {
  return (
    <fieldset>
      <legend className="text-sm font-medium text-ink">Characters</legend>
      <div className="mt-2 grid grid-cols-1 gap-1 min-[420px]:grid-cols-2">
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
      <div className="mt-1 border-t border-line pt-1">
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
