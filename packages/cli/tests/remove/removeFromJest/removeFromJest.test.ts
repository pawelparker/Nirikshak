import process from "process";
import fs from "fs-extra";
import path from "path";
import { JestConfig } from "../../../src/utils/types";
import removeFromJest from "../../../src/remove/removeFromJest";
const configPath = path.resolve(__dirname, "jest.config.json");

beforeAll(() => process.chdir(__dirname));

test(`Removes the resource entry`, async () => {
    await removeFromJest("student");
    const data: JestConfig = await fs.readJSON(configPath);

    expect(data.projects.some((e) => e.displayName === "student")).toBe(false);
});

afterAll(async () => {
    const data: JestConfig = await fs.readJSON(configPath);
    data.projects.push({
        displayName: "student",
        testMatch: ["<rootDir>/student"],
    });
    await fs.writeJSON(configPath, data, { spaces: 4 });
});
