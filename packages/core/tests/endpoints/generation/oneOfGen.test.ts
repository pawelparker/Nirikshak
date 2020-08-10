import {
    OneOfEntries,
    BodyType,
    Base,
} from "../../../src/endpoints/types/helpers";
import {
    SelectedType,
    generateOneOfEntries,
} from "../../../src/endpoints/generation/helpers/oneOfGen";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
import faker from "faker";

const entries: {
    input: OneOfEntries;
    output: () => SelectedType<Base | BodyType>;
}[] = [
    {
        input: {
            types: [
                1,
                2,
                3,
                "resouce:id",
                "resource:addresses[0].city[0].zipCodes[4].code",
                ["stringify", 19, 30, 19.542],
                "faker:random.number",
                [[[[["custom.username"]]]]],
            ],
        },
        output: function (this: {
            input: { types: Base[] };
        }): SelectedType<Base> {
            return {
                type: "base",
                selection: this.input.types[
                    faker.random.number({
                        min: 0,
                        max: this.input.types.length - 1,
                        precision: 1,
                    })
                ],
            };
        },
    },
    {
        input: {
            fields: [
                {
                    branch: "CSE",
                    classes: "resource:classes.count",
                    absurdity: "plain",
                },
                {
                    age: 12,
                    name: 14,
                    address: {
                        types: [
                            12.4353,
                            "custom:word",
                            "faker:random.number",
                            { type: true, nullable: true },
                            [12, 13, 14, null, false, "myString"],
                        ],
                    },
                },
            ],
        },
        output: function (this: {
            input: { fields: BodyType[] };
        }): SelectedType<BodyType> {
            return {
                type: "body type",
                selection: this.input.fields[
                    faker.random.number({
                        min: 0,
                        max: this.input.fields.length - 1,
                        precision: 1,
                    })
                ],
            };
        },
    },
    {
        input: {
            fields: [
                { name: "Name", surName: "Surname" },
                {
                    purple: "resource:purple",
                    age: {
                        type: {
                            function: "faker:random.number",
                            args: [{ min: 1, max: 100, precision: 0.1 }],
                        },
                        nullable: true,
                    },
                },
            ],
            types: [12, 14, true, true, "custom:sample", false, ["SIMP"]],
        },
        output: function (this: {
            input: {
                fields: Base[];
                types: BodyType[];
            };
        }): SelectedType<Base | BodyType> {
            return faker.random.boolean()
                ? {
                      type: "body type",
                      selection: this.input.fields[
                          faker.random.number({
                              min: 0,
                              max: this.input.fields.length - 1,
                              precision: 1,
                          })
                      ],
                  }
                : {
                      type: "base",
                      selection: this.input.types[
                          faker.random.number({
                              min: 0,
                              max: this.input.types.length - 1,
                              precision: 1,
                          })
                      ],
                  };
        },
    },
];

describe("Oneof tests", () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++)
        entries.forEach((entry, index) =>
            test(`Entry ${index}, iteration: ${i}`, () => {
                faker.seed(index + i * 123);
                const o = generateOneOfEntries(entry.input);
                faker.seed(index + i * 123);
                const expected = entry.output();
                expect(o).toEqual(expected);
            })
        );
});
