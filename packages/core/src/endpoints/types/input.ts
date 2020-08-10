import {
    HeaderMap,
    BodyType,
    isHeaderMap,
    isBodyType,
    BaseType,
    isBaseType,
} from "./helpers";

export interface Query {
    [key: string]: Exclude<BaseType, null> | Exclude<BaseType, null>[];
}

function isExcludeBaseTypeNull(input: any): input is Exclude<BaseType, null> {
    return input !== null && isBaseType(input);
}

export function isQuery(input: any): input is Query {
    if (!input || typeof input !== "object") return false;
    return Object.values(input).every((value) =>
        Array.isArray(value)
            ? value.every((v) => isExcludeBaseTypeNull(v))
            : isExcludeBaseTypeNull(value)
    );
}

export interface HeaderAndQuery {
    headers?: HeaderMap;
    query?: Query;
}

export function isHeaderAndQuery(input: any): input is HeaderAndQuery {
    if (!input || typeof input !== "object") return false;

    let value = true;

    value =
        value && ("headers" in input ? isHeaderMap(input["headers"]) : true);
    value = value && ("query" in input ? isQuery(input["query"]) : true);
    return value;
}

export type InputSemantics = {
    semantics: HeaderAndQuery;
};

export type InputBodies = {
    body: BodyType;
    destructiveBody?: BodyType;
};

export interface Inputs {
    GET: InputSemantics;
    DELETE: InputSemantics;
    POST: InputSemantics & InputBodies;
    PUT: InputSemantics & InputBodies;
    PATCH: InputSemantics & InputBodies;
}

export const inputValidationFunctions: {
    [key in keyof Inputs]: (i: any) => i is Inputs[key];
} = {
    GET: (input: any): input is Inputs["GET"] => {
        if (!input || typeof input !== "object") return false;
        return isHeaderAndQuery(input.semantics);
    },
    DELETE: (input: any): input is Inputs["DELETE"] => {
        if (!input || typeof input !== "object") return false;
        return isHeaderAndQuery(input.semantics);
    },
    POST: (input: any): input is Inputs["POST"] => {
        if (!input || typeof input !== "object") return false;
        if ("destructiveBody" in input && !isBodyType(input.destructiveBody))
            return false;
        return isBodyType(input.body) && isHeaderAndQuery(input.semantics);
    },
    PUT: (input: any): input is Inputs["PUT"] => {
        if (!input || typeof input !== "object") return false;
        if ("destructiveBody" in input && !isBodyType(input.destructiveBody))
            return false;
        return isBodyType(input.body) && isHeaderAndQuery(input.semantics);
    },
    PATCH: (input: any): input is Inputs["PATCH"] => {
        if (!input || typeof input !== "object") return false;
        if ("destructiveBody" in input && !isBodyType(input.destructiveBody))
            return false;
        return isBodyType(input.body) && isHeaderAndQuery(input.semantics);
    },
};
