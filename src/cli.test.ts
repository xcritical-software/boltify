
import cli from './cli';


describe('This is the tests for the workspaces command', () => {
  let mockLog: any = null;
  let mockError: any = null;
  let mockExit: any = null;
  beforeAll(() => {
    mockError = jest.spyOn(global.console, 'error').mockImplementation();
    mockLog = jest.spyOn(global.console, 'log').mockImplementation();
    mockExit = jest.spyOn(process, 'exit').mockImplementation();
  });

  afterAll(() => {
    mockLog.mockRestore();
    mockExit.mockRestore();
    mockError.mockRestore();
  });


  test('cli since master', async () => {
    await cli(['workspaces', '--since=master']);
  });

  test('cli since master', async () => {
    await cli(['run', 'test', '--since=master']);
  });

  test('cli since master', async () => {
    await cli(['ororo']);
    expect(mockExit).toHaveBeenCalledWith(0);
  });
});
