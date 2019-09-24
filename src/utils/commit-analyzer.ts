import regex from 'conventional-commits-parser/lib/regex';
import parser from 'conventional-commits-parser/lib/parser';
import analyzeCommit from '@semantic-release/commit-analyzer/lib/analyze-commit';
import filter from 'conventional-commits-filter';

import {
  DEFAULT_RELEASE_RULES,
  RELEASE_TYPES,
} from './const';


interface ICommitParsersOptions {
  headerPattern: RegExp;
  headerCorrespondence: string[];
  referenceActions: string[];
  issuePrefixes: string[];
  noteKeywords: string[];
  fieldPattern: RegExp;
  revertPattern: RegExp;
  revertCorrespondence: string[];
  mergePattern: null | RegExp;
  mergeCorrespondence: null | RegExp;
}


const options: ICommitParsersOptions = {
  headerPattern: /^(\w*)(?:\(([\w$.\-* ]*)\))?: (.*)$/,
  headerCorrespondence: ['type', 'scope', 'subject'],
  referenceActions: [
    'close',
    'closes',
    'closed',
    'fix',
    'fixes',
    'fixed',
    'resolve',
    'resolves',
    'resolved',
    'add',
    'adds',
    'added',
  ],
  issuePrefixes: ['#', 'CRM-'],
  noteKeywords: ['BREAKING CHANGE'],
  fieldPattern: /^-(.*?)-$/,
  revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
  revertCorrespondence: ['header', 'hash'],
  mergePattern: null as any,
  mergeCorrespondence: null as any,
};

function compareReleaseTypes(currentReleaseType: string, releaseType: string): boolean {
  return !currentReleaseType
  || DEFAULT_RELEASE_RULES.indexOf(releaseType)
     < DEFAULT_RELEASE_RULES.indexOf(currentReleaseType);
}


export function parseCommits(commitsRaw: string): any {
  const commits = commitsRaw
    .trim()
    .split('------------------------ >8 ------------------------')
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
