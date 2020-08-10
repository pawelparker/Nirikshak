import signale from "signale";
import process from "process";
import * as Add from "../../../src/add";
import fs from "fs-extra";
import path from "path";
import { Configuration, JestConfig } from "../../../src/utils/types";
import {
    getResourceName,
    getResourceDirEntry,
} from "../../../src/utils/resourceData";

const configData: Configuration = fs.readJSONSync(
    path.resolve(__dirname, "config.json")
);
beforeAll(() => process.chdir(__dirname));
beforeEach(() => {
    signale.info = jest.fn();
    signale.error = jest.fn();
    signale.success = jest.fn();
});

test(`Valid case`, async () => {
    await Add.handler({
        name: "faculty",
        config: "config.json",
        configuration: configData,
    });

    expect(fs.pathExists(path.resolve("test", "faculty"))).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("test", "faculty", "config.json"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("test", "faculty", "helpers.ts"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("test", "faculty", "resource.json"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("test", "faculty", "endpoints.json"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve("test", "faculty", "faculty.test.ts"))
    ).resolves.toBe(true);
    // Checking the changes in nirikshak configuration
    const newConfig: Configuration = await fs.readJSON("config.json");
    // Expect the entry to be added
    expect(
        newConfig.resources.some(
            (e) =>
                getResourceName(e) === "faculty" &&
                getResourceDirEntry(e) === "faculty"
        )
    ).toBe(true);
    // Checking the changes made to jest configuration
    const jest: JestConfig = await fs.readJSON("jest.config.json");
    const testPath = path.join("<rootDir>", "test", "faculty", "**/*.test.ts");
    const e = jest.projects[1];
    // Expect the entry to be added with correct displayname and project regex
    expect(e.displayName === "faculty" && e.testMatch.includes(testPath)).toBe(
        true
    );

    expect(signale.info).toHaveBeenCalledWith("Adding resource faculty");
    expect(signale.success).toHaveBeenCalledWith("Done");
});

afterAll(async () => {
    configData.resources = configData.resources.filter(
        (e) => getResourceName(e) !== "faculty"
    );
    // Reset to previous nirikshak config
    await fs.writeJSON("config.json", configData, { spaces: 4 });
    // Reset to previous jest configu
    await fs.writeJSON(
        "jest.config.json",
        {
            projects: [{ displayName: "student", testMatch: ["student"] }],
        },
        { spaces: 4 }
    );
    await fs.remove(path.resolve("test", "faculty"));
});
