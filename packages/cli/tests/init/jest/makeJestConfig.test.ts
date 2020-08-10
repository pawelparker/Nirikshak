import { Configuration, JestConfig } from "../../../src/utils/types";
import { makeJestConfiguration } from "../../../src/init/jest";
import path from "path";
const config: Configuration = {
    app: "index.ts",
    dir: "nirikshak",
    resources: ["student", { name: "faculty", dir: "tests/faculty" }],
};

const jestConfig: JestConfig = {
    setupFilesAfterEnv: ["./jest.setup.js"],
    projects: [
        {
            displayName: "student",
            testMatch: [
                path.join("<rootDir>", "nirikshak", "student", "**/*.test.ts"),
            ],
        },
        {
            displayName: "faculty",
            testMatch: [
                path.join(
                    "<rootDir>",
                    "nirikshak",
                    "tests/faculty",
                    "**/*.test.ts"
                ),
            ],
        },
    ],
    reporters: ["default", "@nirikshak/reporter"],
};

test(`Making jest configuration`, () => {
    expect(makeJestConfiguration(config)).toEqual(jestConfig);
});
