import process from "process";
import * as Remove from "../../../src/remove";
import path from "path";
import fs from "fs-extra";
import signale from "signale";

beforeAll(() => process.chdir(__dirname));
beforeEach(() => {
    signale.info = jest.fn();
    signale.error = jest.fn();
    signale.success = jest.fn();
});
test(`Invalid resource`, async () => {
    const validConfig = await fs.readJSON(
        path.resolve(__dirname, "config.json")
    );
    expect.assertions(3);
    try {
        await Remove.handler({
            config: "config.json",
            name: "faculty",
            configuration: validConfig,
        });
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Cannot remove non existing resource: faculty]`
        );
    }
    expect(signale.info).toHaveBeenCalledWith("Removing resource faculty");
    expect(signale.success).not.toHaveBeenCalled();
});
