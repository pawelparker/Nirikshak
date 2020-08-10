import signale from "signale";
import path from "path";
import open from "open";
import NirikshakReporter from "../../../src";
import { parseAssertion, parseAssertions } from "../../../src/assertions";
import threeStepLog from "../../threeStepLog.json";
import { runDBScanParallel } from "../../../src/dbscan/parent";
import fs from "fs-extra";
jest.mock("../../../src/dbscan/parent");
jest.mock("../../../src/assertions");
beforeAll(() => process.chdir(__dirname));

test(`No failed tests`, async () => {
    const reporter = new NirikshakReporter();
    await reporter.onRunComplete(
        null as any,
        { ...threeStepLog, numFailedTests: 0 } as any
    );
    expect(open).toHaveBeenCalledWith(path.resolve("test-report.html"));
    expect(parseAssertion).not.toHaveBeenCalled();
    expect(parseAssertions).not.toHaveBeenCalled();
    expect(runDBScanParallel).not.toHaveBeenCalled();
    expect(fs.pathExists("test-report.html")).resolves.toBe(true);
    expect(signale.info).toHaveBeenCalledWith(`Processing your test results`);
    expect(signale.info).not.toHaveBeenCalledWith(`Starting clustering`);
    expect(signale.info).not.toHaveBeenCalledWith(`Starting grouping`);
    expect(signale.info).not.toHaveBeenCalledWith(`Grouping done`);
    expect(signale.info).not.toHaveBeenCalledWith(`Clustering done`);
    expect(signale.info).toHaveBeenCalledWith(`Writing report`);
    expect(signale.success).toHaveBeenCalledWith(
        `Report generated successfully`
    );
    expect(signale.warn).not.toHaveBeenCalled();
    expect(signale.fatal).not.toHaveBeenCalled();
});

afterAll(async () => await fs.remove("test-report.html"));
