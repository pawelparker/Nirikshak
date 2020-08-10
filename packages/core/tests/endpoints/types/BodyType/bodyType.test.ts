import { BodyType, isBodyType } from "../../../../src/endpoints/types/helpers";

const ValidBodyTypes: BodyType[] = [
    {
        name: "lipsum-dolor",
        age: 15,
        class: 12.543,
        baseValue: [true, null, false, "myStrMyStr", "Stroustrup"],
        baseless: "resource:name.age[0].personality",
        places: {
            toGo: false,
            toBe: true,
            toEnjoy: {
                title: {
                    function: "custom:mapResourceToPlacesArray",
                    args: ["Lipsum", { age: "Dolor" }],
                },
                name: true,
            },
        },
    },
    {
        name: "lipsum-dolor",
        age: 15,
        class: { type: "resouce:class", optional: true },
        address: {
            type: ["faker:address.zipCode", "faker:address.streetName"],
            plural: true,
        },
        nestedField: {
            field: {
                class: { types: ["CSE", "ECE", "MECH"] },
                plural: true,
                nullable: true,
                optional: true,
            },
        },
        baseValue: [true, null, false, "myStrMyStr", "Stroustrup"],
        baseless: "resource:name.age[0].personality",
        places: {
            toGo: false,
            toBe: true,
            toEnjoy: {
                title: {
                    function: "custom:mapResourceToPlacesArray",
                    args: ["Lipsum", { age: "Dolor" }],
                },
                name: true,
            },
        },
    },
    {
        places: "faker:random:word",
        cologne: {
            types: [
                {
                    type: [
                        "faker:random.number",
                        "crisps",
                        { function: "custom:colorGenerator", args: [13] },
                    ],
                    plural: true,
                },
                {
                    type: [
                        "faker:random.number",
                        "crisps",
                        { function: "custom:colorGenerator", args: [13] },
                    ],
                    nullable: true,
                },
                {
                    type: [
                        "faker:random.number",
                        "crisps",
                        { function: "custom:colorGenerator", args: [13] },
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
                        type: "resource:age",
                        nullable: true,
                        optional: true,
                    },
                },
            ],
        },
    },
];

const InvalidBodyType: any[] = [
    1,
    false,
    null,
    "stringles",
    undefined,
    [1, 2, 4, true],
    {
        age: true,
        gimp: false,
        pragmaticValue: undefined,
    },
    {
        practice: {
            types: ["makes", "a", "man", "perfect", undefined],
        },
    },
    {
        class: {
            fields: { cross: undefined },
        },
    },
    {
        blimp: {
            clips: {
                types: [undefined],
            },
        },
    },
    {
        criss: {
            cross: {
                amsterdam: {
                    fields: [undefined],
                },
            },
        },
    },
    {
        f1: {
            type: undefined,
        },
    },
    {
        f2: {
            field: [null, undefined, false],
        },
    },
];

describe("Body type", () => {
    test.each(ValidBodyTypes)(`Valid body type: %#`, (body) =>
        expect(isBodyType(body)).toBe(true)
    );
    InvalidBodyType.forEach((body, index) =>
        test(`Invalid body type: ${index}`, () =>
            expect(isBodyType(body)).toBe(false))
    );
});
