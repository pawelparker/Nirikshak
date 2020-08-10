import path from "path";
import fs from "fs-extra";
import process from "process";
import addDirectory from "../../../src/add/addDirectory";
beforeAll(() => process.chdir(__dirname));

test(`Adding new directory`, async () => {
    const resultant = path.resolve("nirikshak/student");
    await addDirectory("student", "nirikshak", "student", "app.ts");
    expect(fs.pathExists(resultant)).resolves.toBe(true);
    expect(fs.pathExists(path.resolve(resultant, "config.json"))).resolves.toBe(
        true
    );
    expect(fs.pathExists(path.resolve(resultant, "helpers.ts"))).resolves.toBe(
        true
    );
    expect(
        fs.pathExists(path.resolve(resultant, "resource.json"))
    ).resolves.toBe(true);
    expect(
        fs.pathExists(path.resolve(resultant, "endpoints.json"))
    ).resolves.toBe(true);
    const testPath = path.resolve(resultant, "student.test.ts");
    expect(fs.pathExists(testPath)).resolves.toBe(true);
    const data = (await fs.readFile(testPath)).toString();
    // Check that the templates were replaced by the correct values
    expect(data.includes("{{resource}}")).toBe(false);
    expect(data.includes("{{appPath}}")).toBe(false);
    expect(data.includes(`import app from "${path.resolve("app")}";`)).toBe(
        true
    );
    expect(data.includes(`describe("student"`)).toBe(true);
});

afterAll(async () => await fs.remove(path.resolve("nirikshak/student")));
