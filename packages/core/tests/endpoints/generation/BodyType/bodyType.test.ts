import faker from "faker";
import {
    BodyType,
    BodyInstance,
    Base,
    isWithModifiers,
} from "../../../../src/endpoints/types/helpers";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";
import { generateBodyType } from "../../../../src/endpoints/generation/helpers/bodyTypeGen";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { generateWithModifiers } from "../../../../src/endpoints/generation/helpers/withModifiersGen";
import { generateBase } from "../../../../src/endpoints/generation/helpers/baseGen";
import { generateOneOfEntries } from "../../../../src/endpoints/generation/helpers/oneOfGen";

const resource = {
    id: faker.random.uuid(),
    name: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
    },
    addresses: [
        { zipCode: faker.address.zipCode(), city: faker.address.city() },
        { zipCode: faker.address.zipCode(), city: faker.address.city() },
    ],
    recursion: {
        bases: {
            args: {
                plethora: [1, 2, 10, [[7, 5, [4]]], 3],
            },
        },
    },
};

const Helpers: SchemaHelpers = {
    word: (): Promise<string> =>
        new Promise((resolve) =>
            setTimeout(() => resolve(faker.random.word()), 10)
        ),
    async invalidHelper() {
        return { age: 10 } as any;
    },
};

const ValidEntries: {
    input: BodyType;
    output: () => Promise<BodyInstance>;
}[] = [
    {
        input: {
            address: "resource:address",
        },
        output: async (): Promise<BodyInstance> => ({}),
    },
    {
        input: {
            sampleFirst: [
                1,
                2,
                3,
                ["faker:random.number", [[["custom:word"]]]],
            ],
            efforts: {
                essentials: {
                    properly: true,
                    improperly: false,
                    versions: [
                        "ES6",
                        "faker:system.semver",
                        "faker:system.semver",
                        "faker:system.semver",
                        {
                            function: "faker:lorem.lines",
                            args: [2],
                        },
                    ],
                },
            },
        },
        async output(): Promise<BodyInstance> {
            return {
                sampleFirst: [
                    1,
                    2,
                    3,
                    [faker.random.number(), [[[await Helpers.word()]]]],
                ],
                efforts: {
                    essentials: {
                        properly: true,
                        improperly: false,
                        versions: [
                            "ES6",
                            faker.system.semver(),
                            faker.system.semver(),
                            faker.system.semver(),
                            faker.lorem.lines(2),
                        ],
                    },
                },
            };
        },
    },
    {
        input: {
            id: "faker:random.word",
            places: {
                type: "custom:word",
                plural: true,
                nullable: true,
                optional: true,
            },
            age: {
                type: { function: "faker:random.number", args: [100] },
            },
            age1: {
                type: { function: "faker:random.number", args: [100] },
                nullable: true,
            },
            age2: {
                type: { function: "faker:random.number", args: [100] },
                optional: true,
            },
            age3: {
                type: { function: "faker:random.number", args: [100] },
                plural: true,
            },
        },
        async output(): Promise<BodyInstance> {
            const o: BodyInstance = {};
            for (const key in this.input) {
                switch (key) {
                    case "id":
                        o["id"] = faker.random.word();
                        break;
                    case "places":
                        // optional
                        if (faker.random.boolean()) break;
                        o["places"] = await generateWithModifiers(
                            this.input.places,
                            resource,
                            Helpers
                        );
                        break;
                    case "age":
                        o["age"] = faker.random.number(100);
                        break;
                    case "age1":
                        o["age1"] = await generateWithModifiers(
                            this.input.age1,
                            resource,
                            Helpers
                        );
                        break;
                    case "age2":
                        if (faker.random.boolean()) continue;
                        o["age2"] = await generateWithModifiers(
                            this.input.age2,
                            resource,
                            Helpers
                        );
                        break;
                    case "age3":
                        o["age3"] = await generateWithModifiers(
                            this.input.age3,
                            resource,
                            Helpers
                        );
                }
            }

            return o;
        },
    },
    {
        input: {
            id: "faker:random.word",
            addresses: "resource:addresses",
            places: {
                field: { value: { type: "custom:word" } },
                plural: true,
                nullable: true,
                optional: true,
            },
            age: {
                field: {
                    value: {
                        type: { function: "faker:random.number", args: [100] },
                    },
                },
            },
            age1: {
                field: { typeName: "faker:random.number" },
                nullable: true,
            },
            age2: {
                field: {
                    value: { function: "faker:random.number", args: [100] },
                },
                optional: true,
            },
            age3: {
                field: {
                    value: {
                        type: { function: "faker:random.number", args: [100] },
                    },
                },
                plural: true,
            },
        },
        async output(): Promise<BodyInstance> {
            const o: BodyInstance = {};
            for (const key in this.input) {
                switch (key) {
                    case "addresses":
                        o["addresses"] = resource.addresses;
                        break;
                    case "id":
                        o["id"] = faker.random.word();
                        break;
                    case "places":
                        // optional
                        if (faker.random.boolean()) break;
                        o["places"] = await generateWithModifiers(
                            this.input.places,
                            resource,
                            Helpers
                        );
                        break;
                    case "age":
                        o["age"] = await generateWithModifiers(
                            this.input.age,
                            resource,
                            Helpers
                        );
                        break;
                    case "age1":
                        o["age1"] = await generateWithModifiers(
                            this.input.age1,
                            resource,
                            Helpers
                        );
                        break;
                    case "age2":
                        if (faker.random.boolean()) continue;
                        o["age2"] = await generateWithModifiers(
                            this.input.age2,
                            resource,
                            Helpers
                        );
                        break;
                    case "age3":
                        o["age3"] = await generateWithModifiers(
                            this.input.age3,
                            resource,
                            Helpers
                        );
                }
            }

            return o;
        },
    },
    {
        input: {
            criteria: {
                fields: [
                    {
                        f1: {
                            types: ["faker:random.number", 1, 2, 3, 4, 5],
                        },
                        f2: {
                            type: "custom:word",
                            plural: true,
                        },
                    },
                    {
                        age: "custom:word",
                        address: "resource:addresses[0].city",
                    },
                ],
            },
            number: {
                types: [1, 2, 3, 4, 5, "resource:id", 7],
            },
            mixedEntries: {
                fields: [
                    {
                        field: { age: 10 },
                        optional: true,
                        nullable: true,
                        plural: true,
                    },
                    {
                        field: { name: "Purpose" },
                    },
                    {
                        class: "CSE",
                    },
                ],
                types: [
                    [1, 2, 3],
                    [4, 5, 6],
                    ["custom:word", "resource:id"],
                    { type: 17, nullable: true, plural: true },
                ],
            },
        },
        async output(): Promise<BodyInstance> {
            const o: BodyInstance = {};
            for (const key in this.input) {
                switch (key) {
                    case "criteria": {
                        const entry = generateOneOfEntries(this.input.criteria);
                        o[key] = await generateBodyType(
                            entry.selection as BodyType,
                            resource,
                            Helpers
                        );
                        break;
                    }
                    case "number": {
                        const entry = generateOneOfEntries(this.input.number);
                        o[key] = await generateBase(
                            entry.selection as Base,
                            resource,
                            Helpers
                        );
                        break;
                    }
                    case "mixedEntries":
                        {
                            const entry = generateOneOfEntries(
                                this.input.mixedEntries
                            );
                            if (isWithModifiers(entry.selection)) {
                                if (
                                    entry.selection.optional &&
                                    faker.random.boolean()
                                )
                                    continue;
                                o["mixedEntries"] = await generateWithModifiers(
                                    entry.selection,
                                    resource,
                                    Helpers
                                );
                            } else if (entry.type === "base")
                                o[key] = await generateBase(
                                    entry.selection,
                                    resource,
                                    Helpers
                                );
                            else
                                o[key] = await generateBodyType(
                                    entry.selection,
                                    resource,
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

const InvalidBodyTypes: any[] = [
    { entry: "custom:lorem.ipsum" },
    { entry: "custom:invalidHelper" },
];

describe("Body generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidEntries.forEach((entry, index) =>
            test(`Valid body generation: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 * i + index);
                const got = await generateBodyType(
                    entry.input,
                    resource,
                    Helpers
                );
                faker.seed(123 * i + index);
                const expected = await entry.output();

                expect(got).toEqual(expected);
            })
        );

    test.each(InvalidBodyTypes)(`Invalid body generation: %#`, (entry) =>
        expect(
            generateBodyType(entry, resource, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
