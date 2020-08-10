import path from "path";
import process from "process";
import * as Init from "../../../src/init";
import { Configuration } from "../../../src/utils/types";
import fs from "fs-extra";
import signale from "signale";

const config: Configuration = {
    app: "app.ts",
    dir: "nirikshak",
    resources: ["resource"],
};

const cwd = process.cwd();

beforeEach(() => {
    signale.info = jest.fn();
    signale.error = jest.fn();
    signale.success = jest.fn();
});
describe(`Initialisation module metadata`, () => {
    test(`Command`, () => expect(Init.command).toEqual("init"));
    test(`Description`, () =>
        expect(Init.describe).toEqual("Initialise nirikshak in the project"));
});

describe(`Initilisation flow`, () => {
    beforeAll(() => process.chdir(__dirname));

    test(`File structure generation`, async () => {
        await Init.handler({ configuration: config });
        expect(fs.pathExists("nirikshak")).resolves.toBe(true);
        expect(fs.pathExists(".nirikshak")).resolves.toBe(true);
        expect(
            fs.pathExists(
                path.resolve("nirikshak", "resource/resource.test.ts")
            )
        ).resolves.toBe(true);
        expect(
            fs.pathExists(path.resolve("nirikshak", "resource/config.json"))
        ).resolves.toBe(true);
        expect(
            fs.pathExists(path.resolve("nirikshak", "resource/resource.json"))
        ).resolves.toBe(true);
        expect(
            fs.pathExists(path.resolve("nirikshak", "resource/endpoints.json"))
        ).resolves.toBe(true);
        expect(
            fs.pathExists(path.resolve("nirikshak", "resource/helpers.ts"))
        ).resolves.toBe(true);

        expect(fs.pathExists("jest.config.json")).resolves.toBe(true);
        expect(fs.pathExists("jest.setup.js")).resolves.toBe(true);

        expect(signale.info).toHaveBeenCalledWith("Initialising nirikshak");
        expect(signale.success).toHaveBeenCalledWith("Done");
    });

    afterAll(async () => {
        await fs.remove(".nirikshak");
        await fs.remove("nirikshak");
        await fs.remove("jest.config.json");
        await fs.remove("jest.setup.js");
        process.chdir(cwd);
    });
});
