const path = require("path");
module.exports = {
    env: {
        es6: true,
        node: true,
        jest: true,
    },
    root: true,
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:import/typescript",
    ],
    ignorePatterns: ["node_modules", "*.js", "*.d.ts"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json", "./packages/*/tsconfig.json"],
    },
    plugins: ["@typescript-eslint"],
    rules: {
        "import/no-unresolved": ["error", { ignore: ["^@nirikshak"] }],
        "@typescript-eslint/no-explicit-any": 0,
        "@typescript-eslint/no-non-null-assertion": 0,
        "import/default": 0,
        "import/no-extraneous-dependencies": ["error"],
        "@typescript-eslint/no-use-before-define": [
            "error",
            { functions: false },
        ],
    },
};
