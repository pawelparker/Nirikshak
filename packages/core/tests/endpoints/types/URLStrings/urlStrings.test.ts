import { isURLString } from "../../../../src/endpoints/types/urlString";

const InvalidUrlStrings: any[] = [
    7,
    false,
    null,
    "{custom.name}",
    "/plurals/singular/{myStringString}/eof",
];

const ValidURLStrings: string[] = [
    "/home",
    "home/classes/max",
    "/home/{faker:random.number}/end",
    "/home/{custom:random}/end",
    "/home//bases",
    "home/my home",
    "/home/{resource:name}",
    "home/{faker:random.uuid}/place/{resource:id}/eof/{custom:color}",
];

describe("URL Strings", () => {
    test.each(ValidURLStrings)(`Valid url string: %#`, (str) =>
        expect(isURLString(str)).toBe(true)
    );

    test.each(InvalidUrlStrings)(`Invalid url string: %#`, (str) =>
        expect(isURLString(str)).toBe(false)
    );
});
