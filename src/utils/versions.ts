import path from 'path';
import pLocate from 'p-locate';
import semver from 'semver';

import {
  IWorkspace, IWorkspaceVersion,
} from '../interfaces';
import {
  getCommitsSinceRef,
  getFirstCommitByWorkspaceFolder,
  getTags,
  isRefInHistory,
} from './git';

import {
  analyzeCommits,
  parseCommits,
} from './commit-analyzer';


async function analyzeCommitsSinceRef(ref: string, folderName: string): Promise<string> {
  const commits = await getCommitsSinceRef(ref, folderName);
  const parsedCommits = parseCommits(commits);
  return analyzeCommits(parsedCommits);
}

export async function getNextVersion(
  tags: string[],
  workspace: IWorkspace,
): Promise<IWorkspaceVersion> {
  const wName = workspace.getName();
  const folderName = workspace.dir.replace(process.cwd() + path.sep, '');
  let ref = '';
  let currentVersion;

  if (tags.length === 0) {
    ref = await getFirstCommitByWorkspaceFolder(folderName);
    currentVersion = workspace.getVersion();
  } else {
    ref = await pLocate(tags, async (t: string): Promise<boolean> => {
      const result = await isRefInHistory(t);
      return result;
    }, { preserveOrder: true });
    currentVersion = ref.replace(`${wName}-`, '');
  }

  const releaseType = await analyzeCommitsSinceRef(ref, folderName);
  const next = semver.inc(currentVersion, releaseType as semver.ReleaseType);

  return {
    [wName]: next,
  };
}

export async function getNextVersionsByWorkspaces(
  workspaces: IWorkspace[],
): Promise<IWorkspaceVersion[]> {
  const tags = await getTags({ isRevert: true });

  const promises = workspaces.map(async (workspace: IWorkspace): Promise<IWorkspaceVersion> => {
    const name = workspace.getName();
    const workspaceTags = tags.filter((tag: string) => tag.startsWith(name));
    return getNextVersion(workspaceTags, workspace);
  });

  return Promise.all(promises);
}
