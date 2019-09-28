/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/unbound-method */
import chalk from 'chalk';
import log from 'npmlog';
import os from 'os';
import {
  getWorkspaces,
  toWorkspacesRunOptions,
  updateWorkspaceConfig,
} from '../../utils/workspaces';
import { getNextVersionsByWorkspaces } from '../../utils/versions';
import {
  outputFormat,
  gitCommit,
  gitAdd,
  addTag,
  gitPush,
} from '../../utils';
import {
  IFlags, IWorkspaceVersion,
} from '../../interfaces';
import { IPackagePrint } from '../workspaces';


function updateWorkspaceVersion(
  workspaces: IWorkspaceVersion[],
  { updatePackage = true }: IFlags,
): Promise<IWorkspaceVersion[]> {
  let chain = Promise.resolve();

  if (updatePackage) {
    const promises = workspaces.map(({ workspace, nextVersion }) => {
      const { config: { filePath } } = workspace;
      chain = chain.then(() => updateWorkspaceConfig(workspace, { version: nextVersion }));
      return chain.then(() => filePath);
    });
    chain = chain.then(() => Promise.all(promises)).then(filePaths => gitAdd(filePaths));
  }

  return chain.then(() => workspaces);
}

function gitCommitAndTagVersion(
  workspaces: IWorkspaceVersion[],
  { message: subject = 'Publish', gitTagVersion, ...flags }: IFlags,
): Promise<IWorkspaceVersion[]> {
  const tags = workspaces.map((
    {
      workspace,
      nextVersion,
    },
  ) => `${workspace.getName()}-v${nextVersion}`);

  const message = tags.reduce((msg, tag) => `${msg}${os.EOL} - ${tag}`, `${subject}${os.EOL}`);

  return Promise.resolve()
    .then(() => gitCommit(message, flags))
    .then(() => gitTagVersion && Promise.all(tags.map(tag => addTag(tag))))
    .then(() => workspaces);
}

function outputCommand(
  workspaces: IWorkspaceVersion[],
  flags: IFlags,
): IWorkspaceVersion[] {
  const workspacesToPrint = workspaces
    .map((
      {
        workspace,
        nextVersion,
      }: IWorkspaceVersion,
    ): IPackagePrint => {
      const { config: { json: { description, private: $private } } } = workspace;
      return {
        name: workspace.getName(),
        version: chalk.green(nextVersion || 'No next version'),
        description,
        private: $private,
        location: workspace.dir,
      };
    });

  outputFormat(workspacesToPrint, flags);
  return workspaces;
}

function gitPushToRemote({
  gitRemote = 'origin',
  branch = 'master',
  push,
}: IFlags): Promise<any> {
  log.info('git', 'Pushing tags...');

  return push && gitPush(gitRemote, branch);
}


export async function commandGetVersionsByWorkspaces(
  _args: string[],
  flags: IFlags,
): Promise<any> {
  const opts = toWorkspacesRunOptions(_args, flags);

  return getWorkspaces(opts.filterOpts)
    .then(getNextVersionsByWorkspaces)
    .then(workspaces => workspaces.filter(({ nextVersion }) => nextVersion !== null))
    .then(workspaces => updateWorkspaceVersion(workspaces, flags))
    .then((workspaces: IWorkspaceVersion[]) => gitCommitAndTagVersion(workspaces, flags))
    .then(workspaces => outputCommand(workspaces, flags))
    .then(() => gitPushToRemote(flags));
}
