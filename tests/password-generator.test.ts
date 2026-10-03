import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  AMBIGUOUS_CHARS,
  CHAR_SETS,
  CryptoUnavailableError,
  DEFAULT_CONFIG,
  InvalidConfigError,
  LIMITS,
  WORD_LIST,
  applyExclusions,
  generatePassword,
  generatePassphrase,
  getActiveGroups,
  secureRandomInt,
  secureShuffle,
} from '../src/lib/password-generator';
import type { GeneratorConfig } from '../src/types/password';

const base: GeneratorConfig = { ...DEFAULT_CONFIG };

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('secureRandomInt', () => {
  it('returns integers within [0, maxExclusive)', () => {
    for (let i = 0; i < 1000; i++) {
      const v = secureRandomInt(10);
      expect(Number.isInteger(v)).toBe(true);
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(10);
    }
  });

  it('handles a bound of 1', () => {
    for (let i = 0; i < 50; i++) expect(secureRandomInt(1)).toBe(0);
  });

  it('rejects non-positive or non-integer bounds', () => {
    expect(() => secureRandomInt(0)).toThrow(InvalidConfigError);
    expect(() => secureRandomInt(-5)).toThrow(InvalidConfigError);
    expect(() => secureRandomInt(2.5)).toThrow(InvalidConfigError);
  });

  it('produces a roughly uniform distribution (rejection sampling sanity)', () => {
    const counts = [0, 0];
    const n = 20000;
    for (let i = 0; i < n; i++) counts[secureRandomInt(2)]++;
    // 14+ sigma away from 50/50 would be essentially impossible if biased.
    expect(counts[0]).toBeGreaterThan(n * 0.45);
    expect(counts[0]).toBeLessThan(n * 0.55);
  });

  it('throws CryptoUnavailableError when Web Crypto is missing', () => {
    vi.stubGlobal('crypto', undefined);
    expect(() => secureRandomInt(10)).toThrow(CryptoUnavailableError);
  });
});

describe('secureShuffle', () => {
  it('returns a permutation of the input without mutating it', () => {
    const input = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    const shuffled = secureShuffle(input);
    expect([...shuffled].sort()).toEqual([...input].sort());
    expect(input).toEqual(['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']);
  });
});

