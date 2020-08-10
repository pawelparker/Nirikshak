import fs from "fs-extra";
import path from "path";
import { JestConfig } from "../utils/types";

export default async function addToJest(
    name: string,
    rootDir: string,
    dir?: string
): Promise<void> {
    const configData: JestConfig = await fs.readJSON(
        path.resolve("jest.config.json")
    );

    configData.projects.push({
        displayName: name,
        testMatch: [
            path.join("<rootDir>", rootDir, dir ? dir : name, "**/*.test.ts"),
        ],
    });

    await fs.writeJSON("jest.config.json", configData, {
        spaces: 4,
    });
}
