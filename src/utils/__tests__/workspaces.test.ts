import {
  getWorkspaces,
  getWorkspacesChangedSinceRef,
  getChangesFromLastTagByWorkspaces,
} from '../workspaces';
import { getMasterRef } from '../git';
import { IWorkspace, IWorkspaceChange } from '../../interfaces';


describe('This is the tests for the workspaces utils', (): void => {
  test('getWorkspaces checking', async () => {
    const result: IWorkspace[] = await getWorkspaces();
    expect(result).toBeDefined();
  });

  test('getWorkspacesChangedSinceRef checking', async () => {
    try {
      const ref: string = await getMasterRef();
      const result: IWorkspace[] = await getWorkspacesChangedSinceRef(ref);
      expect(result).toHaveLength(2);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('getChangesFromLastTagByWorkspaces checking', async () => {
    try {
      const workspaces: IWorkspace[] = await getWorkspaces();
      const changesByWorkspace: IWorkspaceChange = await getChangesFromLastTagByWorkspaces();
      expect(changesByWorkspace).toHaveProperty(workspaces[0].dir);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
