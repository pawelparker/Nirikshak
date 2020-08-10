import faker from "faker";
import { BaseType, WithModifiers, OneOfEntries } from "../types/helper";
import { ResourceBase } from "../types/resource";

// Return type with discriminated union
export type SelectedType<T extends BaseType | ResourceBase> = {
    type: T extends BaseType ? "base type" : "resource base";
    selection: T extends BaseType
        ? BaseType | WithModifiers<BaseType>
        : ResourceBase | WithModifiers<ResourceBase>;
};

// Function simply selects one of the types / fields
// and returns
export function generateOneOfEntries(
    input: OneOfEntries
): SelectedType<BaseType> | SelectedType<ResourceBase> {
    // Use faker.random.number instead of Math.random
    // So that randomness seed works

    // From the given selections, select an entry

    // If only types exists
    // Or we randomly choose type from choice b/w types and fields
    if (!("fields" in input))
        // Only type in the input
        return {
            type: "base type",
            selection:
                input.types[
                    faker.random.number({
                        min: 0,
                        max: input.types.length - 1,
                        precision: 1,
                    })
                ],
        };

    // If only fields exists
    if (!("types" in input))
        return {
            type: "resource base",
            selection:
                input.fields[
                    faker.random.number({
                        min: 0,
                        max: input.fields.length - 1,
                        precision: 1,
                    })
                ],
        };

    // Select either type or field
    return faker.random.boolean()
        ? {
              type: "resource base",
              selection:
                  input.fields[
                      faker.random.number({
                          min: 0,
                          max: input.fields.length - 1,
                          precision: 1,
                      })
                  ],
          }
        : {
              type: "base type",
              selection:
                  input.types[
                      faker.random.number({
                          min: 0,
                          max: input.types.length - 1,
                          precision: 1,
                      })
                  ],
          };
}
