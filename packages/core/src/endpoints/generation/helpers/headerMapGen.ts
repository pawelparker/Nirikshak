import { HeaderMap } from "../../types/helpers";
import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers } from "../../../common/types/helpers";
import { Literal } from "../../../common/types/literals";
import { generateBaseType } from "./baseTypeGen";

export interface HeadersInstance {
    [key: string]: Exclude<Literal, null>;
}

export async function generateHeaderMap(
    input: HeaderMap,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<HeadersInstance> {
    const headers: HeadersInstance = {};
    const promiseMap: Map<string, Promise<Literal>> = new Map();

    for (const key in input) {
        promiseMap.set(key, generateBaseType(input[key], resource, helpers));
    }

    for (const key in input) {
        const resolved = await promiseMap.get(key)!;
        if (resolved === null)
            throw new Error(
                `Header: ${key} = ${input[key]} resolved to null value`
            );
        else headers[key] = resolved;
    }

    return headers;
}
