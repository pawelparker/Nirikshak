const base = require("./jest.base");

module.exports = {
    ...base,
    projects: [
        {
            displayName: "Root",
            testMatch: ["<rootDir>/tests/**/*.test.ts"],
        },
        {
            displayName: "CLI",
            testMatch: ["<rootDir>/packages/cli/tests/**/*.test.ts"],
        },
        {
            displayName: "Core",
            testMatch: ["<rootDir>/packages/core/tests/**/*.test.ts"],
        },
        {
            displayName: "Reporter",
            testMatch: ["<rootDir>/packages/reporter/tests/**/*.test.ts"],
        },
    ],
};
