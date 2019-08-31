import * as bolt from 'bolt';
import path from 'path';

import { getChangedFilesSince } from './git';

export async function getWorkspaces(): Promise<IWorkspace[]> {
  const cwd = process.cwd();
  
  const allPackages = await bolt.getWorkspaces({ cwd });

  const workspaces = (allPackages.map(({ dir, name }) => ({
    dir,
    name,
  })));

  return workspaces;
};



export async function getWorkspacesChangedSinceRef(ref: string): Promise<IWorkspace[]> {
  const cwd = process.cwd();
  
  const changedFiles = (await getChangedFilesSince(ref)).map(changedFile => path.join(cwd, changedFile));
  console.log(changedFiles)
  const allPackages = await bolt.getWorkspaces({ cwd });

  const workspaces = (allPackages.map(({ dir, name }) => ({
    dir,
    name,
  })));

  const changedWorkspaces = workspaces.filter(({ dir }) => changedFiles.cont)

  return workspaces;
};