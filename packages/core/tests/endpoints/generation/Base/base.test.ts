import faker from "faker";
import {
    SchemaHelpers,
    Primitives,
} from "../../../../src/common/types/helpers";
import { Base } from "../../../../src/endpoints/types/helpers";
import { generateBase } from "../../../../src/endpoints/generation/helpers/baseGen";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";

const resource = {
    id: faker.random.uuid(),
    name: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
    },
    addresses: [
        { zipCode: faker.address.zipCode(), city: faker.address.city() },
        { zipCode: faker.address.zipCode(), city: faker.address.city() },
    ],
    recursion: {
        bases: {
            args: {
                plethora: [1, 2, 10, [[7, 5, [4]]], 3],
            },
        },
    },
};

const Helpers: SchemaHelpers = {
    word: (): Promise<string> =>
        new Promise((resolve) =>
            setTimeout(() => resolve(faker.random.word()), 10)
        ),
    async invalidHelper() {
        return { age: 10 } as any;
    },
};

const ValidInputs: { input: Base; output: () => Promise<Primitives> }[] = [
    {
        input: "faker:lorem.lines",
        async output(): Promise<string> {
            return faker.lorem.lines();
        },
    },
    {
        input: [
            1,
            3,
            "stringstring",
            "custom:word",
            [null, true, false, true, [[["resource:id"]]]],
        ],
        async output(): Promise<Primitives> {
            return [
                1,
                3,
                "stringstring",
                await Helpers.word(),
                [null, true, false, true, [[[resource.id]]]],
            ];
        },
    },
];

const InvalidInputs: any[] = [
    [
        1,
        7,
        8,
        true,
        true,
        true,
        false,
        [12],
        [12],
        { function: "custom:invalidHelper" },
    ],
    ["strstr", "resource:nonExistentPath"],
    "resource:addresses[0]",
    [[[[[[[[[[[[[["custom:nonExistentHelper"]]]]]]]]]]]]]],
];

describe("Base generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidInputs.forEach((entry, index) =>
            test(`Valid input: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 + index * i);
                const got = await generateBase(entry.input, resource, Helpers);
                faker.seed(123 + index * i);
                const expected = await entry.output();
                expect(got).toEqual(expected);
            })
        );

    InvalidInputs.forEach((entry, index) =>
        test(`Invalid input: ${index}`, () =>
            expect(
                generateBase(entry, resource, Helpers)
            ).rejects.toMatchSnapshot())
    );
});
