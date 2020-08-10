import { CustomFunctionType } from "../../../src/common/types/custom";
import faker from "faker";
import { generateCustom } from "../../../src/common/generation/customGen";
import { SchemaHelpers } from "../../../src/common/types/helpers";
import { Literal } from "../../../src/common/types/literals";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";

const RandomFakerPromise = (): Promise<string> =>
    new Promise((resolve) => {
        const val = faker.random.word();
        setTimeout(
            () => resolve(val),
            // Don't need determinism here
            5
        );
    });

// Helpers for the resource
const Helpers: SchemaHelpers = {
    username: async () => faker.name.firstName() + faker.name.lastName(),
    number: async (min: number, max: number, step: number) =>
        // Use faker.random.number instead of Math.random
        // For universal randomness seed
        faker.random.number({ min, max, precision: step }),
    color: () => RandomFakerPromise(),
    invalidHelper: async () => ({ age: 12 } as any),
};

// Valid custom function types
const ValidCustoms: {
    input: CustomFunctionType;
    output: () => Promise<Literal>;
}[] = [
    {
        input: "custom:username",
        output: (): Promise<Literal> => Helpers.username(),
    },
    {
        input: {
            function: "custom:number",
            args: [0, 1, 0.1],
        },
        output: (): Promise<Literal> => Helpers.number(0, 1, 0.1),
    },
    {
        input: { function: "custom:color", args: [] },
        output: (): Promise<Literal> => Helpers.color(),
    },
];

describe("Custom literal generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidCustoms.forEach((entry, index) =>
            test(`Valid custom: ${index}, iteration : ${i}`, async () => {
                // Settings randomness seed
                // Does not work with faker.random.uuid and faker.date.*
                faker.seed(index + i * 100);
                const original = await generateCustom(entry.input, Helpers);
                faker.seed(index + i * 100);
                const expected = await entry.output();
                expect(original).toEqual(expected);
            })
        );

    // Checking that the function throws an error if no valid helper found at runtime
    test("Invalid custom literal: No helper found", () =>
        expect(
            generateCustom("custom:lipsum", Helpers)
        ).rejects.toMatchInlineSnapshot(
            `[Error: function: custom:lipsum, args: ]`
        ));

    test("Invalid custom literal: Non literal helper", () =>
        expect(
            generateCustom("custom:invalidHelper", Helpers)
        ).rejects.toMatchInlineSnapshot(
            `[Error: Non literal type value from custom:invalidHelper]`
        ));
});
