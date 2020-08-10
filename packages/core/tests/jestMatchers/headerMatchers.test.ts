import { toMatchHeaders } from "../../src/jestMatchers/headerMatchers";

const Entries: {
    input: boolean;
    expected: boolean;
    output: {
        pass: boolean;
        message: string;
    };
}[] = [
    {
        input: true,
        expected: true,
        output: {
            pass: true,
            message: "Headers matched",
        },
    },
    {
        input: false,
        expected: false,
        output: {
            pass: true,
            message: "Headers matched",
        },
    },
    {
        input: true,
        expected: false,
        output: {
            pass: false,
            message: "Headers did not match",
        },
    },
    {
        input: false,
        expected: true,
        output: {
            pass: false,
            message: "Headers did not match",
        },
    },
];

describe(`Header matcher`, () => {
    test.each(Entries)(`entry:%#`, (entry) => {
        const { pass, message } = toMatchHeaders(entry.input, entry.expected);
        expect(pass).toBe(entry.output.pass);
        expect(message()).toBe(entry.output.message);
    });
});
