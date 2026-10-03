import { Copy, History, Trash2, X } from 'lucide-react';
import { copyText } from '../../lib/clipboard';
import { Button } from '../ui/Button';
import type { HistoryEntry } from '../../types/password';

interface HistoryPanelProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  entries: HistoryEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

/**
 * Optional, strictly in-memory password history.
 * Off by default; enabling shows an explicit privacy note. Entries are kept
 * in React state only and vanish on reload — nothing is persisted anywhere.
 */
export function HistoryPanel({ enabled, onToggle, entries, onRemove, onClear }: HistoryPanelProps) {
  const copyEntry = async (value: string) => {
    await copyText(value);
  };

  return (
    <div>
      <label
        htmlFor="history-toggle"
        className="flex min-h-[44px] cursor-pointer items-center justify-between gap-3"
      >
        <span className="flex items-center gap-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
          <History className="h-4 w-4 text-zinc-500 dark:text-zinc-400" aria-hidden="true" />
          Remember generated passwords
        </span>
        <button
          id="history-toggle"
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 dark:focus-visible:ring-blue-400 ${
            enabled ? 'bg-blue-700 dark:bg-blue-600' : 'bg-zinc-300 dark:bg-zinc-700'
          }`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-150 motion-reduce:transition-none ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </label>
      <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
        {enabled
          ? 'History is kept in memory only while this page is open. It is never saved, synced, or sent anywhere — it disappears when you reload or close the tab.'
          : 'Off by default. When on, recent passwords stay in this tab’s memory only.'}
      </p>

      {enabled && entries.length > 0 ? (
        <div className="mt-3">
          <ul className="space-y-2" aria-label="Password history">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-800/60"
              >
                <span className="min-w-0 flex-1 truncate font-mono text-sm text-zinc-800 dark:text-zinc-200" title={entry.summary}>
                  {'•'.repeat(Math.min(entry.value.length, 24))}
                </span>
                <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">{entry.summary}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => copyEntry(entry.value)}
                  aria-label={`Copy password from ${entry.summary}`}
                  className="!h-9 !w-9 !min-h-[36px] !min-w-[36px]"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(entry.id)}
                  aria-label={`Remove password from ${entry.summary}`}
                  className="!h-9 !w-9 !min-h-[36px] !min-w-[36px]"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
          <Button type="button" variant="danger-ghost" size="sm" onClick={onClear} className="mt-3">
            <Trash2 className="h-4 w-4" aria-hidden="true" /> Clear history
          </Button>
        </div>
      ) : null}
    </div>
  );
}
