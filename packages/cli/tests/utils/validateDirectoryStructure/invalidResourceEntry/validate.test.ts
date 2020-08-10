import process from "process";
import validateDirectoryStructure from "../../../../src/utils/validateDirectoryStructure";
import { Configuration } from "../../../../src/utils/types";

const config: Configuration = {
    app: "index.ts",
    dir: "test",
    resources: ["student", { name: "faculty", dir: "fc" }],
};

beforeAll(() => process.chdir(__dirname));

test(`Invalid resource entry`, async () => {
    expect.hasAssertions();
    try {
        await validateDirectoryStructure(config);
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Resource directory for faculty does not match. Expected fc, got faculty.]`
        );
    }
});
