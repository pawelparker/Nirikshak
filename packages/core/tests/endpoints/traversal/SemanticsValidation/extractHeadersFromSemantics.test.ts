import { HeaderAndStatus } from "../../../../src/endpoints/types/output";
import { HeaderMap } from "../../../../src/endpoints/types/helpers";
import { extractHeadersFromSemantics } from "../../../../src/endpoints/traversal/semanticsValidation";

const Entries: {
    input: HeaderAndStatus[];
    output: HeaderMap[];
}[] = [
    {
        input: [],
        output: [],
    },
    {
        input: [
            {
                status: 200,
            },
        ],
        output: [],
    },
    {
        input: [
            {
                status: 200,
            },
            { status: 400 },
            { status: 500 },
        ],
        output: [],
    },
    {
        input: [
            {
                status: 400,
                headers: {
                    a: "faker:random.number",
                    b: {
                        function: "faker:lorem.lines",
                        args: [1],
                    },
                    c: "custom:word",
                    d: false,
                },
            },
        ],
        output: [
            {
                a: "faker:random.number",
                b: {
                    function: "faker:lorem.lines",
                    args: [1],
                },
                c: "custom:word",
                d: false,
            },
        ],
    },
    {
        input: [
            { status: 200, headers: {} },
            { status: 400 },
            { status: 404 },
            {
                status: 201,
                headers: {
                    a: "faker:random.number",
                    b: {
                        function: "faker:lorem.lines",
                        args: [1],
                    },
                },
            },
            { status: 500 },
            {
                status: 409,
                headers: {
                    c: "custom:word",
                    d: false,
                },
            },
        ],
        output: [
            {},
            {
                a: "faker:random.number",
                b: {
                    function: "faker:lorem.lines",
                    args: [1],
                },
            },
            {
                c: "custom:word",
                d: false,
            },
        ],
    },
];

describe(`Extract headers from semantics`, () => {
    test.each(Entries)(`Entry: %#`, (entry) =>
        expect(
            extractHeadersFromSemantics(
                entry.input.map((i) => ({ semantics: i }))
            )
        ).toEqual(entry.output)
    );
});
