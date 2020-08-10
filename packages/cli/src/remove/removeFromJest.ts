import fs from "fs-extra";
import path from "path";
import { JestConfig } from "../utils/types";

export default async function removeFromJest(name: string): Promise<void> {
    const configData: JestConfig = await fs.readJSON(
        path.resolve("jest.config.json")
    );

    configData.projects = configData.projects.filter(
        (entry) => entry.displayName !== name
    );

    await fs.writeJSON("jest.config.json", configData, {
        spaces: 4,
    });
}
