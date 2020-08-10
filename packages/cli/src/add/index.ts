import { CliArgs } from "../utils/types";
import addToConfig from "./addToConfig";
import addToJest from "./addToJest";
import addDirectory from "./addDirectory";
import signale from "signale";
import { checkExistanceValidity } from "./checkExistanceValidity";

interface AddArgs extends CliArgs {
    name: string;
    dir?: string;
}

async function add({
    name,
    dir,
    config,
    configuration,
}: AddArgs): Promise<void> {
    // The directory entry for the resource
    const directory = dir ?? name;
    signale.info(`Adding resource ${name}`);
    // Check for any conflicts
    await checkExistanceValidity(name, directory, configuration);
    // Adding the resource directory and files for it
    await addDirectory(directory, configuration.dir, name, configuration.app);
    // Adding the entry to nirkshak configuration
    await addToConfig(name, config, dir);
    // Adding the entry to jest configuration
    await addToJest(name, configuration.dir, dir);
    signale.success("Done");
}

export const command = "add <name> [dir]";
export const describe = "Add a resource to the project";
export const handler = add;
