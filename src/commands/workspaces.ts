import chalk from 'chalk';
import {
  getWorkspaces,
  getWorkspacesChangedSinceRef,
  toWorkspacesRunOptions,
  getChangesFromLastTagByWorkspaces,
  getNextVersionsByWorkspaces,
} from '../utils/workspaces';
import { addTag, pushTag } from '../utils/git';
import {
  getRef,
  trimmedColumns,
  write,
} from '../utils';
import { IWorkspace, IFlags, IWorkspaceChange, IWorkspaceVersion } from '../interfaces';


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
    write('Error', {}, error);
  }
}

export async function commandGetVersionsByWorkspaces(
  _args: string[],
  { since, push, gitTagVersion, ...flags }: IFlags,
): Promise<void> {
  try {
    const opts = toWorkspacesRunOptions(_args, flags);
    const workspaces = await getWorkspaces(opts.filterOpts);
    const versionsByWorkspace: IWorkspaceVersion[] = await getNextVersionsByWorkspaces(workspaces);

    if (gitTagVersion) {
      const tags = versionsByWorkspace.map((versionByWorkspace: IWorkspaceVersion) => {
       const [workspace, version] = Object.entries(versionByWorkspace)[0];
       return version ? `${workspace}-v${version}` : null;
      }).filter((tag: string) => tag !== null);

      const promises = tags.map((tag: string): Promise<void> => {
        return addTag(tag);
      });

      await Promise.all(promises);
      
      if (push && tags.length !== 0) {
        await pushTag();
      }
    }

    const versionsToPrint: any[] = [];
    versionsByWorkspace.forEach((versionByWorkspace: IWorkspaceVersion): void => {
      Object.entries(versionByWorkspace).forEach(([workspace, version]: [string, string]): void => {
        versionsToPrint.push({
          workspace,
          version: version || 'No next version',
        });
      })
    });

    write(trimmedColumns(versionsToPrint, ['workspace', 'version']));
  } catch (error) {
    write('Error', {}, error);
    console.error(error);
  }
}
