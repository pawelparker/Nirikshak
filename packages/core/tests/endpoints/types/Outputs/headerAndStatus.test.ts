import {
    HeaderAndStatus,
    isHeaderAndStatus,
} from "../../../../src/endpoints/types/output";

const ValidInputs: HeaderAndStatus[] = [
    {
        status: 200,
    },
    { status: 101, headers: {} },
    {
        status: 200,
        headers: {
            "application-type": "master-card",
            "content-type": "faker:system.mimeType",
            "pickles-pruston": 12.54,
            pruning: false,
        },
    },
];

const InvalidInputs: any[] = [
    1,
    undefined,
    [false, null, 7],
    {},
    {
        status: "Nixon",
    },
    {
        status: 300,
        headers: null,
    },
    {
        status: 201,
        headers: [false, true, "null"],
    },
    {
        status: 200,
        headers: {
            h1: true,
            h2: false,
            h3: 7,
            h4: "STRSTR",
            h5: null,
        },
    },
    {
        status: 200,
        headers: {
            h1: true,
            h2: false,
            h3: 7,
            h4: "STRSTR",
            h5: [7],
        },
    },
    {
        status: 200,
        headers: {
            h1: true,
            h2: false,
            h3: 7,
            h4: "STRSTR",
            h5: { h6: true },
        },
    },
];

describe("Header and status", () => {
    test.each(ValidInputs)(`Valid header and status: %#`, (entry) => {
        expect(isHeaderAndStatus(entry)).toBe(true);
    });

    test.each(InvalidInputs)(`Invalid header and status: %#`, (entry) => {
        expect(isHeaderAndStatus(entry)).toBe(false);
    });
});
