import { Literal } from "../../../common/types/literals";
import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers } from "../../../common/types/helpers";
import { generateBaseType } from "../helpers/baseTypeGen";
import { Query } from "../../types/input";

export interface QueryInstance {
    [key: string]: Exclude<Literal, null> | Exclude<Literal, null>[];
}

export async function generateQuery(
    input: Query,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<QueryInstance> {
    const promiseMap: Map<string, Promise<Literal | Literal[]>> = new Map();

    for (const key in input) {
        const entry = input[key];

        if (Array.isArray(entry)) {
            promiseMap.set(
                key,
                Promise.all(
                    entry.map((e) => generateBaseType(e, resource, helpers))
                )
            );
        } else {
            promiseMap.set(key, generateBaseType(entry, resource, helpers));
        }
    }

    const queries: QueryInstance = {};
    for (const key in input) {
        const res = await promiseMap.get(key)!;

        if (Array.isArray(res) && res.some((entry) => entry === null))
            throw new Error(
                `query: ${key}:${input[key]} resolved to an array containing a null value`
            );
        else if (res === null)
            throw new Error(`query: ${key}:${input[key]} resolved to null`);

        queries[key] = res as Exclude<Literal, null> | Exclude<Literal, null>[];
    }

    return queries;
}
