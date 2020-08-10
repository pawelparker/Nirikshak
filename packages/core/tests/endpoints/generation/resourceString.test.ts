import { ResourceInstance } from "../../../src/resource/types/helper";
import { ResourceString } from "../../../src/endpoints/types/resourceString";
import faker from "faker";
import { getFromResource } from "../../../src/endpoints/generation/resourceStringGen";

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

const ValidInputs: {
    input: ResourceString;
    output: () => ResourceInstance[string];
}[] = [
    {
        input: "resource:id",
        output(): string {
            return resource.id;
        },
    },
    {
        input: "resource:name.lastName",
        output(): string {
            return resource.name.lastName;
        },
    },
    {
        input: "resource:addresses[1].city",
        output(): string {
            return resource.addresses[1].city;
        },
    },
    {
        input: "resource:name",
        output(): typeof resource.name {
            return resource.name;
        },
    },
    {
        input: "resource:recursion.bases.args.plethora[3][0][2][0]",
        output(): number {
            return resource.recursion.bases.args.plethora[3][0][2][0];
        },
    },
];

const InvalidInputs: ResourceString[] = [
    "resource:age",
    "resource:addresses[4].city",
    "resource:recursion.age",
    "resource:recursion.bases.args.plethora[4][0][2][0]",
];

void ValidInputs;

describe("Getting data from resource string", () => {
    test.each(ValidInputs)(`Valid input: %#`, (entry) =>
        expect(getFromResource(entry.input, resource)).toEqual(entry.output())
    );

    test.each(InvalidInputs)(`Invalid input: %#`, (entry) =>
        expect(() =>
            getFromResource(entry, resource)
        ).toThrowErrorMatchingSnapshot()
    );
});
