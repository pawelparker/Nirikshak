import { Base, isBase } from "../../../../../src/endpoints/types/helpers";

const ValidBases: Base[] = [
    1,
    null,
    false,
    "MyStrings",
    "faker:random.number",
    "custom:number",
    "resource:age[1].places",
    { function: "faker:random.number" },
    { function: "custom:random.number", args: [1] },
    [
        1,
        2,
        3,
        "false",
        true,
        true,
        "strings",
        [12.5324, "resource", [[[[["resource:id"]]]]]],
    ],
];

const InvalidBases: any[] = [
    undefined,
    [false, true, null, "resource:id", undefined],
    [
        1,
        2,
        3,
        "false",
        true,
        true,
        "strings",
        [12.5324, "resource", [[[[["undefined", undefined]]]]]],
    ],
];
describe("Base type", () => {
    test.each(ValidBases)(`Valid base type : %#`, (o) =>
        expect(isBase(o)).toBe(true)
    );

    test.each(InvalidBases)(`Invalid base type : %#`, (o) =>
        expect(isBase(o)).toBe(false)
    );
});
