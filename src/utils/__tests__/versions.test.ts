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
      const wName = ws[0].getName();
      const currentVersion = '1.0.0';
      const next = semver.inc(currentVersion, 'patch');

      return {
        [wName]: next,
      };
    });

    const wName = workspaces[0].getName();
    const nextVersion = await getNextVersion(workspaces);
    expect(nextVersion).toEqual({ [wName]: '1.0.1' });
  });
});
