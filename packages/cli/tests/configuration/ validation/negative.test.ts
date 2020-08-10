import process from "process";
import { validateConfig } from "../../../src/configuration";
const invalidConfigs = [
    // No app
    {},
    // No app
    { dir: "testDirectory" },
    // No app
    { resources: ["student"] },
    // No app
    { dir: 12, resources: ["name"] },
    // No app
    { dir: "testDir", resources: 12312 },
    // No app
    { dir: "testDir", resources: [] },
    // No app
    { dir: "testDir", resources: [""] },
    // No app
    { dir: "testDir", resources: [{ name: "" }] },
    // No app
    { dir: "testDir", resources: [{ name: "name" }] },
    // No app
    { dir: "testDir", resources: [{ name: "name", dir: "" }] },
    // No app
    { dir: "testDir", resources: [{ name: "name", dir: "dir" }, ""] },
    // No app
    { dir: "testDir", resources: ["", { name: "" }] },
    // No app
    { dir: "testDir", resources: ["", { name: "name" }] },
    // No app
    { dir: "testDir", resources: ["", { name: "name", dir: "" }] },
    // No dir
    { app: "app.ts" },
    // No resource
    { app: "app.ts", dir: "testDirectory" },
    // No dir
    { app: "app.ts", resources: ["student"] },
    // Invalid dir
    { app: "app.ts", dir: 12, resources: ["name"] },
    // Invalid resources
    { app: "app.ts", dir: "testDir", resources: 12312 },
    // Invalid resource length
    { app: "app.ts", dir: "testDir", resources: [] },
    // Invalid resource entry
    { app: "app.ts", dir: "testDir", resources: [""] },
    // Invalid resource entry name
    { app: "app.ts", dir: "testDir", resources: [{ name: "" }] },
    // Missing dir from resource entry
    { app: "app.ts", dir: "testDir", resources: [{ name: "name" }] },
    // Invalid dir in resource entry
    { app: "app.ts", dir: "testDir", resources: [{ name: "name", dir: "" }] },
    // Invalid resource entry
    {
        app: "app.ts",
        dir: "testDir",
        resources: [{ name: "name", dir: "dir" }, ""],
    },
    // Invalid resource entry
    { app: "app.ts", dir: "testDir", resources: ["", { name: "" }] },
    // Invalid resource entry
    { app: "app.ts", dir: "testDir", resources: ["", { name: "name" }] },
    // Invalid resource entry
    {
        app: "app.ts",
        dir: "testDir",
        resources: ["", { name: "name", dir: "" }],
    },
    // Duplicate resource entry
    {
        app: "app.ts",
        dir: "testDir",
        resources: ["name", { name: "name", dir: "files" }],
    },
    // Duplicate resource directory
    {
        app: "app.ts",
        dir: "testDir",
        resources: ["name", { name: "namaste", dir: "name" }],
    },
    // Invalid jest argument
    {
        app: "app.ts",
        dir: "testDir",
        resources: ["name"],
        jestArgs: [1, 2, 3, 4, false],
    },
    // Invalid jestArgs type
    {
        app: "app.ts",
        dir: "testDir",
        resources: ["name"],
        jestArgs: "shingles",
    },
];

describe("Validate invalid config", () => {
    beforeAll(() => process.chdir(__dirname));
    test.each(invalidConfigs)("Validate invalid config %#", (invalid) => {
        expect.assertions(1);
        try {
            validateConfig(invalid);
        } catch (e) {
            expect(e).toMatchSnapshot();
        }
    });
});
