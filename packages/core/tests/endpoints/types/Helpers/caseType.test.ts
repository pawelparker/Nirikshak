import { Cases, isCaseType } from "../../../../src/endpoints/types/helpers";

const ValidCaseTypes: Cases[] = ["POSITIVE", "NEGATIVE", "DESTRUCTIVE"];

const InvalidCaseTypes: any[] = [
    1,
    undefined,
    false,
    null,
    "positive",
    "negative",
    "destructive",
    "any other string",
];

describe("Case types", () => {
    test.each(ValidCaseTypes)(`Valid case: %#`, (str) =>
        expect(isCaseType(str)).toBe(true)
    );

    test.each(InvalidCaseTypes)(`Invalid case: %#`, (str) =>
        expect(isCaseType(str)).toBe(false)
    );
});
