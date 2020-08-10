/* 
    Tests to validate WithModifiers<ResourceBase> type
    Circular dependecy with ResourceBase, OneOfEntries
    Assumes circular dependencies to be working correctly, except this part
*/
import { ResourceBase, isResourceBase } from "../../../../src/resource/types/resource";
import { ValidModifiers, InvalidModifiers } from "../../utils";
import {
    WithModifiers,
    isWithModifiersResource,
    isWithModifiers,
} from "../../../../src/resource/types/helper";

// Valid resource bases
const ValidResourceBaseTypes: ResourceBase[] = [
    { age: 12 },
    {
        name: "Yash",
        class: 5,
        adddress: {
            type: { function: "faker:random.address", args: [1] },
            nullable: true,
            optional: true,
            plural: true,
        },
        types: [
            true,
            null,
            "stinrg",
            [
                false,
                [true, true, false, [null, { function: "custom:myFunction" }]],
            ],
        ],
    },
    {
        root: {
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
                                types: [
                                    "faker:random.words",
                                    "faker:address.city",
                                ],
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
    },
];
// Valid with modifiers entries
const ValidWithModifiers: WithModifiers<ResourceBase>[] = [];

// Valid ResourceBase x Valid modifiers = Valid with modifiers entries
ValidResourceBaseTypes.forEach((baseType) =>
    ValidModifiers.forEach((mod) => {
        const o = Object.assign({}, mod) as WithModifiers<ResourceBase>;
        o.field = baseType;
        ValidWithModifiers.push(o);
    })
);

// Invalid bases
const InvalidBaseTypes: any[] = [
    undefined,
    [undefined],
    true,
    [
        null,
        "strings",
        false,
        true,
        [false, [true, { function: "faker:random.number" }]],
    ],
    {
        age: 12,
        name: "Name",
        class: undefined,
    },
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
                            streetAddress: "faker:address.streetAddress",
                        },
                    ],
                    types: ["faker:address.zipCode", undefined],
                },
            },
        },
    },
];

// Invalid with modifiers entries
const InvalidWithModifiers: any[] = [];

// Invalid modifiers x (Valid bases, Invalid bases) = Invalid with modifiers entries
InvalidModifiers.forEach((mods) => {
    ValidResourceBaseTypes.forEach((base) => {
        const o = Object.assign({}, mods);
        o.field = base;
        InvalidWithModifiers.push(o);
    });

    InvalidBaseTypes.forEach((base) => {
        const o = Object.assign({}, mods);
        o.field = base;
        InvalidWithModifiers.push(o);
    });
});

// Valid Bases x Invalid Modifiers Invalid Bases = Invalid with modifiers entries
ValidModifiers.forEach((mods) =>
    InvalidBaseTypes.forEach((base) => {
        const o = Object.assign({}, mods) as any;
        o.field = base;
        InvalidWithModifiers.push(o);
    })
);

describe("With modifiers: ResourceBase Type", () => {
    ValidWithModifiers.forEach((entry, index) =>
        test(`Valid base type with modifiers ${index}`, () => {
            expect(isWithModifiersResource(entry)).toBe(true);
            expect(isWithModifiers(entry)).toBe(true);
            expect(isResourceBase(entry.field)).toBe(true);
        })
    );

    InvalidWithModifiers.forEach((entry, index) =>
        test(`Invalid base type with modifiers ${index}`, () => {
            expect(isWithModifiersResource(entry)).toBe(false);
            expect(isWithModifiers(entry)).toBe(false);
        })
    );
});
