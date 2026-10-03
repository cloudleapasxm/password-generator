/**
 * Cryptographically secure password / PIN / passphrase generation.
 *
 * Security contract (must hold for every change to this file):
 * - Randomness comes ONLY from the Web Crypto API (`crypto.getRandomValues`).
 *   `Math.random()` is never used for anything secret.
 * - Index selection uses rejection sampling so there is no modulo bias.
 * - When `requireEachGroup` is on, one character from each enabled group is
 *   forced in and the result is shuffled with a CSPRNG Fisher–Yates shuffle,
 *   so group characters are not in predictable positions.
 * - Generated values are never logged, never persisted (no localStorage,
 *   sessionStorage, cookies, URLs, or history state), and never sent anywhere.
 * - If Web Crypto is unavailable we throw a clear error. We NEVER silently
 *   fall back to an insecure generator.
 */

import { WORD_LIST } from './words';
import type { GeneratorConfig } from '../types/password';

/** Re-exported for consumers that need the raw list (e.g. entropy math). */
export { WORD_LIST };

/** Explicitly supported symbol characters (shown verbatim in the UI). */
export const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.<>?/~';

export const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  digits: '0123456789',
  symbols: SYMBOLS,
} as const;

export type CharGroupId = keyof typeof CHAR_SETS;

/** Visually ambiguous characters removed by the "exclude ambiguous" option. */
export const AMBIGUOUS_CHARS = 'Il1O0o|';

export const LIMITS = {
  minLength: 8,
  /** PINs are conventionally short; password mode still starts at 8. */
  minPinLength: 4,
  maxLength: 128,
  defaultLength: 20,
  minWords: 3,
  maxWords: 12,
  defaultWords: 6,
  maxSeparatorLength: 8,
  maxHistoryEntries: 20,
} as const;

/** Thrown when `crypto.getRandomValues` is not available. */
export class CryptoUnavailableError extends Error {
  constructor() {
    super(
      'Secure random number generation is not available in this browser. ' +
        'SecurePass needs the Web Crypto API (crypto.getRandomValues) and will not ' +
        'generate passwords without it.'
    );
    this.name = 'CryptoUnavailableError';
  }
}

/** Thrown when a generation request fails validation. */
export class InvalidConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidConfigError';
  }
}

function getCrypto(): Crypto {
  const webCrypto: Crypto | undefined =
    typeof globalThis !== 'undefined' ? (globalThis as { crypto?: Crypto }).crypto : undefined;
  if (!webCrypto || typeof webCrypto.getRandomValues !== 'function') {
    throw new CryptoUnavailableError();
  }
  return webCrypto;
}

/**
 * Uniform random integer in [0, maxExclusive) using rejection sampling
 * over 32-bit values, eliminating modulo bias.
 */
export function secureRandomInt(maxExclusive: number): number {
  if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
    throw new InvalidConfigError('secureRandomInt requires a positive integer bound.');
  }
  const crypto = getCrypto();
  // Largest multiple of maxExclusive that fits in 2^32; values >= limit are
  // discarded so every remaining value maps uniformly via `%`.
  const range = 0x1_0000_0000;
  const limit = range - (range % maxExclusive);
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= limit);
  return value % maxExclusive;
}

/** Fisher–Yates shuffle driven by `secureRandomInt`. Returns a new array. */
export function secureShuffle<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export interface ActiveGroup {
  id: CharGroupId;
  chars: string;
}

/** Remove ambiguous and user-excluded characters from a character pool. */
export function applyExclusions(pool: string, config: GeneratorConfig): string {
  let result = pool;
  if (config.excludeAmbiguous) {
    const ambiguous = new Set(AMBIGUOUS_CHARS);
    result = [...result].filter((ch) => !ambiguous.has(ch)).join('');
  }
  if (config.customExclusions) {
    const excluded = new Set([...config.customExclusions]);
    result = [...result].filter((ch) => !excluded.has(ch)).join('');
  }
  return result;
}

