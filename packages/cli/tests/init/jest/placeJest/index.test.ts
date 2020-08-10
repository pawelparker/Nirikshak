import fs from "fs-extra";
import process from "process";
import placeJestConfig, {
    makeJestConfiguration,
} from "../../../../src/init/jest";
import { Configuration } from "../../../../src/utils/types";
beforeAll(() => process.chdir(__dirname));

const config: Configuration = {
    app: "index.ts",
    dir: "teacher",
    resources: ["student"],
};

test(`Placing jest configuration files`, async () => {
    await placeJestConfig(config);
    expect(await fs.pathExists("jest.config.json")).toBe(true);
    // Import the configuration file
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    // eslint-disable-next-line import/no-unresolved
    const { default: mod } = await import("./jest.config.json");
    expect(mod).toEqual(makeJestConfiguration(config));
    expect(await fs.pathExists("jest.setup.js")).toBe(true);
});

afterAll(async () => {
    // Remove the files
    await fs.remove("jest.config.json");
    await fs.remove("jest.setup.js");
});
