import { IProject, ISpawnOpts, IFlags } from 'bolt';


declare module 'bolt/dist/modern/utils/yarn' {
  function run(
    pkg: IPackage,
    script: string,
    args: string[] = []
  ): Promise<void>;

  function runIfExists(
    pkg: IPackage,
    script: string,
    args: string[] = []
  ): Promise<void>;
}
