import faker from "faker";
import { URLString } from "../../../src/endpoints/types/urlString";
import { generateURL } from "../../../src/endpoints/generation/urlStringGen";
import { SchemaHelpers } from "../../../src/common/types/helpers";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";

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

const ValidCases: {
    input: URLString;
    output: () => Promise<string>;
}[] = [
    {
        input: "home/classrooms/places",
        output: async (): Promise<string> => "/home/classrooms/places",
    },
    {
        input: "/resource/{faker:random.word}",
        output: async (): Promise<string> => "/resource/" + faker.random.word(),
    },
    {
        input: "/resource/{faker:random.word}/words/{custom:word}",
        output: async (): Promise<string> =>
            `/resource/${faker.random.word()}/words/${await Helpers.word()}`,
    },
    {
        input:
            "/resource/{resource:name.firstName}/words/{resource:name.lastName}",
        output: async (): Promise<string> =>
            `/resource/${resource.name.firstName}/words/${resource.name.lastName}`,
    },
    {
        input: `{resource:id}/numbers/{faker:random.number}/words/{custom:word}/zipCode/{resource:addresses[0].zipCode}/number/{resource:recursion.bases.args.plethora[3][0][2][0]}`,
        output: async (): Promise<string> =>
            `/${
                resource.id
            }/numbers/${faker.random.number()}/words/${await Helpers.word()}/zipCode/${
                resource.addresses[0].zipCode
            }/number/${resource.recursion.bases.args.plethora[3][0][2][0]}`,
    },
];

const InvalidInputs: string[] = [
    "resource/{resouce:lorem.ipsum}",
    "resource/{custom:lithium}",
    "resource/{custom:invalidHelper}",
    "resource/{resource:recursion.bases.args.plethora[3][0][2]}",
];

describe("URL strings", () => {
    
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
    ValidCases.forEach((entry, index) =>
        test(`Valid entry: ${index}, iteration: ${i}`, async () => {
            faker.seed(123 + index * i);
            const a = await generateURL(entry.input, resource, Helpers);
            faker.seed(123 + index * i);
            const b = await entry.output();
            expect(a).toEqual(b);
        })
    );

    test.each(InvalidInputs)(`Invalid entry: %#`, (entry) =>
        expect(generateURL(entry, resource, Helpers)).rejects.toMatchSnapshot()
    );
});
