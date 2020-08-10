import path from "path";
import childProcess from "child_process";
import fs from "fs-extra";
const flags = ["--version", "-v", "--help", "-h"];
const modulePath = path.resolve(__dirname, "../../lib/index.js");
describe("Command output", () => {
    beforeAll(() => {
        if (!fs.existsSync(modulePath))
            childProcess.execSync("cd packages/cli && npm run build:dev");
        process.chdir(__dirname);
    });

    for (const flag of flags)
        test(flag, (done) => {
            expect.hasAssertions();
            const output = childProcess.spawn("node", [modulePath, flag]);

            const chunks: Buffer[] = [];
            output.stdout.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
            });

            output.stdout.on("end", () => {
                expect(Buffer.concat(chunks).toString()).toMatchSnapshot();
                done();
            });
        });
});
