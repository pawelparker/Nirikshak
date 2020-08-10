import {
    OneOfEntries,
    isWithModifiersBase,
    isWithModifiersBodyType,
} from "../../../../src/endpoints/types/helpers";
import { matchOneOfEntries } from "../../../../src/endpoints/traversal/bodyValidation";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import faker from "faker";
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

const ValidOneOf: OneOfEntries = {
    types: [
        {
            type: [
                "faker:random.number",
                "crisps",
                { function: "custom:word", args: [13] },
            ],
            plural: true,
        },
        {
            type: [
                "faker:random.number",
                "crisps",
                { function: "custom:word", args: [13] },
            ],
            nullable: true,
        },
        {
            type: [
                "faker:random.number",
                "crisps",
                { function: "custom:word", args: [13] },
            ],
            optional: true,
        },
        null,
        false,
        "strstr",
    ],
    fields: [
        {
            planets: {
                types: [
                    "Earth",
                    "Mars",
                    "Jupiter",
                    { type: "faker:random.words", nullable: true },
                ],
            },
            age: {
                field: {
                    field: {
                        ageHolder: {
                            types: [1, 2, 3, "faker:random.number"],
                        },
                        plural: true,
                    },
                    nullable: true,
                },
                nullable: true,
                plural: true,
            },
            branch: {
                type: "resource:id",
                nullable: true,
                optional: true,
            },
        },
        {
            field: { age: 12 },
            optional: true,
            nullable: true,
            plural: true,
        },
    ],
};

const NullAndUndefinedEntries: {
    input: null | undefined;
    oneOfEntries: OneOfEntries;
    output: boolean;
}[] = [
    // Undefined input
    {
        input: undefined,
        oneOfEntries: { types: ValidOneOf.types },
        output: true,
    },
    {
        input: undefined,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.optional : true
            ),
        },
        output: false,
    },
    {
        input: undefined,
        oneOfEntries: { fields: ValidOneOf.fields },
        output: true,
    },
    {
        input: undefined,
        oneOfEntries: {
            fields: ValidOneOf.fields.filter((field) =>
                isWithModifiersBodyType(field) ? !field.optional : true
            ),
        },
        output: false,
    },
    {
        input: undefined,
        oneOfEntries: { types: ValidOneOf.types, fields: ValidOneOf.fields },
        output: true,
    },
    {
        input: undefined,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.optional : true
            ),
            fields: ValidOneOf.fields.filter((field) =>
                isWithModifiersBodyType(field) ? !field.optional : true
            ),
        },
        output: false,
    },
    {
        input: null,
        oneOfEntries: { fields: ValidOneOf.fields },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            fields: ValidOneOf.fields.filter((field) =>
                isWithModifiersBodyType(field) ? !field.nullable : true
            ),
        },
        output: false,
    },
    {
        input: null,
        oneOfEntries: { types: ValidOneOf.types },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) => type !== null),
        },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.nullable : true
            ),
        },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.nullable : type !== null
            ),
        },
        output: false,
    },
    {
        input: null,
        oneOfEntries: { types: ValidOneOf.types, fields: ValidOneOf.fields },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types,
            fields: ValidOneOf.fields.filter((field) =>
                isWithModifiersBodyType(field) ? !field.nullable : true
            ),
        },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) => type !== null),
            fields: ValidOneOf.fields,
        },
        output: true,
    },

    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) => type !== null),
            fields: ValidOneOf.fields.filter((field) =>
                isWithModifiersBodyType(field) ? !field.nullable : true
            ),
        },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.nullable : true
            ),
            fields: ValidOneOf.fields,
        },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.nullable : true
            ),
            fields: ValidOneOf.fields.filter((field) =>
                isWithModifiersBodyType(field) ? !field.nullable : true
            ),
        },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.nullable : type !== null
            ),
            fields: ValidOneOf.fields,
        },
        output: true,
    },
    {
        input: null,
        oneOfEntries: {
            types: ValidOneOf.types.filter((type) =>
                isWithModifiersBase(type) ? !type.nullable : type !== null
            ),
            fields: ValidOneOf.fields.filter((field) =>
                isWithModifiersBodyType(field) ? !field.nullable : true
            ),
        },
        output: false,
    },
];

