/**
 * Human-readable validation of generator configuration.
 * Returns a list of problems; an empty list means the config is usable.
 * Messages are written for end users (no implementation details).
 */

import { getActiveGroups, getPasswordPool, LIMITS, applyExclusions, CHAR_SETS } from './password-generator';
import type { GeneratorConfig } from '../types/password';

export function validateConfig(config: GeneratorConfig): string[] {
  const errors: string[] = [];

  if (config.mode === 'passphrase') {
    if (!Number.isInteger(config.wordCount) || config.wordCount < LIMITS.minWords || config.wordCount > LIMITS.maxWords) {
      errors.push(`Choose between ${LIMITS.minWords} and ${LIMITS.maxWords} words for a passphrase.`);
    }
    if (config.separator.length > LIMITS.maxSeparatorLength) {
      errors.push('The word separator is too long — keep it under 8 characters.');
    }
    return errors;
  }

  const minLength = config.mode === 'pin' ? LIMITS.minPinLength : LIMITS.minLength;
  if (!Number.isInteger(config.length) || config.length < minLength || config.length > LIMITS.maxLength) {
    errors.push(`Password length must be between ${minLength} and ${LIMITS.maxLength} characters.`);
  }

  if (config.mode === 'pin') {
    if (applyExclusions(CHAR_SETS.digits, config).length === 0) {
      errors.push('Your exclusions remove every digit, so no PIN can be generated.');
    }
    return errors;
  }

  const groups = getActiveGroups(config);
  const enabledGroups = groups.filter((g) => g.chars.length > 0);
  const anyGroupEnabled =
    config.includeUppercase || config.includeLowercase || config.includeDigits || config.includeSymbols;

  if (!anyGroupEnabled) {
    errors.push('Select at least one character group (uppercase, lowercase, digits, or symbols).');
  } else if (enabledGroups.length === 0 || getPasswordPool(config).length === 0) {
    errors.push('Your exclusions remove every available character. Remove some exclusions or enable more groups.');
  } else if (config.requireEachGroup && enabledGroups.length > config.length) {
    errors.push(
      'The length is shorter than the number of enabled character groups, so one character per group cannot be guaranteed.'
    );
  }

  return errors;
}

/** Clamp and sanitize a raw length value coming from the numeric input. */
export function sanitizeLengthInput(raw: string): number | null {
  const trimmed = raw.trim();
  if (trimmed === '') return null;
  const value = Number(trimmed);
  if (!Number.isInteger(value)) return null;
  return Math.min(LIMITS.maxLength, Math.max(LIMITS.minLength, value));
}
