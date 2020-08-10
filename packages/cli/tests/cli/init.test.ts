import path from "path";
import fs from "fs-extra";
import childProcess from "child_process";

const modulePath = path.resolve(__dirname, "../../lib/index.js");

beforeAll(() => {
    if (!fs.existsSync(modulePath))
        childProcess.execSync("cd packages/cli && npm run build:dev");
    process.chdir(__dirname);
});

test("Check binding to modules via init command", async () => {
    const output = childProcess.execSync(`node ${modulePath} init`);
    expect(output.toString()).toMatchSnapshot();
});
