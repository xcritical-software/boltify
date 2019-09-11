
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


declare module 'bolt/dist/modern/utils/options' {
  function toSpawnOpts(flags: IFlags): ISpawnOpts;
  function toFilterOpts(flags: IFlags): IFilterOpts;
}

declare module 'bolt/dist/modern/Project' {

  export interface IProject {
    pkg: IPackage;
    runPackageTasks: (packages: IPackage[], spawnOpts: ISpawnOpts, task: ITask) => Promise<void>;
    init: (cwd: string) => Promise<IPackage>;
    filterPackages: (packages: IPackage[], opts: IFilterOpts) => IPackage[];
    getPackages: () => Promise<IPackage[]>;
  }

  declare const Project: IProject;
  export default Project;
}
