import { Configuration } from "../../../../src/utils/types";
import process from "process";
import { ensureDirectories } from "../../../../src/init/ensureDirectories";
import path from "path";
import fs from "fs-extra";
const config: Configuration = {
    app: "index.ts",
    dir: "testDirectory",
    resources: [{ name: "student", dir: "studentDir" }],
};
beforeAll(() => {
    process.chdir(__dirname);
});
test(`Ensuring non existing directories`, async () => {
    await ensureDirectories(config);
    expect(fs.pathExists("testDirectory")).resolves.toBe(true);
    expect(fs.pathExists(".nirikshak")).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("testDirectory", "studentDir"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(
            path.resolve("testDirectory", "studentDir", "config.json")
        )
    ).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("testDirectory", "studentDir", "helpers.ts"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(
            path.resolve("testDirectory", "studentDir", "student.test.ts")
        )
    ).resolves.toBe(true);
});

afterAll(async () => {
    await fs.remove("testDirectory");
    await fs.remove(".nirikshak");
});
