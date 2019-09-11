import {
  getMasterRef,
  getChangedFilesSinceRef,
  getLatestTag,
  getRef,
  getChangedFilesSinceMaster,
} from './git';


describe('This is the tests for the git utils', () => {
  test('getMasterRef checking', async () => {
    const result = await getRef('undefined');
    expect(result).toBe(null);
  });
  test('getMasterRef checking', async () => {
    const result = await getMasterRef();
    expect(result).toBeDefined();
  });

  test('getChangedFilesSinceRef checking', async () => {
    const ref = await getMasterRef();
    const result = await getChangedFilesSinceRef(ref);
    expect(result).toBeDefined();
  });

  test('getChangedFilesSinceMaster checking', async () => {
    const result = await getChangedFilesSinceMaster(true);
    expect(result).toBeDefined();
  });

  test('getLatestTag checking', async () => {
    const tag = await getLatestTag();
    expect(tag).toBeDefined();
  });
});
