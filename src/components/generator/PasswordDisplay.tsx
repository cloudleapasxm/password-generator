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
 * The central readout: a wrap-safe monospace field (long passwords wrap
 * instead of scrolling or clipping) with a dedicated action row — Copy as
 * the primary action, reveal and regenerate as secondary icon buttons.
 * Copy gives clear success/error feedback announced to assistive tech.
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
      <div
        className="rounded-lg border border-line bg-surface px-4 py-3 transition-colors duration-200 motion-reduce:transition-none"
        aria-label="Generated password"
      >
        <output
          key={password}
          aria-live="off"
          className="pw-fade block break-all font-mono text-[17px] leading-7 tracking-wide text-ink"
        >
          {password ? shown : <span className="text-faint">—</span>}
        </output>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
        <Button
          type="button"
          variant={copyState === 'copied' ? 'success' : 'primary'}
          onClick={handleCopy}
          disabled={disabled || !password}
          aria-live="off"
          className="w-full sm:w-auto sm:min-w-[11rem]"
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
        <div className="flex gap-2">
          <Tooltip label={revealed ? 'Hide password' : 'Show password'}>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={() => setRevealed((v) => !v)}
              aria-label={revealed ? 'Hide password' : 'Show password'}
              aria-pressed={revealed}
              disabled={disabled || !password}
              className="btn-reveal"
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
              className="btn-regenerate"
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
