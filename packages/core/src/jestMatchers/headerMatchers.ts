export const toMatchHeaders = (
    match: boolean,
    expected: boolean
): { pass: boolean; message: () => string } => {
    return {
        pass: expected === match,
        message: (): string =>
            expected !== match ? `Headers did not match` : "Headers matched",
    };
};
