import {
  getMasterRef,
  getChangedFilesSinceRef,
  getLatestTag,
  getRef,
  getChangedFilesSinceMaster,
  getTags,
  isRefInHistory,
} from '../git';


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
    try {
      const ref = await getMasterRef();
      const result = await getChangedFilesSinceRef(ref);
      expect(result).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('getChangedFilesSinceMaster checking', async () => {
    try {
      const result = await getChangedFilesSinceMaster(true);
      expect(result).toBeDefined();
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('getLatestTag checking', async () => {
    const tag = await getLatestTag();
    expect(tag).toBeDefined();
  });

  test('getTags checking if isRevert is false', async () => {
    const tag = await getTags({ isRevert: false });
    expect(tag).toBeDefined();
  });

  test('getTags checking if isRevert is true', async () => {
    const tag = await getTags({ isRevert: true });
    expect(tag).toBeDefined();
  });

  test('isRefInHistory checking', async () => {
    try {
      const ref = await getMasterRef();
      const result = await isRefInHistory(ref);
      expect(result).toEqual(true);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});
