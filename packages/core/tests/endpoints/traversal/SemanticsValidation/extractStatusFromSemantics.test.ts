import { HeaderAndStatus } from "../../../../src/endpoints/types/output";
import { extractStatusFromSemantics } from "../../../../src/endpoints/traversal/semanticsValidation";

const Entries: {
    input: HeaderAndStatus[];
    output: number[];
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
        output: [200],
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
        output: [400],
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
        output: [200, 400, 404, 201, 500, 409],
    },
];

describe(`Extract status from semantics`, () => {
    test.each(Entries)(`Entry: %#`, (entry) =>
        expect(
            extractStatusFromSemantics(
                entry.input.map((i) => ({ semantics: i }))
            )
        ).toEqual(entry.output)
    );
});
