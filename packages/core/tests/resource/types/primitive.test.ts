/* 
    Test to check functionality of the primitive type
*/

import { Primitives, isPrimitives } from "../../../src/common/types/helpers";


const ValidInputs: Primitives[] = [
    1,
    false,
    null,
    "stirngs",
    [1, 2, false, true, null, null, [1, 8, 9, "stringify"]],
];

const InvalidInputs: any[] = [
    undefined,
    [undefined],
    [
        1,
        true,
        true,
        null,
        false,
        "sgtr",
        "ssss",
        [null, false, false, [undefined]],
    ],
];

describe("Primitive helper type", () => {
    ValidInputs.forEach((input, index) =>
        test(`Valid input: ${index}`, () =>
            expect(isPrimitives(input)).toBe(true))
    );

    InvalidInputs.forEach((input, index) =>
        test(`Valid input: ${index}`, () =>
            expect(isPrimitives(input)).toBe(false))
    );
});
