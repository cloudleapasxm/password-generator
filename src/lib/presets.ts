/**
 * The six quick presets from the spec. Each preset is a full
 * `GeneratorConfig` so applying one reconfigures the generator (and
 * regenerates), after which the user can still tweak everything.
 */

import { DEFAULT_CONFIG } from './password-generator';
import type { GeneratorConfig } from '../types/password';

export interface Preset {
  id: string;
  name: string;
  description: string;
  config: GeneratorConfig;
}

const base: GeneratorConfig = DEFAULT_CONFIG;

export const PRESETS: Preset[] = [
  {
    id: 'strong',
    name: 'Strong Password',
    description: '20 chars, all character groups. The everyday default.',
    config: { ...base, mode: 'password', length: 20, includeUppercase: true, includeLowercase: true, includeDigits: true, includeSymbols: true, excludeAmbiguous: false, requireEachGroup: true },
  },
  {
    id: 'extra-long',
    name: 'Extra-Long Password',
    description: '64 chars for vaults, encryption keys and root accounts.',
    config: { ...base, mode: 'password', length: 64, includeUppercase: true, includeLowercase: true, includeDigits: true, includeSymbols: true, excludeAmbiguous: false, requireEachGroup: true },
  },
  {
    id: 'developer',
    name: 'Developer Password',
    description: '32 chars, no symbols — safe in shells, URLs and configs.',
    config: { ...base, mode: 'password', length: 32, includeUppercase: true, includeLowercase: true, includeDigits: true, includeSymbols: false, excludeAmbiguous: false, requireEachGroup: true },
  },
  {
    id: 'easy-read',
    name: 'Easy-to-Read Password',
    description: '16 chars without ambiguous characters like I, l, 1, O, 0.',
    config: { ...base, mode: 'password', length: 16, includeUppercase: true, includeLowercase: true, includeDigits: true, includeSymbols: false, excludeAmbiguous: true, requireEachGroup: true },
  },
  {
    id: 'pin',
    name: 'Numeric PIN',
    description: '6 digits for device locks and short numeric codes.',
    config: { ...base, mode: 'pin', length: 6, includeUppercase: false, includeLowercase: false, includeDigits: true, includeSymbols: false, excludeAmbiguous: false, requireEachGroup: false },
  },
  {
    id: 'passphrase',
    name: 'Memorable Passphrase',
    description: '6 random words — easier to type and remember.',
    config: { ...base, mode: 'passphrase', wordCount: 6, separator: '-', capitalizeWords: false, requireEachGroup: false },
  },
];

export function getPreset(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
