import { FakerType, normalizeFaker } from "../types/fakerTypes";
import faker from "faker";
import _ from "lodash";
import { Literal } from "../types/literals";

// Function to generate faker literals
// Should not throw any error for valid faker types
export function generateFaker(input: FakerType): Literal {
    const object = normalizeFaker(input);

    const functionName = object.function.slice(6);
    return _.get(faker, functionName)(...object.args);
}
