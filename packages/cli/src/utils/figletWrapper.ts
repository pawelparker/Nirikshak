import figlet from "figlet";

const figletPromise = (
    message: Parameters<typeof figlet>[0],
    options?: Exclude<Parameters<typeof figlet>[1], undefined>
): Promise<string> => {
    return new Promise(
        (
            resolve: (value: string | undefined) => void,
            reject: (err: Error) => void
        ) => {
            figlet(message, options, (error, data) => {
                if (error) reject(error);
                else resolve(data);
            });
        }
    );
};

export default figletPromise;
