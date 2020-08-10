import { statusValidation } from "../../../../src/endpoints/traversal/semanticsValidation";

const Entries: {
    input: any;
    status: number[];
    output: boolean;
}[] = [
    {
        input: 200,
        status: [],
        output: true,
    },
    {
        input: 200,
        status: [200],
        output: true,
    },
    {
        input: 200,
        status: [404],
        output: false,
    },
    {
        input: 200,
        status: [200, 210, 500, 404],
        output: true,
    },
    {
        input: 210,
        status: [200, 210, 500, 404],
        output: true,
    },
    {
        input: 500,
        status: [200, 210, 500, 404],
        output: true,
    },
    {
        input: 404,
        status: [200, 210, 500, 404],
        output: true,
    },
    {
        input: 300,
        status: [200, 210, 500, 404],
        output: false,
    },
    {
        input: false,
        status: [200, 210, 500, 404],
        output: false,
    },
    {
        input: [100, 200],
        status: [200, 210, 500, 404],
        output: false,
    },
];

describe(`Match status`, () => {
    test.each(Entries)(`Entry: %#`, (entry) =>
        expect(statusValidation(entry.input, entry.status)).toEqual(
            entry.output
        )
    );
});
