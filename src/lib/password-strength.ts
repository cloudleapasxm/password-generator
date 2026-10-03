/**
 * Entropy estimation and strength labelling.
 *
 * These are *estimates* for comparing configurations, not guarantees of
 * real-world resistance to every attack (phishing, reuse, and database
 * leaks are not modelled here). Strength is never derived from length alone:
 * it is always length × effective pool size, adjusted for the
 * require-each-group constraint and, for passphrases, word-list size.
 */

import { WORD_LIST } from './words';
import { applyExclusions, CHAR_SETS, getPasswordPool, getActiveGroups } from './password-generator';
import type { GeneratorConfig, StrengthLabel } from '../types/password';

/** Effective character pool for entropy math (PIN mode = digits only). */
function effectivePool(config: GeneratorConfig): string {
  if (config.mode === 'pin') return applyExclusions(CHAR_SETS.digits, config);
  return getPasswordPool(config);
}

/** Estimated entropy in bits for the given configuration. */
export function estimateEntropyBits(config: GeneratorConfig): number {
  if (config.mode === 'passphrase') {
    const perWord = Math.log2(WORD_LIST.length);
    const capitalizationBonus = config.capitalizeWords ? config.wordCount : 0; // ~1 bit per word
    return Math.max(0, config.wordCount * perWord + capitalizationBonus);
  }

  const pool = effectivePool(config);
  const poolSize = pool.length;
  const length = config.length;
  if (poolSize === 0 || length <= 0) return 0;

  let bits = length * Math.log2(poolSize);

  if (config.requireEachGroup) {
    const groups = getActiveGroups(config).filter((g) => g.chars.length > 0);
    if (groups.length > 1) {
      // Requiring ≥1 char per group slightly shrinks the valid space.
      // Approximate the fraction of random strings satisfying the constraint
      // (treating groups as independent) and subtract it from the total.
      let satisfyingFraction = 1;
      for (const group of groups) {
        const missingGroup = Math.pow((poolSize - group.chars.length) / poolSize, length);
        satisfyingFraction *= 1 - missingGroup;
      }
      bits += Math.log2(Math.max(satisfyingFraction, Number.MIN_VALUE));
    }
  }

  return Math.max(0, bits);
}

export function strengthLabel(bits: number): StrengthLabel {
  if (bits < 45) return 'Weak';
  if (bits < 60) return 'Fair';
  if (bits < 80) return 'Good';
  if (bits < 100) return 'Strong';
  return 'Very Strong';
}

/** 0–4 index used to fill the meter segments. */
export function strengthLevel(bits: number): number {
  if (bits < 45) return 0;
  if (bits < 60) return 1;
  if (bits < 80) return 2;
  if (bits < 100) return 3;
  return 4;
}

/** Short, honest explanation of what drives the estimate. */
export function strengthExplanation(config: GeneratorConfig, bits: number): string {
  if (config.mode === 'passphrase') {
    return (
      `About ${bits.toFixed(0)} bits from ${config.wordCount} randomly chosen words ` +
      `(~${Math.log2(WORD_LIST.length).toFixed(1)} bits per word from a list of ${WORD_LIST.length.toLocaleString()}). ` +
      `Longer word counts raise the estimate; the words themselves are unrelated to each other.`
    );
  }
  if (config.mode === 'pin') {
    return (
      `About ${bits.toFixed(0)} bits from ${config.length} random digits. ` +
      `PINs are convenient but weak against online guessing — prefer a full password where possible.`
    );
  }
  const poolSize = effectivePool(config).length;
  const groupCount = getActiveGroups(config).filter((g) => g.chars.length > 0).length;
  return (
    `About ${bits.toFixed(0)} bits from ${config.length} characters drawn from a pool of ${poolSize} ` +
    `(${groupCount} character ${groupCount === 1 ? 'group' : 'groups'}). ` +
    `Length and pool size together drive the estimate — never length alone.`
  );
}
