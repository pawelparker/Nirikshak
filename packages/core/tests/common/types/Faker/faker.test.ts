/*
    Tests to check the faker types 
    isFakerObject assumes that isFakerString works correctly
*/
import { FakerString } from "../../../../src/common/types/fakerStrings";
import {
    isFakerString,
    isFakerType,
    FakerObject,
    isFakerObject,
} from "../../../../src/common/types/fakerTypes";

const ValidFakerStrings: FakerString[] = [
    "faker:address.zipCode",
    "faker:address.city",
    "faker:address.cityPrefix",
    "faker:address.citySuffix",
    "faker:address.streetName",
    "faker:address.streetAddress",
    "faker:address.streetSuffix",
    "faker:address.streetPrefix",
    "faker:address.secondaryAddress",
    "faker:address.county",
    "faker:address.country",
    "faker:address.countryCode",
    "faker:address.state",
    "faker:address.stateAbbr",
    "faker:address.latitude",
    "faker:address.longitude",
    "faker:commerce.color",
    "faker:commerce.department",
    "faker:commerce.productName",
    "faker:commerce.price",
    "faker:commerce.productAdjective",
    "faker:commerce.productMaterial",
    "faker:commerce.product",
    "faker:company.suffixes",
    "faker:company.companyName",
    "faker:company.companySuffix",
    "faker:company.catchPhrase",
    "faker:company.bs",
    "faker:company.catchPhraseAdjective",
    "faker:company.catchPhraseDescriptor",
    "faker:company.catchPhraseNoun",
    "faker:company.bsAdjective",
    "faker:company.bsBuzz",
    "faker:company.bsNoun",
    "faker:database.column",
    "faker:database.type",
    "faker:database.collation",
    "faker:database.engine",
    "faker:date.past",
    "faker:date.future",
    "faker:date.between",
    "faker:date.recent",
    "faker:date.month",
    "faker:date.weekday",
    "faker:finance.account",
    "faker:finance.accountName",
    "faker:finance.mask",
    "faker:finance.amount",
    "faker:finance.transactionType",
    "faker:finance.currencyCode",
    "faker:finance.currencyName",
    "faker:finance.currencySymbol",
    "faker:finance.bitcoinAddress",
    "faker:finance.iban",
    "faker:finance.bic",
    "faker:hacker.abbreviation",
    "faker:hacker.adjective",
    "faker:hacker.noun",
    "faker:hacker.verb",
    "faker:hacker.ingverb",
    "faker:hacker.phrase",
    "faker:image.image",
    "faker:image.avatar",
    "faker:image.imageUrl",
    "faker:image.abstract",
    "faker:image.animals",
    "faker:image.business",
    "faker:image.cats",
    "faker:image.city",
    "faker:image.food",
    "faker:image.nightlife",
    "faker:image.fashion",
    "faker:image.people",
    "faker:image.nature",
    "faker:image.sports",
    "faker:image.technics",
    "faker:image.transport",
    "faker:image.dataUri",
    "faker:internet.avatar",
    "faker:internet.email",
    "faker:internet.exampleEmail",
    "faker:internet.userName",
    "faker:internet.protocol",
    "faker:internet.url",
    "faker:internet.domainName",
    "faker:internet.domainSuffix",
    "faker:internet.domainWord",
    "faker:internet.ip",
    "faker:internet.ipv6",
    "faker:internet.userAgent",
    "faker:internet.color",
    "faker:internet.mac",
    "faker:internet.password",
    "faker:lorem.word",
    "faker:lorem.words",
    "faker:lorem.sentence",
    "faker:lorem.slug",
    "faker:lorem.sentences",
    "faker:lorem.paragraph",
    "faker:lorem.paragraphs",
    "faker:lorem.text",
    "faker:lorem.lines",
    "faker:name.firstName",
    "faker:name.lastName",
    "faker:name.findName",
    "faker:name.jobTitle",
    "faker:name.prefix",
    "faker:name.suffix",
    "faker:name.title",
    "faker:name.jobDescriptor",
    "faker:name.jobArea",
    "faker:name.jobType",
    "faker:phone.phoneNumber",
    "faker:phone.phoneNumberFormat",
    "faker:phone.phoneFormats",
    "faker:random.number",
    "faker:random.arrayElement",
    "faker:random.objectElement",
    "faker:random.uuid",
    "faker:random.boolean",
    "faker:random.word",
    "faker:random.words",
    "faker:random.image",
    "faker:random.locale",
    "faker:random.alphaNumeric",
    "faker:system.fileName",
    "faker:system.commonFileName",
    "faker:system.mimeType",
    "faker:system.commonFileType",
    "faker:system.commonFileExt",
    "faker:system.fileType",
    "faker:system.fileExt",
    "faker:system.semver",
];

const ValidFakerObjects: FakerObject[] = [
    { function: "faker:address.city" },
    { args: [], function: "faker:address.county" },
    { args: [true, false, null], function: "faker:commerce.department" },
    {
        args: [{ min: 1, max: 2, precision: 0.1 }, true, false, false],
        function: "faker:commerce.productAdjective",
    },
    { function: "faker:company.catchPhraseAdjective" },
];

const InvalidFakerStrings: any[] = [
    "custom:random.number",
    "custom Random string",
    "faker.random.number",
    "fker:random.number",
    "faker:random.name",
    { function: "faker:random.number" },
    { function: "faker:random.number", args: [1] },
];

const InvalidFakerObjects: any[] = [
    "faker:random.number",
    { fc: "faker:random.number" },
    { function: "faker:random.name" },
    { function: "faker:random.name", args: [true, false, null] },
    { fc: "faker:random.number", args: ["stringify"] },
    { function: "faker:random.number", args: false },
];

describe("Faker literals", () => {
    describe("Faker strings", () => {
        test.each(ValidFakerStrings)("Valid faker string: %#", (str) => {
            expect(isFakerString(str)).toBe(true);
            expect(isFakerObject(str)).toBe(false);
            expect(isFakerType(str)).toBe(true);
        });

        test.each(InvalidFakerStrings)("Invalid faker string: %#", (str) => {
            expect(isFakerString(str)).toBe(false);
            expect(isFakerType(str)).toBe(isFakerObject(str));
        });
    });

    describe("Faker objects", () => {
        test.each(ValidFakerObjects)("Valid faker object: %#", (obj) => {
            expect(isFakerObject(obj)).toBe(true);
            expect(isFakerString(obj)).toBe(false);
            expect(isFakerType(obj)).toBe(true);
        });

        test.each(InvalidFakerObjects)("Invalid faker object: %#", (obj) => {
            expect(isFakerObject(obj)).toBe(false);
            expect(isFakerType(obj)).toBe(isFakerString(obj));
        });
    });
});
