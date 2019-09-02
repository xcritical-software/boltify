import cli from './cli';


describe('This is the tests for the workspaces command', () => {
  test('cli workspaces checking', async () => {
    await cli(['workspaces']);
  });

  test('cli since master', async () => {
    await cli(['workspaces', '--since=master']);
  });

  test('cli not defined command', async () => {
    await cli(['oroor', '--since=master']);
  });
});
