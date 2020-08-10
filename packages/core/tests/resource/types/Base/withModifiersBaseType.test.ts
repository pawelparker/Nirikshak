/* 
    Test to validate WithModifiers<BaseType> functionality
*/
import {
    WithModifiers,
    BaseType,
    isWithModifiersBaseType,
    isWithModifiers,
    isBaseType,
} from "../../../../src/resource/types/helper";
import { ValidModifiers, InvalidModifiers } from "../../utils";

// Valid bases
const ValidBaseTypes: BaseType[] = [
    "custom:loremFunction",
    "12",
    null,
    [null, "12", "faker:random.string"],
    {
        function: "faker:random.number",
        args: [{ min: 0, max: 1, precision: 0.1 }],
    },
    {
        function: "custom:random.number",
        args: [{ min: 0, max: 1, precision: 0.1 }],
    },
    [
        true,
        false,
        true,
        "faker:lorem.lines",
        ["faker:invalid.treatedAsString", [null, 12.75, 8.85, [0]]],
    ],
];
// Valid with modifiers entries
const ValidWithModifiers: WithModifiers<BaseType>[] = [];

// Valid Bases x Valid modifiers = Valid with modifiers entries
ValidBaseTypes.forEach((baseType) =>
    ValidModifiers.forEach((mod) => {
        const o = Object.assign({}, mod) as WithModifiers<BaseType>;
        o.type = baseType;
        ValidWithModifiers.push(o);
    })
);

// Invalid bases
const InvalidBaseTypes: any[] = [
    undefined,
    [12, [true], undefined],
    [undefined],
    [
        "false",
        true,
        true,
        null,
        18.85,
        19.356,
        2,
        false,
        [0, 0, [123.45, 67.89, [undefined], "false", "true"]],
    ],
];

// Invalid with modifiers entries
const InvalidWithModifiers: any[] = [];

// Invalid modifiers x (Valid bases, Invalid bases) = Invalid with modifiers entries
InvalidModifiers.forEach((mods) => {
    ValidBaseTypes.forEach((base) => {
        const o = Object.assign({}, mods);
        o.type = base;
        InvalidWithModifiers.push(o);
    });

    InvalidBaseTypes.forEach((base) => {
        const o = Object.assign({}, mods);
        o.type = base;
        InvalidWithModifiers.push(o);
    });
});

// Valid Bases x Invalid Modifiers Invalid Bases = Invalid with modifiers entries
ValidModifiers.forEach((mods) =>
    InvalidBaseTypes.forEach((base) => {
        const o = Object.assign({}, mods) as any;
        o.type = base;
        InvalidWithModifiers.push(o);
    })
);

describe("With modifiers: Base Type", () => {
    ValidWithModifiers.forEach((entry, index) =>
        test(`Valid base type with modifiers ${index}`, () => {
            expect(isWithModifiersBaseType(entry)).toBe(true);
            expect(isWithModifiers(entry)).toBe(true);
            expect(isBaseType(entry.type)).toBe(true);
        })
    );

    InvalidWithModifiers.forEach((entry, index) =>
        test(`Invalid base type with modifiers ${index}`, () => {
            expect(isWithModifiersBaseType(entry)).toBe(false);
            expect(isWithModifiers(entry)).toBe(false);
        })
    );
});
