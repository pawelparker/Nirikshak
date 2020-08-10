import faker from "faker";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import {
    BodyType,
    BodyInstance,
} from "../../../../src/endpoints/types/helpers";
import { matchBody } from "../../../../src/endpoints/traversal/bodyValidation";
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

const ValidBody: BodyType = {
    id: "resource:id",
    addresses: {
        types: [
            "resource:addresses[0].zipCode",
            "resource:addresses[1].zipCode",
        ],
        fields: [
            {
                zipCode: "resource:addresses[0].zipCode",
            },
            {
                zipCode: "resource:addresses[1].zipCode",
            },
        ],
    },
    purple: {
        type: ["custom:word", "faker:random.word"],
        optional: true,
        nullable: true,
        plural: true,
    },
    figurines: {
        field: {
            places: "resource:places",
        },
        optional: true,
        nullable: true,
        plural: true,
    },
};

const Entries: { input: () => Promise<BodyInstance>; output: boolean }[] = [
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: "370432",
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: {
                zipCode: "370432",
            },
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: {
                zipCode: "232344",
            },
            purple: null,
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: "232344",
            figurines: null,
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: "370432",
            figurines: null,
            purple: null,
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: "370432",
            purple: [
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
            ],
            figurines: null,
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: "370432",
            purple: [
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
            ],
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: "370432",
            purple: [
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
                [faker.random.word(), await Helpers.word()],
            ],
            figurines: [
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
            ],
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: { zipCode: "370432" },
            figurines: [
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
            ],
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: { zipCode: "370432" },
            purple: null,
            figurines: [
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
            ],
        }),
        output: true,
    },
    {
        input: async (): Promise<BodyInstance> => ({
            id: ValidResource.id,
            addresses: { zipCode: "370432" },
            purple: null,
            figurines: [
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
                { places: ValidResource.places },
            ],
        }),
        output: true,
    },
];

const InvalidInputs: { input: any; body: any }[] = [
    {
        input: { x: true },
        body: {
            x: "resource:nonExistent",
        },
    },
    {
        input: {
            x: {
                y: "word",
            },
        },
        body: {
            x: {
                y: {
                    types: [1, "custom:invalidHelper"],
                },
            },
        },
    },
    {
        input: {
            x: {
                y: "word",
            },
        },
        body: {
            x: {
                y: {
                    types: [1, "custom:nonExistent"],
                },
            },
        },
    },
];

const ResourceStringEdgeCases: {
    input: BodyInstance;
    resource: ResourceInstance;
    schema: BodyType;
    output: boolean;
}[] = [
    {
        input: {
            id: ValidResource.id,
        },
        schema: {
            id: "resource:id",
            dummy: "resource:dummy",
        },
        resource: {
            id: ValidResource.id,
        },
        output: true,
    },
    {
        input: {
            id: ValidResource.id,
            dummy: 4,
        },
        schema: {
            id: "resource:id",
            dummy: "resource:dummy",
        },
        resource: {
            id: ValidResource.id,
            dummy: 4,
        },
        output: true,
    },
    {
        input: {
            id: ValidResource.id,
        },
        schema: {
            id: "resource:id",
            dummy: "resource:dummy",
        },
        resource: {
            id: ValidResource.id,
            dummy: 4,
        },
        output: false,
    },
    {
        input: {
            id: ValidResource.id,
            dummy: 4,
        },
        schema: {
            id: "resource:id",
            dummy: "resource:dummy",
        },
        resource: {
            id: ValidResource.id,
        },
        output: false,
    },
];

describe(`Body match`, () => {
    test.each(Entries)(`Valid body type : %#`, async ({ output, input }) =>
        expect(
            matchBody(await input(), ValidBody, ValidResource, Helpers)
        ).resolves.toBe(output)
    );

    test.each(InvalidInputs)(`Invalid body %#:`, (entry) => {
        expect(
            matchBody(
                entry.input,
                entry.body as BodyType,
                ValidResource,
                Helpers
            )
        ).rejects.toMatchSnapshot();
    });

    test.each(ResourceStringEdgeCases)(
        `Resource string entry : %#`,
        async ({ resource, schema, output, input }) => {
            try {
                const val = await matchBody(input, schema, resource, Helpers);
                expect(val).toBe(output);
            } catch (e) {
                expect(e).toMatchSnapshot();
            }
        }
    );
});
