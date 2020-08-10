import faker from "faker";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { Base, WithModifiers } from "../../../../src/endpoints/types/helpers";
import { matchWithModifiersBase } from "../../../../src/endpoints/traversal/bodyValidation";
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
    base: WithModifiers<Base>;
    output: boolean;
}[] = [
    {
        input: "Worder",
        base: { type: "custom:word" },
        output: true,
    },
    {
        input: [1, 2, [[[3], "word1"], "word2"], 4],
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:word"],
                    { function: "faker:random.word", args: [] },
                ],
                "faker:random.number",
            ],
            optional: true,
        },
        output: true,
    },
    {
        input: [1, 2, [[[3], "word1"], "word2"], 4],
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:word"],
                    { function: "faker:random.word", args: [] },
                ],
                "faker:random.number",
            ],
            optional: true,
            plural: true,
        },
        output: false,
    },
    {
        input: [[1, 2, [[[3], "word1"], "word2"], 4]],
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:word"],
                    { function: "faker:random.word", args: [] },
                ],
                "faker:random.number",
            ],
            optional: true,
            plural: true,
        },
        output: true,
    },
    {
        input: [1, 2, [[[3], "word1", [[[[["str"]]]]]], "word2"], 4],
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:word", [[[[[null]]]]]],
                    { function: "faker:random.word", args: [] },
                ],
                "faker:random.number",
            ],
        },
        output: false,
    },
    {
        input: null,
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:word", [[[[[null]]]]]],
                    { function: "faker:random.word", args: [] },
                ],
                "faker:random.number",
            ],
            nullable: true,
            optional: true,
        },
        output: true,
    },
    {
        input: [1, 2, [[[3], "word1", [[[[["str"]]]]]], "word2"], 4],
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:word", [[[[[null]]]]]],
                    { function: "faker:random.word", args: [] },
                ],
                "faker:random.number",
            ],
            nullable: true,
            optional: true,
        },
        output: false,
    },
    {
        input: null,
        base: {
            type: "faker:random.number",
            plural: true,
            nullable: true,
            optional: true,
        },
        output: true,
    },
    {
        input: 17,
        base: {
            type: "faker:random.number",
            plural: true,
            nullable: true,
            optional: true,
        },
        output: false,
    },
    {
        input: [2, 7, 8, 9.54, 10, 100, 12, 17.5],
        base: {
            type: "faker:random.number",
            plural: true,
            nullable: true,
            optional: true,
        },
        output: true,
    },
    {
        input: [2, 7, 8, 9.54, 10, 100, 12, "SIMPS"],
        base: {
            type: "faker:random.number",
            plural: true,
            nullable: true,
            optional: true,
        },
        output: false,
    },
];

const InvalidEntries: { input: any; base: any }[] = [
    {
        input: [true, false, false],
        base: { type: "resource:addresses", plural: true },
    },
    {
        input: [1, 2, [[[3], "word1", [[[[["str"]]]]]], "word2"], 4],
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:invalidHelper", [[[[[null]]]]]],
                    { function: "faker:random.word", args: [] },
                ],
                "faker:random.number",
            ],
            nullable: true,
            optional: true,
        },
    },
    {
        input: [
            [1, 2, [[[3], "word1", [[[[[null]]]]]], "word2"], 4],
            [1, 2, [[[3], "word1", [[[[[null]]]]]], "word2"], 4],
        ],
        base: {
            type: [
                1,
                2,
                [
                    [[3], "custom:word", [[[[[null]]]]]],
                    { function: "faker:random.word", args: [] },
                ],
                "custom:nonExistentHelper",
            ],
            plural: true,
        },
    },
    {
        input: [1, 2, 3, 4],
        base: {
            type: [1, 2, "resource:lorem.ipsum", "faker:random.number"],
            optional: true,
        },
    },
];

void InvalidEntries;

describe(`Base type match`, () => {
    test.each(Entries)(`Valid base with modifiers entry: %#`, (entry) =>
        expect(
            matchWithModifiersBase(
                entry.input,
                entry.base,
                ValidResource,
                Helpers
            )
        ).resolves.toBe(entry.output)
    );

    test.each(InvalidEntries)(
        `Invalid base with modifiers entry: %#`,
        (entry) =>
            expect(
                matchWithModifiersBase(
                    entry.input,
                    entry.base as WithModifiers<Base>,
                    ValidResource,
                    Helpers
                )
            ).rejects.toMatchSnapshot()
    );
});
