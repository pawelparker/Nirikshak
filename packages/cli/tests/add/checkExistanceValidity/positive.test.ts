import { Configuration } from "../../../src/utils/types";
import { checkExistanceValidity } from "../../../src/add/checkExistanceValidity";

const config: Configuration = {
    app: "index.ts",
    dir: "__test__",
    resources: ["name", { dir: "min", name: "max" }],
};

beforeAll(() => process.chdir(__dirname));

test(`Resource existance validity : Positive`, () => {
    expect(
        checkExistanceValidity("minimax", "micromax", config)
    ).resolves.toBeUndefined();
});
