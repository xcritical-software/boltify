import chalk from 'chalk';
import {
  getWorkspaces,
  toWorkspacesRunOptions,
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


export async function commandGetVersionsByWorkspaces(
  _args: string[],
  {
    push, gitTagVersion, ...flags
  }: IFlags,
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

      const promises = tags.map(async (tag: string): Promise<void> => {
        const result = await addTag(tag);
        return result;
      });

      await Promise.all(promises);

      if (push && tags.length !== 0) {
        await pushTag();
      }
    }

    const versionsToPrint: { workspace: string; version: string | null }[] = [];
    versionsByWorkspace.forEach((versionByWorkspace: IWorkspaceVersion): void => {
      Object.entries(versionByWorkspace)
        .forEach(([workspace, version]: [string, string | null]): void => {
          versionsToPrint.push({
            workspace,
            version: chalk.green(version || 'No next version'),
          });
        });
    });

    write(trimmedColumns(versionsToPrint, ['workspace', 'version']));
  } catch (error) {
    write('Error', {}, error);
  }
}
