import * as bolt from 'bolt';
import Project from 'bolt/dist/modern/Project';
import { toSpawnOpts, toFilterOpts } from 'bolt/dist/modern/utils/options';
import path from 'path';
import { getTags, isRefInHistory } from 'semantic-release/lib/git';
import pLocate from 'p-locate';


import {
  IWorkspace, IFlags, IWorkspacesRunOptions, IWorkspaceChange,
} from '../interfaces';
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

export const fileNameToPackage = (
  fileName: string,
  allPackages: IWorkspace[],
): IWorkspace => allPackages
  .find(pkg => fileName.startsWith(pkg.dir + path.sep));

export const fileExistsInPackage = (
  fileName: string,
  allPackages: IWorkspace[],
): boolean => !!fileNameToPackage(fileName, allPackages);

export async function getWorkspacesChangedSinceRef(
  ref: string,
  opts: bolt.IFilterOpts = {},
): Promise<IWorkspace[]> {
  const changedFiles = await getChangedFilesSinceRef(ref, true);
  const allPackages = await getWorkspaces(opts);

  return (
    changedFiles
      // ignore deleted files
      .filter(fileName => fileExistsInPackage(fileName, allPackages))
      .map(fileName => fileNameToPackage(fileName, allPackages))
      // filter, so that we have only unique packages
      .filter((pkg, idx, packages) => packages.indexOf(pkg) === idx)
  );

  // return changedWorkspaces;
}

export async function getChangesFromLastTagByWorkspaces(
  opts: bolt.IFilterOpts = {},
): Promise<IWorkspaceChange> {
  const tags = await getTags();
  const tag = await pLocate(tags, t => isRefInHistory(t), { preserveOrder: true });
  const changedFiles = await getChangedFilesSinceRef(tag, true);
  const allPackages = await getWorkspaces(opts);
  const result = {};

  // changedFiles.forEach((file: string): void => {
  //   const paths = file.split('/');
  //   const workspace = paths[0];
  //   const rest = paths.slice(1).join('/');

  //   if (!result[workspace]) {
  //     result[workspace] = [];
  //   }

  //   result[workspace].push(rest);
  // });
  console.log(allPackages);
  console.log('=============');
  console.log(changedFiles);
  return result;
}
