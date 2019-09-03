// Type definitions for 'bolt'
// Definitions by: XCritical Software

declare module 'bolt' {

  export type ITask = (workspace: IPackage) => Promise<any>;
  export type IArgs = string[];
  export interface IOptions {
    cwd?: string;
    only?: string;
    ignore?: string;
    onlyFs?: string;
    ignoreFs?: string;
  }

  export interface IPackage {
    dir: string;
    name: string;
    config: IJSONValue;
  }


  interface ISpawnOpts {
    orderMode?: 'serial' | 'parallel' | 'parallel-nodes';
    bail?: boolean;
    // maxConcurrent?: number,
  }

  function getWorkspaces(opts: IOptions): Promise<IPackage[]>;
  function getProject(): Promise<IPackage>;
}
