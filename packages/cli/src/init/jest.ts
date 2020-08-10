import path from "path";
import { Configuration, CliArgs, JestConfig } from "../utils/types";
import fs from "fs-extra";
import { getResourceDirectory } from "../utils/getResourceDir";

export function makeJestConfiguration(
    configuration: CliArgs["configuration"]
): JestConfig {
    return {
        // Each resource is treated as a project
        projects: configuration.resources.map((resource) => ({
            displayName: typeof resource == "string" ? resource : resource.name,
            // Test regex
            testMatch: [
                path.join(
                    "<rootDir>",
                    getResourceDirectory(resource, configuration.dir),
                    "**/*.test.ts"
                ),
            ],
        })),
        // A longer timeout might be needed. Extend to 30s to be safe
        setupFilesAfterEnv: ["./jest.setup.js"],
        // Plug in the reporter
        reporters: ["default", "@nirikshak/reporter"],
    };
}

export default async function placeJestConfig(
    configuration: Configuration
): Promise<void> {
    // Prepare jest configuration
    const jestConfig = makeJestConfiguration(configuration);

    // Put in the config file
    await fs.writeJSON("jest.config.json", jestConfig, {
        spaces: 4,
    });
    // Put in the setup file
    await fs.copy(
        path.resolve(__dirname, "../../staticFiles/jest.setup.js"),
        "jest.setup.js"
    );
}
