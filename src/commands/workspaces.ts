import { getWorkspaces, getWorkspacesChangedSinceRef } from '../utils/workspaces';
import { getRef, trimmedColumns } from '../utils';


export async function commandGetWorkspaces(
  args: string[],
  { changed }: { [name: string]: any },
): Promise<void> {
  let workspaces: IWorkspace[] = [];
  if (changed) {
    const ref = await getRef(changed);
    workspaces = await getWorkspacesChangedSinceRef(ref);
  } else {
    workspaces = await getWorkspaces();
  }

  const workspacesToPrint = workspaces.map((item) => {
    const { name, config: { version, description } } = item;
    return {
      name,
      version,
      description,
    };
  });

  trimmedColumns(workspacesToPrint, ['name', 'version', 'description']);
}
