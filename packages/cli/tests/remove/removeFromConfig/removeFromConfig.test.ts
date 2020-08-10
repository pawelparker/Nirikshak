import process from "process";
import fs from "fs-extra";
import path from "path";
import removeFromConfig from "../../../src/remove/removeFromConfig";
import { Configuration } from "../../../src/utils/types";
const configPath = path.resolve(__dirname, "config.json");

beforeAll(() => process.chdir(__dirname));

test(`Removes the resource entry`, async () => {
    await removeFromConfig("student", configPath);
    const data: Configuration = await fs.readJSON(configPath);

    expect(
        data.resources.some((e) =>
            typeof e === "string" ? e === "student" : e.name === "student"
        )
    ).toBe(false);
});

afterAll(async () => {
    const data: Configuration = await fs.readJSON(configPath);
    data.resources.push({
        name: "student",
        dir: "st",
    });
    await fs.writeJSON(configPath, data,{spaces: 4});
});
