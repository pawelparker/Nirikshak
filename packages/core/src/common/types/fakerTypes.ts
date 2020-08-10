import _ from "lodash";
import faker from "faker";
import { FakerString } from "./fakerStrings";

// Type guard: Faker string
export function isFakerString(input: any): input is FakerString {
    if (typeof input !== "string") return false;

    const i = input.indexOf("faker:");
    if (i != 0) return false;

    return _.get(faker, input.slice(6)) instanceof Function;
}

// Faker object type
export type FakerObject = {
    function: FakerString;
    args?: any[];
};

// type guard: Faker object
export function isFakerObject(input: any): input is FakerObject {
    if (!input || typeof input !== "object") return false;

    if ("function" in input && isFakerString(input["function"])) {
        if ("args" in input) {
            return Array.isArray(input["args"]);
        }
        return true;
    }

    return false;
}

// The faker literal can be either of both
export type FakerType = FakerString | FakerObject;

// Type guard: faker type
export function isFakerType(input: any): input is FakerType {
    return isFakerString(input) || isFakerObject(input);
}

// A standard format to rep faker types
// Same as faker object, but optional fields are made compulsory
export type NormalizedFaker = {
    [K in keyof FakerObject]-?: FakerObject[K];
};

// Function to normalize faker literal
export function normalizeFaker(input: FakerType): NormalizedFaker {
    if (isFakerObject(input)) return { args: [], ...input };
    return {
        function: input,
        args: [],
    };
}
