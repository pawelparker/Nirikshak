import signale from "signale";
import path from "path";
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

test(`Few failed tests`, async () => {
    const assertions: AssertionResult[] = [];
    twoStepLog.testResults.forEach((t) => {
        (t as any).testResults = t.assertionResults;
        assertions.push(...(t.assertionResults as AssertionResult[]));
    });
    const reporter = new NirikshakReporter();
    await reporter.onRunComplete(
        null as any,
        { ...twoStepLog, numFailedTests: 25 } as any
    );
    expect(open).toHaveBeenCalledWith(path.resolve("test-report.html"));
    let failedCount = 0;
    for (const assertion of assertions) {
        assertion.status === "failed"
            ? ++failedCount &&
              expect(parseAssertion).toHaveBeenCalledWith(assertion)
            : expect(parseAssertion).not.toHaveBeenCalledWith(assertion);
    }

    const assertionArr: ParsedAssertion[] = [];
    while (failedCount--) assertionArr.push(parseAssertion(assertions[0]));
    expect(parseAssertions).toHaveBeenCalledWith(assertionArr);
    expect(fs.pathExists("test-report.html")).resolves.toBe(true);
    expect(parseAssertion).toHaveBeenCalled();
    expect(parseAssertions).toHaveBeenCalled();
    expect(runDBScanParallel).not.toHaveBeenCalled();
    expect(fs.pathExists("test-report.html")).resolves.toBe(true);
    expect(signale.info).toHaveBeenCalledWith(`Processing your test results`);
    expect(signale.info).toHaveBeenCalledWith(`Starting grouping`);
    expect(signale.info).toHaveBeenCalledWith(`Writing report`);
    expect(signale.complete).toHaveBeenCalledWith(`Grouping done`);
    expect(signale.info).not.toHaveBeenCalledWith(`Starting clustering`);
    expect(signale.complete).not.toHaveBeenCalledWith(`Clustering done`);
    expect(signale.success).toHaveBeenCalledWith(
        `Report generated successfully`
    );
    expect(signale.warn).not.toHaveBeenCalled();
    expect(signale.fatal).not.toHaveBeenCalled();
});

afterAll(async () => await fs.remove("test-report.html"));
