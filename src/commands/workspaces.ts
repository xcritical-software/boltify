import chalk from 'chalk';
import { getWorkspaces, getWorkspacesChangedSinceRef, toWorkspacesRunOptions } from '../utils/workspaces';
import {
  getRef,
  trimmedColumns,
  write,
} from '../utils';
import { IWorkspace, IFlags } from '../interfaces';


export async function commandGetWorkspaces(
  _args: string[],
  { since, ...flags }: IFlags,
): Promise<void> {
  const opts = toWorkspacesRunOptions(_args, flags);
  let workspaces: IWorkspace[] = [];

  if (since) {
    const ref = await getRef(since);
    workspaces = await getWorkspacesChangedSinceRef(ref, opts.filterOpts);
  } else {
    workspaces = await getWorkspaces(opts.filterOpts);
  }

  const workspacesToPrint = workspaces.map((item: IWorkspace) => {
    const { config: { json: { description } } } = item;
    return {
      name: item.getName(),
      version: chalk.green(`v${item.getVersion()}`),
      description,
    };
  });
  write(trimmedColumns(workspacesToPrint, ['name', 'version', 'description']));
}