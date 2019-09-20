import execa from 'execa';
import path from 'path';
import regex from 'conventional-commits-parser/lib/regex';
import parser from 'conventional-commits-parser/lib/parser';
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
  if (ref === null) {
    throw Error('Error: Current ref is undefined');
  }

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
      'adds',
      'added',
    ],
    issuePrefixes: ['#'],
    noteKeywords: ['BREAKING CHANGE'],
    fieldPattern: /^-(.*?)-$/,
    revertPattern: /^Revert\s"([\s\S]*)"\s*This reverts commit (\w*)\./,
    revertCorrespondence: ['header', 'hash'],
    mergePattern: null as any,
    mergeCorrespondence: null as any,
  };

  const releaseRules = [
    { type: '/feat/', release: 'patch' },
    { type: '/fix/', release: 'patch' },
    { type: '/perf/', release: 'patch' },
    { type: '/bump(patch)/', release: 'patch' },
    { type: '/bump(minor)/', release: 'minor' },
    { type: '/bump(major)/', release: 'major' },
  ];

  try {
    const parsed = parser(stdout.trim(), options, regex(options));
    const release = analyzeCommit(releaseRules, parsed);

    return release;
  } catch (e) {
    return null;
  }
}

export async function getFirstCommitByWorkspaceFolder(
  workspaceFolder: string,
): Promise<string> {
  const { stdout } = await execa('git', [
    'log',
    '--reverse',
    '--pretty=format:%H',
    '--',
    workspaceFolder,
  ]);

  return stdout.split('\n')[0].trim();
}

export async function getTags({ isRevert }: { isRevert: boolean }): Promise<string[]> {
  const execaOpts = ['tag'];

  if (isRevert) {
    execaOpts.push('--sort=-refname');
  }

  return (await execa('git', execaOpts)).stdout
    .split('\n')
    .map(tag => tag.trim());
}

export async function isRefInHistory(ref: string): Promise<boolean> {
  try {
    await execa('git', ['merge-base', '--is-ancestor', ref, 'HEAD']);
    return true;
  } catch (error) {
    if (error.code === 1) {
      return false;
    }

    throw error;
  }
}

export async function addTag(tag: string, message?: string, ref = 'HEAD'): Promise<void> {
  await execa('git', ['tag', '-a', tag, '-m', (message || tag), ref]);
}

export async function pushTag(): Promise<void> {
  await execa('git', ['push', 'origin', '--tags']);
}
