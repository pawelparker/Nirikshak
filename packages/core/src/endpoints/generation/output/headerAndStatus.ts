import { HeaderAndStatus } from "../../types/output";
import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers } from "../../../common/types/helpers";
import { HeadersInstance, generateHeaderMap } from "../helpers/headerMapGen";

export interface HeaderAndStatusInstance {
    status: number;
    headers?: HeadersInstance;
}

export async function generateHeaderAndStatus(
    input: HeaderAndStatus,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<HeaderAndStatusInstance> {
    const r: HeaderAndStatusInstance = {
        status: input.status,
    };

    if ("headers" in input) {
        r.headers = await generateHeaderMap(input.headers!, resource, helpers);
    }

    return r;
}
