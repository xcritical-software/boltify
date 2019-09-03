import cli from './cli';


describe('This is the tests for the workspaces command', () => {
  test('cli since master', async () => {
    await cli(['workspaces', '--since=master']);
  });

  test('cli since master', async () => {
    await cli(['run', 'test', '--since=master']);
  });
});
