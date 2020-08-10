import { Query, isQuery } from "../../../../src/endpoints/types/input";

const ValidQueries: Query[] = [
    {
        name: 12,
        age: 15,
    },
    {
        alps: "pulp",
        alpha: [
            "faker:random.number",
            "faker:random.number",
            "resource:version",
        ],
    },
    {
        attributes: true,
        sort: "ascending",
        swarmFactor: 1.88,
    },
];

const InvalidQueries: any[] = [
    undefined,
    1,
    [false, null, true],
    {
        age: null,
    },
    { branch: null },
    { classes: [1, 2, 3, [4]] },
    { pupils: ["true", "undef", undefined] },
    {
        glares: "faker:random.number",
        glimpse: ["purple", 1, 8],
        argumnets: null,
    },
    {
        glares: "faker:random.number",
        glimpse: ["purple", 1, 8, null],
    },
];

describe(`Query objects`, () => {
    it.each(ValidQueries)(`Valid query object: %#`, (obj) =>
        expect(isQuery(obj)).toBe(true)
    );

    it.each(InvalidQueries)(`Invalid query object: %#`, (obj) =>
        expect(isQuery(obj)).toBe(false)
    );
});
