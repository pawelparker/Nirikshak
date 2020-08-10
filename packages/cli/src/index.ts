#!/usr/bin/env node
/* istanbul ignore file */
import figlet from "./utils/figletWrapper";
import chalk from "chalk";
import yargs from "yargs";
import * as Init from "./init";
import { parseConfig } from "./configuration";
import signale from "signale";
import * as Remove from "./remove";
import * as Add from "./add";
import * as Run from "./run";
/* Main file to route the commands to appropriate functions */

(async function (): Promise<void> {
    console.log(
        chalk.whiteBright(
            await figlet("Nirikshak", {
                horizontalLayout: "full",
            })
        )
    );
    console.log(chalk.underline.bold("Test your REST APIs with ease"));
    console.log("\n");

    yargs
        .demandCommand(1)
        // Init command
        .command(Init)
        // Add command
        .command(Add)
        // Remove command
        .command(Remove)
        // Run command
        .command(Run)
        // Update app command
        .usage("Usage: $0 <command> [options]")
        // Option: config
        .config("config", parseConfig)
        // Configuration file options
        .alias("config", "c")
        .default("config", "nirikshak.json")
        .describe("config", "path to the configuration file")
        // Examples
        .example(
            "$0 init",
            "Initialises the project using configuration in nirikshak.json"
        )
        .example(
            "$0 init -c config.json",
            "Initialises the project using configuration in config.json"
        )
        .example(
            "$0 add student",
            "Adds files for a resource named student in student directory."
        )
        .example(
            "$0 add student myDir",
            "Adds files for a resource named student in myDir directory."
        )
        .example("$0 remove student", "Remove the resource named student.")
        // Alias help
        .help()
        .alias("help", "h")
        // Alias version
        .version()
        .alias("version", "v")
        // Error handling
        .fail((message, error) => {
            if (message && message !== error?.message) {
                yargs.showHelp();
                signale.fatal(message);
            } else signale.fatal(error);
            process.exit();
        })
        .recommendCommands()
        // Start
        .parse();
})();
