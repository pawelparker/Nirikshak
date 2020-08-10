import { toMatchBody } from "../../src/jestMatchers/bodyMatchers";

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
            message: "Response bodies matched",
        },
    },
    {
        input: false,
        expected: false,
        output: {
            pass: true,
            message: "Response bodies matched",
        },
    },
    {
        input: true,
        expected: false,
        output: {
            pass: false,
            message: "Response bodies did not match",
        },
    },
    {
        input: false,
        expected: true,
        output: {
            pass: false,
            message: "Response bodies did not match",
        },
    },
];

describe(`Body matcher`, () => {
    test.each(Entries)(`entry:%#`, (entry) => {
        const { pass, message } = toMatchBody(entry.input, entry.expected);
        expect(pass).toBe(entry.output.pass);
        expect(message()).toBe(entry.output.message);
    });
});
