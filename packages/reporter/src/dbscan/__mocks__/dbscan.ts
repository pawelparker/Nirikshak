const run = jest.fn(() => {
    return { clusters: [], noise: [] };
});
const DBScan = jest.fn(() => {
    return {
        run,
    };
});

export default DBScan;
