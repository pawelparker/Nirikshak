import process from "process";
import validateDirectoryStructure from "../../../../src/utils/validateDirectoryStructure";
import { Configuration } from "../../../../src/utils/types";
beforeAll(() => process.chdir(__dirname));

const config: Configuration = {
    app: "index.ts",
    dir: "test",
    resources: ["student", { name: "faculty", dir: "fc" }],
};

test(`Missing resource directory`, async () => {
    expect.hasAssertions();
    try {
        await validateDirectoryStructure(config);
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Directory for faculty not found]`
        );
    }
});
