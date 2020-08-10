import signale from "signale";
import open from "open";
import NirikshakReporter from "../../../src";
import {
    parseAssertion,
    parseAssertions,
    ParsedAssertion,
} from "../../../src/assertions";
import twoStepLog from "../../twoStepLog.json";
import { runDBScanParallel } from "../../../src/dbscan/parent";
import fs from "fs-extra";
import { AssertionResult } from "@jest/test-result";
jest.mock("../../../src/dbscan/parent");
jest.mock("../../../src/assertions");
beforeAll(() => process.chdir(__dirname));

test(`Throws error`, async () => {
    const assertions: AssertionResult[] = [];
    twoStepLog.testResults.forEach((t) => {
        (t as any).testResults = t.assertionResults;
        assertions.push(...(t.assertionResults as AssertionResult[]));
    });

    const error = new Error(`Sample error`);
    (runDBScanParallel as jest.Mock<any, any>).mockImplementation((): never => {
        throw error;
    });

    const reporter = new NirikshakReporter();
    await reporter.onRunComplete(null as any, twoStepLog as any);

    expect(open).not.toHaveBeenCalled();
    let failedCount = 0;
    for (const assertion of assertions) {
        assertion.status === "failed"
            ? ++failedCount &&
              expect(parseAssertion).toHaveBeenCalledWith(assertion)
            : expect(parseAssertion).not.toHaveBeenCalledWith(assertion);
    }

    const assertionArr: ParsedAssertion[] = [];
    while (failedCount--) assertionArr.push(parseAssertion(assertions[0]));
    expect(parseAssertions).not.toHaveBeenCalledWith();
    expect(runDBScanParallel).toHaveBeenCalled();
    expect(signale.info).toHaveBeenCalledWith(`Processing your test results`);
    expect(signale.info).not.toHaveBeenCalledWith(`Starting grouping`);
    expect(signale.info).not.toHaveBeenCalledWith(`Writing report`);
    expect(signale.complete).not.toHaveBeenCalledWith(`Grouping done`);
    expect(signale.info).toHaveBeenCalledWith(`Starting clustering`);
    expect(signale.complete).not.toHaveBeenCalledWith(`Clustering done`);
    expect(signale.success).not.toHaveBeenCalledWith();
    expect(signale.warn).not.toHaveBeenCalled();
    expect(signale.fatal).toHaveBeenCalledWith(error);
});

afterAll(async () => await fs.remove("test-report.html"));
