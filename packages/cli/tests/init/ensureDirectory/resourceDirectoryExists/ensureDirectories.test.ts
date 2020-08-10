import { Configuration } from "../../../../src/utils/types";
import process from "process";
import { ensureDirectories } from "../../../../src/init/ensureDirectories";
import fs from "fs-extra";
const config: Configuration = {
    app: "index.ts",
    dir: "testDirectory",
    resources: [{ name: "student", dir: "studentDir" }],
};
beforeAll(() => {
    process.chdir(__dirname);
});
test(`Ensuring already existing directories`, async () => {
    expect.hasAssertions();
    try {
        await ensureDirectories(config);
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Directory studentDir already exists]`
        );
    }
});

afterAll(async () => {
    await fs.remove(".nirikshak");
});
