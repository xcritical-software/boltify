import * as bolt from 'bolt';
import * as yarn from 'bolt/dist/modern/utils/yarn';
import Project from 'bolt/dist/modern/Project';

import { IWorkspace, IWorkspacesRunOptions } from '../interfaces';


export async function runWorkspaceTasks(
  workspaces: IWorkspace[],
  opts: IWorkspacesRunOptions,
): Promise<void> {
  const project = await Project.init(process.cwd());

  await project.runPackageTasks(
    workspaces,
    opts.spawnOpts,
    async (pkg: bolt.IPackage) => {
      await yarn.runIfExists(pkg, opts.script, opts.scriptArgs);
    },
  );
}
