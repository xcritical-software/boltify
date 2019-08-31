import bolt from 'bolt';


export const getWorkspaces = async (): Promise<IWorkspace[]> => {
  const cwd = process.cwd();
  const allPackages = await bolt.getWorkspaces({ cwd });

  const workspaces = (allPackages.map(({ dir, name }) => ({
    dir,
    name,
  })));

  return workspaces;
};
