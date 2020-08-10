/* 
    Tests to validate the facility of the OneOfEntries type
    Circular dependency with ResourceBase, WithModifiers<ResourceBase>
    Assumes circular dependencies to be working correctly, except this part
    Assumes isBaseType to be working correctly
*/

import { OneOfEntries, isOneOfEntries } from "../../../src/resource/types/helper";


const ValidOneOfEntries: OneOfEntries[] = [
    { types: ["string"] },
    {
        types: [
            {
                type: { function: "faker:random.number", args: [1] },
                plural: true,
                optional: true,
            },
            null,
            true,
            "faker:random.name",
            "custom:myFunction",
            {
                function: "faker:lorem.lines",
            },
        ],
    },
    { types: [["string", 12, 13, { function: "faker:lorem.lines" }]] },
    {
        fields: [
            { name: "Name", surName: "Surname" },
            {
                age: {
                    type: {
                        function: "faker:random.number",
                        args: [{ min: 1, max: 100, precision: 0.1 }],
                    },
                    nullable: true,
                },
            },
        ],
    },
    {
        fields: [
            {
                branch: {
                    types: ["CSE", "ECE", "Mechanical"],
                    plural: false,
                    nullable: false,
                    optional: true,
                },
                section: {
                    function: "custom:getSection",
                    args: ["CSE", "ECE", "Mechanical"],
                },
            },
            {
                addresses: {
                    field: {
                        city: {
                            types: ["faker:random.words", "faker:address.city"],
                        },
                        street: {
                            fields: [
                                { streetName: "faker:address.streetName" },
                                {
                                    streetAddress:
                                        "faker:address.streetAddress",
                                },
                            ],
                            types: ["faker:address.zipCode"],
                        },
                    },
                    plural: true,
                },
            },
        ],
        types: [
            {
                type: {
                    function: "custom:random.callers",
                    args: [1, false, null, [true, true, [false]]],
                },
                plural: true,
                optional: true,
                nullable: false,
            },
            null,
            "faker:random.number",
            {
                function: "faker:lorem.lines",
            },
            17.885,
            false,
            true,
        ],
    },
];

const InvalidOneOfEntries: any[] = [
    undefined,
    { fields: [], types: [] },
    {
        types: [["string", 12, 13, { function: "faker:lorem.lines" }]],
        fields: [],
    },
    {
        fields: [
            { name: "Name", surName: "Surname" },
            {
                age: {
                    type: {
                        function: "faker:random.number",
                        args: [{ min: 1, max: 100, precision: 0.1 }],
                    },
                    nullable: true,
                },
            },
        ],
        types: [],
    },
    true,
    null,
    [true, null],
    {},
    { types: true },
    { types: [undefined] },
    {
        types: [
            12.4353,
            "faker:random.number",
            { type: true, nullable: true },
            [12, 13, 14, null, false, "myString", undefined],
        ],
    },
    { fields: [{ age: false }, true, "38"] },
    {
        fields: [
            { branch: "CSE" },
            {
                age: 12,
                name: 14,
                address: {
                    types: [
                        12.4353,
                        "faker:random.number",
                        { type: true, nullable: true },
                        [12, 13, 14, null, false, "myString", undefined],
                    ],
                },
            },
        ],
    },
    {
        types: [
            {
                type: { function: "faker:random.number", args: [1] },
                plural: true,
                optional: true,
            },
            null,
            true,
            "faker:random.name",
            "custom:myFunction",
            {
                function: "faker:lorem.lines",
            },
        ],
        fields: [{ name: undefined }],
    },
    {
        fields: [
            { name: "Name", surName: "Surname" },
            {
                age: {
                    type: {
                        function: "faker:random.number",
                        args: [{ min: 1, max: 100, precision: 0.1 }],
                    },
                    nullable: true,
                },
            },
        ],
        types: [12, 14, true, true, false, [undefined]],
    },
    {
        types: [
            12.4353,
            "faker:random.number",
            { type: true, nullable: true },
            [12, 13, 14, null, false, "myString", undefined],
        ],
        fields: [
            { branch: "CSE" },
            {
                age: 12,
                name: 14,
                address: {
                    types: [
                        12.4353,
                        "faker:random.number",
                        { type: true, nullable: true },
                        [12, 13, 14, null, false, "myString", undefined],
                    ],
                },
            },
        ],
    },
];

describe("One of entries", () => {
    ValidOneOfEntries.forEach((entry, index) =>
        test(`Valid one of entry: ${index}`, () =>
            expect(isOneOfEntries(entry)).toBe(true))
    );

    InvalidOneOfEntries.forEach((entry, index) =>
        test(`Invalid one of entry: ${index}`, () =>
            expect(isOneOfEntries(entry)).toBe(false))
    );
});
