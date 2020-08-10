import open from "open";
import NirikshakReporter from "../../src";
import { parseAssertion } from "../../src/assertions";
import threeStepLog from "../threeStepLog.json";
import signale from "signale";
jest.mock("../../src/assertions");
beforeAll(() => process.chdir(__dirname));

test(`No tests`, async () => {
    const reporter = new NirikshakReporter();
    await reporter.onRunComplete(
        null as any,
        { ...threeStepLog, numTotalTests: 0 } as any
    );
    expect(open).not.toHaveBeenCalled();
    expect(parseAssertion).not.toHaveBeenCalled();
    expect(signale.info).toHaveBeenCalledWith(`Processing your test results`);
    expect(signale.warn).toHaveBeenCalledWith(`No tests ran.`);
    expect(signale.fatal).not.toHaveBeenCalled();
});
