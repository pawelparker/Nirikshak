import {
    HeaderMap,
    MethodType,
    Cases,
} from "../../../../../src/endpoints/types/helpers";
import {
    HeaderAndStatus,
    outputValidationFunctions,
} from "../../../../../src/endpoints/types/output";

const ValidHeader: HeaderMap = {
    "content-type": "faker:system:mimetype",
    Authorization: "faker:random.alphaNumeric",
    identity: false,
    resource: "resource:id",
    count: 4,
};

const InvalidHeader: any = {
    purple: "color",
    color: "purple",
    application: [1, 3, false, null],
};

const ValidStatus: HeaderAndStatus["status"] = 200;

const InvalidStatus: any = "200";

const ValidHeaderAndStatus: HeaderAndStatus[] = [
    { status: ValidStatus },
    {
        headers: ValidHeader,
        status: ValidStatus,
    },
];
const InvalidHeaderAndStatus: any[] = [
    {},
    { headers: InvalidHeader },
    { status: InvalidStatus },
    { headers: ValidHeader, status: InvalidStatus },
    { headers: InvalidHeader, status: ValidStatus },
    { headers: InvalidHeader, status: InvalidStatus },
];

const ValidHeaderAndStatusArrays: { semantics: HeaderAndStatus }[][] = [
    [{ semantics: ValidHeaderAndStatus[0] }],
    [
        { semantics: ValidHeaderAndStatus[0] },
        { semantics: ValidHeaderAndStatus[1] },
    ],
    [
        { semantics: ValidHeaderAndStatus[1] },
        { semantics: ValidHeaderAndStatus[1] },
        { semantics: ValidHeaderAndStatus[1] },
    ],
];

const InvalidHeaderAndStatusArrays: { semantics: any }[][] = [
    [{ semantics: InvalidHeaderAndStatus[0] }],
    [
        { semantics: InvalidHeaderAndStatus[0] },
        { semantics: InvalidHeaderAndStatus[0] },
        { semantics: InvalidHeaderAndStatus[0] },
    ],
    [
        { semantics: InvalidHeaderAndStatus[1] },
        { semantics: InvalidHeaderAndStatus[2] },
        { semantics: InvalidHeaderAndStatus[3] },
    ],
    [
        { semantics: ValidHeaderAndStatus[1] },
        { semantics: InvalidHeaderAndStatus[4] },
        { semantics: InvalidHeaderAndStatus[5] },
    ],
    [
        { semantics: ValidHeaderAndStatus[1] },
        { semantics: ValidHeaderAndStatus[1] },
        { semantics: InvalidHeaderAndStatus[1] },
    ],
];

const NonObjectEntries: any = [1, null, "false", 31231.2, undefined, true];

describe("Output validation functions: header and status", () => {
    (["GET", "DELETE", "PUT", "PATCH", "POST"] as MethodType[]).forEach(
        (method) => {
            NonObjectEntries.forEach((element, index) => {
                (["POSITIVE", "NEGATIVE", "DESTRUCTIVE"] as Cases[]).forEach(
                    (caseValue) => {
                        test(`Non object values - ${method}-${caseValue}: ${index}`, () => {
                            const o =
                                outputValidationFunctions[method][caseValue];

                            o && expect(o(element)).toBe(false);
                        });
                    }
                );
            });
        }
    );

    (["GET", "DELETE", "POST", "PUT", "PATCH"] as MethodType[]).forEach(
        (method) => {
            ValidHeaderAndStatus.forEach((element, index) => {
                (["DESTRUCTIVE", "NEGATIVE"] as Cases[]).forEach(
                    (caseValue) => {
                        test(`Valid header and status - ${method}-${caseValue}: ${index}`, () => {
                            const o =
                                outputValidationFunctions[method][caseValue];

                            o && expect(o({ semantics: element })).toBe(true);
                        });
                    }
                );
            });

            ValidHeaderAndStatusArrays.forEach((element, index) => {
                (["DESTRUCTIVE", "NEGATIVE"] as Cases[]).forEach(
                    (caseValue) => {
                        test(`Valid header and status array - ${method}-${caseValue}: ${index}`, () => {
                            const o =
                                outputValidationFunctions[method][caseValue];

                            o && expect(o(element)).toBe(true);
                        });
                    }
                );
            });

            InvalidHeaderAndStatus.forEach((element, index) => {
                (["DESTRUCTIVE", "NEGATIVE"] as Cases[]).forEach(
                    (caseValue) => {
                        test(`Invalid header and status - ${method}-${caseValue}: ${index}`, () => {
                            const o =
                                outputValidationFunctions[method][caseValue];

                            o && expect(o({ semantics: element })).toBe(false);
                        });
                    }
                );
            });
            InvalidHeaderAndStatusArrays.forEach((element, index) => {
                (["DESTRUCTIVE", "NEGATIVE"] as Cases[]).forEach(
                    (caseValue) => {
                        test(`Invalid header and status array - ${method}-${caseValue}: ${index}`, () => {
                            const o =
                                outputValidationFunctions[method][caseValue];

                            o && expect(o(element)).toBe(false);
                        });
                    }
                );
            });
        }
    );
});
