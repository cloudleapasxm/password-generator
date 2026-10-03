import { useEffect, useRef, useState } from 'react';
import { Check, Copy, Eye, EyeOff, RefreshCw, TriangleAlert } from 'lucide-react';
import { copyText } from '../../lib/clipboard';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface PasswordDisplayProps {
  password: string;
  onRegenerate: () => void;
  disabled?: boolean;
}

const COPY_RESET_MS = 2000;

/**
 * The hero of the page: one composed card holding the generated password
 * (large monospace on a whisper of accent tint) with its actions in a
 * dedicated row below — Copy as the primary action, reveal and regenerate
 * as secondary icon buttons. Copy gives clear success/error feedback
 * announced to assistive tech.
 */
export function PasswordDisplay({ password, onRegenerate, disabled = false }: PasswordDisplayProps) {
  const [revealed, setRevealed] = useState(true);
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const resetTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    };
  }, []);

  // A fresh password resets the copy feedback.
  useEffect(() => {
    setCopyState('idle');
  }, [password]);

  const scheduleReset = () => {
    if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopyState('idle'), COPY_RESET_MS);
  };

  const handleCopy = async () => {
    if (!password || disabled) return;
    const ok = await copyText(password);
    setCopyState(ok ? 'copied' : 'failed');
    scheduleReset();
  };

  const shown = revealed ? password : '•'.repeat(Math.max(password.length, 8));

  return (
    <div>
      <div className="overflow-hidden rounded-xl border border-line bg-raised shadow-[0_1px_2px_rgb(0_0_0/0.05)] transition-colors duration-200 motion-reduce:transition-none">
        <div className="bg-accent/[0.07] px-5 py-5" aria-label="Generated password">
          <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted">
            Generated password
          </p>
          <output
            key={password}
            aria-live="off"
            className="pw-fade mt-2 block break-all font-mono text-xl leading-9 tracking-wide text-ink sm:text-[22px]"
          >
            {password ? shown : <span className="text-faint">—</span>}
          </output>
        </div>

        <div className="flex gap-2 border-t border-line bg-raised px-4 py-3">
          <Button
            type="button"
            variant={copyState === 'copied' ? 'success' : 'primary'}
            onClick={handleCopy}
            disabled={disabled || !password}
            aria-live="off"
            className="min-w-0 flex-1"
          >
            {copyState === 'copied' ? (
              <>
                <Check className="h-5 w-5" aria-hidden="true" /> Copied!
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" aria-hidden="true" /> Copy password
              </>
            )}
          </Button>
          <Tooltip label={revealed ? 'Hide password' : 'Show password'}>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? 'Hide password' : 'Show password'}
              aria-pressed={revealed}
              disabled={disabled || !password}
              className="btn-reveal shrink-0"
            >
              {revealed ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
            </Button>
          </Tooltip>
          <Tooltip label="Generate a new password">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onRegenerate}
              aria-label="Generate a new password"
              disabled={disabled}
              className="btn-regenerate shrink-0"
            >
              <RefreshCw className="h-5 w-5" aria-hidden="true" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {copyState === 'failed' ? (
        <p className="mt-2 flex items-start gap-2 text-sm text-danger">
          <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          Could not access the clipboard. You can still select and copy the password manually.
        </p>
      ) : null}

      {/* Screen-reader announcements for copy results (never the password itself). */}
      <div aria-live="polite" role="status" className="sr-only">
        {copyState === 'copied' ? 'Password copied to clipboard.' : ''}
        {copyState === 'failed' ? 'Copy failed. Clipboard access was not available.' : ''}
      </div>
    </div>
  );
}