const OutOfScopeEntries: {
    input: Exclude<any, null | undefined>;
    output: boolean;
    oneOfEntries: OneOfEntries;
}[] = [
    {
        input: { x: 1 },
        oneOfEntries: {
            types: [1, 2, 3],
        },
        output: false,
    },
    {
        input: 4,
        oneOfEntries: {
            fields: [{ a: 1 }, { b: 2 }],
        },
        output: false,
    },
];

const ValidComplexEntries: {
    input: Exclude<any, null | undefined>;
    output: boolean;
}[] = [
    {
        input: [
            [1, "crisps", "word1"],
            [2, "crisps", "word2"],
            [3, "crisps", "word3"],
            [4, "crisps", "word4"],
            [5, "crisps", "word5"],
        ],
        output: true,
    },
    {
        input: "strstr",
        output: true,
    },
    {
        input: [1, "crisps", "word1"],
        output: true,
    },
    {
        input: true,
        output: false,
    },
    {
        input: {
            planets: "Earth",
            age: null,
        },
        output: true,
    },
    {
        input: {
            planets: "HMU",
            age: null,
        },
        output: true,
    },
    {
        input: {
            planets: null,
            age: null,
        },
        output: true,
    },
    {
        input: {
            planets: 22.757,
            age: null,
            branch: ValidResource.id,
        },
        output: false,
    },
    {
        input: {
            planets: "Jupiter",
            age: [
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 172,
                        plural: true,
                    },
                    nullable: true,
                },
            ],
        },
        output: true,
    },
    {
        input: {
            planets: "Jupiter",
            age: [
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 172,
                        plural: true,
                    },
                    nullable: true,
                },
            ],
            branch: null,
        },
        output: true,
    },
    {
        input: {
            planets: "Jupiter",
            age: [
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 172,
                        plural: true,
                    },
                    nullable: true,
                },
            ],
            branch: ValidResource.id,
        },
        output: true,
    },
    {
        input: {
            planets: 17.25,
            age: [
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 1,
                        plural: true,
                    },
                    nullable: true,
                },
                {
                    field: {
                        ageHolder: 172,
                        plural: true,
                    },
                    nullable: true,
                },
            ],
        },
        output: false,
    },
    {
        input: {
            planets: "purple",
            age: [],
        },
        output: true,
    },
    { input: [{ age: 12 }, { age: 12 }], output: true },
];

const InvalidEntries: {
    input: any;
    oneOf: any;
}[] = [
    {
        input: false,
        oneOf: {
            types: [1, 2, 3, "resource:invalidField"],
        },
    },
    {
        input: false,
        oneOf: {
            types: [1, 2, 3, "resource:addresses"],
        },
    },
    {
        input: { class: false },
        oneOf: {
            types: [1, 2, 3],
            fields: [{ class: "custom:invalidHelper" }],
        },
    },
    {
        input: { class: false },
        oneOf: {
            types: [1, 2, 3],
            fields: [{ class: "custom:non.existent" }],
        },
    },
];

describe(`Oneof type match`, () => {
    test.each(NullAndUndefinedEntries)(
        `Null/Undefined oneof type : %#`,
        ({ oneOfEntries, output, input }) =>
            expect(
                matchOneOfEntries(input, oneOfEntries, ValidResource, Helpers)
            ).resolves.toBe(output)
    );

    test.each(OutOfScopeEntries)(
        `Out of scope oneof type : %#`,
        ({ output, oneOfEntries, input }) =>
            expect(
                matchOneOfEntries(input, oneOfEntries, ValidResource, Helpers)
            ).resolves.toBe(output)
    );

    test.each(ValidComplexEntries)(
        `Valid complex oneof type : %#`,
        ({ output, input }) =>
            expect(
                matchOneOfEntries(input, ValidOneOf, ValidResource, Helpers)
            ).resolves.toBe(output)
    );

    test.each(InvalidEntries)(`Invalid oneof type : %#`, ({ oneOf, input }) =>
        expect(
            matchOneOfEntries(input, oneOf, ValidResource, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
