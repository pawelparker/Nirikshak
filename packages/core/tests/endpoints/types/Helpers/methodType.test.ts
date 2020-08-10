import {
    MethodType,
    isMethodType,
} from "../../../../src/endpoints/types/helpers";

const ValidMethodTypes: MethodType[] = [
    "GET",
    "PUT",
    "POST",
    "PATCH",
    "DELETE",
];

const InvalidMethodTypes: any[] = [
    1,
    undefined,
    false,
    null,
    "post",
    "put",
    "patch",
    "delete",
    "get",
    "any other string",
];

describe("Method types", () => {
    test.each(ValidMethodTypes)(`Valid method: %#`, (str) =>
        expect(isMethodType(str)).toBe(true)
    );

    test.each(InvalidMethodTypes)(`Invalid method: %#`, (str) =>
        expect(isMethodType(str)).toBe(false)
    );
});
