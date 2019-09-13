// Type definitions for semantic-release
// Definitions by: XCritical Software

/**
 * The semantic release configuration itself.
 */
declare module 'semantic-release' {
  export interface IGlobalConfig {
    /** The full prepare step configuration. */
    prepare?: any;
    /** The branch on which releases should happen. */
    branch: string;
    /** The Git repository URL, in any supported format. */
    repositoryUrl: string;
    /** The Git tag format used by semantic-release to identify releases. */
    tagFormat: string;
  }

  export interface ILastRelease {
    /** The version name of the release */
    version: string;
    /** The Git tag of the release. */
    gitTag: string;
    /** The Git checksum of the last commit of the release. */
    gitHead: string;
  }

  export interface INextRelease extends ILastRelease {
    /** The release notes of the next release. */
    notes: string;
  }

  export interface IContext {
    /** The semantic release configuration itself. */
    options?: IGlobalConfig;
    /** The previous release details. */
    lastRelease?: ILastRelease;
    /** The next release details. */
    nextRelease?: INextRelease;
    /** The shared logger instance of semantic release. */
    logger: {
      log: (message: string, ...vars: any[]) => void;
      error: (message: string, ...vars: any[]) => void;
    };
  }
}
