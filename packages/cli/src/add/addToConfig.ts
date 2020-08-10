import fs from "fs-extra";
import path from "path";
import { Configuration } from "../utils/types";

export default async function addToConfig(
    name: string,
    configFile: string,
    dir?: string
): Promise<void> {
    const configPath = path.resolve(configFile);
    const configData: Configuration = await fs.readJSON(configPath);

    configData.resources.push(
        dir
            ? {
                  dir,
                  name,
              }
            : name
    );

    await fs.writeJSON(configPath, configData, {
        spaces: 4,
    });
}
