import process from "process";
import * as Add from "../../../src/add";
import signale from "signale";
const config: Record<string, any> = {
    app: "index.ts",
    resources: ["student", "college"],
    dir: "test",
};

beforeAll(() => process.chdir(__dirname));
beforeEach(() => {
    signale.info = jest.fn();
    signale.error = jest.fn();
    signale.success = jest.fn();
});

test(`Already existing resource`, async () => {
    expect.assertions(3);
    try {
        await Add.handler({
            name: "student",
            dir: "fc",
            config: "config.json",
            configuration: config as any,
        });
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Resource student already exists.]`
        );
    }
    expect(signale.info).toHaveBeenCalledWith(`Adding resource student`);
    expect(signale.success).not.toHaveBeenCalled();
});
