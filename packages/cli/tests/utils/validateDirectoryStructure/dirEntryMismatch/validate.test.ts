import process from "process";
import validateDirectoryStructure from "../../../../src/utils/validateDirectoryStructure";
import { Configuration } from "../../../../src/utils/types";
beforeAll(() => process.chdir(__dirname));

const config: Configuration = {
    app: "index.ts",
    dir: "testDir",
    resources: ["student", { name: "faculty", dir: "fc" }],
};

test(`Directory path mismatch`, async () => {
    expect.hasAssertions();
    try {
        await validateDirectoryStructure(config);
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Nirikshak directory changed. Expected dir key of config to be test, got testDir]`
        );
    }
});
