import { Configuration } from "../../src/utils/types";
import * as Run from "../../src/run";
import childProcess from "child_process";
import signale from "signale";
jest.mock("child_process");

const validConfig: Configuration = {
    dir: "tests",
    app: "index.ts",
    resources: ["student", { name: "person", dir: "personDir/" }],
};

beforeAll(() => process.chdir(__dirname));
beforeEach(() => {
    signale.info = jest.fn();
    signale.error = jest.fn();
    signale.success = jest.fn();
});
test(`Command`, () => expect(Run.command).toEqual("run [name..]"));
test(`Description`, () =>
    expect(Run.describe).toEqual("Run tests for specified resources."));

const validJest: {
    input: Parameters<typeof Run.handler>[0];
    command: string;
}[] = [
    {
        input: {
            name: ["student"],
            configuration: {
                ...validConfig,
                jestArgs: ["--no-cache", "--runInBand"],
            },
            config: "config.json",
        },
        command: `npx jest --no-cache --runInBand --color=false --noStackTrace tests/student/`,
    },
    {
        input: {
            name: ["person"],
            configuration: {
                ...validConfig,
            },
            config: "config.json",
        },
        command: `npx jest --color=false --noStackTrace tests/personDir/`,
    },
    {
        input: {
            name: [],
            configuration: {
                ...validConfig,
                jestArgs: ["--no-cache", "--runInBand"],
            },
            config: "config.json",
        },
        command: `npx jest --no-cache --runInBand --color=false --noStackTrace tests/student/ tests/personDir/`,
    },
    {
        input: {
            configuration: {
                ...validConfig,
                jestArgs: ["--no-cache", "--runInBand"],
            },
            config: "config.json",
        },
        command: `npx jest --no-cache --runInBand --color=false --noStackTrace tests/student/ tests/personDir/`,
    },
];

describe(`Valid config`, () => {
    test(`Invalid resource names`, async () => {
        expect.assertions(3);
        try {
            await Run.handler({
                configuration: validConfig,
                config: "config.json",
                name: ["true"],
            });
        } catch (e) {
            expect(e).toMatchInlineSnapshot(
                `[Error: Cannot find resource: true]`
            );
        }
        expect(signale.info).not.toHaveBeenCalled();
        expect(signale.success).not.toHaveBeenCalled();
    });

    test.each(validJest)(
        `Jest with config arguments: %#`,
        async ({ input, command }) => {
            await Run.handler(input);

            expect(childProcess.execSync).toHaveBeenCalledWith(command, {
                stdio: ["inherit", "inherit", "inherit"],
            });
            expect(signale.info).toHaveBeenCalledWith(
                `Invoking jest. This might take a while if there are a large number of tests.`
            );
            expect(signale.success).toHaveBeenCalledWith(
                `Jest completed successfully.`
            );
        }
    );

    test(`Jest throws error`, async () => {
        expect.assertions(4);
        childProcess.execSync = jest.fn().mockImplementation(() => {
            throw new Error(`Mocking error`);
        });
        try {
            await Run.handler({
                config: "config.json",
                configuration: validConfig,
                name: [],
            });
        } catch (e) {
            expect(e).toBeTruthy();
            expect(signale.fatal).toHaveBeenCalledWith(`Jest sent an error`);
        }
        expect(signale.info).toHaveBeenCalledWith(
            `Invoking jest. This might take a while if there are a large number of tests.`
        );
        expect(signale.success).not.toHaveBeenCalled();
    });
});
