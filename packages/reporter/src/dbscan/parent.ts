import childProcess from "child_process";
import path from "path";
import { ChildProcessOutput } from "./child";
import DBScan from "./dbscan";
import { distance } from "./distanceFunction";
import { ParsedAssertion } from "../assertions";

export interface ChildProcessInput<T> {
    dataset: T[];
    epsilon: number;
    minPoints: number;
}

const program = path.resolve(__dirname, "../../lib/dbscan", "child.js");
export function runDBScanParallel<T>(
    input: ChildProcessInput<T>
): Promise<ChildProcessOutput<T>> {
    return new Promise((resolve) => {
        const child = childProcess.fork(program, [], {
            stdio: ["inherit", "inherit", "inherit", "ipc"],
        });

        child.on("message", (message) => {
            if (message === "Ready") child.send(input);
            else resolve(message as ChildProcessOutput<T>);
        });
    });
}
