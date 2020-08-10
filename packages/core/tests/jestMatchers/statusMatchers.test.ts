import { toMatchStatus } from "../../src/jestMatchers/statusMatchers";

const Entries: {
    input: any;
    expected: number[];
    output: {
        message: string;
        pass: boolean;
    };
}[] = [
    {
        input: 200,
        expected: [200],
        output: {
            pass: true,
            message: "Statuses matched",
        },
    },
    {
        input: 200,
        expected: [201, 400],
        output: {
            pass: false,
            message: "Status mismatch: Expected 201,400 got 200",
        },
    },
    {
        input: 200,
        expected: [201, 400, 200],
        output: {
            pass: true,
            message: "Statuses matched",
        },
    },
    {
        input: "lorem-ipsum",
        expected: [201, 400],
        output: {
            pass: false,
            message: "Status mismatch: Expected 201,400 got lorem-ipsum",
        },
    },
];

describe(`Status matcher`, () => {
    test.each(Entries)(`entry:%#`, (entry) => {
        const { pass, message } = toMatchStatus(entry.input, entry.expected);
        expect(pass).toBe(entry.output.pass);
        expect(message()).toBe(entry.output.message);
    });
});
