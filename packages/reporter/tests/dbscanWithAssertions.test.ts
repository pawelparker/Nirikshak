import result from "./twoStepClusters.json";
import log from "./twoStepLog.json";
import { AssertionResult } from "@jest/test-result";
import DBScan from "../src/dbscan/dbscan";
import { parseAssertion } from "../src/assertions";
import { distance } from "../src/dbscan/distanceFunction";

test("DBScan with assertions: Two step", () => {
    let assertions: AssertionResult[] = [];
    log.testResults.forEach((t) =>
        assertions.push(...(t.assertionResults as AssertionResult[]))
    );

    assertions = assertions.filter((a) => a.status === "failed");
    const parsedAssertions = assertions.map((i) => parseAssertion(i));
    const results = new DBScan(parsedAssertions, 0.4, 7, distance).run();
    expect(results).toEqual(result);
});
