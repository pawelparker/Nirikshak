import process from "process";
import fs from "fs-extra";
import addToConfig from "../../../src/add/addToConfig";
import { Configuration } from "../../../src/utils/types";

beforeAll(() => process.chdir(__dirname));

describe(`Adding entries to config`, () => {
    test(`With directory`, async () => {
        await addToConfig("college", "config.json", "collegeDir");
        const data: Configuration = await fs.readJSON("config.json");

        expect(
            data.resources.some(
                (e) =>
                    typeof e === "object" &&
                    e.name === "college" &&
                    e.dir === "collegeDir"
            )
        ).toBe(true);

        data.resources = data.resources.filter(
            (e) =>
                typeof e !== "object" ||
                (e.name !== "college" && e.dir !== "collegeDir")
        );
        await fs.writeJSON("config.json", data, {
            spaces: 4,
        });
    });

    test(`With name`, async () => {
        await addToConfig("faculty", "config.json");
        const data: Configuration = await fs.readJSON("config.json");

        expect(data.resources.includes("faculty")).toBe(true);

        data.resources = data.resources.filter((e) => e !== "faculty");
        await fs.writeJSON("config.json", data, {
            spaces: 4,
        });
    });
});
