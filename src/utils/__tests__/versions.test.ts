/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable global-require */
import semver from 'semver';
import {
  getWorkspaces,
} from '../workspaces';
import { IWorkspace, IWorkspaceVersion } from '../../interfaces';


describe('This is the tests for the versions utils', (): void => {
  test('getNextVersion checking', async () => {
    const workspaces: IWorkspace[] = await getWorkspaces();

    jest.mock('../versions');
    const { getNextVersion } = require('../versions');

    getNextVersion.mockImplementation((
      ws: IWorkspace[],
    ): IWorkspaceVersion => {
      const currentVersion = '1.0.0';
      const next = semver.inc(currentVersion, 'patch');

      return {
        workspace: ws[0],
        nextVersion: next,
      };
    });

    const nextVersion = await getNextVersion(workspaces);
    expect(nextVersion).toEqual({ workspace: workspaces[0], nextVersion: '1.0.1' });
  });
});
