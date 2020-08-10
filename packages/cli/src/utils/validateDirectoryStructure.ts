import fs from "fs-extra";
import path from "path";
import { Configuration } from "./types";
import { getResourceDirectory } from "./getResourceDir";

export default async function validateDirectoryStructure(
    data: Configuration
): Promise<void> {
    // Check if the project has been init
    if (!(await fs.pathExists(path.resolve(".nirikshak"))))
        throw new Error(`Project has not been initialized.`);
    // Validate the testing directory
    const dirFilePath = path.resolve(".nirikshak", "dir");
    if (!(await fs.pathExists(dirFilePath)))
        throw new Error(
            `Project configuration corrupted. Delete .nirikshak folder and start over`
        );
    const dirContent = (await fs.readFile(dirFilePath)).toString();
    if (dirContent !== data.dir)
        throw new Error(
            `Nirikshak directory changed. Expected dir key of config to be ${dirContent}, got ${data.dir}`
        );

    if (!(await fs.pathExists(path.resolve(data.dir))))
        throw new Error(`Nirikshak directory: ${data.dir} does not exist`);
    const promiseArr: Promise<void>[] = data.resources.map(async (r) => {
        const resource = typeof r === "string" ? r : r.name;
        const metaPath = path.resolve(".nirikshak", resource);
        if (!(await fs.pathExists(metaPath)))
            throw new Error(
                `Resource ${resource} does not exist. Please check project configuration.`
            );
        const gotMeta = (await fs.readFile(metaPath)).toString();
        const expectedMeta = typeof r === "string" ? r : r.dir;
        if (expectedMeta !== gotMeta)
            throw new Error(
                `Resource directory for ${resource} does not match. Expected ${expectedMeta}, got ${gotMeta}.`
            );
        if (
            !(await fs.pathExists(
                path.resolve(getResourceDirectory(r, data.dir))
            ))
        )
            throw new Error(`Directory for ${resource} not found`);
    });

    await Promise.all(promiseArr);
}
