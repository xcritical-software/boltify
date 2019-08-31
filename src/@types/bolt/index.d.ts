// Type definitions for 'bolt'
// Definitions by: XCritical Software

declare module 'bolt' {

  interface IOptions {
    cwd?: string;
    only?: string;
    ignore?: string;
    onlyFs?: string;
    ignoreFs?: string;
  }

  interface IPackage {
    dir: string;
    name: string;
    config: IJSONValue;
  }

  function getWorkspaces(opts: IOptions): Promise<IPackage[]>;
  function getProject(): Promise<IPackage>;
}
