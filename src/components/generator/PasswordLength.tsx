import { useState, type CSSProperties } from 'react';
import { LIMITS } from '../../lib/password-generator';

interface PasswordLengthProps {
  value: number;
  onChange: (length: number) => void;
  min?: number;
  max?: number;
}

/** Length slider + synchronized numeric input (default 8–128, PIN 4–128). */
export function PasswordLength({ value, onChange, min = LIMITS.minLength, max = LIMITS.maxLength }: PasswordLengthProps) {
  const [draft, setDraft] = useState<string | null>(null);

  const commit = (next: number | null) => {
    if (next === null) {
      setDraft(null);
      return;
    }
    onChange(next);
    setDraft(null);
  };

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  const fillPct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  const commitRaw = (raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === '') {
      setDraft(null);
      return;
    }
    const parsed = Number(trimmed);
    commit(Number.isInteger(parsed) ? clamp(parsed) : null);
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <label htmlFor="pw-length" className="text-sm font-medium text-ink">
          Length
        </label>
        <div className="flex items-center gap-2">
          <input
            id="pw-length-number"
            type="number"
            inputMode="numeric"
            min={min}
            max={max}
            step={1}
            value={draft ?? String(value)}
            aria-label="Password length (number)"
            onChange={(e) => setDraft(e.target.value)}
            onBlur={(e) => commitRaw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commitRaw((e.target as HTMLInputElement).value);
            }}
            className="sp-number h-10 w-[4.5rem] rounded-lg border border-line bg-raised px-2 text-center font-mono text-sm font-medium text-ink transition-colors duration-150 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 motion-reduce:transition-none"
          />
          <span className="text-sm tabular-nums text-muted" aria-hidden="true">
            chars
          </span>
        </div>
      </div>
      <input
        id="pw-length"
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => {
          setDraft(null);
          onChange(Number(e.target.value));
        }}
        aria-valuetext={`${value} characters`}
        className="pw-slider mt-2 w-full"
        style={{ '--sp-pct': `${fillPct}%` } as CSSProperties}
      />
      <div className="mt-0.5 flex justify-between text-xs tabular-nums text-faint" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
