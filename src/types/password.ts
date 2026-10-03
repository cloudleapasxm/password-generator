/**
 * Shared domain types for SecurePass.
 *
 * Everything password-related is generated locally in the browser and is
 * never persisted: see `src/lib/password-generator.ts`.
 */

/** The three generation modes offered by the app. */
export type PasswordMode = 'password' | 'pin' | 'passphrase';

/** Full configuration for a single generation run. */
export interface GeneratorConfig {
  mode: PasswordMode;
  /** Character length for `password` and `pin` modes (8–128). */
  length: number;
  /** Word count for `passphrase` mode (3–12). */
  wordCount: number;
  /** Separator placed between passphrase words. */
  separator: string;
  /** Capitalize the first letter of each passphrase word. */
  capitalizeWords: boolean;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeDigits: boolean;
  includeSymbols: boolean;
  /** Remove visually ambiguous characters (I, l, 1, O, 0, o, |). */
  excludeAmbiguous: boolean;
  /** Additional characters the user wants removed from every pool. */
  customExclusions: string;
  /** Guarantee ≥1 character from every enabled group (shuffled in). */
  requireEachGroup: boolean;
}

/** Text labels for the strength meter (never length-only). */
export type StrengthLabel = 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';

/** One entry of the optional, in-memory-only password history. */
export interface HistoryEntry {
  id: string;
  value: string;
  createdAt: number;
  /** Short human description of the config used (never the config itself). */
  summary: string;
}
