import {
    ResourceString,
    isResourceString,
} from "../../../src/endpoints/types/resourceString";

const ValidStrings: ResourceString[] = [
    "resource:name.id",
    "resource:age",
    "resource:classes[0].ages.names[places]",
];

const InvalidStrings: any[] = [
    1,
    false,
    undefined,
    null,
    "Stringy",
    "resource.name.id",
    "resource :name.age",
];

describe("Resource strings", () => {
    test.each(ValidStrings)(`Valid resource string: %#`, (str) =>
        expect(isResourceString(str)).toBe(true)
    );

    test.each(InvalidStrings)(`Invalid resource string: %#`, (str) =>
        expect(isResourceString(str)).toBe(false)
    );
});
