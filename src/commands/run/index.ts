import { getWorkspaces, getWorkspacesChangedSinceRef } from '../../utils/workspaces';
import {
  getRef,
  runWorkspaceTasks,
  toWorkspacesRunOptions,
} from '../../utils';
import { IWorkspace, IFlags } from '../../interfaces';


export async function commandRunWorkspaces(
  _args: string[],
  { since, ...flags }: IFlags,
): Promise<void> {
  let workspaces: IWorkspace[] = [];
  const opts = toWorkspacesRunOptions(_args, flags);

  if (since) {
    const ref = await getRef(since);
    workspaces = await getWorkspacesChangedSinceRef(ref, opts.filterOpts);
  } else {
    workspaces = await getWorkspaces(opts.filterOpts);
  }

  return runWorkspaceTasks(
    workspaces,
    opts,
  );
}
