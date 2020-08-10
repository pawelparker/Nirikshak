import { HeaderAndStatus } from "../types/output";
import { ResourceInstance } from "../../resource/types/helper";
import { SchemaHelpers } from "../../common/types/helpers";
import { matchBaseType } from "./bodyValidation";
import { HeaderMap } from "../types/helpers";

export async function headersValidation(
    input: any,
    headers: HeaderMap[],
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<boolean> {
    if (!input || typeof input !== "object") return false;

    return (
        !headers.length ||
        (
            await Promise.all(
                headers.map(async (header) =>
                    (
                        await Promise.all(
                            Object.keys(header).map((key) =>
                                matchBaseType(
                                    input[key],
                                    header[key],
                                    resource,
                                    helpers
                                )
                            )
                        )
                    ).every((val) => val)
                )
            )
        ).some((val) => val)
    );
}

export function statusValidation(input: any, expected: number[]): boolean {
    return !expected.length || expected.some((entry) => entry === input);
}

export function extractStatusFromSemantics(
    entry: { semantics: HeaderAndStatus }[]
): number[] {
    return entry.map((e) => e.semantics.status);
}

export function extractHeadersFromSemantics(
    entry: { semantics: HeaderAndStatus }[]
): HeaderMap[] {
    const o: HeaderMap[] = [];
    entry.forEach(
        (e) => "headers" in e.semantics && o.push(e.semantics.headers!)
    );
    return o;
}
