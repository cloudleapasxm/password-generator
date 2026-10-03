import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_CONFIG,
  LIMITS,
  generatePassword,
} from '../lib/password-generator';
import { validateConfig } from '../lib/validation';
import { estimateEntropyBits, strengthLabel } from '../lib/password-strength';
import { getPreset } from '../lib/presets';
import type { GeneratorConfig, HistoryEntry, StrengthLabel } from '../types/password';

let historyCounter = 0;

function describeConfig(config: GeneratorConfig): string {
  if (config.mode === 'passphrase') {
    return `${config.wordCount}-word passphrase`;
  }
  if (config.mode === 'pin') {
    return `${config.length}-digit PIN`;
  }
  const groups: string[] = [];
  if (config.includeUppercase) groups.push('A–Z');
  if (config.includeLowercase) groups.push('a–z');
  if (config.includeDigits) groups.push('0–9');
  if (config.includeSymbols) groups.push('symbols');
  return `${config.length} chars · ${groups.join(', ') || 'no groups'}`;
}

/**
 * Owns generator state: config, current value, validation, entropy and the
 * optional in-memory-only history. Passwords live in React state only and
 * are never written to any persistent storage.
 */
export function usePasswordGenerator() {
  const [config, setConfig] = useState<GeneratorConfig>(DEFAULT_CONFIG);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activePresetId, setActivePresetId] = useState<string | null>('strong');
  const [historyEnabled, setHistoryEnabled] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const historyEnabledRef = useRef(historyEnabled);
  historyEnabledRef.current = historyEnabled;

  const regenerate = useCallback(() => {
    const problems = validateConfig(config);
    if (problems.length > 0) {
      setError(problems[0]);
      return;
    }
    try {
      const value = generatePassword(config);
      setPassword(value);
      setError(null);
      if (historyEnabledRef.current) {
        historyCounter += 1;
        const entry: HistoryEntry = {
          id: `${Date.now()}-${historyCounter}`,
          value,
          createdAt: Date.now(),
          summary: describeConfig(config),
        };
        setHistory((prev) => [entry, ...prev].slice(0, LIMITS.maxHistoryEntries));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not generate a password with these settings.');
    }
  }, [config]);

  // Regenerate whenever the configuration changes (including first mount).
  useEffect(() => {
    regenerate();
  }, [regenerate]);

  const updateConfig = useCallback((patch: Partial<GeneratorConfig>) => {
    setConfig((prev) => ({ ...prev, ...patch }));
    setActivePresetId(null);
  }, []);

  const applyPreset = useCallback((presetId: string) => {
    const preset = getPreset(presetId);
    if (!preset) return;
    setConfig({ ...preset.config });
    setActivePresetId(presetId);
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const removeHistoryEntry = useCallback((id: string) => {
    setHistory((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  // Turning history off also drops everything collected so far.
  const toggleHistory = useCallback((enabled: boolean) => {
    setHistoryEnabled(enabled);
    if (!enabled) setHistory([]);
  }, []);

  const entropyBits = useMemo(() => {
    try {
      return estimateEntropyBits(config);
    } catch {
      return 0;
    }
  }, [config]);

  const strength: StrengthLabel = useMemo(() => strengthLabel(entropyBits), [entropyBits]);

  return {
    config,
    updateConfig,
    applyPreset,
    activePresetId,
    password,
    error,
    entropyBits,
    strength,
    regenerate,
    history,
    historyEnabled,
    toggleHistory,
    clearHistory,
    removeHistoryEntry,
  };
}
