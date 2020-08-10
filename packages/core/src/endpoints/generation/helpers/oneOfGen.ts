import faker from "faker";
import {
    Base,
    BodyType,
    WithModifiers,
    OneOfEntries,
} from "../../types/helpers";

// Return type with discriminated union
export type SelectedType<T extends Base | BodyType> = {
    type: T extends Base ? "base" : "body type";
    selection: T extends Base
        ? Base | WithModifiers<Base>
        : BodyType | WithModifiers<BodyType>;
};

// Function simply selects one of the types / fields
// and returns
export function generateOneOfEntries(
    input: OneOfEntries
): SelectedType<Base> | SelectedType<BodyType> {
    // Use faker.random.number instead of Math.random
    // So that randomness seed works

    // From the given selections, select an entry

    // If only types exists
    // Or we randomly choose type from choice b/w types and fields
    if (!("fields" in input))
        // Only type in the input
        return {
            type: "base",
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
            type: "body type",
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
              type: "body type",
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
              type: "base",
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
