/* 
    Tests to validate resource base and resource type functionality
    Assumes other functions to be working correctly
    except the circular deps : with fine except this part
*/
import {
    ResourceBase,
    isResourceBase,
    isResource,
    Resource,
} from "../../../../src/resource/types/resource";

const ValidResourceBases: ResourceBase[] = [
    {
        name: 15,
        class: "faker:random.number",
        branch: { function: "faker:random.words", args: [1] },
        address: "faker.random.zipCode",
    },
    {
        name: 15,
        class: "faker:random.number",
        branch: { function: "faker:random.words", args: [1] },
        address: "faker.random.zipCode",
    },
    {
        root: {
            f2: {
                type: [1, 2, 3, 4, "stirng", false, "faker:random.address"],
                nullable: true,
                plural: true,
            },
            field: {
                f1: {
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
                                            {
                                                streetName:
                                                    "faker:address.streetName",
                                            },
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
                optional: true,
            },
        },
    },
    {
        f1: {
            types: [
                1,
                2,
                3,
                ["stringify", 19, 30, 19.542],
                "faker:random.number",
                [[[[["custom.username"]]]]],
            ],
        },
        f2: {
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
                            [12, 13, 14, null, false, "myString"],
                        ],
                    },
                },
            ],
        },
        f3: {
            fields: [
                { branch: 3 },
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
            types: [12, 14, true, true, false, ["SIMP"]],
        },
        f4: {
            fields: [
                { field: { name: "Name", surName: "Surname" }, plural: true },
            ],
        },
    },
];

const InvalidResourceBases: any[] = [
    true,
    undefined,
    [true, false, [undefined], false, "stringify"],
    {
        age: 19,
        class: 23,
        branch: { types: ["CSE", "ECE", "Mechanical"] },
        address: undefined,
    },
    {
        root: {
            f2: {
                type: [1, 2, 3, 4, "stirng", false, "faker:random.address"],
                nullable: true,
                plural: true,
            },
            field: {
                f1: {
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
                                            {
                                                streetName:
                                                    "faker:address.streetName",
                                            },
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
                        undefined,
                    ],
                },
                optional: true,
            },
        },
    },
];

describe("Resource base type", () => {
    ValidResourceBases.forEach((resource, index) =>
        test(`Valid resource base ${index}`, () =>
            expect(isResourceBase(resource)).toBe(true))
    );

    InvalidResourceBases.forEach((resource, index) =>
        test(`Invalid resource base ${index}`, () =>
            expect(isResourceBase(resource)).toBe(false))
    );
});

describe("Resource type", () => {
    ValidResourceBases.forEach((resource, index) =>
        test(`Valid resource base ${index}`, () => {
            expect(isResource(resource)).toBe(false);
            const o = Object.assign({}, resource) as Resource;
            o.id = "faker:random.uuid";
            expect(isResource(o)).toBe(true);
        })
    );

    InvalidResourceBases.forEach((resource, index) =>
        test(`Invalid resource base ${index}`, () => {
            if (typeof resource === "object" && !Array.isArray(resource)) {
                const o = Object.assign({}, resource);
                o.id = "faker:random.uuid";
                expect(isResource(o)).toBe(false);
            } else expect(isResource(resource)).toBe(false);
        })
    );
});
