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
 * Prominent password readout: monospace, reveal/conceal, copy with
 * success feedback + screen-reader announcement, and regenerate.
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
      <div className="flex items-stretch gap-2">
        <div
          className="min-w-0 flex-1 overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-700 dark:bg-zinc-800/60"
          aria-label="Generated password"
        >
          <output
            aria-live="off"
            className="block whitespace-nowrap font-mono text-lg leading-8 tracking-wide text-zinc-900 dark:text-zinc-50"
          >
            {password ? shown : <span className="text-zinc-400 dark:text-zinc-500">—</span>}
          </output>
        </div>
        <Tooltip label={revealed ? 'Hide password' : 'Show password'}>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? 'Hide password' : 'Show password'}
            aria-pressed={revealed}
            disabled={disabled || !password}
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

      <div className="mt-3 flex flex-col gap-2">
        <Button
          type="button"
          variant="primary"
          onClick={handleCopy}
          disabled={disabled || !password}
          aria-live="off"
          className="w-full sm:w-auto"
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
        {copyState === 'failed' ? (
          <p className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400">
            <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden="true" />
            Could not access the clipboard. You can still select and copy the password manually.
          </p>
        ) : null}
      </div>

      {/* Screen-reader announcements for copy results (never the password itself). */}
      <div aria-live="polite" role="status" className="sr-only">
        {copyState === 'copied' ? 'Password copied to clipboard.' : ''}
        {copyState === 'failed' ? 'Copy failed. Clipboard access was not available.' : ''}
      </div>
    </div>
  );
}
