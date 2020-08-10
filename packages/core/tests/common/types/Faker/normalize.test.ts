/* 
    Tests to check faker normalization
    These tests assume that isFaker, isFakerObject and isFakerString work correctly
*/

import {
    FakerType,
    normalizeFaker,
    NormalizedFaker,
} from "../../../../src/common/types/fakerTypes";

const ValidFaker: { input: FakerType; output: NormalizedFaker }[] = [
    {
        input: "faker:random.number",
        output: { args: [], function: "faker:random.number" },
    },
    {
        input: { function: "faker:lorem.lines" },
        output: { args: [], function: "faker:lorem.lines" },
    },
    {
        input: { function: "faker:lorem.lines", args: [] },
        output: { args: [], function: "faker:lorem.lines" },
    },
    {
        input: { function: "faker:lorem.lines" },
        output: { args: [], function: "faker:lorem.lines" },
    },
    {
        input: { function: "faker:lorem.lines", args: [{ max: 2 }] },
        output: { args: [{ max: 2 }], function: "faker:lorem.lines" },
    },
];

describe("Normalize faker", () => {
    test.each(ValidFaker)("Normalize valid faker: %#", (entry) =>
        expect(normalizeFaker(entry.input)).toEqual(entry.output)
    );
});
