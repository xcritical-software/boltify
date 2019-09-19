import execa from 'execa';
import path from 'path';
import regex from 'conventional-commits-parser/lib/regex.js';
import parser from 'conventional-commits-parser/lib/parser.js';
import analyzeCommit from '@semantic-release/commit-analyzer/lib/analyze-commit';


export async function getRef(name: string): Promise<string> {
  try {
    const { stdout } = await execa('git', ['rev-parse', name]);
    return stdout.trim().split('\n')[0];
  } catch {
    return null;
  }
}

export async function getMasterRef(): Promise<string> {
  return getRef('master');
}

export async function getLatestTag(): Promise<string> {
  try {
    const { stdout } = await execa('git', ['describe', '--tags', '--abbrev=0']);
    return stdout.trim().split('\n')[0];
  } catch (e) {
    return null;
  }
}

export async function getChangedFilesSinceRef(
  ref: string,
  fullPath = false,
): Promise<string[]> {
  // First we need to find the commit where we diverged from `ref` at using `git merge-base`
  let cmd = await execa('git', ['merge-base', ref, 'HEAD']);
  const divergedAt = cmd.stdout.trim();
  // Now we can find which files we added
  cmd = await execa('git', ['diff', '--name-only', divergedAt]);
  const files = cmd.stdout.trim().split('\n');
  if (!fullPath) return files;
  return files.map((file: string) => path.resolve(file));
}

export async function getChangedFilesSinceMaster(fullPath = false): Promise<string[]> {
  const ref = await getMasterRef();
  return getChangedFilesSinceRef(ref, fullPath);
}

export async function analyzeCommitsSinceRef(ref: string, workspace: string): Promise<string> {
  const { stdout } = await execa('git', [
    'log',
    `${ref}..HEAD`,
    '--stat',
    '--name-only',
    '--format=%B%n------------------------ >8 ------------------------',
    '--',
    workspace,
  ]);

  const options = {
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
      'added',
    ],
    issuePrefixes: ['#'],
    noteKeywords: ['BREAKING CHANGE'],
    fieldPattern: /^-(.*?)-$/,
    revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
    revertCorrespondence: ['header', 'hash'],
    warn: function () {},
    mergePattern: null as any,
    mergeCorrespondence: null as any,
  };

  const releaseRules = [
    { type: '/feat/', release: 'minor' },
    { type: '/fix/', release: 'patch' },
    { type: '/perf/', release: 'patch' },
  ];

  const parsed = parser(stdout.trim(), options, regex(options));
  console.log(parsed);
  const release = analyzeCommit(releaseRules, parsed);
  console.log(release);

  return release;
}
