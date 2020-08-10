import fs from "fs-extra";
import { CliArgs } from "../utils/types";
import path from "path";
import addDirectory from "../add/addDirectory";
import { getResourceDirEntry, getResourceName } from "../utils/resourceData";

export async function ensureDirectories(
    configuration: CliArgs["configuration"]
): Promise<void> {
    // .nirikshak directory exists = project initialised

    // If the project has already been initialised
    if (await fs.pathExists(".nirikshak"))
        throw new Error(
            `Project already initialised. Delete ${path.resolve(
                ".nirikshak"
            )} if you want to restart from scratch.`
        );
    // Mark the project initialised
    // To be used for storing metadata in future
    else await fs.mkdir(".nirikshak");

    // Create the test folder
    await fs.ensureDir(path.resolve(configuration.dir));

    // Create and prepare directories for the resource
    await Promise.all(
        configuration.resources.map((resource) =>
            addDirectory(
                getResourceDirEntry(resource),
                configuration.dir,
                getResourceName(resource),
                configuration.app
            )
        )
    );
}
