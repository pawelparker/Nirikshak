import signale from "signale";
import { CliArgs, Configuration } from "../utils/types";
import childProcess from "child_process";
import { getResourceDirectory } from "../utils/getResourceDir";
import { getResourceName } from "../utils/resourceData";
interface RunArgs extends CliArgs {
    name?: string[];
}

async function run({ name = [], configuration }: RunArgs): Promise<void> {
    let mapping: Configuration["resources"] = [];

    name.forEach((n) => {
        const val = configuration.resources.find(
            (resource) => getResourceName(resource) === n
        );
        if (!val) throw new Error(`Cannot find resource: ${n}`);
        mapping.push(val);
    });
    if (!mapping.length) mapping = configuration.resources;
    const commandString: string[] = configuration.jestArgs ?? [];
    // Override user
    commandString.push("--color=false", "--noStackTrace");
    commandString.push(
        ...mapping.map((m) => {
            const v = getResourceDirectory(m, configuration.dir);
            return v[v.length - 1] === "/" ? v : v + "/";
        })
    );

    try {
        signale.info(
            `Invoking jest. This might take a while if there are a large number of tests.`
        );
        childProcess.execSync(`npx jest ${commandString.join(" ")}`, {
            stdio: ["inherit", "inherit", "inherit"],
        });
        signale.success(`Jest completed successfully.`);
    } catch (e) {
        signale.fatal("Jest sent an error");
        throw e;
    }
}

export const command = "run [name..]";
export const describe = "Run tests for specified resources.";
export const handler = run;
