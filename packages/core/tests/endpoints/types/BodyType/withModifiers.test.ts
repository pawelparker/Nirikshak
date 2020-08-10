import {
    BodyType,
    WithModifiers,
    isWithModifiersBodyType,
    isBodyType,
} from "../../../../src/endpoints/types/helpers";
import { InvalidModifiers, ValidModifiers } from "../../utils";

const ValidBodyTypes: BodyType[] = [
    { age: 1 },
    { pulse: { faint: true } },
    { classic: { types: [1, 2, 3] } },
    { types: true, fields: false },
    {
        root: {
            fields: [
                {
                    agnes: {
                        type: 13,
                        nullable: true,
                        plural: true,
                    },
                    blimps: {
                        types: [1, 2, 3],
                        fields: [
                            {
                                age: {
                                    type: {
                                        function: "faker:random.number",
                                        args: [100],
                                    },
                                },
                            },
                            { ageism: false },
                        ],
                    },
                },
                {
                    blossom: {
                        field: {
                            ageism: true,
                            alpha: "faker:system.semver",
                        },
                    },
                },
            ],
        },
    },
];

const InvalidBodyTypes: any[] = [
    false,
    undefined,
    null,
    "ninjaw",
    [1, 7, "true", false, null],
    { field: undefined },
    { little: "prompt", args: ["false", true, undefined] },
    {
        root: {
            fields: [
                {
                    agnes: {
                        type: 13,
                        nullable: true,
                        plural: true,
                    },
                    blimps: {
                        types: [1, 2, 3],
                        fields: [
                            {
                                age: {
                                    type: {
                                        function: "faker:random.number",
                                        args: [100],
                                    },
                                },
                            },
                            { ageism: undefined },
                        ],
                    },
                },
                {
                    blossom: {
                        field: {
                            ageism: true,
                            alpha: "faker:system.semver",
                        },
                    },
                },
            ],
        },
    },
];

const ValidWithModifers: WithModifiers<BodyType>[] = [];
const InvalidWithModifers: WithModifiers<BodyType>[] = [];

ValidModifiers.forEach((modifier) => {
    ValidBodyTypes.forEach((bodyType) => {
        const o = Object.assign({}, modifier) as WithModifiers<BodyType>;
        o.field = bodyType;
        ValidWithModifers.push(o);
    });

    InvalidBodyTypes.forEach((bodyType) => {
        const o = Object.assign({}, modifier) as any;
        o.field = bodyType;
        InvalidWithModifers.push(o);
    });
});

InvalidModifiers.forEach((modifier) => {
    ValidBodyTypes.forEach((bodyType) => {
        const o = Object.assign({}, modifier);
        o.field = bodyType;
        InvalidWithModifers.push(o);
    });

    InvalidBodyTypes.forEach((bodyType) => {
        const o = Object.assign({}, modifier) as any;
        o.field = bodyType;
        InvalidWithModifers.push(o);
    });
});

describe("Body type with modifiers", () => {
    test.each(ValidWithModifers)(
        `Valid body type with modifiers: %#`,
        (entry) => {
            expect(isWithModifiersBodyType(entry)).toBe(true);
        }
    );

    InvalidBodyTypes.forEach((entry, index) =>
        test(`Invalid body type with modifiers: ${index}`, () =>
            expect(isBodyType(entry)).toBe(false))
    );
});
