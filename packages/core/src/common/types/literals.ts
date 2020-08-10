/* Literals that can be provided to describe the resource */

// Basic literal type
// Ex: 1, false, null, "myString"
export type Literal = string | number | null | boolean;

// type guard: Literal
export function isLiteral(input: any): input is Literal {
    const c = typeof input;
    switch (c) {
        case "number":
        case "string":
        case "boolean":
            return true;
        default:
            return input === null;
    }
}
