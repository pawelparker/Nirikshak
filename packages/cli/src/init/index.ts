import { Configuration } from "../utils/types";
import { ensureDirectories } from "./ensureDirectories";
import placeJestConfig from "./jest";
import signale from "signale";

async function init({
    configuration,
}: {
    configuration: Configuration;
}): Promise<void> {
    signale.info("Initialising nirikshak");
    // Prepare the folder structure needed
    await ensureDirectories(configuration);
    // Prepare jest files
    await placeJestConfig(configuration);
    // Adding entries for the resources in .nirikshak
    signale.success("Done");
}

export const command = "init";
export const describe = "Initialise nirikshak in the project";
export const handler = init;
