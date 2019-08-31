import * as bolt from 'bolt';
import path from 'path';

import { getChangedFilesSinceRef } from './git';


export async function getWorkspaces(): Promise<IWorkspace[]> {
  const cwd = process.cwd();
  const project = await bolt.getProject();
  const projectDir = project.dir;

  const allPackages = (await bolt.getWorkspaces({ cwd }))
    .map(pkg => ({
      ...pkg,
      relativeDir: path.relative(projectDir, pkg.dir),
    }));

  return allPackages;
}


export async function getWorkspacesChangedSinceRef(ref: string): Promise<IWorkspace[]> {
  const changedFiles = await getChangedFilesSinceRef(ref, true);
  const allPackages = await getWorkspaces();


  const fileNameToPackage = (
    fileName: string,
  ): IWorkspace => allPackages
    .find(pkg => fileName.startsWith(pkg.dir + path.sep));
  const fileExistsInPackage = (fileName: string): boolean => !!fileNameToPackage(fileName);

  return (
    changedFiles
      // ignore deleted files
      .filter(fileName => fileExistsInPackage(fileName))
      .map(fileName => fileNameToPackage(fileName))
      // filter, so that we have only unique packages
      .filter((pkg, idx, packages) => packages.indexOf(pkg) === idx)
  );

  // return changedWorkspaces;
}
