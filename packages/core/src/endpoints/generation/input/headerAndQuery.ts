import { HeaderAndQuery } from "../../types/input";
import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers } from "../../../common/types/helpers";
import { HeadersInstance, generateHeaderMap } from "../helpers/headerMapGen";
import { QueryInstance, generateQuery } from "./queryGen";

export interface HeaderAndQueryInstance {
    headers?: HeadersInstance;
    query?: QueryInstance;
}

export async function generateHeaderAndQuery(
    input: HeaderAndQuery,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<HeaderAndQueryInstance> {
    const res: HeaderAndQueryInstance = {};

    let headers: Promise<HeadersInstance | null> = Promise.resolve(null),
        query: Promise<QueryInstance | null> = Promise.resolve(null);
    if ("headers" in input)
        headers = generateHeaderMap(input.headers!, resource, helpers);

    if ("query" in input)
        query = generateQuery(input.query!, resource, helpers);

    const [h, q] = await Promise.all([headers, query]);

    if (h !== null) res.headers = h as HeadersInstance;
    if (q !== null) res.query = q;
    return res;
}
