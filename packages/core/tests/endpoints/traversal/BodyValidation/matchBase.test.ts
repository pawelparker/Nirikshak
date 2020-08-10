import faker from "faker";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { Base } from "../../../../src/endpoints/types/helpers";
import { matchBase } from "../../../../src/endpoints/traversal/bodyValidation";
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

const Entries: {
    input: any;
    base: Base;
    output: boolean;
}[] = [
    {
        input: "Worder",
        base: "custom:word",
        output: true,
    },
    {
        input: 88,
        base: "number",
        output: false,
    },
    {
        input: 4,
        base: [1, 2, 3, 4],
        output: false,
    },
    {
        input: [1, 2, 3],
        base: [1, 2, 3, 4],
        output: false,
    },
    {
        input: [1, 2, 3, 4],
        base: [1, 2, 3, "faker:random.number"],
        output: true,
    },
    {
        input: [1, 2, 3, ValidResource.id],
        base: [1, 2, 3, "resource:id"],
        output: true,
    },
    {
        input: [1, 2, [[[3], "word1"], "word2"], 4],
        base: [
            1,
            2,
            [[[3], "custom:word"], { function: "faker:random.word", args: [] }],
            "faker:random.number",
        ],
        output: true,
    },
    {
        input: [1, 2, 3, 4],
        base: [1, 2, 3, "faker:random:word"],
        output: false,
    },
    {
        input: [1, 2, [[[3], "word1", [[[[["str"]]]]]], "word2"], 4],
        base: [
            1,
            2,
            [
                [[3], "custom:word", [[[[[null]]]]]],
                { function: "faker:random.word", args: [] },
            ],
            "faker:random.number",
        ],
        output: false,
    },
];

const InvalidEntries: { input: any; base: any }[] = [
    {
        input: true,
        base: "resource:addresses",
    },
    {
        input: false,
        base: "resource:lorem.ipsum",
    },
    {
        input: "worldy",
        base: {
            function: "custom:nonExistentHelper",
        },
    },
    {
        input: "D. Piscatella",
        base: "custom:invalidHelper",
    },
    {
        input: [1, 2, [[[3], "word1", [[[[["str"]]]]]], "word2"], 4],
        base: [
            1,
            2,
            [
                [[3], "custom:invalidHelper", [[[[[null]]]]]],
                { function: "faker:random.word", args: [] },
            ],
            "faker:random.number",
        ],
    },
    {
        input: [1, 2, [[[3], "word1", [[[[[null]]]]]], "word2"], 4],
        base: [
            1,
            2,
            [
                [[3], "custom:word", [[[[[null]]]]]],
                { function: "faker:random.word", args: [] },
            ],
            "custom:nonExistentHelper",
        ],
    },
    {
        input: [1, 2, [[[3], "word1", [[[[[null]]]]]], "word2"], 4],
        base: [
            1,
            2,
            [
                [[3], "resource:addresses", [[[[[null]]]]]],
                { function: "faker:random.word", args: [] },
            ],
            "faker:random.number",
        ],
    },
    {
        input: [1, 2, 3, 4],
        base: [1, 2, "resource:lorem.ipsum", "faker:random.number"],
    },
];

describe(`Base type match`, () => {
    test.each(Entries)(`Valid base entry: %#`, (entry) =>
        expect(
            matchBase(entry.input, entry.base, ValidResource, Helpers)
        ).resolves.toBe(entry.output)
    );

    test.each(InvalidEntries)(`Invalid base entry: %#`, (entry) =>
        expect(
            matchBase(entry.input, entry.base as Base, ValidResource, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
