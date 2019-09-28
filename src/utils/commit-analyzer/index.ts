import regex from 'conventional-commits-parser/lib/regex';
import parser from 'conventional-commits-parser/lib/parser';
import filter from 'conventional-commits-filter';

import { analyzeCommit } from './analyzeCommit';
import { compareReleaseTypes } from './compareReleaseTypes';
import { options } from './options';

import {
  RELEASE_TYPES,
} from './const';
import { SCISSOR } from '../const';


export function parseCommits(commitsRaw: string): any {
  const commits = commitsRaw
    .trim()
    .split(SCISSOR)
    .filter(f => f);
  return filter(commits.map(commit => parser(commit, options, regex(options))));
}

export function analyzeCommits(parsedCommits: object[]): string {
  let releaseType: string = null;
  parsedCommits.forEach((commit) => {
    const commitReleaseType = analyzeCommit(RELEASE_TYPES, commit);
    if (commitReleaseType) {
      console.log('The release type for the commit is %s', commitReleaseType);
    } else {
      console.log('The commit should not trigger a release');
    }

    if (commitReleaseType && compareReleaseTypes(releaseType, commitReleaseType)) {
      releaseType = commitReleaseType;
    }
  });

  return releaseType;
}
