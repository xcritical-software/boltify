/* eslint-disable @typescript-eslint/promise-function-async */
import chalk from 'chalk';
import {
  getWorkspaces,
  toWorkspacesRunOptions,
  updateWorkspaceConfig,
} from '../utils/workspaces';
import { addTag, pushTag } from '../utils/git';
import { getNextVersionsByWorkspaces } from '../utils/versions';
import {
  trimmedColumns,
  write,
} from '../utils';
import {
  IFlags, IWorkspaceVersion,
} from '../interfaces';


function addWorkspaceTag(enable: boolean) {
  return async function func(
    {
      workspace,
      nextVersion,
    }: IWorkspaceVersion,
  ): Promise<IWorkspaceVersion> {
    if (enable) {
      const tag = nextVersion ? `${workspace}-v${nextVersion}` : null;
      await addTag(tag);
    }
    return { workspace, nextVersion };
  };
}

function updateWorkspaceVersion(enable: boolean) {
  return async function func(
    {
      workspace,
      nextVersion,
    }: IWorkspaceVersion,
  ): Promise<IWorkspaceVersion> {
    if (enable) {
      await updateWorkspaceConfig(workspace, { version: nextVersion });
    }
    return { workspace, nextVersion };
  };
}


export async function commandGetVersionsByWorkspaces(
  _args: string[],
  {
    push,
    gitTagVersion,
    ...flags
  }: IFlags,
): Promise<void> {
  try {
    const opts = toWorkspacesRunOptions(_args, flags);
    const workspaces = await getWorkspaces(opts.filterOpts);
    const versionsByWorkspace: IWorkspaceVersion[] = await getNextVersionsByWorkspaces(workspaces);

    const promises = versionsByWorkspace
      .filter(({ nextVersion }) => nextVersion !== null)
      .map(workspaceVersion => Promise.resolve(workspaceVersion)
        .then(addWorkspaceTag(gitTagVersion))
        .then(updateWorkspaceVersion(true)));

    await (Promise.all(promises).then(() => (push ? pushTag() : null)));


    const versionsToPrint: { workspace: string; version: string | null }[] = [];
    versionsByWorkspace.forEach(({ workspace, nextVersion }: IWorkspaceVersion): void => {
      versionsToPrint.push({
        workspace: workspace.getName(),
        version: chalk.green(nextVersion || 'No next version'),
      });
    });

    write(trimmedColumns(versionsToPrint, ['workspace', 'version']));
  } catch (error) {
    console.error(error);
  }
}
