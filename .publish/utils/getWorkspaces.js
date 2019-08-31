import * as tslib_1 from "tslib";
import bolt from 'bolt';
export const getWorkspaces = () => tslib_1.__awaiter(this, void 0, void 0, function* () {
    const cwd = process.cwd();
    const allPackages = yield bolt.getWorkspaces({ cwd });
    const workspaces = (allPackages.map(({ dir, name }) => ({
        dir,
        name,
    })));
    // eslint-disable-next-line no-console
    return workspaces;
});

//# sourceMappingURL=getWorkspaces.js.map
