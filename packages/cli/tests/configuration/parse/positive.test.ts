import process from "process";
import path from "path";
import ValidConfig from "./valid.json";
import { parseConfig } from "../../../src/configuration";
const configPath = path.resolve(__dirname, "valid.json");

beforeAll(() => process.chdir(__dirname));

test("Valid configuration parsing", () => {
    const parsed = parseConfig(configPath);

    expect("configuration" in parsed).toBe(true);
    expect((parsed as Exclude<typeof parsed, Error>).configuration).toEqual(
        ValidConfig
    );
});
