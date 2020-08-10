import process from "process";
import path from "path";
import { parseConfig } from "../../../src/configuration";
const invalidPath = path.resolve(__dirname, "nonExistent.json");
const validPath = path.resolve(__dirname, "invalid.json");

describe(`Parse invalid configuration`, () => {
    beforeAll(() => process.chdir(__dirname));

    test(`Invalid path`, () => {
        const err = parseConfig(invalidPath);
        expect(err).toMatchInlineSnapshot(
            `[Error: Error: /home/yash/Desktop/nirikshak/packages/cli/tests/configuration/parse/nonExistent.json: ENOENT: no such file or directory, open '/home/yash/Desktop/nirikshak/packages/cli/tests/configuration/parse/nonExistent.json']`
        );
    });

    test(`Invalid file`, () => {
        const err = parseConfig(validPath);
        expect(err).toMatchInlineSnapshot(
            `[Error: Error parsing configuration: data should have required property 'app']`
        );
    });
});
