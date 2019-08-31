interface IWorkspace {
    dir: string;
    name: string;
}
export declare const getWorkspaces: () => Promise<IWorkspace[]>;
export {};
