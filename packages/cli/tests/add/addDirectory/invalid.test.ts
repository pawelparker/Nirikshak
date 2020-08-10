import process from "process";
import addDirectory from "../../../src/add/addDirectory";
beforeAll(() => process.chdir(__dirname));

test(`Adding already existing directory`, async () => {
    expect.hasAssertions();
    try {
        // Directory sample already exists
        await addDirectory("sample", "nirikshak", "student", "app");
    } catch (e) {
        expect(e).toMatchInlineSnapshot(
            `[Error: Directory sample already exists]`
        );
    }
});
