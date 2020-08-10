import process from "process";
import DBScan from "../src/dbscan/dbscan";

jest.mock("process");
jest.mock("/home/yash/Desktop/nirikshak/packages/reporter/src/dbscan/dbscan");

test(`Parallel DBSCAN: Parent`, async () => {
    await import(
        "/home/yash/Desktop/nirikshak/packages/reporter/src/dbscan/child"
    );

    expect(process.send).toHaveBeenCalledWith("Ready");
    expect(DBScan).toHaveBeenCalled();
    expect(process.exit).toHaveBeenCalled();
    expect(process.send).toHaveBeenCalledWith({ clusters: [], noise: [] });
});
