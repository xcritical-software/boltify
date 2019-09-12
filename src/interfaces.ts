import {
  IPackage, ISpawnOpts, IArgs, IFilterOpts,
} from 'bolt';


export interface IFlags {
  [name: string]: any;
}

export interface IJSONValue {
  [key: string]: IJSONValue;
}

export interface IWorkspace extends IPackage {
  dir: string;
  name: string;
  config: IJSONValue;
  relativeDir: string;
}

export interface IWorkspacesRunOptions {
  script?: string;
  scriptArgs?: IArgs;
  spawnOpts?: ISpawnOpts;
  filterOpts?: IFilterOpts;
}
