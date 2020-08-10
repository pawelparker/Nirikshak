import {
    URLString,
    normalizeURLString,
} from "../../../../src/endpoints/types/urlString";

const cases: { input: URLString; output: URLString }[] = [
    { input: "/home", output: "/home" },
    { input: "home/classes/max", output: "/home/classes/max" },
    {
        input: "/home/{faker:random.number}/end",
        output: "/home/{faker:random.number}/end",
    },
    { input: "/home/{custom:random}/end", output: "/home/{custom:random}/end" },
    { input: "/home//bases", output: "/home//bases" },
    { input: "home/my home", output: "/home/my home" },
    { input: "/home/{resource:name}", output: "/home/{resource:name}" },
    {
        input:
            "home/{faker:random.uuid}/place/{resource:id}/eof/{custom:color}",
        output:
            "/home/{faker:random.uuid}/place/{resource:id}/eof/{custom:color}",
    },
];

describe("Normalize URL string", () => {
    test.each(cases)(`Normalize string: %#`, (c) =>
        expect(normalizeURLString(c.input)).toEqual(c.output)
    );
});
