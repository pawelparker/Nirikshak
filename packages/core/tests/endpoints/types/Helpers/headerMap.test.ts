import {
    HeaderMap,
    isHeaderMap,
} from "../../../../src/endpoints/types/helpers";

const ValidHeaderMaps: HeaderMap[] = [
    {
        "x-application": "nirikshak",
        version: 4,
        "app-count": {
            function: "faker:random.number",
            args: [{ min: 0, max: 10, precision: 1 }],
        },
    },
    {
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
        "content-type": "application/json",
        userIssuer: "custom:getUsername",
        "ai-id": "resource:id",
        asparagus: false,
    },
];

const InvalidHeaderMaps: any[] = [
    true,
    null,
    undefined,
    15,
    "stringstring",
    { peeps: null },
    [true, false],
    {
        "x-application": "nirikshak",
        "app-count": {
            function: "faker:radom.number",
            args: [{ min: 0, max: 10, precision: 1 }],
        },
        version: undefined,
    },
    {
        "x-application": "nirikshak",
        "app-count": {
            function: "faker:radom.number",
            args: [{ min: 0, max: 10, precision: 1 }],
        },
        version: null,
    },
    {
        "x-application": "nirikshak",
        version: 4,
        "app-count": [
            "classes",
            {
                function: "faker:radom.number",
                args: [{ min: 0, max: 10, precision: 1 }],
            },
        ],
    },
];

describe("Header map", () => {
    test.each(ValidHeaderMaps)(`Valid header map: %#`, (m) =>
        expect(isHeaderMap(m)).toBe(true)
    );

    InvalidHeaderMaps.forEach((m, index) =>
        test(`Invalid header map: ${index}`, () =>
            expect(isHeaderMap(m)).toBe(false))
    );
});
