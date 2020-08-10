import { ChildProcessInput } from "../src/dbscan/parent";
const process: Record<string, any> = {};
process.send = jest.fn();
process.on = jest.fn(
    (event, callback: (message: ChildProcessInput<any>) => void) => {
        void event;
        callback({
            dataset: [],
            minPoints: 0,
            epsilon: 0,
        });
    }
);

process.exit = jest.fn();

export default process;
