/* 
    test to validate base type functionality 
*/

import { BaseType, isBaseType } from "../../../../src/resource/types/helper";

const ValidBaseTypes: BaseType[] = [
    // Faker
    "faker:random.number",
    { function: "faker:lorem.lines", args: [1] },
    // Custom function
    "custom:MyFucntion",
    { function: "custom:MyFucntion", args: [[[true]]] },
    // Literals
    true,
    // Array of any entry
    [12, null, "custom:name", "faker:random.number", "faker:random.name"],
    [
        false,
        true,
        true,
        [true, true, false, ["Name", { function: "custom:name", args: [] }]],
    ],
];

const InvalidBaseTypes: any[] = [
    { fc: "faker:random.number" },
    { function: "faker:random.number", args: true },
    { fc: "custom:random.number" },
    { custom: "custom:random.number", args: false },
    undefined,
    [[12], null, undefined],
    [undefined, false, false, null],
    [
        12,
        true,
        "faker:lorem.lines",
        [{ function: "custom:fc", args: [] }, [null, [null, [undefined]]]],
    ],
];

describe("Base Type", () => {
    ValidBaseTypes.forEach((entry, index) =>
        test(`Valid base type: ${index}`, () => {
            expect(isBaseType(entry)).toBe(true);
        })
    );

    InvalidBaseTypes.forEach((entry, index) =>
        test(`Invalid base type: ${index}`, () => {
            expect(isBaseType(entry)).toBe(false);
        })
    );
});
