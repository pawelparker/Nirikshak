import { ChildProcessInput } from "./parent";
import DBScan from "./dbscan";
import { distance } from "./distanceFunction";
import { ParsedAssertion } from "../assertions";
import process from "process";

export interface ChildProcessOutput<T> {
    clusters: T[][];
    noise: T[];
}

process.on("message", (message: ChildProcessInput<ParsedAssertion>) => {
    const dbscan = new DBScan(
        message.dataset,
        message.epsilon,
        message.minPoints,
        distance
    );
    const response: ChildProcessOutput<ParsedAssertion> = dbscan.run();

    process.send && process.send(response);
    process.exit();
});

process.send && process.send("Ready");
