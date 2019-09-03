import Project from 'bolt/dist/modern/Project';
import path from 'path';

import { IWorkspace } from '../interfaces';
import { getChangedFilesSinceRef } from './git';


export async function getWorkspaces(): Promise<IWorkspace[]> {
  const project = await Project.init(process.cwd());
  const allPackages = await project.getPackages();

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
