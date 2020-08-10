import faker from "faker";
import { Query } from "../../../../src/endpoints/types/input";
import {
    QueryInstance,
    generateQuery,
} from "../../../../src/endpoints/generation/input/queryGen";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { Literal } from "../../../../src/common/types/literals";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";

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

const ValidQueries: {
    input: Query;
    output: () => Promise<QueryInstance>;
}[] = [
    {
        input: {
            entry1: "foo-bar",
            entry2: false,
            entry3: [
                1,
                false,
                true,
                "resource:addresses[0].zipCode",
                "faker:random.number",
                "custom:word",
            ],
        },
        async output(): Promise<QueryInstance> {
            const promiseMap: Map<
                string,
                Promise<Literal | Literal[]>
            > = new Map();

            for (const key in this.input) {
                switch (key) {
                    case "entry1":
                        promiseMap.set(key, Promise.resolve("foo-bar"));
                        break;
                    case "entry2":
                        promiseMap.set(key, Promise.resolve(false));
                        break;
                    case "entry3":
                        promiseMap.set(
                            key,
                            Promise.resolve([
                                1,
                                false,
                                true,
                                resource.addresses[0].zipCode,
                                faker.random.number(),
                                await Helpers.word(),
                            ])
                        );
                        break;
                }
            }

            const queries: QueryInstance = {};
            for (const key in this.input) {
                const res = await promiseMap.get(key)!;

                if (Array.isArray(res) && res.some((entry) => entry === null))
                    throw new Error(
                        `query: ${key}:${this.input[key]} resolved to an array containing a null value`
                    );
                else if (res === null)
                    throw new Error(
                        `query: ${key}:${this.input[key]} resolved to null`
                    );

                queries[key] = res as
                    | Exclude<Literal, null>
                    | Exclude<Literal, null>[];
            }

            return queries;
        },
    },
];

const InvalidQueries: any[] = [
    { entry1: null },
    { entry2: [true, false, "str", "strstr", null] },
    {
        entry2: [
            true,
            false,
            "str",
            "strstr",
            "resource:addresses",
            "resource:addresses",
            "resource:addresses",
        ],
    },
    { entry3: "custom:nonExistent" },
    { entry4: ["possums", "resource:lorem.ipsum"] },
    { entry5: "custom:invalidHelper" },
];

describe("Query type generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidQueries.forEach((entry, index) => {
            test(`Valid query entry: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 * i + index);
                const got = await generateQuery(entry.input, resource, Helpers);
                faker.seed(123 * i + index);
                const expected = await entry.output();
                expect(got).toEqual(expected);
            });
        });

    test.each(InvalidQueries)(`Invalid query entry: %#`, (entry) =>
        expect(
            generateQuery(entry, resource, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