/** Character groups enabled in the config, after exclusions. */
export function getActiveGroups(config: GeneratorConfig): ActiveGroup[] {
  const groups: ActiveGroup[] = [];
  if (config.includeUppercase) groups.push({ id: 'uppercase', chars: CHAR_SETS.uppercase });
  if (config.includeLowercase) groups.push({ id: 'lowercase', chars: CHAR_SETS.lowercase });
  if (config.includeDigits) groups.push({ id: 'digits', chars: CHAR_SETS.digits });
  if (config.includeSymbols) groups.push({ id: 'symbols', chars: CHAR_SETS.symbols });
  return groups.map((g) => ({ ...g, chars: applyExclusions(g.chars, config) }));
}

/** Full candidate pool for `password` mode (concatenation of active groups). */
export function getPasswordPool(config: GeneratorConfig): string {
  return getActiveGroups(config)
    .map((g) => g.chars)
    .join('');
}

/**
 * Generate one password / PIN / passphrase from the config.
 * Throws `InvalidConfigError` or `CryptoUnavailableError` on bad input or
 * missing Web Crypto — never returns a value that violates the config.
 */
export function generatePassword(config: GeneratorConfig): string {
  if (config.mode === 'passphrase') {
    return generatePassphrase(config);
  }

  const pool = config.mode === 'pin' ? applyExclusions(CHAR_SETS.digits, config) : getPasswordPool(config);
  const minLength = config.mode === 'pin' ? LIMITS.minPinLength : LIMITS.minLength;

  if (!Number.isInteger(config.length) || config.length < minLength || config.length > LIMITS.maxLength) {
    throw new InvalidConfigError(
      `Password length must be an integer between ${minLength} and ${LIMITS.maxLength}.`
    );
  }
  if (pool.length === 0) {
    throw new InvalidConfigError(
      config.mode === 'pin'
        ? 'Your exclusions remove every digit, so no PIN can be generated.'
        : 'Select at least one character group, and make sure your exclusions do not remove every available character.'
    );
  }

  if (config.mode === 'pin') {
    let pin = '';
    for (let i = 0; i < config.length; i++) {
      pin += pool[secureRandomInt(pool.length)];
    }
    return pin;
  }

  const groups = getActiveGroups(config).filter((g) => g.chars.length > 0);
  if (groups.length === 0) {
    throw new InvalidConfigError('Select at least one character group to generate a password.');
  }

  const chars: string[] = [];
  if (config.requireEachGroup && groups.length > 1) {
    if (config.length < groups.length) {
      throw new InvalidConfigError(
        'The password length is shorter than the number of enabled character groups, so one character per group cannot be guaranteed.'
      );
    }
    // Force one character from each group, then shuffle everything so the
    // forced characters are not in predictable positions.
    for (const group of groups) {
      chars.push(group.chars[secureRandomInt(group.chars.length)]);
    }
  }
  while (chars.length < config.length) {
    chars.push(pool[secureRandomInt(pool.length)]);
  }
  return secureShuffle(chars).join('');
}

/** Generate a memorable passphrase from the bundled EFF word list. */
export function generatePassphrase(config: GeneratorConfig): string {
  if (
    !Number.isInteger(config.wordCount) ||
    config.wordCount < LIMITS.minWords ||
    config.wordCount > LIMITS.maxWords
  ) {
    throw new InvalidConfigError(
      `Passphrase word count must be an integer between ${LIMITS.minWords} and ${LIMITS.maxWords}.`
    );
  }
  if (config.separator.length > LIMITS.maxSeparatorLength) {
    throw new InvalidConfigError('The passphrase separator is too long.');
  }
  const words: string[] = [];
  for (let i = 0; i < config.wordCount; i++) {
    const word = WORD_LIST[secureRandomInt(WORD_LIST.length)];
    words.push(config.capitalizeWords ? word.charAt(0).toUpperCase() + word.slice(1) : word);
  }
  return words.join(config.separator);
}

/** Default configuration applied on first load (also the "Strong" preset). */
export const DEFAULT_CONFIG: GeneratorConfig = {
  mode: 'password',
  length: LIMITS.defaultLength,
  wordCount: LIMITS.defaultWords,
  separator: '-',
  capitalizeWords: false,
  includeUppercase: true,
  includeLowercase: true,
  includeDigits: true,
  includeSymbols: true,
  excludeAmbiguous: false,
  customExclusions: '',
  requireEachGroup: true,
};
