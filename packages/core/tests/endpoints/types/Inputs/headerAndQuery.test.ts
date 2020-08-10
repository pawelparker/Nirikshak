import {
    HeaderAndQuery,
    isHeaderAndQuery,
} from "../../../../src/endpoints/types/input";

const ValidHeaderAndQuery: HeaderAndQuery[] = [
    {},
    {
        headers: {
            application: "content-holder",
            Authorization: "Bearer JWT TOKEN",
        },
    },
    {
        query: {
            names: ["faker:name.firstName", "faker:name.lastName"],
            age: 12,
            id: "faker:random.uuid",
        },
    },
    {
        headers: {
            "content-type": "application/json",
            username: "resource:id",
        },

        query: {
            pupils: true,
            dilated: false,
        },
    },
];

const InvalidHeaderAndQuery: any[] = [
    null,
    undefined,
    {
        headers: {
            "content-base": undefined,
            "x-powered-by": false,
        },
    },
    {
        query: {
            horrors: null,
        },
    },
    {
        headers: {
            "content-base": null,
            "x-powered-by": false,
        },
        query: {
            horrors: null,
        },
    },
];

describe(`Header and query type`, () => {
    test.each(ValidHeaderAndQuery)(`Valid entry: %#`, (entry) =>
        expect(isHeaderAndQuery(entry)).toBe(true)
    );
    InvalidHeaderAndQuery.forEach((entry, index) =>
        test(`Invalid entry: ${index}`, () =>
            expect(isHeaderAndQuery(entry)).toBe(false))
    );
});
