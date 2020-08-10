import childProcess from "child_process";
import { runDBScanParallel } from "../src/dbscan/parent";
jest.mock("child_process");

// This test cannot be run separately due to mocking
// Run with the project
test(`Parallel DBSCAN: Parent`, async () => {
    const input = {
        dataset: [1, 2, 3, 4, 4, 5, 6, 6, 7, 27, 28, 29, 30, 32],
        epsilon: 3,
        minPoints: 4,
    };
    const message = await runDBScanParallel(input);
    const child = childProcess.fork("");
    expect(child.send).toHaveBeenCalledWith(input);
    expect(message).toEqual({
        clusters: [],
        noise: [],
    });
    expect(childProcess.fork).toHaveBeenCalledWith(
        "/home/yash/Desktop/nirikshak/packages/reporter/lib/dbscan/child.js",
        [],
        {
            stdio: ["inherit", "inherit", "inherit", "ipc"],
        }
    );
});
