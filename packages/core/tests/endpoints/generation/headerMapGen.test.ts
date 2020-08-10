import faker from "faker";
import { SchemaHelpers } from "../../../src/common/types/helpers";
import { HeaderMap } from "../../../src/endpoints/types/helpers";
import {
    HeadersInstance,
    generateHeaderMap,
} from "../../../src/endpoints/generation/helpers/headerMapGen";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
import { Literal } from "../../../src/common/types/literals";
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

const ValidHeaders: {
    input: HeaderMap;
    output: () => Promise<HeadersInstance>;
}[] = [
    {
        input: {
            entry1: "1000",
            entry2: "resource:id",
            entry3: "resource:addresses[0].zipCode",
            words: "custom:word",
            number1: "faker:random.number",
        },
        async output(): Promise<HeadersInstance> {
            const headers: HeadersInstance = {};
            const promiseMap: Map<string, Promise<Literal>> = new Map();

            for (const key in this.input) {
                switch (key) {
                    case "entry1":
                        promiseMap.set(key, Promise.resolve("1000"));
                        break;
                    case "entry2":
                        promiseMap.set(key, Promise.resolve(resource.id));
                        break;
                    case "entry3":
                        promiseMap.set(
                            key,
                            Promise.resolve(resource.addresses[0].zipCode)
                        );
                        break;
                    case "words":
                        promiseMap.set(key, Helpers.word());
                        break;
                    case "number1":
                        promiseMap.set(
                            key,
                            Promise.resolve(faker.random.number())
                        );
                        break;
                }
            }

            for (const key in this.input)
                headers[key] = (await promiseMap.get(key)) as Exclude<
                    Literal,
                    null
                >;

            return headers;
        },
    },
];

const InvalidHeaders: any[] = [
    { entry1: null },
    { entry2: "resource:addresses" },
    { entry4: "custom:nonExistent" },
    { entry5: "resource:lorem.ipsum" },
    { entry6: "custom:invalidHelper" },
];

describe("Header map generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidHeaders.forEach((entry, index) => {
            test(`Valid header entry: ${index}, iteration: ${i}`, async () => {
                faker.seed(123 * i + index);
                const got = await generateHeaderMap(
                    entry.input,
                    resource,
                    Helpers
                );
                faker.seed(123 * i + index);
                const expected = await entry.output();
                expect(got).toEqual(expected);
            });
        });

    test.each(InvalidHeaders)(`Invalid header entry: %#`, (entry) =>
        expect(
            generateHeaderMap(entry, resource, Helpers)
        ).rejects.toMatchSnapshot()
    );
});
