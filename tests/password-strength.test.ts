import { describe, it, expect } from 'vitest';
import {
  estimateEntropyBits,
  strengthExplanation,
  strengthLabel,
  strengthLevel,
} from '../src/lib/password-strength';
import { WORD_LIST, DEFAULT_CONFIG } from '../src/lib/password-generator';
import type { GeneratorConfig } from '../src/types/password';

const base: GeneratorConfig = { ...DEFAULT_CONFIG };

describe('estimateEntropyBits', () => {
  it('equals length × log2(poolSize) without group requirements', () => {
    const cfg = { ...base, requireEachGroup: false };
    // 26 + 26 + 10 + 27 symbols = 89
    expect(estimateEntropyBits(cfg)).toBeCloseTo(20 * Math.log2(89), 6);
  });

  it('is slightly lower when each group is required', () => {
    const plain = estimateEntropyBits({ ...base, requireEachGroup: false });
    const required = estimateEntropyBits({ ...base, requireEachGroup: true });
    expect(required).toBeLessThan(plain);
    expect(required).toBeGreaterThan(plain - 1); // tiny correction for sane lengths
  });

  it('grows with length and shrinks with smaller pools', () => {
    const long = estimateEntropyBits({ ...base, length: 64 });
    const short = estimateEntropyBits({ ...base, length: 8 });
    expect(long).toBeGreaterThan(short);
    const digitsOnly = estimateEntropyBits({
      ...base,
      includeUppercase: false,
      includeLowercase: false,
      includeSymbols: false,
    });
    expect(digitsOnly).toBeLessThan(estimateEntropyBits(base));
  });

  it('estimates passphrase entropy from the word list', () => {
    const bits = estimateEntropyBits({ ...base, mode: 'passphrase', wordCount: 6 });
    expect(bits).toBeCloseTo(6 * Math.log2(WORD_LIST.length), 6);
  });

  it('adds roughly one bit per word for capitalization', () => {
    const plain = estimateEntropyBits({ ...base, mode: 'passphrase', wordCount: 5 });
    const capped = estimateEntropyBits({ ...base, mode: 'passphrase', wordCount: 5, capitalizeWords: true });
    expect(capped - plain).toBeCloseTo(5, 6);
  });

  it('estimates PIN entropy from digits only', () => {
    const bits = estimateEntropyBits({ ...base, mode: 'pin', length: 6, requireEachGroup: false });
    expect(bits).toBeCloseTo(6 * Math.log2(10), 6);
  });

  it('returns 0 for degenerate configs instead of NaN', () => {
    expect(
      estimateEntropyBits({ ...base, includeUppercase: false, includeLowercase: false, includeDigits: false, includeSymbols: false })
    ).toBe(0);
  });
});

describe('strengthLabel / strengthLevel', () => {
  it.each([
    [0, 'Weak', 0],
    [30, 'Weak', 0],
    [44.9, 'Weak', 0],
    [45, 'Fair', 1],
    [59.9, 'Fair', 1],
    [60, 'Good', 2],
    [79.9, 'Good', 2],
    [80, 'Strong', 3],
    [99.9, 'Strong', 3],
    [100, 'Very Strong', 4],
    [200, 'Very Strong', 4],
  ] as const)('maps %d bits to %s (level %d)', (bits, label, level) => {
    expect(strengthLabel(bits)).toBe(label);
    expect(strengthLevel(bits)).toBe(level);
  });
});

describe('strengthExplanation', () => {
  it('explains password entropy in plain language', () => {
    const text = strengthExplanation(base, estimateEntropyBits(base));
    expect(text).toContain('bits');
    expect(text).toContain('20');
  });

  it('explains passphrase entropy via the word list', () => {
    const cfg: GeneratorConfig = { ...base, mode: 'passphrase', wordCount: 6 };
    const text = strengthExplanation(cfg, estimateEntropyBits(cfg));
    expect(text).toContain('6');
    expect(text).toContain('words');
  });
});
