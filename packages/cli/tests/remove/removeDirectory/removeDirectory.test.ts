import path from "path";
import fs from "fs-extra";
import process from "process";
import { Configuration } from "../../../src/utils/types";
import removeDirectory from "../../../src/remove/removeDirectory";

const config: Configuration = {
    app: "index.ts",
    dir: "test",
    resources: [
        {
            name: "student",
            dir: "st",
        },
    ],
};

const dirPath = path.resolve(__dirname, "test/st");
beforeAll(() => process.chdir(__dirname));

test(`Remove directory for resource`, async () => {
    await removeDirectory(config, "student");
    expect(fs.pathExists(dirPath)).resolves.toBe(false);
});

afterAll(async () => await fs.ensureDir(dirPath));
