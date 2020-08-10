import faker from "faker";
import { ResourceInstance } from "../../../src/resource/types/helper";
import { Resource } from "../../../src/resource/types/resource";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
import { generateResource } from "../../../src/resource/generation/resourceGen";
import { SchemaHelpers } from "../../../src/common/types/helpers";
import { getRandomExistingResource } from "../../../src/endpoints/traversal/collection";

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

const ValidResource: Resource = {
    id: "faker:random.uuid",
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
};

describe(`Collection traversal`, () => {
    const collection: Map<ResourceInstance["id"], ResourceInstance> = new Map();
    beforeAll(async () => {
        const promiseArr: Promise<ResourceInstance>[] = [];

        for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
            promiseArr.push(generateResource(ValidResource, Helpers));
        const result = await Promise.all(promiseArr);

        result.forEach((r) => collection.set(r.id, r));
    });

    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++) {
        test(`Get random existing resource: ${i}`, () => {
            const got = getRandomExistingResource(collection);

            expect(collection.has(got.id)).toBe(true);
            expect(collection.get(got.id)).toEqual(got);
        });
    }

    test(`Getting from empty collection`, () =>
        expect(() =>
            getRandomExistingResource(new Map())
        ).toThrowErrorMatchingInlineSnapshot(
            `"Collection is empty. Cannot get any existing resource from it."`
        ));
});
