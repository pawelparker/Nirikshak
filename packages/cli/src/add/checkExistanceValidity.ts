import { Configuration } from "../utils/types";
import { getResourceName } from "../utils/resourceData";
import fs from "fs-extra";
import { getResourceDirectory } from "../utils/getResourceDir";
import path from "path";
export async function checkExistanceValidity(
    name: string,
    directory: string,
    { resources, dir }: Configuration
): Promise<void> {
    // Check for duplicate resource directory
    if (
        await fs.pathExists(
            path.resolve(getResourceDirectory({ name, dir: directory }, dir))
        )
    )
        throw new Error(`Directory ${dir} already exists.`);

    // For all resources in configuration
    for (const resource of resources) {
        // Check for duplicate resource name
        if (getResourceName(resource) == name)
            throw new Error(`Resource ${name} already exists.`);
    }
}
