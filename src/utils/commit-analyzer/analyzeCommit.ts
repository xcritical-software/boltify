// Parts of this source are modified from @semantic-release/commit-analyzer:
// semantic-release/commit-analyzer: https://github.com/semantic-release/commit-analyzer/blob/master/LICENSE
import log from 'npmlog';
import { isMatchWith, isRegExp } from 'lodash';
import { Rule, IRevertRule, IBreakingRule } from '../../interfaces';

import { compareReleaseTypes } from './compareReleaseTypes';
import { DEFAULT_RELEASE_RULES } from './const';


export const analyzeCommit = (releaseRules: Rule[], commit: any): string => {
  let releaseType: string;

  releaseRules
    .filter(
      ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        breaking, revert, release, ...rule
      }: IRevertRule & IBreakingRule) => (!breaking || (commit.notes && commit.notes.length > 0)) // If the rule is not `breaking` or the commit doesn't have a breaking change note
            && (!revert || commit.revert) // If the rule is not `revert` or the commit is not a revert
            && isMatchWith(commit, rule, (obj: any, src: any) => (/^\/.*\/$/.test(src) // Otherwise match the regular rules
              || isRegExp(src)
              ? new RegExp(/^\/(.*)\/$/.exec(src)[1]).test(obj) : undefined)),
    )
    .every((match) => {
      if (compareReleaseTypes(releaseType, match.release)) {
        releaseType = match.release;
        log.verbose('boltify:commit-analyzer', 'The rule %o match commit with release type %o', match, releaseType);
        if (releaseType === DEFAULT_RELEASE_RULES[0]) {
          log.verbose('boltify:commit-analyzer', 'Release type %o is the highest possible. Stop analysis.', releaseType);
          return false;
        }
      } else {
        log.verbose('boltify:commit-analyzer',
          'The rule %o match commit with release type %o but the higher release type %o has already been found for this commit',
          match,
          match.release,
          releaseType);
      }

      return true;
    });

  return releaseType;
};
