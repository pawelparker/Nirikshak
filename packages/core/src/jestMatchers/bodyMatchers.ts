export const toMatchBody = (
    bodyMatch: boolean,
    expected: boolean
): { pass: boolean; message: () => string } => {
    return {
        pass: bodyMatch === expected,
        message: (): string =>
            expected !== bodyMatch
                ? `Response bodies did not match`
                : `Response bodies matched`,
    };
};
