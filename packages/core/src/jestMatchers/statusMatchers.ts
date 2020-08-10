import { statusValidation } from "../endpoints";

export const toMatchStatus = (
    recieved: any,
    expected: number[]
): { pass: boolean; message: () => string } => {
    const pass = statusValidation(recieved, expected);
    return {
        pass,
        message: (): string =>
            !pass
                ? `Status mismatch: Expected ${expected.join(
                      ","
                  )} got ${recieved}`
                : "Statuses matched",
    };
};
