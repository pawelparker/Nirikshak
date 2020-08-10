import faker from "faker";
import { BodyType, WithModifiers } from "../../../../src/endpoints/types/helpers";
import { ValidModifiers } from "../../utils";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";
import { generateWithModifiers } from "../../../../src/endpoints/generation/helpers/withModifiersGen";
import { SchemaHelpers } from "../../../../src/common/types/helpers";

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

const ValidBodyType: BodyType = {
    ages: "custom:word",
    city: {
        field: {
            zipCode: "faker:random.zipCode",
            city: "faker:random.city",
        },
        plural: true,
        nullable: true,
        optional: true,
    },
    names: {
        fields: [
            { a: true },
            { b: false },
            {
                c: {
                    types: [1, 2, 3, 4, 5],
                    fields: [
                        {
                            addresses: {
                                type: "faker:random.address",
                                nullable: true,
                                plural: true,
                                optional: true,
                            },
                        },
                    ],
                },
            },
        ],
    },
};

const InvalidBodyTypes: any[] = [
    { entry: "resource:addresses" },
    { entry: "resource:lorem.ipsum" },
    { entry: "custom:lorem.ipsum" },
    { entry: "custom:invalidHelper" },
];

const ValidWithModifiers: WithModifiers<
    BodyType
>[] = ValidModifiers.map((modifier) =>
    Object.assign({}, modifier, { field: ValidBodyType })
);

const InvalidWithModifiers: any[] = [];
ValidModifiers.forEach((modifier) =>
    InvalidBodyTypes.forEach((bodyType) =>
        Object.assign({}, modifier, { field: bodyType })
    )
);

describe(`Body type generation with modifiers`, () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidWithModifiers.forEach((entry, index) =>
            test(`Valid entry: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 * i + index);
                const got = await generateWithModifiers(
                    entry,
                    resource,
                    Helpers
                );
                expect(got).toMatchSnapshot();
            })
        );
    InvalidWithModifiers.forEach((entry, index) =>
        test(`Invalid entry: ${index}`, () =>
            expect(
                generateWithModifiers(entry, resource, Helpers)
            ).rejects.toMatchSnapshot())
    );
});
