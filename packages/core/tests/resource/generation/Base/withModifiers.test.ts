import faker from "faker";
import { BaseType, WithModifiers } from "../../../../src/resource/types/helper";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";
import { generateWithModifiers } from "../../../../src/resource/generation/withModifiersGen";
import { ValidModifiers } from "../../utils";
import {
    SchemaHelpers,
    isPrimitives,
} from "../../../../src/common/types/helpers";

// Helpers for the resource
const Helpers: SchemaHelpers = {
    username: async () => faker.name.firstName() + faker.name.lastName(),
    number: async (min: number, max: number, step: number) =>
        // Use faker.random.number instead of Math.random
        // For universal randomness seed
        faker.random.number({ min, max, precision: step }),
    async invalidHelper() {
        return { age: 10 } as any;
    },
};

const entries: BaseType[] = [
    [
        1,
        2,
        34,
        7,
        9,
        [
            "faker:random.number",
            "My String",
            { function: "custom:number", args: [0, 10, 1] },
        ],
    ],
];

const inputs: WithModifiers<BaseType>[] = [];
entries.forEach((entry) =>
    ValidModifiers.forEach((modifiers) => {
        const o = Object.assign({}, modifiers) as WithModifiers<BaseType>;
        o.type = entry;
        inputs.push(o);
    })
);

const InvalidWithModifiers = [
    {
        type: [1, 2, [3, ["custom:args"]]],
    },
    {
        type: [1, 2, [3, ["custom:invalidHelper"]]],
        optional: true,
    },
];

describe("Generating base types with modifiers", () => {
    inputs.forEach((input, index) => {
        for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++) {
            test(`Base type: ${index}, iteration: ${i}`, async () => {
                faker.seed(index + i * 123);
                const o = await generateWithModifiers(input, Helpers);
                expect(o).toMatchSnapshot();
                expect(isPrimitives(o)).toBe(true);
                faker.seed(index + i * 123);
                const isNull = !!(input.nullable && faker.random.boolean());

                expect(o === null).toBe(isNull);
                if (input.plural && !isNull)
                    expect(Array.isArray(o)).toBe(true);
            });
        }
    });
    test.each(InvalidWithModifiers)(
        `Invalid base type with modifiers: %#`,
        (entry) =>
            expect(
                generateWithModifiers(entry, Helpers)
            ).rejects.toMatchSnapshot()
    );
});
