import { useState } from 'react';
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
        <label htmlFor="pw-length" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
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
            className="h-11 w-20 rounded-lg border border-zinc-200 bg-white px-2 text-center text-sm font-medium text-zinc-900 focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600/30 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-blue-400"
          />
          <span className="text-sm text-zinc-500 dark:text-zinc-400" aria-hidden="true">
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
        className="pw-slider mt-3 w-full"
      />
      <div className="mt-1 flex justify-between text-xs text-zinc-500 dark:text-zinc-400" aria-hidden="true">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}
