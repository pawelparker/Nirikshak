module.exports = {
    collectCoverage: true,
    coverageReporters: ["json-summary", "text", "lcov"],
    collectCoverageFrom: [
        "packages/!(*example*)/src/**/*.ts",
        "!**/node_modules/**",
    ],
    coverageDirectory: "<rootDir>/coverage",
};
