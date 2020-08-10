import faker from "faker";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { BaseType } from "../../../../src/endpoints/types/helpers";
import { matchBaseType } from "../../../../src/endpoints/traversal/bodyValidation";
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
    base: BaseType;
    output: boolean;
}[] = [
    {
        input: ValidResource.id,
        base: "resource:id",
        output: true,
    },
    {
        input: 53,
        base: 53,
        output: true,
    },
    {
        input: 53,
        base: "faker:random.number",
        output: true,
    },
    {
        input: 53,
        base: { function: "faker:random.number", args: [10] },
        output: true,
    },
    {
        input: "word",
        base: "custom:word",
        output: true,
    },
    {
        input: 27,
        base: 53,
        output: false,
    },
    {
        input: 72,
        base: "faker:random.word",
        output: false,
    },
    {
        input: 72,
        base: "custom:word",
        output: false,
    },
];

const InvalidEntries: { input: any; baseType: any }[] = [
    {
        input: true,
        baseType: "resource:addresses",
    },
    {
        input: false,
        baseType: "resource:lorem.ipsum",
    },
    {
        input: "worldy",
        baseType: {
            function: "custom:nonExistentHelper",
        },
    },
    {
        input: "D. Piscatella",
        baseType: "custom:invalidHelper",
    },
];

describe(`Base type match`, () => {
    test.each(Entries)(`Valid base type entry: %#`, (entry) =>
        expect(
            matchBaseType(entry.input, entry.base, ValidResource, Helpers)
        ).resolves.toBe(entry.output)
    );

    test.each(InvalidEntries)(`Invalid base type entry: %#`, (entry) =>
        expect(
            matchBaseType(
                entry.input,
                entry.baseType as BaseType,
                ValidResource,
                Helpers
            )
        ).rejects.toMatchSnapshot()
    );
});
