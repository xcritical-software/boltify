import { Rule } from '@semantic-release/commit-analyzer/lib/analyze-commit';


export const DEFAULT_RELEASE_RULES = ['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'];

export const RELEASE_TYPES: Rule[] = [
  { breaking: true, release: 'major' },
  { revert: true, release: 'patch' },
  // Angular
  { type: 'feat', release: 'patch' },
  { type: 'fix', release: 'patch' },
  { type: 'perf', release: 'patch' },
  // Atom
  { emoji: ':racehorse:', release: 'patch' },
  { emoji: ':bug:', release: 'patch' },
  { emoji: ':penguin:', release: 'patch' },
  { emoji: ':apple:', release: 'patch' },
  { emoji: ':checkered_flag:', release: 'patch' },
  // Ember
  { tag: 'BUGFIX', release: 'patch' },
  { tag: 'FEATURE', release: 'minor' },
  { tag: 'SECURITY', release: 'patch' },
  // ESLint
  { tag: 'Breaking', release: 'major' },
  { tag: 'Fix', release: 'patch' },
  { tag: 'Update', release: 'minor' },
  { tag: 'New', release: 'minor' },
  // Express
  { component: 'perf', release: 'patch' },
  { component: 'deps', release: 'patch' },
  // JSHint
  { type: 'FEAT', release: 'minor' },
  { type: 'FIX', release: 'patch' },

  { type: 'bump', scope: 'minor', release: 'minor' },
  { type: 'bump', scope: 'major', release: 'major' },
  { type: 'bump', scope: 'patch', release: 'patch' },
];
