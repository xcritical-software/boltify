import * as bolt from 'bolt';
import Project from 'bolt/dist/modern/Project';
import { toSpawnOpts, toFilterOpts } from 'bolt/dist/modern/utils/options';
import path from 'path';


import { IWorkspace, IFlags, IWorkspacesRunOptions } from '../interfaces';
import { getChangedFilesSinceRef } from './git';


export function toWorkspacesRunOptions(
  args: bolt.IArgs,
  flags: IFlags,
): IWorkspacesRunOptions {
  const [script, ...scriptArgs] = args;
  const flagArgs = flags['--'] || [];

  return {
    script,
    scriptArgs: [...scriptArgs, ...flagArgs],
    spawnOpts: toSpawnOpts(flags),
    filterOpts: toFilterOpts(flags),
  };
}

export async function getWorkspaces(
  opts: bolt.IFilterOpts = {},
): Promise<IWorkspace[]> {
  const project = await Project.init(process.cwd());
  const packages = await project.getPackages();

  const filtered = project.filterPackages(packages, {
    only: opts.only,
    ignore: opts.ignore,
    onlyFs: opts.onlyFs,
    ignoreFs: opts.ignoreFs,
  });

  return filtered;
}


export async function getWorkspacesChangedSinceRef(
  ref: string,
  opts: bolt.IFilterOpts = {},
): Promise<IWorkspace[]> {
  const changedFiles = await getChangedFilesSinceRef(ref, true);
  const allPackages = await getWorkspaces(opts);


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
