import {
  DEFAULT_RELEASE_RULES,
} from './const';


export function compareReleaseTypes(currentReleaseType: string, releaseType: string): boolean {
  return !currentReleaseType
  || DEFAULT_RELEASE_RULES.indexOf(releaseType)
     < DEFAULT_RELEASE_RULES.indexOf(currentReleaseType);
}
