import * as bolt from 'bolt';
import * as yarn from 'bolt/dist/modern/utils/yarn';
import { toSpawnOpts } from 'bolt/dist/modern/utils/options';
import Project from 'bolt/dist/modern/Project';

import { IWorkspace, IWorkspacesRunOptions, IFlags } from '../interfaces';


export function toWorkspacesRunOptions(
  args: bolt.IArgs,
  flags: IFlags,
): IWorkspacesRunOptions {
  const [script, ...scriptArgs] = args;
  const flagArgs = flags['--'] || [];

  return {
    script,
    scriptArgs: [...scriptArgs, ...flagArgs],
    spawnOpts: toSpawnOpts(flags),
  };
}

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
