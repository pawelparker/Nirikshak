import {
    Base,
    WithModifiers,
    isWithModifiersBase,
    isWithModifiers,
} from "../../../../../src/endpoints/types/helpers";
import { ValidModifiers, InvalidModifiers } from "../../../utils";

const ValidBases: Base[] = [
    false,
    null,
    1.324,
    "strstr",
    [
        1,
        1,
        2,
        3,
        null,
        false,
        true,
        ["ignore", ["falsify", null, null, 313.343232, true]],
    ],
    [
        "custom:name",
        42342,
        null,
        false,
        {
            function: "faker:random.uuid",
            args: [1, 2, 3, { min: 4 }, ["resource:id.name[0].age"]],
        },
    ],
];

const InvalidBases: any[] = [
    undefined,
    [false, true, null, { fc: "faker:random.number" }],
    [
        "custom:name",
        42342,
        null,
        false,
        {
            function: "faker:random.name",
            args: [1, 2, 3, { min: 4 }, ["resource:id.name[0].age"]],
        },
    ],
    [
        1,
        1,
        2,
        3,
        null,
        false,
        true,
        ["ignore", ["falsify", null, null, 313.343232, undefined]],
    ],
];

const ValidWithModifiers: WithModifiers<Base>[] = [];
const InvalidWithModifiers: any[] = [];

ValidModifiers.forEach((modifier) => {
    ValidBases.forEach((base) => {
        const o = Object.create(modifier) as WithModifiers<Base>;
        o.type = base;
        ValidWithModifiers.push(o);
    });

    InvalidBases.forEach((base) => {
        const o = Object.create(modifier);
        o.type = base;
        InvalidWithModifiers.push(o);
    });
});

InvalidModifiers.forEach((modifier) => {
    ValidBases.forEach((base) => {
        const o = Object.create(modifier);
        o.type = base;
        InvalidWithModifiers.push(o);
    });

    InvalidBases.forEach((base) => {
        const o = Object.create(modifier);
        o.type = base;
        InvalidWithModifiers.push(o);
    });
});

describe("Base with modifiers", () => {
    test.each(ValidWithModifiers)(`Valid base with modifier: %#`, (entry) => {
        expect(isWithModifiersBase(entry)).toBe(true);
        expect(isWithModifiers(entry)).toBe(true);
    });

    test.each(InvalidWithModifiers)(
        `Invalid base with modifier: %#`,
        (entry) => {
            expect(isWithModifiersBase(entry)).toBe(false);
            expect(isWithModifiers(entry)).toBe(false);
        }
    );
});
