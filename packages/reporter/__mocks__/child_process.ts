import cp from "child_process";
const childProcess: typeof cp = jest.genMockFromModule("child_process");

const send = jest.fn();
const on = jest
    .fn()
    .mockImplementation((event: string, callback: (input: any) => void) => {
        void event;
        setTimeout(() => callback("Ready"), 10);
        setTimeout(() => callback({ clusters: [], noise: [] }), 30);
    });
const child = {
    send,
    on,
};
childProcess.fork = jest.fn().mockReturnValue(child);

export default childProcess;
