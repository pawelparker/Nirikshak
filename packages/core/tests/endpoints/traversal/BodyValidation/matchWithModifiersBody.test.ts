import {
    WithModifiers,
    BodyType,
    BodyInstance,
} from "../../../../src/endpoints/types/helpers";
import faker from "faker";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import { matchWithModifiersBodyType } from "../../../../src/endpoints/traversal/bodyValidation";
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
    input: () => Promise<BodyInstance | BodyInstance[] | null>;
    withMod: WithModifiers<BodyType>;
    output: boolean;
}[] = [
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            places: ValidResource.places,
        }),
        withMod: {
            field: {
                id: "resource:id",
                places: "resource:places",
            },
        },
        output: true,
    },
    {
        input: async (): Promise<null> => null,
        withMod: {
            field: {
                id: "resource:id",
                places: "resource:places",
            },
            nullable: true,
            optional: true,
        },
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            places: ValidResource.places,
            colors: await Helpers.word(),
        }),
        withMod: {
            field: {
                id: "resource:id",
                places: "resource:places",
                colors: "custom:word",
            },
            nullable: true,
            optional: true,
        },
        output: true,
    },
    {
        input: async (): Promise<BodyInstance[]> => [
            {
                id: ValidResource.id,
                places: ValidResource.places,
                colors: await Helpers.word(),
            },
            {
                id: ValidResource.id,
                places: ValidResource.places,
                colors: await Helpers.word(),
            },
            {
                id: ValidResource.id,
                places: ValidResource.places,
                colors: await Helpers.word(),
            },
            {
                id: ValidResource.id,
                places: ValidResource.places,
                colors: await Helpers.word(),
            },
        ],
        withMod: {
            field: {
                id: "resource:id",
                places: "resource:places",
            },
            nullable: true,
            optional: true,
            plural: true,
        },
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            color: "red",
        }),
        withMod: {
            field: {
                places: "custom:word",
            },
        },
        output: false,
    },
    {
        input: async (): Promise<null> => null,
        withMod: {
            field: {
                places: "custom:word",
            },
        },
        output: false,
    },
    {
        input: async (): Promise<null> => null,
        withMod: {
            field: {
                places: "custom:word",
            },
            plural: true,
        },
        output: false,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            places: await Helpers.word(),
        }),
        withMod: {
            field: {
                places: "custom:word",
            },
            plural: true,
        },
        output: false,
    },
    {
        input: async (): Promise<null> => null,
        withMod: {
            field: {
                name: {
                    types: [
                        1,
                        2,
                        3,
                        {
                            type: 4,
                            nullable: true,
                        },
                    ],
                    fields: [
                        { a: 1 },
                        {
                            field: { b: 2 },
                            nullable: true,
                            plural: true,
                            optional: true,
                        },
                    ],
                },
            },
            nullable: true,
        },
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            name: 1,
        }),
        withMod: {
            field: {
                name: {
                    types: [
                        1,
                        2,
                        3,
                        {
                            type: 4,
                            nullable: true,
                        },
                    ],
                    fields: [
                        { a: 1 },
                        {
                            field: { b: 2 },
                            nullable: true,
                            plural: true,
                            optional: true,
                        },
                    ],
                },
            },
            nullable: true,
            optional: true,
        },
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            name: null,
        }),
        withMod: {
            field: {
                name: {
                    types: [
                        1,
                        2,
                        3,
                        {
                            type: 4,
                            nullable: true,
                        },
                    ],
                    fields: [
                        { a: 1 },
                        {
                            field: { b: 2 },
                            nullable: true,
                            plural: true,
                            optional: true,
                        },
                    ],
                },
            },
            nullable: true,
            optional: true,
        },
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            name: null,
        }),
        withMod: {
            field: {
                name: {
                    types: [
                        1,
                        2,
                        3,
                        {
                            type: 4,
                            nullable: true,
                        },
                    ],
                    fields: [
                        { a: 1 },
                        {
                            field: { b: 2 },
                            nullable: true,
                            plural: true,
                            optional: true,
                        },
                    ],
                },
            },
            nullable: true,
            optional: true,
            plural: true,
        },
        output: false,
    },
    {
        input: async (): Promise<BodyInstance[]> => [
            {
                name: null,
            },
            {
                name: 1,
            },
            {
                name: { a: 1 },
            },
            {
                name: null,
            },
            { name: [{ b: 2 }] },
        ],
        withMod: {
            field: {
                name: {
                    types: [
                        1,
                        2,
                        3,
                        {
                            type: 4,
                            nullable: true,
                        },
                    ],
                    fields: [
                        { a: 1 },
                        {
                            field: { b: 2 },
                            nullable: true,
                            plural: true,
                            optional: true,
                        },
                    ],
                },
            },
            nullable: true,
            optional: true,
            plural: true,
        },
        output: true,
    },
];
const InvalidInputs: { input: any; withMod: any }[] = [
    {
        input: { alpa: true },
        withMod: {
            field: {
                alpa: "custom:invalidHelper",
            },
        },
    },
    {
        input: { alpa: [true, false, "functional"] },
        withMod: {
            field: {
                alpa: [true, false, "custom:invalidHelper"],
            },
        },
    },
    {
        input: { alpa: [true, false, "functional"] },
        withMod: {
            field: {
                alpa: [true, false, "resource:addresses"],
            },
        },
    },
    {
        input: { alpa: [true, false, "functional"] },
        withMod: {
            field: {
                alpa: "resource:nonExistent",
            },
        },
    },
];

describe(`Body with modifiers match`, () => {
    test.each(Entries)(
        `Valid body type : %#`,
        async ({ output, input, withMod }) =>
            expect(
                matchWithModifiersBodyType(
                    await input(),
                    withMod,
                    ValidResource,
                    Helpers
                )
            ).resolves.toBe(output)
    );

    test.each(InvalidInputs)(`Invalid body %#:`, (entry) => {
        expect(
            matchWithModifiersBodyType(
                entry.input,
                entry.withMod as WithModifiers<BodyType>,
                ValidResource,
                Helpers
            )
        ).rejects.toMatchSnapshot();
    });
});
