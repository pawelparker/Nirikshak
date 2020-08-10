/*
    Tests to check the custom types 
    isFakerObject assumes that isFakerString works correctly
*/
import {
    isCustomFunction,
    isCustomFunctionString,
    isCustomFunctionObject,
    CustomFunctionString,
    CustomFunctionObject,
} from "../../../../src/common/types/custom";

const ValidCustomStrings: CustomFunctionString[] = [
    "custom:LoremIpsumDolor",
    "custom:",
    "custom: My Valid Functions",
];

const ValidCustomObjects: CustomFunctionObject[] = [
    { function: "custom:LoremIpsumDolor", args: [] },
    { function: "custom:" },
    {
        function: "custom: My Valid Functions",
        args: [1, 2, 3, false, ["true"]],
    },
];

const InvalidCustomStrings: string[] = [
    "custom-LoremIpsum",
    "custom Lorem",
    "costom:LoremIpsum",
];

const InvalidCustomObjects: any[] = [
    "custom",
    { function: "custom" },
    { fc: "custom:MyFunction" },
    { function: "custom:Lorem", args: undefined },
    { fc: "custom:Fc", args: [12, 3, "strigbr"] },
];

describe("Custom functions", () => {
    ValidCustomStrings.map((str, index) =>
        test(`Valid custom function string ${index}`, () => {
            expect(isCustomFunctionString(str)).toBe(true);
            expect(isCustomFunctionObject(str)).toBe(false);
            expect(isCustomFunction(str)).toBe(true);
        })
    );

    ValidCustomObjects.map((object, index) =>
        test(`Valid custom function object ${index}`, () => {
            expect(isCustomFunctionString(object)).toBe(false);
            expect(isCustomFunctionObject(object)).toBe(true);
            expect(isCustomFunction(object)).toBe(true);
        })
    );

    InvalidCustomStrings.map((str, index) =>
        test(`Invalid custom function string ${index}`, () => {
            expect(isCustomFunctionString(str)).toBe(false);
            expect(isCustomFunction(str)).toBe(false);
        })
    );

    InvalidCustomObjects.map((object, index) =>
        test(`Invalid custom function object ${index}`, () => {
            expect(isCustomFunctionObject(object)).toBe(false);
            expect(isCustomFunction(object)).toBe(false);
        })
    );
});
