import chalk from 'chalk';
import { getWorkspaces, getWorkspacesChangedSinceRef } from '../utils/workspaces';
import {
  getRef,
  trimmedColumns,
  write,
} from '../utils';


export async function commandGetWorkspaces(
  _args: string[],
  { since }: { [name: string]: any },
): Promise<void> {
  let workspaces: IWorkspace[] = [];

  if (since) {
    const ref = await getRef(since);
    workspaces = await getWorkspacesChangedSinceRef(ref);
  } else {
    workspaces = await getWorkspaces();
  }

  const workspacesToPrint = workspaces.map((item) => {
    const { name, config: { version, description } } = item;
    return {
      name,
      version: chalk.green(`v${version}`),
      description,
    };
  });
  write(trimmedColumns(workspacesToPrint, ['name', 'version', 'description']));
}
