import { CustomFunction } from "./custom";
import { Literal, isLiteral } from "./literals";

export interface SchemaHelpers {
    [key: string]: CustomFunction;
}

// Ultimately, a resource fields ends in Primitive type
// Ex: {age: 23}
// Ex: {address: [{zipCode: "370445"}, {zipCode: "121342"}], classes: [1,2,3,4,5]}
export type Primitives = Literal | Array<Primitives>;
export function isPrimitives(input: any): input is Primitives {
    if (Array.isArray(input)) return input.every((i) => isPrimitives(i));
    return isLiteral(input);
}
