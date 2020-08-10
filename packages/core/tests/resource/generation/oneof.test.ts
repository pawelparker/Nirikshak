import { OneOfEntries } from "../../../src/resource/types/helper";
import faker from "faker";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
import {
    generateOneOfEntries,
    SelectedType,
} from "../../../src/resource/generation/oneOfEntries";
import { BaseType } from "../../../src/endpoints/types/helpers";
import { ResourceBase } from "../../../src/resource/types/resource";

const entries: {
    input: OneOfEntries;
    output: () => SelectedType<BaseType | ResourceBase>;
}[] = [
    {
        input: {
            types: [
                1,
                2,
                3,
                ["stringify", 19, 30, 19.542],
                "faker:random.number",
                [[[[["custom.username"]]]]],
            ],
        },
        output: function (this: {
            input: { types: BaseType[] };
        }): SelectedType<BaseType> {
            return {
                type: "base type",
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
                { branch: "CSE" },
                {
                    age: 12,
                    name: 14,
                    address: {
                        types: [
                            12.4353,
                            "faker:random.number",
                            { type: true, nullable: true },
                            [12, 13, 14, null, false, "myString"],
                        ],
                    },
                },
            ],
        },
        output: function (this: {
            input: { fields: ResourceBase[] };
        }): SelectedType<ResourceBase> {
            return {
                type: "resource base",
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
                    age: {
                        type: {
                            function: "faker:random.number",
                            args: [{ min: 1, max: 100, precision: 0.1 }],
                        },
                        nullable: true,
                    },
                },
            ],
            types: [12, 14, true, true, false, ["SIMP"]],
        },
        output: function (this: {
            input: {
                fields: ResourceBase[];
                types: BaseType[];
            };
        }): SelectedType<BaseType | ResourceBase> {
            return faker.random.boolean()
                ? {
                      type: "resource base",
                      selection: this.input.fields[
                          faker.random.number({
                              min: 0,
                              max: this.input.fields.length - 1,
                              precision: 1,
                          })
                      ],
                  }
                : {
                      type: "base type",
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
