import {
    hamming,
    resourceDistance,
    caseDistance,
    methodDistance,
    errorDistance,
    distance,
} from "../src/dbscan/distanceFunction";
import { Cases, MethodType } from "@nirikshak/core";
import { ParsedAssertion } from "../src/assertions";

test(`Hamming`, () => {
    expect(hamming("purpose", "purpose")).toBe(0);
    expect(hamming("alpha", "beta")).toBe(1);
    expect(hamming("similar", "similarly")).toBe(2 / 9);
    expect(hamming("similarly", "similar")).toBe(2 / 9);
});

test(`Resource`, () => {
    expect(resourceDistance("s1", "s1")).toBe(0);
    expect(resourceDistance("s1", "s2")).toBe(1);
});

test(`Case`, () => {
    const cases: Cases[] = ["POSITIVE", "NEGATIVE", "DESTRUCTIVE"];

    for (const caseVal of cases) {
        for (const caseVal2 of cases) {
            expect(caseDistance(caseVal, caseVal2)).toBe(
                caseVal === caseVal2 ? 0 : 1
            );
        }
    }
});

test(`Method`, () => {
    const indices = [0, 1, 2];
    const methods: MethodType[] = ["DELETE", "GET", "PATCH", "POST", "PUT"];

    for (const index1 of indices)
        for (const method1 of methods)
            for (const index2 of indices)
                for (const method2 of methods) {
                    const distance =
                        (method1 === method2 ? 0 : 0.8) +
                        (index1 === index2 ? 0 : 0.2);
                    expect(
                        methodDistance(method1, index1, method2, index2)
                    ).toBe(distance);
                }
});

test(`Error distance: Hamming`, () => {
    const nonStatusEntries: [string, string][] = [
        ["response bodies did not match", "response bodies did match"],
        [
            "Status mismatch: Expected 200,500 got 201",
            "response bodies did match",
        ],
        [
            "response bodies did match",
            "Status mismatch: Expected 200,500 got 201",
        ],
    ];
    for (const entry of nonStatusEntries)
        expect(errorDistance(...entry)).toBe(hamming(...entry));
});

test(`Error distance: Status matching`, () => {
    expect(
        errorDistance(
            "Status mismatch: Expected 200,500 got 201",
            "Status mismatch: Expected 404 got 201"
        )
    ).toBe(0.5);
    expect(
        errorDistance(
            "Status mismatch: Expected 404 got 200",
            "Status mismatch: Expected 200,500 got 201"
        )
    ).toBe(0.75);
    expect(
        errorDistance(
            "Status mismatch: Expected 404 got 400",
            "Status mismatch: Expected 200,500 got 201"
        )
    ).toBe(1);
    expect(
        errorDistance(
            "Status mismatch: Expected 404,201,503,301,302,303,304,305 got 400",
            "Status mismatch: Expected 200,500,400,101,201,503 got 201"
        )
    ).toBe(0.7083333333333334);
    expect(
        errorDistance(
            "Status mismatch: Expected 201,404, 503 got 400",
            "Status mismatch: Expected 404,201 got 400"
        )
    ).toBe(0);
    expect(
        errorDistance(
            "Status mismatch: Expected 404,201 got 400",
            "Status mismatch: Expected 201,404, 503 got 400"
        )
    ).toBe(0);
    expect(
        errorDistance(
            "Status mismatch: Expected 201,404, 503 got 400",
            "Status mismatch: Expected  got 400"
        )
    ).toBe(0.5);
    expect(
        errorDistance(
            "Status mismatch: Expected  got 200",
            "Status mismatch: Expected  got 400"
        )
    ).toBe(0.5);
});

test(`Distance function`, () => {
    const assertion1: ParsedAssertion = {
        caseValue: "POSITIVE",
        errorMessage: "GFSGIUDGYSGJDVSBNCBNVCHCSVGJCSYCVJGHCSHG",
        iteration: 1,
        method: "GET",
        methodIndex: 0,
        pathIndex: 0,
        resource: "student",
        url: "/{resource:id}",
    };

    const assertion2: ParsedAssertion = {
        caseValue: "DESTRUCTIVE",
        errorMessage: "Status mismatch: Expected 200,500 got 201",
        iteration: 0,
        method: "POST",
        methodIndex: 1,
        pathIndex: 0,
        resource: "faculty",
        url: "/people",
    };

    expect(distance(assertion1, assertion2)).toBe(1);
});
