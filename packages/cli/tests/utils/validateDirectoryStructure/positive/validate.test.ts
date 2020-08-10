import process from "process";
import validateDirectoryStructure from "../../../../src/utils/validateDirectoryStructure";
import { Configuration } from "../../../../src/utils/types";

const config: Configuration = {
    app: "index.ts",
    dir: "test",
    resources: ["student", { name: "faculty", dir: "fc" }],
};

beforeAll(() => process.chdir(__dirname));

test(`Valid directory structure`, async () => {
    expect(await validateDirectoryStructure(config)).toBeFalsy();
});
