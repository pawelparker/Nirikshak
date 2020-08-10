/* 
    Tests to validate faker data generation validation
*/
import { FakerType } from "../../../src/common/types/fakerTypes";
import faker from "faker";
import { generateFaker } from "../../../src/common/generation/fakerGen";
import { Literal } from "../../../src/common/types/literals";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
const ValidFakers: { input: FakerType; output: () => Literal }[] = [
    {
        output: (): string => faker.address.zipCode('"#####-###"'),
        input: { function: "faker:address.zipCode", args: ['"#####-###"'] },
    },
    {
        output: (): string => faker.address.citySuffix(),
        input: "faker:address.citySuffix",
    },
    {
        output: (): string => faker.address.streetName(),
        input: "faker:address.streetName",
    },
    {
        output: (): string => faker.address.streetAddress(),
        input: "faker:address.streetAddress",
    },
    {
        output: (): string => faker.address.streetPrefix(),
        input: "faker:address.streetPrefix",
    },
    {
        output: (): string => faker.address.county(),
        input: "faker:address.county",
    },
    {
        output: (): string => faker.address.countryCode(),
        input: "faker:address.countryCode",
    },
    {
        output: (): string => faker.address.state(true),
        input: { function: "faker:address.state", args: [true] },
    },
    {
        output: (): string => faker.commerce.productAdjective(),
        input: "faker:commerce.productAdjective",
    },
    {
        output: (): string => faker.commerce.product(),
        input: "faker:commerce.product",
    },
    {
        output: (): string => faker.company.bs(),
        input: { function: "faker:company.bs", args: [] },
    },
    {
        output: (): string => faker.company.catchPhraseAdjective(),
        input: {
            function: "faker:company.catchPhraseAdjective",
            args: [null, null, null],
        },
    },
    {
        output: (): string => faker.company.catchPhraseDescriptor(),
        input: "faker:company.catchPhraseDescriptor",
    },
    {
        output: (): string => faker.company.bsNoun(),
        input: "faker:company.bsNoun",
    },
    {
        output: (): string => faker.database.collation(),
        input: "faker:database.collation",
    },
    {
        output: (): string => faker.finance.account(8),
        input: { function: "faker:finance.account", args: [8] },
    },
    { output: (): string => faker.hacker.verb(), input: "faker:hacker.verb" },
    { output: (): string => faker.image.image(), input: "faker:image.image" },
    { output: (): string => faker.image.avatar(), input: "faker:image.avatar" },
    {
        output: (): string => faker.image.cats(200, 200),
        input: { function: "faker:image.cats", args: [200, 200] },
    },
    {
        output: (): string => faker.internet.userName("FirstName", "LastName"),
        input: {
            function: "faker:internet.userName",
            args: ["FirstName", "LastName"],
        },
    },
    { output: (): string => faker.internet.url(), input: "faker:internet.url" },
    {
        output: (): string => faker.lorem.words(3),
        input: { function: "faker:lorem.words", args: [3] },
    },
    {
        output: (): string => faker.lorem.sentence(),
        input: "faker:lorem.sentence",
    },
    {
        output: (): string => faker.lorem.slug(4),
        input: { function: "faker:lorem.slug", args: [4] },
    },
    {
        output: (): string => faker.lorem.paragraph(),
        input: "faker:lorem.paragraph",
    },
    {
        output: (): string => faker.name.firstName(),
        input: "faker:name.firstName",
    },
    {
        output: (): string => faker.name.lastName(),
        input: "faker:name.lastName",
    },
    {
        output: (): number =>
            faker.random.number({ min: 0, max: 1, precision: 0.1 }),
        input: {
            function: "faker:random.number",
            args: [{ min: 0, max: 1, precision: 0.1 }],
        },
    },
    { output: (): string => faker.random.words(), input: "faker:random.words" },
    {
        output: (): string => faker.system.semver(),
        input: "faker:system.semver",
    },
];

describe("Faker literal generation", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        ValidFakers.forEach((entry, index) =>
            test(`Valid faker: ${index}, iteration: ${i}`, () => {
                // Setting randomness seed
                // Does not work with random.uuid and Date.*
                // So avoid them during testing

                faker.seed(index + 100 * i);
                const input = generateFaker(entry.input);
                faker.seed(index + 100 * i);
                const output = entry.output();
                expect(input).toEqual(output);
            })
        );
});
