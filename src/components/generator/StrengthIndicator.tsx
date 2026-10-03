import { strengthExplanation, strengthLevel } from '../../lib/password-strength';
import type { GeneratorConfig, StrengthLabel } from '../../types/password';

interface StrengthIndicatorProps {
  config: GeneratorConfig;
  bits: number;
  label: StrengthLabel;
}

const SEGMENT_LABELS = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];

/**
 * Restrained strength readout: a compact segmented meter, a text label
 * (never color alone), the estimated entropy, and an honest explanation.
 */
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
            className={`h-1.5 flex-1 rounded-full transition-colors duration-200 motion-reduce:transition-none ${
              i <= level
                ? level <= 1
                  ? 'bg-danger'
                  : level === 2
                    ? 'bg-warn'
                    : 'bg-success'
                : 'bg-line'
            }`}
          />
        ))}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <p className="text-base font-semibold text-ink">{label}</p>
        <p className="font-mono text-sm tabular-nums text-muted" aria-label={`Estimated entropy ${Math.round(bits)} bits`}>
          ~{Math.round(bits)} bits
        </p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-muted">{strengthExplanation(config, bits)}</p>
      <p className="mt-2 text-xs leading-relaxed text-faint">
        An estimate for comparing settings — not a guarantee against phishing, reuse, or leaked databases.
      </p>
    </div>
  );
}
