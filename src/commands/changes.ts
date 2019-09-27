import {
  getChangesFromLastTagByWorkspaces,
} from '../utils/workspaces';
import {
  trimmedColumns,
  write,
} from '../utils';
import {
  IWorkspaceChange,
} from '../interfaces';


export async function commandGetChangesFromLastTagByWorkspaces(): Promise<void> {
  const changesByWorkspace: IWorkspaceChange = await getChangesFromLastTagByWorkspaces();

  const changesToPrint = Object.keys(changesByWorkspace).map((workspace: string) => {
    const changes = changesByWorkspace[workspace];
    return {
      workspace,
      changes,
    };
  });

  write(trimmedColumns(changesToPrint, ['workspace', 'changes']));
}
