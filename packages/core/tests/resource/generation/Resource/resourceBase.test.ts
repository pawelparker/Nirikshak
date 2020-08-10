/* 
    Test to validate resource generation
    Not testing in depth as other functions are assumed to be working correctly
*/
import {
    ResourceBase,
    Resource,
} from "../../../../src/resource/types/resource";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";
import {
    generateResourceBase,
    generateResource,
} from "../../../../src/resource/generation/resourceGen";
import faker from "faker";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import {
    isWithModifiersResource,
    ResourceInstanceBase,
} from "../../../../src/resource/types/helper";
import { generateWithModifiers } from "../../../../src/resource/generation/withModifiersGen";
import {
    generateOneOfEntries,
    SelectedType,
} from "../../../../src/resource/generation/oneOfEntries";
import {
    isWithModifiersBase,
    BaseType,
    WithModifiers,
} from "../../../../src/endpoints/types/helpers";
import { generateBaseType } from "../../../../src/resource/generation/baseGen";
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

const ValidResourceBases: {
    input: ResourceBase;
    output: () => Promise<ResourceInstanceBase>;
}[] = [
    {
        input: {
            name: 15,
            class: "faker:random.number",
            branch: { function: "faker:random.words", args: [1] },
            address: "faker.random.zipCode",
        },
        output: async (): Promise<ResourceInstanceBase> => {
            return {
                name: 15,
                class: faker.random.number(),
                branch: faker.random.words(1),
                address: "faker.random.zipCode",
            };
        },
    },
    {
        input: {
            root: {
                f2: {
                    type: [1, 2, 3, 4, "stirng", false, "faker:random.address"],
                    nullable: true,
                    plural: true,
                    optional: true,
                },
                f1: {
                    field: {
                        f3: {
                            fields: [
                                {
                                    branch: {
                                        types: ["CSE", "ECE", "Mechanical"],
                                        plural: false,
                                        nullable: false,
                                        optional: true,
                                    },
                                    section: {
                                        function: "custom:username",
                                        args: ["CSE", "ECE", "Mechanical"],
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
                                                    {
                                                        streetName:
                                                            "faker:address.streetName",
                                                    },
                                                    {
                                                        streetAddress:
                                                            "faker:address.streetAddress",
                                                    },
                                                ],
                                                types: [
                                                    "faker:address.zipCode",
                                                ],
                                            },
                                        },
                                        plural: true,
                                        optional: true,
                                        nullable: false,
                                    },
                                },
                            ],
                            types: [
                                {
                                    type: {
                                        function: "custom:number",
                                        args: [1, 7, 0.2],
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
                    optional: true,
                },
            },
        },
        output: async function (): Promise<ResourceInstanceBase> {
            const o: Record<string, any> = {
                root: {},
            };

            for (const key in this.input.root) {
                switch (key) {
                    case "f2":
                        if (!faker.random.boolean())
                            // Optional
                            o.root["f2"] = await generateWithModifiers(
                                {
                                    type: [
                                        1,
                                        2,
                                        3,
                                        4,
                                        "stirng",
                                        false,
                                        "faker:random.address",
                                    ],
                                    nullable: true,
                                    plural: true,
                                    optional: true,
                                },
                                Helpers
                            );
                        break;
                    case "f1":
                        if (!faker.random.boolean()) {
                            // Optional
                            o.root["f1"] = {};
                            const entry = generateOneOfEntries(
                                this.input.root.f1.field.f3
                            );

                            if (entry.type === "base type") {
                                if (isWithModifiersBase(entry.selection)) {
                                    o.root.f1.f3 = await generateWithModifiers(
                                        entry.selection,
                                        Helpers
                                    );
                                } else {
                                    o.root.f1.f3 = await generateBaseType(
                                        entry.selection,
                                        Helpers
                                    );
                                }
                            } else {
                                if (isWithModifiersResource(entry.selection)) {
                                    o.root.f1.f3 = await generateWithModifiers(
                                        entry.selection,
                                        Helpers
                                    );
                                } else {
                                    o.root.f1.f3 = await generateResourceBase(
                                        entry.selection,
                                        Helpers
                                    );
                                }
                            }
                        }
                        break;
                }
            }
            return o;
        },
    },
    {
        input: {
            f1: {
                types: [
                    1,
                    2,
                    3,
                    ["stringify", 19, 30, 19.542],
                    "faker:random.number",
                    [[[[["custom.username"]]]]],
                ],
            },
            f2: {
                fields: [
                    { branch: "CSE" },
                    {
                        age: 12,
                        name: 14,
                        address: {
                            types: [
                                12.4353,
                                "faker:random.number",
                                { type: true, nullable: true },
                                [12, 13, 14, null, false, "myString"],
                            ],
                        },
                    },
                ],
            },
            f3: {
                fields: [
                    { branch: 3 },
                    {
                        age: {
                            type: {
                                function: "faker:random.number",
                                args: [{ min: 1, max: 100, precision: 0.1 }],
                            },
                            nullable: true,
                        },
                    },
                ],
                types: [12, 14, true, true, false, ["SIMP"]],
            },
            f4: {
                fields: [
                    {
                        field: { name: "Name", surName: "Surname" },
                        plural: true,
                    },
                ],
            },
        },
        output: async function (): Promise<ResourceInstanceBase> {
            const o = {};

            for (const key in this.input) {
                switch (key) {
                    case "f1":
                        {
                            const f1Entry = generateOneOfEntries(
                                this.input.f1
                            ) as SelectedType<BaseType>;
                            o["f1"] = await generateBaseType(
                                f1Entry.selection as BaseType,
                                Helpers
                            );
                        }
                        break;
                    case "f2":
                        {
                            const f2Entry = generateOneOfEntries(
                                this.input.f2
                            ) as SelectedType<ResourceBase>;
                            o["f2"] = await generateResourceBase(
                                f2Entry.selection as ResourceBase,
                                Helpers
                            );
                        }
                        break;
                    case "f3":
                        {
                            const f3Entry = generateOneOfEntries(this.input.f3);

                            if (f3Entry.type === "base type") {
                                o["f3"] = await generateBaseType(
                                    f3Entry.selection as BaseType,
                                    Helpers
                                );
                            } else {
                                o["f3"] = await generateResourceBase(
                                    f3Entry.selection as ResourceBase,
                                    Helpers
                                );
                            }
                        }
                        break;
                    case "f4":
                        {
                            const f4Entry = generateOneOfEntries(
                                this.input.f4
                            ) as SelectedType<ResourceBase>;
                            o["f4"] = await generateWithModifiers(
                                f4Entry.selection as WithModifiers<
                                    ResourceBase
                                >,
                                Helpers
                            );
                        }
                        break;
                }
            }

            return o;
        },
    },
];

const InvalidResourceBases = [
    {
        name: "faker:name.firstName",
        age: "custom:age",
    },
    { name: "faker:name.lastName", age: "custom:invalidHelper" },
];

describe(`Resource base type`, () => {
    // Account for randomness
    for (let i = 0; i < RANDOMNESS_ITERATIONS; i++)
        ValidResourceBases.forEach((resource, index) =>
            test(`resource base: ${index}, iteration: ${i}`, async () => {
                faker.seed(i + 123);
                const o = Object.assign({}, resource.input) as Resource;
                const got = await generateResourceBase(o, Helpers);
                faker.seed(i + 123);
                const expected = await resource.output();
                expect(got).toEqual(expected);
            })
        );
});
describe(`Resource type`, () => {
    beforeAll(() => faker.seed(123));
    // Account for randomness
    for (let i = 0; i < RANDOMNESS_ITERATIONS; i++)
        ValidResourceBases.forEach((resource, index) =>
            test(`resource base ${index}, iteration: ${i}`, async () => {
                const o = Object.assign({}, resource.input) as Resource;
                o.id = "faker:random.word";
                expect(await generateResource(o, Helpers)).toMatchSnapshot();
            })
        );

    test.each(InvalidResourceBases)(`Invalid resource base: %#`, (entry) =>
        expect(
            generateResourceBase(entry as ResourceBase, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
