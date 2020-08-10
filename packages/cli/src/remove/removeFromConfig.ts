import fs from "fs-extra";
import path from "path";
import { Configuration } from "../utils/types";
import { getResourceName } from "../utils/resourceData";

export default async function removeFromConfig(
    name: string,
    configFile: string
): Promise<void> {
    const configPath = path.resolve(configFile);
    const configData: Configuration = await fs.readJSON(configPath);

    configData.resources = configData.resources.filter(
        (entry) => getResourceName(entry) !== name
    );

    await fs.writeJSON(configPath, configData, {
        spaces: 4,
    });
}
