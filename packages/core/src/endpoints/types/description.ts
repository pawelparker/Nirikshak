import { Inputs, inputValidationFunctions } from "./input";
import { Outputs, outputValidationFunctions } from "./output";
import { MethodType, isMethodType } from "./helpers";
import { URLString, isURLString } from "./urlString";

type SingleOrArray<T> = T | T[];

export type Description = {
    [K in MethodType]?: SingleOrArray<{
        url: URLString;
        input: Inputs[K];
        output: {
            [P in keyof Outputs[K]]?: Outputs[K][P];
        };
    }>;
};

export function isDescription(arg: any): arg is Description {
    if (!arg || typeof arg !== "object") return false;

    return Object.keys(arg).every((key) => {
        if (!isMethodType(key)) return false;

        let value = true;
        const entryArr = Array.isArray(arg[key]) ? arg[key] : [arg[key]];
        for (const entry of entryArr) {
            if (
                !value ||
                !("url" in entry) ||
                !isURLString(entry.url) ||
                !("input" in entry) ||
                !("output" in entry) ||
                !entry["output"] ||
                typeof entry["output"] !== "object"
            )
                return false;

            value =
                value &&
                inputValidationFunctions[key](entry["input"]) &&
                Object.keys(entry["output"]).every(
                    (caseValue) =>
                        outputValidationFunctions[key][
                            caseValue as keyof Outputs[typeof key]
                        ] &&
                        outputValidationFunctions[key][
                            caseValue as keyof Outputs[typeof key]
                        ](
                            entry["output"][
                                caseValue as keyof Outputs[typeof key]
                            ]
                        )
                );
        }

        return value;
    });
}
