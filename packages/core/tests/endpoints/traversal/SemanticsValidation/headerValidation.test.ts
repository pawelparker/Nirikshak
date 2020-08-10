import { headersValidation } from "../../../../src/endpoints/traversal/semanticsValidation";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import faker from "faker";
import { HeaderMap } from "../../../../src/endpoints/types/helpers";
const Helpers: SchemaHelpers = {
    word: (): Promise<string> =>
        new Promise((resolve) =>
            setTimeout(() => resolve(faker.random.word()), 10)
        ),
    async invalidHelper() {
        return { age: 10 } as any;
    },
};

const ValidResource: ResourceInstance = {
    created: true,
    id: faker.random.uuid(),
    args: [1, 2, 3, [false], true, "strstr", null],
    addresses: [{ zipCode: "370432" }, { zipCode: "232344" }],
    fallacies: faker.random.word(),
    places: {
        to: {
            be: {
                miles: {
                    to: {
                        go: {
                            before: 23,
                        },
                    },
                },
            },
        },
    },
};

const ValidInputs: {
    input: () => Promise<any>;
    headers: HeaderMap[];
    output: boolean;
}[] = [
    {
        input: async (): Promise<null> => null,
        headers: [],
        output: false,
    },
    {
        input: async (): Promise<string> => "TureHeader",
        headers: [],
        output: false,
    },
    {
        input: async (): Promise<Record<string, any>> => ({ h: true }),
        headers: [],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({}),
        headers: [],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            a: true,
            b: false,
        }),
        headers: [
            {
                a: true,
                b: false,
                c: "faker:random:number",
                d: "custom:word",
                e: "resource:id",
            },
        ],
        output: false,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            a: true,
            b: false,
            c: faker.random.number(),
            d: await Helpers.word(),
            e: ValidResource.id,
        }),
        headers: [
            {
                a: true,
                b: false,
                c: "faker:random:number",
                d: "custom:word",
                e: "resource:id",
            },
        ],
        output: false,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            a: true,
            b: false,
            c: faker.random.number(),
            d: await Helpers.word(),
            e: ValidResource.id,
        }),
        headers: [
            {
                a: true,
                b: false,
            },
        ],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            a: true,
            b: true,
            c: faker.random.number(),
            d: await Helpers.word(),
            e: ValidResource.id,
        }),
        headers: [
            {
                a: true,
                b: false,
            },
        ],
        output: false,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            a: true,
            b: true,
            c: faker.random.number(),
            d: await Helpers.word(),
            e: ValidResource.id,
        }),
        headers: [
            {
                a: true,
                b: false,
            },
            { a: true },
        ],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({}),
        headers: [
            { a: true },
            { b: "custom:word" },
            { c: "faker:random:word" },
            { d: "resource:id" },
        ],
        output: false,
    },
    {
        input: async (): Promise<Record<string, any>> => ({ a: true }),
        headers: [
            { a: true },
            { b: "custom:word" },
            { c: "faker:random:word" },
            { d: "resource:id" },
        ],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            b: await Helpers.word(),
        }),
        headers: [
            { a: true },
            { b: "custom:word" },
            { c: "faker:random:word" },
            { d: "resource:id" },
        ],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            c: faker.random.word(),
        }),
        headers: [
            { a: true },
            { b: "custom:word" },
            { c: "faker:random.word" },
            { d: "resource:id" },
        ],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            d: ValidResource.id,
        }),
        headers: [
            { a: true },
            { b: "custom:word" },
            { c: "faker:random:word" },
            { d: "resource:id" },
        ],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            d: ValidResource.id,
        }),
        headers: [
            { a: true, b: "custom:word" },
            { b: "custom:word", c: "faker:random:word" },
            { c: "faker:random:word", d: "resource:id" },
            { d: "resource:id", a: true },
        ],
        output: false,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            a: true,
            d: ValidResource.id,
            c: faker.random.word(),
            b: await Helpers.word(),
        }),
        headers: [
            { a: true, b: "custom:word" },
            { b: "custom:word", c: "faker:random:word" },
            { c: "faker:random:word", d: "resource:id" },
            { d: "resource:id", a: true },
        ],
        output: true,
    },
    {
        input: async (): Promise<Record<string, any>> => ({
            a: true,
            c: faker.random.word(),
        }),
        headers: [
            { a: true, b: "custom:word" },
            { b: "custom:word", c: "faker:random:word" },
            { c: "faker:random:word", d: "resource:id" },
            { d: "resource:id", a: true },
        ],
        output: false,
    },
];

const InvalidInputs: { input: any; headers: any[] }[] = [
    {
        input: {
            a: true,
        },
        headers: [{ a: "custom:invalidHelper" }],
    },
    {
        input: {
            a: true,
        },
        headers: [{ a: "custom:non.existent" }],
    },
    {
        input: {
            a: true,
        },
        headers: [{ a: "resource:addresses" }],
    },
    {
        input: {
            a: true,
        },
        headers: [{ a: "resource:lorem.ipsum" }],
    },
];
describe(`Header match`, () => {
    test.each(ValidInputs)(`Valid entry: %#`, async (entry) =>
        expect(
            headersValidation(
                await entry.input(),
                entry.headers,
                ValidResource,
                Helpers
            )
        ).resolves.toBe(entry.output)
    );
    test.each(InvalidInputs)(`Invalid entry: %#`, async (entry) =>
        expect(
            headersValidation(
                entry.input,
                entry.headers,
                ValidResource,
                Helpers
            )
        ).rejects.toMatchSnapshot()
    );
});
