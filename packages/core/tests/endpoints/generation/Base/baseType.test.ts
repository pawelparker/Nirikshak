import { BaseType } from "../../../../src/endpoints/types/helpers";
import {
    Primitives,
    SchemaHelpers,
} from "../../../../src/common/types/helpers";
import faker from "faker";
import { generateBaseType } from "../../../../src/endpoints/generation/helpers/baseTypeGen";
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

const ValidEntries: { input: BaseType; output: () => Promise<Primitives> }[] = [
    {
        input: 1,
        async output(): Promise<1> {
            return 1;
        },
    },
    {
        input: {
            function: "faker:random.number",
            args: [10],
        },
        async output(): Promise<number> {
            return faker.random.number(10);
        },
    },
    {
        input: "custom:word",
        async output(): Promise<string> {
            return Helpers.word() as Promise<string>;
        },
    },
    {
        input: "resource:addresses[1].zipCode",
        async output(): Promise<string> {
            return resource.addresses[1].zipCode;
        },
    },
];

const InvalidEntries: any[] = [
    "custom:nonExistent",
    "custom:invalidHelper",
    "resource:invalidPath",
    "resource:addresses",
];

describe("BaseType type generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidEntries.forEach((entry, index) =>
            test(`Valid entry: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 + index * i);
                const got = await generateBaseType(
                    entry.input,
                    resource,
                    Helpers
                );
                faker.seed(123 + index * i);
                const expected = await entry.output();
                expect(got).toEqual(expected);
            })
        );

    test.each(InvalidEntries)(`Invalid entry: %#`, (entry) =>
        expect(
            generateBaseType(entry, resource, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
