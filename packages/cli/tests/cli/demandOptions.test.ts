import path from "path";
import fs from "fs-extra";
import childProcess from "child_process";

const modulePath = path.resolve(__dirname, "../../lib/index.js");

beforeAll(() => {
    if (!fs.existsSync(modulePath))
        childProcess.execSync("cd packages/cli && npm run build:dev");
    process.chdir(__dirname);
});

test("Demand atleast one option", async () => {
    const output = childProcess.execSync(`node ${modulePath}`);
    expect(output.toString()).toMatchSnapshot();
});
