import { ParsedAssertion } from "../assertions";
const parsedAssertion: ParsedAssertion = {
    caseValue: "POSITIVE",
    errorMessage: "eff",
    iteration: 0,
    method: "DELETE",
    methodIndex: 2,
    pathIndex: 1,
    resource: "student",
    url: "/student/{resource}",
};

export const parseAssertion = jest.fn().mockReturnValue(parsedAssertion);
export const parseAssertions = jest.fn();
