import {
  analyzeCommits,
  parseCommits,
} from '../commit-analyzer';


const commitsMinor = `fix(tests): fixup! fixup! Change error checking

------------------------ >8 ------------------------
fix(tests): fixup! Change error message

------------------------ >8 ------------------------
fix(tests): Add error handling if master ref is undefined

------------------------ >8 ------------------------
Merge pull request #6 from tundraray/master

v1.0.2
------------------------ >8 ------------------------
v1.0.2

------------------------ >8 ------------------------
bump(minor): Merge pull request #5 from xcritical-software/feature/Add_git_tags_definition

Feature: add definition changes of workspaces with adding git tags
------------------------ >8 ------------------------
`;


const commitsMajor = `fix(tests): fixup! fixup! Change error checking

------------------------ >8 ------------------------
fix(tests): fixup! Change error message

------------------------ >8 ------------------------
fix(tests): Add error handling if master ref is undefined

------------------------ >8 ------------------------
Merge pull request #6 from tundraray/master

v1.0.2
------------------------ >8 ------------------------
v1.0.2

------------------------ >8 ------------------------
bump(major): Merge pull request #5 from xcritical-software/feature/Add_git_tags_definition

Feature: add definition changes of workspaces with adding git tags
------------------------ >8 ------------------------
`;


describe('This is the tests for the commit parsing', () => {
  let spy: any = null;

  beforeAll(() => {
    spy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterAll(() => {
    spy.mockRestore();
  });

  test('parseCommits checking', () => {
    const result = parseCommits(commitsMinor);
    expect(result.length).toBe(6);
  });

  test('analyzeCommits checking', () => {
    const result = analyzeCommits(parseCommits(commitsMinor));
    expect(result).toBe('minor');
  });

  test('analyzeCommits checking for majorVersion', () => {
    const result = analyzeCommits(parseCommits(commitsMajor));
    expect(result).toBe('major');
  });
});
