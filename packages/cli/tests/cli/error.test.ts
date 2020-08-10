import childProcess from "child_process";
import path from "path";
import fs from "fs-extra";
const modulePath = path.resolve(__dirname, "../../lib/index.js");
describe("Checks error handling with yargs", () => {
    beforeAll(() => {
        if (!fs.existsSync(modulePath))
            childProcess.execSync("cd packages/cli && npm run build:dev");
        process.chdir(__dirname);
    });

    test(`Invalid config path`, () => {
        const output = childProcess.execSync(
            `node ${modulePath} -c config.json`
        );
        expect(output.toString()).toMatchSnapshot();
    });
});
