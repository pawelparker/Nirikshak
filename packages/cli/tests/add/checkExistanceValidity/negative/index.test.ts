import { Configuration } from "../../../../src/utils/types";
import { checkExistanceValidity } from "../../../../src/add/checkExistanceValidity";

const config: Configuration = {
    app: "index.ts",
    dir: "__test__",
    resources: ["name", { dir: "min", name: "max" }],
};

beforeAll(() => process.chdir(__dirname));

describe(`Resource existance validity : Negative`, () => {
    test(`Same name`, async () => {
        expect.hasAssertions();
        try {
            await checkExistanceValidity("name", "lorem-ipsum", config);
        } catch (e) {
            expect(e).toMatchInlineSnapshot(
                `[Error: Resource name already exists.]`
            );
        }
    });

    test(`Existing directory`, async () => {
        expect.hasAssertions();
        try {
            await checkExistanceValidity("lorem-ipsum", "max", config);
        } catch (e) {
            expect(e).toMatchInlineSnapshot(
                `[Error: Directory __test__ already exists.]`
            );
        }
    });
});
