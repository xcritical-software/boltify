/* eslint-disable @typescript-eslint/promise-function-async */

import execa, { ExecaChildProcess } from 'execa';
import path from 'path';
import { EOL } from 'os';
import log from 'npmlog';
import tempWrite from 'temp-write';

import { IFlags } from 'src/interfaces';
import { SCISSOR } from './const';


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
    throw Error('Current ref is undefined');
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

export async function getCommitsSinceRef(ref: string, workspace: string): Promise<string> {
  const { stdout } = await execa('git', [
    'log',
    `${ref}..HEAD`,
    `--format=%B%n${SCISSOR}`,
    '--',
    workspace,
  ]);
  return stdout;
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

export function addTag(tag: string, message?: string, ref = 'HEAD'): Promise<any> {
  return execa('git', ['tag', '-a', tag, '-m', (message || tag), ref]);
}

export function gitAdd(files: string[]): Promise<any> {
  log.silly('gitAdd', files.join(','));

  return execa('git', ['add', '--', ...files]);
}

export function pushTag(): Promise<any> {
  return execa('git', ['push', 'origin', '--tags']);
}


export function gitPush(remote: string, branch: string): ExecaChildProcess {
  log.silly('gitPush', remote, branch);

  return execa('git', ['push', '--follow-tags', '--no-verify', remote, branch]);
}

export function gitCommit(
  message: string,
  {
    amend,
    commitHooks,
    signGitCommit,
  }: IFlags,
): Promise<any> {
  log.silly('gitCommit', message);
  const args = ['commit'];

  if (commitHooks === false) {
    args.push('--no-verify');
  }

  if (signGitCommit) {
    args.push('--gpg-sign');
  }

  if (amend) {
    args.push('--amend', '--no-edit');
  } else if (message.includes(EOL)) {
    // Use tempfile to allow multi\nline strings.
    args.push('-F', tempWrite.sync(message, 'boltify-commit.txt'));
  } else {
    args.push('-m', message);
  }

  log.verbose('git', args.join(','));
  return execa('git', args);
}
