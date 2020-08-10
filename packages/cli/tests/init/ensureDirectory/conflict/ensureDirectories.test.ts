import process from "process";
import { ensureDirectories } from "../../../../src/init/ensureDirectories";
import { Configuration } from "../../../../src/utils/types";
const config: Configuration = {
    app: "index.ts",
    dir: "testDirectory",
    resources: [{ name: "student", dir: "studentDir" }],
};

beforeAll(() => {
    process.chdir(__dirname);
});
test(`Throws on reinitialising`, async () => {
    try {
        await ensureDirectories(config);
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Project already initialised. Delete /home/yash/Desktop/nirikshak/packages/cli/tests/init/ensureDirectory/conflict/.nirikshak if you want to restart from scratch.]`
        );
    }
});
