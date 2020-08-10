/* Only for jest */

// babel.config.js
module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
    ],
    plugins: ["@babel/plugin-proposal-export-namespace-from"],
    sourceMaps: "inline",
    retainLines: true,
};
