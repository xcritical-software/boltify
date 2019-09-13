declare module 'semantic-release/lib/git' {
  export async function getTags(execaOpts?): Promise<string[]>;

  export async function isRefInHistory(ref, execaOpts?): boolean;
}
