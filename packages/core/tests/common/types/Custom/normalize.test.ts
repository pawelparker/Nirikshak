/* 
    Tests to check faker normalization
    These tests assume that isFaker, isFakerObject and isFakerString work correctly
*/
import {
    NormalizedCustomFunction,
    CustomFunctionType,
    normalizeCustomFunction,
} from "../../../../src/common/types/custom";

const ValidFaker: {
    input: CustomFunctionType;
    output: NormalizedCustomFunction;
}[] = [
    {
        input: "custom:random.number",
        output: { args: [], function: "custom:random.number" },
    },
    {
        input: { function: "custom:lorem.lines" },
        output: { args: [], function: "custom:lorem.lines" },
    },
    {
        input: { function: "custom:lorem.lines", args: [] },
        output: { args: [], function: "custom:lorem.lines" },
    },
    {
        input: { function: "custom:lorem.lines" },
        output: { args: [], function: "custom:lorem.lines" },
    },
    {
        input: { function: "custom:lorem.lines", args: [{ max: 2 }] },
        output: { args: [{ max: 2 }], function: "custom:lorem.lines" },
    },
];

describe("Normalize faker", () => {
    test.each(ValidFaker)("Normalize valid custom function: %#", (entry) =>
        expect(normalizeCustomFunction(entry.input)).toEqual(entry.output)
    );
});
