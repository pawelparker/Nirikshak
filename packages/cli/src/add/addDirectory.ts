import path from "path";
import fs from "fs-extra";
import { getAppImport } from "../utils/getAppImport";

export default async function addDirectory(
    dir: string,
    rootDir: string,
    resourceName: string,
    appPath: string
): Promise<void> {
    // Get the path for the resource directory
    const resultant = path.resolve(rootDir, dir);
    if (await fs.pathExists(resultant))
        throw new Error(`Directory ${dir} already exists`);
    await fs.ensureDir(resultant);

    // Place the configuration file
    await fs.copy(
        path.resolve(__dirname, "../../staticFiles/config.json"),
        path.resolve(resultant, "config.json")
    );

    // Place the helper file
    await fs.copy(
        path.resolve(__dirname, "../../staticFiles/helpers"),
        path.resolve(resultant, "helpers.ts")
    );

    // Place resource.json template
    await fs.copy(
        path.resolve(__dirname, "../../staticFiles/resource.json"),
        path.resolve(resultant, "resource.json")
    );

    // Place endpoints template
    await fs.copy(
        path.resolve(__dirname, "../../staticFiles/endpoints.json"),
        path.resolve(resultant, "endpoints.json")
    );

    // Get the import path for the app
    const app = getAppImport(path.resolve(appPath));
    // Read the test file
    const test = (
        await fs.readFile(path.resolve(__dirname, "../../staticFiles/test"))
    )
        .toString()
        // Replace {{appPath}} by the app import path and {{resource}} by resource name
        .replace(/{{appPath}}|{{resource}}/g, (m) => {
            if (m[2] === "r") return resourceName;
            else return app;
        });
    // Write the test file in the destination
    await fs.writeFile(
        path.resolve(resultant, `${resourceName}.test.ts`),
        test
    );
}
