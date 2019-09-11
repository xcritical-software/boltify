import execa from 'execa';
import path from 'path';


export async function getRef(name: string): Promise<string> {
  try {
    const { stdout } = await execa('git', ['rev-parse', name]);
    return stdout.trim().split('\n')[0];
  } catch {
    return null;
  }
}

export async function getMasterRef(): Promise<string> {
  return getRef('master');
}

export async function getLatestTag(): Promise<string> {
  try {
    const { stdout } = await execa('git', ['describe', '--tags', '--abbrev=0']);
    return stdout.trim().split('\n')[0];
  } catch (e) {
    return null;
  }
}

export async function getChangedFilesSinceRef(
  ref: string,
  fullPath = false,
): Promise<string[]> {
  // First we need to find the commit where we diverged from `ref` at using `git merge-base`
  let cmd = await execa('git', ['merge-base', ref, 'HEAD']);
  const divergedAt = cmd.stdout.trim();
  // Now we can find which files we added
  cmd = await execa('git', ['diff', '--name-only', divergedAt]);
  const files = cmd.stdout.trim().split('\n');
  if (!fullPath) return files;
  return files.map((file: string) => path.resolve(file));
}

export async function getChangedFilesSinceMaster(fullPath = false): Promise<string[]> {
  const ref = await getMasterRef();
  return getChangedFilesSinceRef(ref, fullPath);
}
