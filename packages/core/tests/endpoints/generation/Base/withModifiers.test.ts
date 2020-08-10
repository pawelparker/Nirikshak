import faker from "faker";
import { SchemaHelpers } from "../../../../src/common/types/helpers";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import { Base, WithModifiers } from "../../../../src/endpoints/types/helpers";
import { ValidModifiers } from "../../utils";
import { generateWithModifiers } from "../../../../src/endpoints/generation/helpers/withModifiersGen";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";

faker.seed(456);
const resource: ResourceInstance = {
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

const ValidBases: Base[] = [
    1,
    [17, false, true, null, "strings", "strings", ["faker:random.number"]],
    [
        { function: "custom:word", args: [] },
        { function: "faker:random.number", args: [50] },
    ],
    [
        "resource:id",
        "resource:addresses[0].city",
        "resource:name.firstName",
        [true, false],
        ["custom:word", ["faker:lorem.lines"]],
    ],
];

const ValidWithModifiers: WithModifiers<Base>[] = [];

ValidModifiers.forEach((modifier) =>
    ValidBases.forEach((base) =>
        ValidWithModifiers.push(Object.assign({}, modifier, { type: base }))
    )
);

const InvalidWithModifiers: any[] = [
    { type: [1, 2, [[[[false, "resource:nonExistentPath"]]]]] },
    { type: [1, 2, [[[[false, "resource:addresses"]]]]], optional: true },
    { type: [1, 2, [[[[false, "custom:lorem.ipsum"]]]]] },
    { type: [1, 2, [[[[false, "custom:invalidHelper"]]]]], optional: true },
];

describe("Base generation with modifiers", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidWithModifiers.forEach((entry, index) =>
            test(`Valid base with modifiers: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 + index * i);
                const gen = await generateWithModifiers(
                    entry,
                    resource,
                    Helpers
                );
                expect(gen).toMatchSnapshot();
                faker.seed(123 + index * i);
                const isNull = !!(entry.nullable && faker.random.boolean());
                expect(gen === null).toBe(isNull);

                if (!isNull && entry.plural)
                    expect(Array.isArray(gen)).toBe(true);
            })
        );

    test.each(InvalidWithModifiers)(
        `Invalid base with modifiers: %#`,
        (entry) => {
            expect(
                generateWithModifiers(entry, resource, Helpers)
            ).rejects.toThrowErrorMatchingSnapshot();
        }
    );
});
