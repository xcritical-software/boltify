import {
  getWorkspaces,
  getWorkspacesChangedSinceRef,
  toWorkspacesRunOptions,
} from '../utils/workspaces';
import {
  getRef,
  outputFormat,
} from '../utils';
import {
  IWorkspace, IFlags,
} from '../interfaces';


export interface IPackagePrint {
  name: string;
  version: string;
  description: string;
  private: boolean;
  location: string;
}

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

  const workspacesToPrint = workspaces.map((item: IWorkspace): IPackagePrint => {
    const { config: { json: { description, private: $private } } } = item;
    return {
      name: item.getName(),
      version: item.getVersion(),
      description,
      private: $private,
      location: item.dir,
    };
  });

  outputFormat(workspacesToPrint, flags);
}
