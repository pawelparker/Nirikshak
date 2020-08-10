import DBScan from "../src/dbscan/dbscan";

test("DB Scan", () => {
    const dataset: [number, number][] = [
        [1, 1],
        [0, 1],
        [1, 0],
        [0, 5.9],
        [10, 10],
        [10, 13],
        [13, 13],
        [54, 54],
        [55, 55],
        [89, 89],
        [57, 55],
    ];
    const dbscan = new DBScan(
        dataset,
        5,
        3,
        (a: [number, number], b: [number, number]) => {
            return Math.sqrt(
                (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1])
            );
        }
    );

    const { clusters, noise } = dbscan.run();
    expect(clusters).toEqual(
        [
            [0, 1, 2, 3],
            [4, 5, 6],
            [7, 8, 10],
        ].map((entry) => entry.map((index) => dataset[index]))
    );
    expect(noise).toEqual([[89, 89]]);
});
