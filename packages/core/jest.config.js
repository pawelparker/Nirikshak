const base = require("../../jest.base");

module.exports = {
    ...base,
    collectCoverage: true,
    collectCoverageFrom: ["<rootDir>/src/**/*.ts"],
    setupFilesAfterEnv: [
        // NOT setupFiles
        "./jestSetup.js",
    ],
};
