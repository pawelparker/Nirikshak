import path from "path";
import { Reporter, Context } from "@jest/reporters";
import { AggregatedResult } from "@jest/test-result";
import fs from "fs-extra";
import open from "open";
import {
    ParsedAssertions,
    parseAssertions,
    ParsedAssertion,
    parseAssertion,
} from "./assertions";
import { ChildProcessOutput } from "./dbscan/child";
import { runDBScanParallel } from "./dbscan/parent";
import signale from "signale";

interface Results {
    total: number;
    passed: number;
    failed: number;
    parsedAssertions?: ParsedAssertions;
    clustering?: ChildProcessOutput<ParsedAssertion>;
}

class NirikshakReporter implements Pick<Reporter, "onRunComplete"> {
    async onRunComplete(
        contextSet: Set<Context>,
        results: AggregatedResult
    ): Promise<void> {
        try {
            signale.info(`Processing your test results`);
            if (!results.numTotalTests) {
                signale.warn(`No tests ran.`);
                return;
            }

            const htmlData: Results = {
                total: results.numTotalTests,
                passed: results.numPassedTests,
                failed: results.numFailedTests,
            };

            if (results.numFailedTests) {
                const assertions: ParsedAssertion[] = [];
                results.testResults.forEach((t) =>
                    t.testResults.forEach(
                        (res) =>
                            res.status === "failed" &&
                            assertions.push(parseAssertion(res))
                    )
                );
                let promise: Promise<
                    ChildProcessOutput<ParsedAssertion>
                > | null = null;
                if (results.numFailedTests > 100) {
                    signale.info(`Starting clustering`);
                    promise = runDBScanParallel({
                        dataset: assertions,
                        epsilon: 0.4,
                        minPoints: 7,
                    });
                }
                signale.info(`Starting grouping`);
                htmlData.parsedAssertions = parseAssertions(assertions);
                signale.complete(`Grouping done`);
                if (promise) {
                    htmlData.clustering = await promise;
                    signale.complete(`Clustering done`);
                }
            }

            signale.info(`Writing report`);
            let htmlFile = (
                await fs.readFile(
                    path.resolve(__dirname, "../static/index.html")
                )
            ).toString();
            htmlFile = htmlFile.replace(
                "{{testResult}}",
                JSON.stringify(htmlData)
            );
            const dest = path.resolve("test-report.html");
            await fs.writeFile(dest, htmlFile);
            open(dest);
            signale.success("Report generated successfully");
        } catch (e) {
            signale.fatal(e);
        }
    }
}

export default NirikshakReporter;
