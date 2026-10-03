import { describe, it, expect } from 'vitest';
import { sanitizeLengthInput, validateConfig } from '../src/lib/validation';
import { CHAR_SETS, DEFAULT_CONFIG } from '../src/lib/password-generator';
import type { GeneratorConfig } from '../src/types/password';

const base: GeneratorConfig = { ...DEFAULT_CONFIG };

describe('validateConfig', () => {
  it('accepts the default configuration', () => {
    expect(validateConfig(base)).toEqual([]);
  });

  it('rejects lengths outside 8–128', () => {
    expect(validateConfig({ ...base, length: 7 })[0]).toMatch(/between 8 and 128/);
    expect(validateConfig({ ...base, length: 129 })[0]).toMatch(/between 8 and 128/);
    expect(validateConfig({ ...base, length: 20 })).toEqual([]);
  });

  it('requires at least one character group', () => {
    const errors = validateConfig({
      ...base,
      includeUppercase: false,
      includeLowercase: false,
      includeDigits: false,
      includeSymbols: false,
    });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/character group/i);
  });

  it('rejects exclusions that empty the pool', () => {
    const everything = CHAR_SETS.uppercase + CHAR_SETS.lowercase + CHAR_SETS.digits + CHAR_SETS.symbols;
    const errors = validateConfig({ ...base, customExclusions: everything });
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toMatch(/exclusions/i);
  });

  it('flags impossible per-group guarantees', () => {
    const errors = validateConfig({ ...base, length: 2, requireEachGroup: true });
    expect(errors.some((e) => e.match(/character groups/i))).toBe(true);
  });

  it('validates PIN configs', () => {
    expect(validateConfig({ ...base, mode: 'pin', length: 6 })).toEqual([]);
    const errors = validateConfig({ ...base, mode: 'pin', customExclusions: '0123456789' });
    expect(errors.length).toBeGreaterThan(0);
  });

  it('validates passphrase configs', () => {
    expect(validateConfig({ ...base, mode: 'passphrase', wordCount: 6 })).toEqual([]);
    expect(validateConfig({ ...base, mode: 'passphrase', wordCount: 2 }).length).toBeGreaterThan(0);
    expect(validateConfig({ ...base, mode: 'passphrase', wordCount: 13 }).length).toBeGreaterThan(0);
    expect(
      validateConfig({ ...base, mode: 'passphrase', separator: '123456789' }).length
    ).toBeGreaterThan(0);
  });

  it('writes messages for users, not developers', () => {
    const errors = validateConfig({ ...base, length: 3 });
    for (const e of errors) {
      expect(e).not.toMatch(/undefined|null|NaN|stack/i);
    }
  });
});

describe('sanitizeLengthInput', () => {
  it('parses plain integers', () => {
    expect(sanitizeLengthInput('20')).toBe(20);
    expect(sanitizeLengthInput('  32 ')).toBe(32);
  });

  it('returns null for empty or non-numeric input', () => {
    expect(sanitizeLengthInput('')).toBeNull();
    expect(sanitizeLengthInput('abc')).toBeNull();
    expect(sanitizeLengthInput('12.5')).toBeNull();
  });

  it('clamps to the supported range', () => {
    expect(sanitizeLengthInput('5')).toBe(8);
    expect(sanitizeLengthInput('500')).toBe(128);
  });
});
