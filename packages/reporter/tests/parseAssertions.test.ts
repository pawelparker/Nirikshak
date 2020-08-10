import simpleLog from "./oneStepLog.json";
import log from "./twoStepLog.json";
import {
    parseAssertions,
    ParsedAssertion,
    parseAssertion,
} from "../src/assertions";
import { AssertionResult } from "@jest/test-result";
import result from "./resultTwoStep.json";

test.only("Assertion grouping", async () => {
    let assertions: ParsedAssertion[] = [];
    log.testResults.forEach((t) =>
        assertions.push(
            ...(t.assertionResults.map((a) =>
                parseAssertion(a as AssertionResult)
            ) as ParsedAssertion[])
        )
    );

    assertions = assertions.filter((a) => a.errorMessage.length);

    const output = parseAssertions(assertions);
    expect(output).toEqual(result);
});
