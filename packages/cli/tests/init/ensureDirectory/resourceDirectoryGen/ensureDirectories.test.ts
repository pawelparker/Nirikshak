import path from "path";
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
test(`Ensuring non existing resource directories`, async () => {
    await ensureDirectories(config);
    expect(fs.pathExists(".nirikshak")).resolves.toBe(true);
    expect(fs.pathExists("testDirectory")).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("testDirectory", "studentDir"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(
            path.resolve("testDirectory", "studentDir", "student.test.ts")
        )
    ).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("testDirectory", "studentDir", "helpers.ts"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(
            path.resolve("testDirectory", "studentDir", "config.json")
        )
    ).resolves.toBe(true);
});

afterAll(async () => {
    await fs.remove(path.resolve("testDirectory", "studentDir"));
    await fs.remove(".nirikshak");
});
