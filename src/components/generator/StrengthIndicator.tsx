import { strengthExplanation, strengthLevel } from '../../lib/password-strength';
import type { GeneratorConfig, StrengthLabel } from '../../types/password';

interface StrengthIndicatorProps {
  config: GeneratorConfig;
  bits: number;
  label: StrengthLabel;
}

const SEGMENT_LABELS = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

/** Strength meter: segmented bar + label + entropy bits + explanation. */
export function StrengthIndicator({ config, bits, label }: StrengthIndicatorProps) {
  const level = strengthLevel(bits);

  return (
    <div>
      <div
        className="flex gap-1.5"
        role="img"
        aria-label={`Password strength: ${label}, estimated entropy ${Math.round(bits)} bits`}
      >
        {SEGMENT_LABELS.map((segment, i) => (
          <span
            key={segment}
            aria-hidden="true"
            className={`h-2 flex-1 rounded-full transition-all duration-300 motion-reduce:transition-none ${
              i <= level
                ? level <= 1
                  ? 'bg-red-500 dark:bg-red-400'
                  : level === 2
                    ? 'bg-amber-500 dark:bg-amber-400'
                    : 'bg-emerald-600 dark:bg-emerald-500'
                : 'bg-zinc-200 dark:bg-zinc-700'
            }`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{label}</p>
        <p className="font-mono text-sm text-zinc-600 dark:text-zinc-400" aria-label={`Estimated entropy ${Math.round(bits)} bits`}>
          ~{Math.round(bits)} bits
        </p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{strengthExplanation(config, bits)}</p>
      <p className="mt-2 text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
        An estimate for comparing settings — not a guarantee against phishing, reuse, or leaked databases.
      </p>
    </div>
  );
}
