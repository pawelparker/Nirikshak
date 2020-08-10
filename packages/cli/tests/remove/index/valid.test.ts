import process from "process";
import * as Remove from "../../../src/remove";
import path from "path";
import fs from "fs-extra";
import { Configuration, JestConfig } from "../../../src/utils/types";
import signale from "signale";
const validConfig: Configuration = fs.readJSONSync(
    path.resolve(__dirname, "config.json")
);

beforeAll(() => process.chdir(__dirname));

test(`Removing valid resource`, async () => {
    await Remove.handler({
        config: "config.json",
        name: "student",
        configuration: validConfig,
    });

    // Check if the entry was removed from the configuration
    const data: Configuration = await fs.readJSON("config.json");
    expect(data.resources.some((e) => e === "student")).toBe(false);
    // Check for jest config
    const jestData: JestConfig = await fs.readJSON("jest.config.json");
    expect(jestData.projects.some((e) => e.displayName === "student")).toBe(
        false
    );
    // Check the directory existance
    expect(fs.pathExists(path.resolve("test", "student"))).resolves.toBe(false);
    // Log message
    expect(signale.info).toHaveBeenCalledWith("Removing resource student");
    expect(signale.success).toHaveBeenCalledWith("Done");
});

afterAll(async () => {
    // Reset jest config
    const data: JestConfig = await fs.readJSON("jest.config.json");
    data.projects.push({
        displayName: "student",
        testMatch: ["<rootDir>/student"],
    });
    await fs.writeJSON("jest.config.json", data, { spaces: 4 });
    // Reset config
    const configData: Configuration = await fs.readJSON("config.json");
    configData.resources.push("student");
    await fs.writeJSON("config.json", configData, { spaces: 4 });
    // Reset directory structure
    await fs.ensureDir(path.resolve("test", "student"));
});
