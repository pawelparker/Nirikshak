import { CliArgs } from "../utils/types";
import removeDirectory from "./removeDirectory";
import removeFromConfig from "./removeFromConfig";
import removeFromJest from "./removeFromJest";
import signale from "signale";
import { getResourceName } from "../utils/resourceData";

interface RemoveArgs extends CliArgs {
    name: string;
}

async function remove({
    name,
    config,
    configuration,
}: RemoveArgs): Promise<void> {
    signale.info(`Removing resource ${name}`);
    // Check if the resource exists in the configuration
    if (!configuration.resources.some((e) => getResourceName(e) === name))
        throw new Error(`Cannot remove non existing resource: ${name}`);

    // Resource existance guaranteed
    // Remove the directory for it
    await removeDirectory(configuration, name);
    // Remove from nirikshak config
    await removeFromConfig(name, config);
    // Remove from jest config
    await removeFromJest(name);
    signale.success(`Done`);
}

export const command = "remove <name>";
export const describe = "Remove a resource from the project";
export const handler = remove;
