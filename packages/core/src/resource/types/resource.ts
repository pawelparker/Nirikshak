import {
    isBaseType,
    isWithModifiersBaseType,
    isWithModifiersResource,
    isOneOfEntries,
    BaseType,
    WithModifiers,
    OneOfEntries,
} from "./helper";

// type guard: ResourceBase
export function isResourceBase(input: any): input is ResourceBase {
    if (!input || typeof input != "object" || Array.isArray(input))
        return false;
    return Object.keys(input).every(
        (key) =>
            isBaseType(input[key]) ||
            isWithModifiersBaseType(input[key]) ||
            isWithModifiersResource(input[key]) ||
            isOneOfEntries(input[key]) ||
            isResourceBase(input[key])
    );
}

// A basic key value pair
export interface ResourceBase {
    [key: string]:
        | BaseType
        | WithModifiers<BaseType>
        | WithModifiers<ResourceBase>
        | OneOfEntries
        // Check for resource base at last as it matches any key
        | ResourceBase;
}

// A resource schema is a resource base along with an identifier field
export interface Resource extends ResourceBase {
    id: Exclude<BaseType, Array<any> | null | boolean>;
}

// type guard: isResource
export function isResource(input: any): input is Resource {
    if (!input || typeof input !== "object") return false;

    return (
        !Array.isArray(input["id"]) &&
        isBaseType(input.id) &&
        isResourceBase(input)
    );
}
