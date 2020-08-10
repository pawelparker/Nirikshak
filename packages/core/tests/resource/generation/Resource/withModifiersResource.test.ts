/* 
    Tests to validate WithModifiers<ResourceBase> type
    Circular dependecy with ResourceBase, OneOfEntries
    Assumes circular dependencies to be working correctly, except this part
*/
import { ValidModifiers } from "../../utils";
import { WithModifiers } from "../../../../src/resource/types/helper";
import faker from "faker";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";
import { generateWithModifiers } from "../../../../src/resource/generation/withModifiersGen";
import { ResourceBase } from "../../../../src/resource/types/resource";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
// Helpers for the resource
const Helpers: SchemaHelpers = {
    username: async () => faker.name.firstName() + faker.name.lastName(),
    number: async (min: number, max: number, step: number) =>
        // Use faker.random.number instead of Math.random
        // For universal randomness seed
        faker.random.number({ min, max, precision: step }),
    async invalidHelper() {
        return { age: 12 } as any;
    },
};

// Valid resource bases
const ValidResourceBaseTypes: ResourceBase[] = [
    { age: 12 },
    {
        name: "Yash",
        class: 5,
        adddress: {
            type: { function: "faker:random.address", args: [1] },
            nullable: true,
            optional: true,
            plural: true,
        },
        types: [
            true,
            null,
            "stinrg",
            [
                false,
                [
                    true,
                    true,
                    false,
                    [null, { function: "custom:number", args: [7, 25, 0.3] }],
                ],
            ],
        ],
    },
    {
        root: {
            fields: [
                {
                    branch: {
                        types: ["CSE", "ECE", "Mechanical"],
                        plural: false,
                        nullable: false,
                        optional: true,
                    },
                    section: {
                        function: "custom:number",
                    },
                },
                {
                    addresses: {
                        field: {
                            city: {
                                types: [
                                    "faker:random.words",
                                    "faker:address.city",
                                ],
                            },
                            street: {
                                fields: [
                                    { streetName: "faker:address.streetName" },
                                    {
                                        streetAddress:
                                            "faker:address.streetAddress",
                                    },
                                ],
                                types: ["faker:address.zipCode"],
                            },
                        },
                        plural: true,
                    },
                },
            ],
            types: [
                {
                    type: {
                        function: "custom:username",
                        args: [1, false, null, [true, true, [false]]],
                    },
                    plural: true,
                    optional: true,
                    nullable: false,
                },
                null,
                "faker:random.number",
                {
                    function: "faker:lorem.lines",
                },
                17.885,
                false,
                true,
            ],
        },
    },
];
// Valid with modifiers entries
const ValidWithModifiers: WithModifiers<ResourceBase>[] = [];

// Valid ResourceBase x Valid modifiers = Valid with modifiers entries
ValidResourceBaseTypes.forEach((baseType) =>
    ValidModifiers.forEach((mod) => {
        const o = Object.assign({}, mod) as WithModifiers<ResourceBase>;
        o.field = baseType;
        ValidWithModifiers.push(o);
    })
);

const InvalidWithModifiers = [
    { field: { class: "custom:ages" }, plural: false },
];

describe("Generating resource bases with modifiers", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidWithModifiers.forEach((entry, index) =>
            test(`Valid base type with modifiers: ${index}, iteration: ${i}`, async () => {
                faker.seed(index + i * 123);
                const o = await generateWithModifiers(entry, Helpers);
                expect(o).toMatchSnapshot();
                faker.seed(index + i * 123);
                expect(o === null).toBe(
                    !!(entry.nullable && faker.random.boolean())
                );
                if (entry.plural && !entry.nullable)
                    expect(Array.isArray(o)).toBe(true);
            })
        );

    test.each(InvalidWithModifiers)(`Invalid resource base: %#`, (entry) =>
        expect(
            generateWithModifiers(entry as WithModifiers<ResourceBase>, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
