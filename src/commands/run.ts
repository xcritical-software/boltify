import { getWorkspaces, getWorkspacesChangedSinceRef } from '../utils/workspaces';
import {
  getRef,
  runWorkspaceTasks,
  toWorkspacesRunOptions,
} from '../utils';
import { IWorkspace } from '../interfaces';


export async function commandRunWorkspaces(
  _args: string[],
  { since, ...flags }: { [name: string]: any },
): Promise<void> {
  let workspaces: IWorkspace[] = [];

  if (since) {
    const ref = await getRef(since);
    workspaces = await getWorkspacesChangedSinceRef(ref);
  } else {
    workspaces = await getWorkspaces();
  }

  return runWorkspaceTasks(
    workspaces,
    toWorkspacesRunOptions(_args, flags),
  );
}
