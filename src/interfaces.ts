import {
  IPackage, ISpawnOpts, IArgs, IFilterOpts,
} from 'bolt';


export interface IFlags {
  [name: string]: any;
}

export interface IJSONValue {
  [key: string]: IJSONValue | string | any;
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

export interface IWorkspaceChange {
  [workspace: string]: string[];
}

export interface IWorkspaceVersion {
  [workspace: string]: string | null;
}

export interface IAngularRule {
  type: string;
  scope?: string;
  release: string;
}

export interface IAtomRule {
  emoji: string;
  release: string;
}

export interface IESLintRule {
  tag: string;
  release: string;
}

export interface IExpressRule {
  component: string;
  release: string;
}

export interface IRevertRule {
  revert: boolean;
  release: string;
}

export interface IBreakingRule {
  breaking: boolean;
  release: string;
}

// eslint-disable-next-line max-len
export type Rule = IAngularRule | IAtomRule | IESLintRule | IExpressRule | IRevertRule | IBreakingRule;
