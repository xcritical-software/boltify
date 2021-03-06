import * as bolt from 'bolt';
import Project from 'bolt/dist/modern/Project';
import { toSpawnOpts, toFilterOpts } from 'bolt/dist/modern/utils/options';
import $updatePackageVersions from 'bolt/dist/modern/functions/updatePackageVersions';
import path from 'path';
import pLocate from 'p-locate';
import os from 'os';
import writeJsonFile from 'write-json-file';

import {
  IWorkspace, IFlags, IWorkspacesRunOptions, IWorkspaceChange,
} from '../interfaces';


import {
  getChangedFilesSinceRef,
  getTags,
  isRefInHistory,
} from './git';


const isWin = (os.platform() === 'win32');

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
  const tags = await getTags({ isRevert: true });
  const tag = await pLocate(tags, async (t: string): Promise<boolean> => {
    const result = await isRefInHistory(t);
    return result;
  }, { preserveOrder: true });
  const changedFiles = await getChangedFilesSinceRef(tag, true);
  const allPackages = await getWorkspaces(opts);
  const result = {};

  allPackages.forEach((workspace: IWorkspace): void => {
    const changes = changedFiles.filter(
      (changeFilePath: string): boolean => changeFilePath.includes(workspace.dir),
    );

    result[workspace.dir] = changes.map((change: string): string => {
      const parts = change.split(isWin ? '\\' : '/');
      return parts[parts.length - 1];
    });
  });

  return result;
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function setWorkspaceVersion(
  workspace: IWorkspace,
  version: string,
): Promise<void> {
  if (version) {
    const { config: { filePath, json } } = workspace;
    const newConfig = { ...json, ...{ version } };
    return writeJsonFile(filePath, newConfig);
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/promise-function-async
export function updatePackageVersions(
  versionMap: { [key: string]: string },
): Promise<string[]> {
  return $updatePackageVersions(versionMap);
}
