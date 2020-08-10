import {
    OneOfEntries,
    isOneOfEntries,
} from "../../../src/endpoints/types/helpers";

const ValidOneOfs: OneOfEntries[] = [
    { types: [1] },
    {
        types: [
            1,
            2,
            3,
            "true",
            "false",
            [[[[[{ function: "custom:color", args: [{ seed: "#000000" }] }]]]]],
        ],
    },
    {
        fields: [
            { age: 12, numbers: 15 },
            {
                classes: 1,
                age: {
                    types: [
                        1,
                        2,
                        3,
                        "faker:random.number",
                        {
                            type: ["profitting"],
                            plural: true,
                            optional: true,
                        },
                    ],
                },
            },
        ],
    },
    {
        types: [1, 2, 4, [[["harder"], "better"], "faster"], "stronger"],
        fields: [
            { ageist: true },
            { age: false },
            { heapify: true },
            {
                values: {
                    types: [
                        { type: "helps", plural: true },
                        { type: "resource:helpers", nullable: true },
                    ],
                },
            },
        ],
    },

    {
        fields: [
            {
                argumental: {
                    field: {
                        ages: { types: [12, 13, 14, 15] },
                        optional: true,
                    },
                    address: {
                        fields: [
                            { zipCode: "faker:address.zipCode" },
                            { city: "faker:address.city" },
                            {
                                street: {
                                    types: [
                                        "faker:address.streetName",
                                        {
                                            function:
                                                "faker:address.streetAddress",
                                        },
                                        {
                                            type: null,
                                            plural: true,
                                            nullable: true,
                                        },
                                    ],
                                },
                            },
                        ],
                    },
                },
            },
        ],
        types: [
            1,
            2,
            false,
            null,
            "faker:random.number",
            {
                type: { function: "custom:color" },
                plural: true,
            },
        ],
    },
];

const InvalidOneOfs: any[] = [
    undefined,
    false,
    ["true", "undefined"],
    { types: null },
    { fields: true },
    { types: "strstr", fields: 12.5 },
    { types: [1, 3, 4, 5, "dwtr", "str,str", { fc: "odd" }] },
    { fields: [{ age: 12 }, { classes: undefined }] },
    { fields: [{ age: 12 }, { classes: { types: [1, 2, undefined] } }] },
    {
        types: [
            "plush",
            false,
            null,
            true,
            true,
            false,
            [null, [null, [null, [null, undefined]]]],
        ],
        fields: [{ age: 12 }, { classes: { types: [1, 2, 3] } }],
    },
    {
        fields: [],
    },
    { types: [] },
    {
        types: [
            "plush",
            false,
            null,
            true,
            true,
            false,
            [null, [null, [null, [null]]]],
        ],
        fields: [{ age: undefined }, { classes: { types: [1, 2, 3] } }],
    },
    {
        fields: {
            args: { types: ["random", "plurals"] },
            address: { zipCode: "faker:random.zipCode" },
            ester: { analog: true, digital: false },
            lorem: {
                ipsum: {
                    dolor: {
                        sit: true,
                        amet: {
                            fields: [
                                { age: 2 },
                                { classes: 3 },
                                {
                                    section: {
                                        fields: [
                                            {
                                                forum: {
                                                    fields: [
                                                        { alaska: undefined },
                                                    ],
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        },
    },
];

describe("One of entries for endpoints", () => {
    test.each(ValidOneOfs)(`Valid one of entry: %#`, (entry) =>
        expect(isOneOfEntries(entry)).toBe(true)
    );

    InvalidOneOfs.forEach((entry, index) =>
        test(`Invalid one of entry: ${index}`, () =>
            expect(isOneOfEntries(entry)).toBe(false))
    );
});