describe('generatePassword', () => {
  it('never uses Math.random for generation', () => {
    const spy = vi.spyOn(Math, 'random');
    for (let i = 0; i < 20; i++) generatePassword(base);
    expect(spy).not.toHaveBeenCalled();
  });

  it('respects the default length of 20', () => {
    expect(generatePassword(base)).toHaveLength(20);
  });

  it('supports the minimum and maximum lengths', () => {
    expect(generatePassword({ ...base, length: LIMITS.minLength })).toHaveLength(LIMITS.minLength);
    expect(generatePassword({ ...base, length: LIMITS.maxLength })).toHaveLength(LIMITS.maxLength);
  });

  it('rejects lengths outside 8–128', () => {
    expect(() => generatePassword({ ...base, length: 7 })).toThrow(InvalidConfigError);
    expect(() => generatePassword({ ...base, length: 129 })).toThrow(InvalidConfigError);
  });

  it('uses only the enabled character group', () => {
    expect(generatePassword({ ...base, includeLowercase: false, includeDigits: false, includeSymbols: false })).toMatch(/^[A-Z]+$/);
    expect(generatePassword({ ...base, includeUppercase: false, includeDigits: false, includeSymbols: false })).toMatch(/^[a-z]+$/);
    expect(generatePassword({ ...base, includeUppercase: false, includeLowercase: false, includeSymbols: false })).toMatch(/^[0-9]+$/);
    const symbolsOnly = generatePassword({ ...base, includeUppercase: false, includeLowercase: false, includeDigits: false });
    expect(symbolsOnly.length).toBe(20);
    expect([...symbolsOnly].every((ch) => CHAR_SETS.symbols.includes(ch))).toBe(true);
  });

  it('throws when every character group is disabled', () => {
    expect(() =>
      generatePassword({ ...base, includeUppercase: false, includeLowercase: false, includeDigits: false, includeSymbols: false })
    ).toThrow(InvalidConfigError);
  });

  it('includes at least one character from each enabled group when required', () => {
    for (let i = 0; i < 100; i++) {
      const pw = generatePassword(base);
      expect([...pw].some((ch) => CHAR_SETS.uppercase.includes(ch))).toBe(true);
      expect([...pw].some((ch) => CHAR_SETS.lowercase.includes(ch))).toBe(true);
      expect([...pw].some((ch) => CHAR_SETS.digits.includes(ch))).toBe(true);
      expect([...pw].some((ch) => CHAR_SETS.symbols.includes(ch))).toBe(true);
    }
  });

  it('does not place required characters in predictable positions', () => {
    // With all groups enabled and length 20, the first 4 chars must not
    // always be exactly one-of-each-group in group order.
    const seen = new Set<string>();
    for (let i = 0; i < 50; i++) {
      seen.add(generatePassword(base).slice(0, 4));
    }
    expect(seen.size).toBeGreaterThan(1);
  });

  it('excludes ambiguous characters when requested', () => {
    const cfg = { ...base, excludeAmbiguous: true };
    for (let i = 0; i < 100; i++) {
      const pw = generatePassword(cfg);
      expect([...pw].some((ch) => AMBIGUOUS_CHARS.includes(ch))).toBe(false);
    }
  });

  it('honours custom character exclusions', () => {
    const cfg = { ...base, customExclusions: 'abcXYZ019$' };
    for (let i = 0; i < 50; i++) {
      const pw = generatePassword(cfg);
      expect([...pw].some((ch) => 'abcXYZ019$'.includes(ch))).toBe(false);
    }
  });

  it('throws when exclusions remove every available character', () => {
    const everything = CHAR_SETS.uppercase + CHAR_SETS.lowercase + CHAR_SETS.digits + CHAR_SETS.symbols;
    expect(() => generatePassword({ ...base, customExclusions: everything })).toThrow(InvalidConfigError);
  });

  it('generates digits-only PINs', () => {
    const pin = generatePassword({ ...base, mode: 'pin', length: 6 });
    expect(pin).toMatch(/^\d{6}$/);
  });

  it('throws when exclusions remove all digits in PIN mode', () => {
    expect(() => generatePassword({ ...base, mode: 'pin', customExclusions: '0123456789' })).toThrow(
      InvalidConfigError
    );
  });

  it('throws CryptoUnavailableError when Web Crypto is missing', () => {
    vi.stubGlobal('crypto', undefined);
    expect(() => generatePassword(base)).toThrow(CryptoUnavailableError);
  });

  it('produces distinct values on consecutive calls', () => {
    const seen = new Set([generatePassword(base), generatePassword(base), generatePassword(base)]);
    expect(seen.size).toBe(3);
  });
});

describe('generatePassphrase', () => {
  it('generates the requested number of words from the word list', () => {
    const phrase = generatePassphrase({ ...base, mode: 'passphrase', wordCount: 6, separator: '-' });
    const words = phrase.split('-');
    expect(words).toHaveLength(6);
    for (const w of words) expect(WORD_LIST).toContain(w);
  });

  it('respects a custom separator and capitalization', () => {
    const phrase = generatePassphrase({ ...base, mode: 'passphrase', wordCount: 4, separator: ' ', capitalizeWords: true });
    const words = phrase.split(' ');
    expect(words).toHaveLength(4);
    for (const w of words) {
      expect(w[0]).toBe(w[0].toUpperCase());
      expect(WORD_LIST).toContain(w.toLowerCase());
    }
  });

  it('rejects invalid word counts and overlong separators', () => {
    expect(() => generatePassphrase({ ...base, mode: 'passphrase', wordCount: 2 })).toThrow(InvalidConfigError);
    expect(() => generatePassphrase({ ...base, mode: 'passphrase', wordCount: 13 })).toThrow(InvalidConfigError);
    expect(() => generatePassphrase({ ...base, mode: 'passphrase', separator: '123456789' })).toThrow(InvalidConfigError);
  });
});

describe('getActiveGroups / applyExclusions', () => {
  it('returns all four groups by default', () => {
    expect(getActiveGroups(base).map((g) => g.id)).toEqual(['uppercase', 'lowercase', 'digits', 'symbols']);
  });

  it('applyExclusions removes ambiguous and custom characters', () => {
    const pool = applyExclusions('aAbB01IlO|$', { ...base, excludeAmbiguous: true, customExclusions: '$' });
    expect(pool).toBe('aAbB');
  });
});
