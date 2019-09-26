import chalk from 'chalk';
import {
  getWorkspaces,
  getWorkspacesChangedSinceRef,
  toWorkspacesRunOptions,
  getChangesFromLastTagByWorkspaces,
} from '../utils/workspaces';
import {
  getRef,
  trimmedColumns,
  write,
} from '../utils';
import {
  IWorkspace, IFlags, IWorkspaceChange,
} from '../interfaces';


export async function commandGetWorkspaces(
  _args: string[],
  { since, ...flags }: IFlags,
): Promise<void> {
  try {
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
  } catch (error) {
    console.error(error);
  }
}

export async function commandGetChangesFromLastTagByWorkspaces(): Promise<void> {
  try {
    const changesByWorkspace: IWorkspaceChange = await getChangesFromLastTagByWorkspaces();

    const changesToPrint = Object.keys(changesByWorkspace).map((workspace: string) => {
      const changes = changesByWorkspace[workspace];
      return {
        workspace,
        changes,
      };
    });

    write(trimmedColumns(changesToPrint, ['workspace', 'changes']));
  } catch (error) {
    console.error(error);
  }
}
