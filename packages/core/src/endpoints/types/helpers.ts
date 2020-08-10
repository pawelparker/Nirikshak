import { ResourceString, isResourceString } from "./resourceString";
import { FakerType, isFakerType } from "../../common/types/fakerTypes";
import {
    CustomFunctionType,
    isCustomFunction,
} from "../../common/types/custom";
import { Literal, isLiteral } from "../../common/types/literals";
import { Primitives } from "../../common/types/helpers";

export type MethodType = "DELETE" | "GET" | "PUT" | "POST" | "PATCH";
export function isMethodType(key: any): key is MethodType {
    if (typeof key !== "string") return false;

    switch (key) {
        case "DELETE":
        case "GET":
        case "PUT":
        case "POST":
        case "PATCH":
            return true;
        default:
            return false;
    }
}

export type Cases = "NEGATIVE" | "POSITIVE" | "DESTRUCTIVE";

export function isCaseType(key: any): key is Cases {
    if (typeof key !== "string") return false;
    switch (key) {
        case "NEGATIVE":
        case "POSITIVE":
        case "DESTRUCTIVE":
            return true;
        default:
            return false;
    }
}

export type BaseType =
    | FakerType
    | CustomFunctionType
    | ResourceString
    | Literal;

export function isBaseType(input: any): input is BaseType {
    return (
        isFakerType(input) ||
        isCustomFunction(input) ||
        isResourceString(input) ||
        isLiteral(input)
    );
}

export type Base = BaseType | Base[];

export function isBase(input: any): input is Base {
    if (Array.isArray(input)) return input.every((value) => isBase(value));
    return isBaseType(input);
}

export type WithModifiers<T extends Base | BodyType> = (T extends Base
    ? { type: Base }
    : { field: BodyType }) & {
    plural?: boolean;
    nullable?: boolean;
    optional?: boolean;
};

// Checking the validity of the modifier fields of the HOT
function checkModifiers(input: WithModifiers<Base | BodyType>): boolean {
    let value = true;
    void (
        "nullable" in input &&
        (value = value && typeof input["nullable"] === "boolean")
    );
    void (
        "optional" in input &&
        (value = value && typeof input["optional"] === "boolean")
    );
    void (
        "plural" in input &&
        (value = value && typeof input["plural"] === "boolean")
    );

    return value;
}

// type guard: WithModifiers<ResourceBase>
export function isWithModifiersBodyType(
    input: any
): input is WithModifiers<BodyType> {
    if (!input || typeof input != "object") return false;

    if (!checkModifiers(input)) return false;

    if ("field" in input) {
        return isBodyType(input["field"]);
    }
    return false;
}

// type guard: WithModifies<BaseType>
export function isWithModifiersBase(input: any): input is WithModifiers<Base> {
    if (!input || typeof input != "object") return false;

    if (!checkModifiers(input)) return false;

    if ("type" in input) {
        return isBase(input["type"]);
    }
    return false;
}

// type guard: WithModifiers<BaseType> or WithModifiers<ResourceBase>
// Infers from input
export function isWithModifiers(
    input: any
): input is WithModifiers<Base | BodyType> {
    return isWithModifiersBase(input) || isWithModifiersBodyType(input);
}

export type OneOfEntries =
    | { fields: (BodyType | WithModifiers<BodyType>)[] }
    | { types: (Base | WithModifiers<Base>)[] }
    | {
          fields: (BodyType | WithModifiers<BodyType>)[];
          types: (Base | WithModifiers<Base>)[];
      };

// type guard: OneOfEntries
export function isOneOfEntries(input: any): input is OneOfEntries {
    if (!input || typeof input !== "object") return false;
    if (!Array.isArray(input["fields"]) && !Array.isArray(input["types"]))
        return false;

    if (Array.isArray(input["fields"]) && !input["fields"].length) return false;
    if (Array.isArray(input["types"]) && !input["types"].length) return false;

    let value = true;
    value =
        value &&
        (Array.isArray(input["types"])
            ? input["types"].every(
                  (entry) => isBase(entry) || isWithModifiersBase(entry)
              )
            : true);

    value =
        value &&
        (Array.isArray(input["fields"])
            ? input["fields"].every(
                  (entry) => isBodyType(entry) || isWithModifiersBodyType(entry)
              )
            : true);

    return value;
}

export interface BodyType {
    [key: string]:
        | ResourceString
        | Exclude<Base, ResourceString>
        | WithModifiers<Base>
        | WithModifiers<BodyType>
        | OneOfEntries
        | BodyType;
}

export interface BodyInstance {
    [key: string]: Primitives | BodyInstance | BodyInstance[];
}

export function isBodyType(input: any): input is BodyType {
    if (!input || typeof input !== "object" || Array.isArray(input))
        return false;

    return Object.values(input).every(
        (entry) =>
            isResourceString(entry) ||
            isBase(entry) ||
            isWithModifiers(entry) ||
            isOneOfEntries(entry) ||
            isBodyType(entry)
    );
}

export interface HeaderMap {
    [key: string]: Exclude<BaseType, null>;
}

export function isHeaderMap(input: any): input is HeaderMap {
    if (!input || typeof input !== "object" || Array.isArray(input))
        return false;

    return Object.values(input).every(
        (value) => value !== null && isBaseType(value)
    );
}
