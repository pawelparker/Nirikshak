/* Tests to validate literal type functionality */

import { Literal, isLiteral } from "../../../src/common/types/literals";

describe("Literal Base", () => {
    const ValidBases: Literal[] = [
        1,
        false,
        true,
        1.3223423,
        null,
        "string",
        14,
        "lorem ipsum",
    ];

    test.each(ValidBases)("Valid literal bases: %#", (entry) =>
        expect(isLiteral(entry)).toBe(true)
    );

    const InvalidBases: any[] = [
        undefined,
        new Date(),
        Symbol(),
        [1, 2, 3, "false", true],
    ];

    InvalidBases.forEach((entry, index) =>
        test(`Invalid literal base: ${index}`, () =>
            expect(isLiteral(entry)).toBe(false))
    );
});
