import { getWorkspaces, getWorkspacesChangedSinceRef } from './workspaces';
import { getMasterRef } from './git';


describe('This is the tests for the worspaces utils', () => {
  test('getWorkspaces checking', async () => {
    const result = await getWorkspaces();
    expect(result).toBeDefined();
  });
});

describe('This is the tests for the worspaces utils', () => {
  test('getWorkspaces checking', async () => {
    const ref = await getMasterRef();
    const result = await getWorkspacesChangedSinceRef(ref);
    expect(result).toHaveLength(1);
  });
});
