/* eslint-disable @typescript-eslint/promise-function-async */
/* eslint-disable @typescript-eslint/unbound-method */
import chalk from 'chalk';
import log from 'npmlog';
import os from 'os';
import { ExecaChildProcess, ExecaReturnValue } from 'execa';
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


function updateWorkspaceVersion(
  workspaces: IWorkspaceVersion[],
  {
    updatePackage = true,
    ...flags
  }: IFlags,
): Promise<IWorkspaceVersion[]> {
  let chain: Promise<any> = Promise.resolve();

  if (updatePackage && workspaces.length > 0) {
    const promises = workspaces.map(({ workspace, nextVersion }) => {
      const { config: { filePath } } = workspace;
      return Promise.resolve()
        .then(() => updateWorkspaceConfig(workspace, { version: nextVersion }))
        .then(() => filePath);
    });

    chain = chain
      .then(() => Promise.all(promises))
      .then(filePaths => gitAdd(filePaths).then(() => gitCommitAndTagVersion(workspaces, flags)));
  }

  return chain.then(() => workspaces);
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

function gitPushToRemote(
  workspaces: IWorkspaceVersion[],
  {
    gitRemote = 'origin',
    branch = 'master',
    push,
  }: IFlags,
): Promise<IWorkspaceVersion[]> {
  log.info('git', 'Pushing tags...');

  return push && workspaces.length
   && gitPush(gitRemote, branch).then(() => workspaces);
}


export async function commandGetVersionsByWorkspaces(
  _args: string[],
  flags: IFlags,
): Promise<IWorkspaceVersion[]> {
  const opts = toWorkspacesRunOptions(_args, flags);

  return getWorkspaces(opts.filterOpts)
    .then(getNextVersionsByWorkspaces)
    .then(workspaces => outputCommand(workspaces, flags))
    .then(workspaces => workspaces.filter(({ nextVersion }) => nextVersion !== null))
    .then(workspaces => updateWorkspaceVersion(workspaces, flags))
    .then(workspaces => outputCommand(workspaces, flags))
    .then(workspaces => gitPushToRemote(workspaces, flags));
}
