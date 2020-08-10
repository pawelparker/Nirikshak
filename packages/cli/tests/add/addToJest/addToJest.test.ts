import path from "path";
import process from "process";
import fs from "fs-extra";
import { JestConfig } from "../../../src/utils/types";
import addToJest from "../../../src/add/addToJest";

describe(`Adding entry to jest`, () => {
    beforeAll(() => process.chdir(__dirname));

    test(`With directory`, async () => {
        await addToJest("college", "nirikshak", "collegeDir");
        const data: JestConfig = await fs.readJSON("jest.config.json");

        const testPath = path.join(
            "<rootDir>",
            "nirikshak",
            "collegeDir",
            "**/*.test.ts"
        );
        expect(
            data.projects.some(
                (project) =>
                    project.displayName === "college" &&
                    project.testMatch.includes(testPath)
            )
        ).toBe(true);
        data.projects = data.projects.filter(
            (project) =>
                project.displayName !== "college" &&
                !project.testMatch.includes(testPath)
        );
        await fs.writeJSON("jest.config.json", data, {
            spaces: 4,
        });
    });

    test(`With name`, async () => {
        await addToJest("faculty", "nirikshak");
        const data: JestConfig = await fs.readJSON("jest.config.json");

        const testPath = path.join(
            "<rootDir>",
            "nirikshak",
            "faculty",
            "**/*.test.ts"
        );
        expect(
            data.projects.some(
                (project) =>
                    project.displayName === "faculty" &&
                    project.testMatch.includes(testPath)
            )
        ).toBe(true);
        data.projects = data.projects.filter(
            (project) =>
                project.displayName !== "faculty" &&
                !project.testMatch.includes(testPath)
        );
        await fs.writeJSON("jest.config.json", data, {
            spaces: 4,
        });
    });
});
