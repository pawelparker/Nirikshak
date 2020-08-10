import faker from "faker";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { HeaderAndQuery } from "../../../../src/endpoints/types/input";
import {
    HeaderAndQueryInstance,
    generateHeaderAndQuery,
} from "../../../../src/endpoints/generation/input/headerAndQuery";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";
import { generateHeaderMap } from "../../../../src/endpoints/generation/helpers/headerMapGen";
import { generateQuery } from "../../../../src/endpoints/generation/input/queryGen";
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

const ValidEntries: Array<{
    input: HeaderAndQuery;
    output: () => Promise<HeaderAndQueryInstance>;
}> = [
    {
        input: {
            headers: {
                name: 15,
                age: 55,
                word: "custom:word",
                lines: "faker:lorem.lines",
                id: "resource:id",
            },
        },
        async output(): Promise<HeaderAndQueryInstance> {
            return {
                headers: await generateHeaderMap(
                    this.input.headers,
                    resource,
                    Helpers
                ),
            };
        },
    },
    {
        input: {
            query: {
                name: 15,
                age: 55,
                word: "custom:word",
                lines: "faker:lorem.lines",
                id: "resource:id",
                purples: [
                    1,
                    false,
                    true,
                    true,
                    true,
                    false,
                    "custom:word",
                    "faker:random.word",
                    "resouce:addresses[0].zipCode",
                ],
            },
        },
        async output(): Promise<HeaderAndQueryInstance> {
            return {
                query: await generateQuery(this.input.query, resource, Helpers),
            };
        },
    },
    {
        input: {
            headers: {
                name: 15,
                age: 55,
                word: "custom:word",
                lines: "faker:lorem.lines",
                id: "resource:id",
            },
            query: {
                name: 15,
                age: 55,
                word: "custom:word",
                lines: "faker:lorem.lines",
                id: "resource:id",
                purples: [
                    1,
                    false,
                    true,
                    true,
                    true,
                    false,
                    "custom:word",
                    "faker:random.word",
                    "resouce:addresses[0].zipCode",
                ],
            },
        },
        async output(): Promise<HeaderAndQueryInstance> {
            const h: HeaderAndQueryInstance = {};

            const h1 = generateHeaderMap(this.input.headers, resource, Helpers);
            const q1 = generateQuery(this.input.query, resource, Helpers);

            h.headers = await h1;
            h.query = await q1;

            return h;
        },
    },
];

const InvalidEntries: any[] = [
    {
        headers: { a: null },
    },
    {
        query: { a: null },
    },
    {
        headers: { a: null },
        query: { a: null },
    },
];

describe("Header and Query type generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidEntries.forEach((entry, index) => {
            test(`Valid header and query entry: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 * i + index);
                const got = await generateHeaderAndQuery(
                    entry.input,
                    resource,
                    Helpers
                );
                faker.seed(123 * i + index);
                const expected = await entry.output();
                expect(got).toEqual(expected);
            });
        });

    test.each(InvalidEntries)(
        `Invalid header and query entry: %#`,
        async (entry) => {
            expect.hasAssertions();
            try {
                await generateHeaderAndQuery(entry, resource, Helpers);
            } catch (e) {
                expect(e).toMatchSnapshot();
            }
        }
    );
});
