export const runDBScanParallel = jest.fn().mockImplementation(() =>
    Promise.resolve({
        clusters: [],
        noise: [],
    })
);
