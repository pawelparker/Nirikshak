// Structuring similar to faker types
// Custom function string is path to a helper function kept in the working directory

import { Literal } from "./literals";

// Custom function string, starts with custom:
// Ex: custom:random.name
export type CustomFunctionString = string;

// Object format of the custom function
// Ex: {function: "custom:random.name"}
export type CustomFunctionObject = {
    function: CustomFunctionString;
    args?: any[];
};

// A custom function that user provides
// User needs to guarantee the validity at runtime
export interface CustomFunction {
    // Primitive is simply a literal or an array of nested arrays of literals
    // Ex: 1, [1,7], [false, [true, [7,8,false, [null]]]]
    (...args: any[]): Promise<Literal>;
}
// Custom type
export type CustomFunctionType = CustomFunctionString | CustomFunctionObject;

// type guard: CustomFunctionString
export function isCustomFunctionString(
    input: any
): input is CustomFunctionString {
    if (typeof input !== "string") return false;

    return input.startsWith("custom:");
}

// type guard: CustomFunctinObject
export function isCustomFunctionObject(
    input: any
): input is CustomFunctionObject {
    if (!input || typeof input !== "object") return false;

    return (
        "function" in input &&
        isCustomFunctionString(input["function"]) &&
        ("args" in input ? Array.isArray(input["args"]) : true)
    );
}

// type guard: CustomFunction
export function isCustomFunction(input: any): input is CustomFunctionType {
    return isCustomFunctionString(input) || isCustomFunctionObject(input);
}

// Normalized form of custom functions
// Same as CustomFunctionObject but optional fields made compulsort
// Ex: {function : "custom:random.name", args: []}
export type NormalizedCustomFunction = {
    [K in keyof CustomFunctionObject]-?: CustomFunctionObject[K];
};

// Function to normalize custom functions
export function normalizeCustomFunction(
    input: CustomFunctionType
): NormalizedCustomFunction {
    if (isCustomFunctionObject(input)) return { args: [], ...input };
    return {
        function: input,
        args: [],
    };
}
