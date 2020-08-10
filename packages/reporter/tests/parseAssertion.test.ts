import { AssertionResult } from "@jest/test-result";
import { parseAssertion } from "../src/assertions";

const Assertion = {
    ancestorTitles: [
        "student",
        "1",
        "GET;;0;;/Student/{resource:id};;POSITIVE--GET;;0;;/Student/{resource:id};;POSITIVE",
    ],
    title: "0::GET;;0;;/Student/{resource:id};;POSITIVE",
    failureMessages: [
        "Error: Status mismatch: Expected 200,500 got 201\n    at Object.<anonymous> (/home/yash/Desktop/nirikshak/packages/simple-example/__tests__/student/student.test.ts:112:53)\n    at processTicksAndRejections (internal/process/task_queues.js:97:5)",
    ],
} as AssertionResult;

describe("Valid assertion parsing", () => {
    test(`Everything as expected`, () => {
        const result = parseAssertion(Assertion);
        expect(result.caseValue).toBe("POSITIVE");
        expect(result.method).toBe("GET");
        expect(result.methodIndex).toBe(0);
        expect(result.resource).toBe("student");
        expect(result.iteration).toBe(1);
        expect(result.url).toBe("/Student/{resource:id}");
        expect(result.errorMessage).toBe(
            "Status mismatch: Expected 200,500 got 201"
        );
    });
    test(`Empty failure messages`, () => {
        const result = parseAssertion({ ...Assertion, failureMessages: [] });
        expect(result.caseValue).toBe("POSITIVE");
        expect(result.method).toBe("GET");
        expect(result.methodIndex).toBe(0);
        expect(result.resource).toBe("student");
        expect(result.iteration).toBe(1);
        expect(result.url).toBe("/Student/{resource:id}");
        expect(result.errorMessage).toBe("");
    });
});

describe(`Invalid assertion parsing`, () => {
    test(`Invalid ancestor length`, () =>
        expect(() =>
            parseAssertion({
                ...Assertion,
                ancestorTitles: [...Assertion.ancestorTitles, "Another Entry"],
            })
        ).toThrowErrorMatchingInlineSnapshot(
            `"Invalid test result format: More than 3 ancestor titles. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter"`
        ));
    test(`Invalid ancestor index`, () => {
        const titles = Array.from(Assertion.ancestorTitles);
        titles[1] = "fkjsld";
        expect(() =>
            parseAssertion({
                ...Assertion,
                ancestorTitles: titles,
            })
        ).toThrowErrorMatchingInlineSnapshot(
            `"Invalid test result format: Method entry index is not a number. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter"`
        );
    });
    test(`Invalid node name`, () => {
        const title = "0::GET;;0;;/Student/{resource:id};;DESTRACTIVE";
        expect(() =>
            parseAssertion({
                ...Assertion,
                title,
            })
        ).toThrowErrorMatchingInlineSnapshot(
            `"Invalid test result format: Title does not contain a valid graph node. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter"`
        );
    });
    test(`Invalid node index`, () => {
        const title = "ilkh::GET;;0;;/Student/{resource:id};;DESTRACTIVE";
        expect(() =>
            parseAssertion({
                ...Assertion,
                title,
            })
        ).toThrowErrorMatchingInlineSnapshot(
            `"Invalid test result format: Entry index in path is not a number. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter"`
        );
    });
});
