import { ParsedAssertion } from "../assertions";
import { Cases, MethodType } from "@nirikshak/core";

// All distance b/w: 0-1
const HammingMap: Map<string, Map<string, number>> = new Map();

function insertToMap(
    map: Map<string, Map<string, number>>,
    s1: string,
    s2: string,
    value: number
): void {
    map.has(s1)
        ? map.get(s1)!.set(s2, value)
        : map.set(s1, new Map([[s2, value]]));
    map.has(s2)
        ? map.get(s2)!.set(s1, value)
        : map.set(s2, new Map([[s1, value]]));
}

export function hamming(s1: string, s2: string): number {
    const max = Math.max(s1.length, s2.length);
    s1 = s1.padEnd(max);
    s2 = s2.padEnd(max);
    const mapEntry = HammingMap.get(s1)?.get(s2);
    if (mapEntry !== undefined) return mapEntry;

    let res = 0;
    for (let i = 0; i < max; i++) if (s1[i] !== s2[i]) res++;

    const value = res / max;
    insertToMap(HammingMap, s1, s2, value);
    return value;
}

export function methodDistance(
    aMethod: MethodType,
    aIndex: number,
    bMethod: MethodType,
    bIndex: number
): number {
    let distance = 0;
    // Method has 80% weightage
    aMethod !== bMethod && (distance += 0.8);
    // Exact entry has 20% weightage
    aIndex !== bIndex && (distance += 0.2);
    return distance;
}

export function resourceDistance(a: string, b: string): number {
    return a !== b ? 1 : 0;
}

export function caseDistance(a: Cases, b: Cases): number {
    return a !== b ? 1 : 0;
}

const statusErrorMap: Map<string, Map<string, number>> = new Map();

export function errorDistance(errorA: string, errorB: string): number {
    if (
        !errorA.startsWith("Status mismatch") ||
        !errorB.startsWith("Status mismatch")
    )
        return hamming(errorA, errorB);

    const value = statusErrorMap.get(errorA)?.get(errorB);
    if (value !== undefined) return value;

    function statusDistance(statusA: string, statusB: string): number {
        return statusA !== statusB ? (statusA[0] === statusB[0] ? 0.5 : 1) : 0;
    }

    function extractRecieved(str: string): { expected: string[]; got: string } {
        // "Status mismatch: Expected 409,200,201,202,210 got 400"
        const [expectedStr, got] = str.slice(26).split(" got ");
        const expected = expectedStr.split(",");

        return { expected, got };
    }

    function compareExpected(expectedA: string[], expectedB: string[]): number {
        const [small, large] =
            expectedA.length < expectedB.length
                ? [expectedA, expectedB]
                : [expectedB, expectedA];

        let distance = 0;
        for (const entry1 of small) {
            let min = 1;
            for (const entry2 of large) {
                min = Math.min(min, statusDistance(entry1, entry2));
                if (min === 0) break;
            }

            distance += min;
        }
        return distance / small.length;
    }

    let distance = 0;
    const { expected: expectedA, got: gotA } = extractRecieved(errorA);
    const { expected: expectedB, got: gotB } = extractRecieved(errorB);

    distance += statusDistance(gotA, gotB) / 2;
    distance += compareExpected(expectedA, expectedB) / 2;
    insertToMap(statusErrorMap, errorA, errorB, distance);
    return distance;
}

export function distance(a: ParsedAssertion, b: ParsedAssertion): number {
    let distance = 0;
    distance +=
        methodDistance(a.method, a.methodIndex, b.method, b.methodIndex) * 2;
    distance += resourceDistance(a.resource, b.resource);
    distance += hamming(a.url.slice(1), b.url.slice(1));
    distance += caseDistance(a.caseValue, b.caseValue) * 2;
    distance += errorDistance(a.errorMessage, b.errorMessage) * 2;
    return distance / 8;
}
