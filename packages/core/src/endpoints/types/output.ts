import { BodyType, HeaderMap, isHeaderMap, isBodyType } from "./helpers";
import {
    isCustomFunction,
    CustomFunctionType,
} from "../../common/types/custom";

export interface HeaderAndStatus {
    headers?: HeaderMap;
    status: number;
}

export function isHeaderAndStatus(input: any): input is HeaderAndStatus {
    if (!input || typeof input !== "object") return false;

    return (
        typeof input.status === "number" &&
        ("headers" in input ? isHeaderMap(input.headers) : true)
    );
}

export type OutputBodies = { body: BodyType | CustomFunctionType };
export type OutputSemantics = {
    semantics: HeaderAndStatus;
};

export interface Outputs {
    GET: {
        POSITIVE:
            | (OutputBodies & OutputSemantics)
            | (OutputBodies & OutputSemantics)[];
        NEGATIVE: OutputSemantics | OutputSemantics[];
    };
    DELETE: {
        POSITIVE:
            | (OutputBodies & OutputSemantics)
            | (OutputBodies & OutputSemantics)[];
        NEGATIVE: OutputSemantics | OutputSemantics[];
    };
    POST: {
        POSITIVE:
            | (OutputBodies & OutputSemantics)
            | (OutputBodies & OutputSemantics)[];
        NEGATIVE: OutputSemantics | OutputSemantics[];
        DESTRUCTIVE: OutputSemantics | OutputSemantics[];
    };
    PUT: {
        POSITIVE:
            | (OutputBodies & OutputSemantics)
            | (OutputBodies & OutputSemantics)[];
        DESTRUCTIVE: OutputSemantics | OutputSemantics[];
    };
    PATCH: {
        POSITIVE:
            | (OutputBodies & OutputSemantics)
            | (OutputBodies & OutputSemantics)[];
        NEGATIVE: OutputSemantics | OutputSemantics[];
        DESTRUCTIVE: OutputSemantics | OutputSemantics[];
    };
}

export const outputValidationFunctions: {
    [KeyOuter in keyof Outputs]: {
        [KeyInner in keyof Outputs[KeyOuter]]: (
            input: any
        ) => input is Outputs[KeyOuter][KeyInner];
    };
} = {
    GET: {
        NEGATIVE: (input: any): input is Outputs["GET"]["NEGATIVE"] => {
            if (!input || typeof input !== "object") return false;
            return Array.isArray(input)
                ? input.every((value) =>
                      outputValidationFunctions["GET"]["NEGATIVE"](value)
                  )
                : isHeaderAndStatus(input.semantics);
        },
        POSITIVE: (input: any): input is Outputs["GET"]["POSITIVE"] => {
            if (!input || typeof input !== "object") return false;
            if (Array.isArray(input))
                return input.every((value) =>
                    outputValidationFunctions["GET"]["POSITIVE"](value)
                );

            return (
                (isCustomFunction(input.body) || isBodyType(input.body)) &&
                isHeaderAndStatus(input.semantics)
            );
        },
    },
    DELETE: {
        NEGATIVE: (input: any): input is Outputs["DELETE"]["NEGATIVE"] => {
            if (!input || typeof input !== "object") return false;

            return Array.isArray(input)
                ? input.every((value) =>
                      outputValidationFunctions["DELETE"]["NEGATIVE"](value)
                  )
                : isHeaderAndStatus(input.semantics);
        },
        POSITIVE: (input: any): input is Outputs["DELETE"]["POSITIVE"] => {
            if (!input || typeof input !== "object") return false;
            if (Array.isArray(input))
                return input.every((value) =>
                    outputValidationFunctions["DELETE"]["POSITIVE"](value)
                );

            return (
                (isCustomFunction(input.body) || isBodyType(input.body)) &&
                isHeaderAndStatus(input.semantics)
            );
        },
    },
    POST: {
        NEGATIVE: (input: any): input is Outputs["POST"]["NEGATIVE"] => {
            if (!input || typeof input !== "object") return false;

            return Array.isArray(input)
                ? input.every((value) =>
                      outputValidationFunctions["POST"]["NEGATIVE"](value)
                  )
                : isHeaderAndStatus(input.semantics);
        },
        DESTRUCTIVE: (input: any): input is Outputs["POST"]["DESTRUCTIVE"] => {
            if (!input || typeof input !== "object") return false;

            return Array.isArray(input)
                ? input.every((value) =>
                      outputValidationFunctions["POST"]["DESTRUCTIVE"](value)
                  )
                : isHeaderAndStatus(input.semantics);
        },
        POSITIVE: (input: any): input is Outputs["POST"]["POSITIVE"] => {
            if (!input || typeof input !== "object") return false;
            if (Array.isArray(input))
                return input.every((value) =>
                    outputValidationFunctions["POST"]["POSITIVE"](value)
                );

            return (
                (isCustomFunction(input.body) || isBodyType(input.body)) &&
                isHeaderAndStatus(input.semantics)
            );
        },
    },
    PATCH: {
        NEGATIVE: (input: any): input is Outputs["PATCH"]["NEGATIVE"] => {
            if (!input || typeof input !== "object") return false;

            return Array.isArray(input)
                ? input.every((value) =>
                      outputValidationFunctions["PATCH"]["NEGATIVE"](value)
                  )
                : isHeaderAndStatus(input.semantics);
        },
        DESTRUCTIVE: (input: any): input is Outputs["PATCH"]["DESTRUCTIVE"] => {
            if (!input || typeof input !== "object") return false;

            return Array.isArray(input)
                ? input.every((value) =>
                      outputValidationFunctions["PATCH"]["DESTRUCTIVE"](value)
                  )
                : isHeaderAndStatus(input.semantics);
        },
        POSITIVE: (input: any): input is Outputs["PATCH"]["POSITIVE"] => {
            if (!input || typeof input !== "object") return false;

            if (Array.isArray(input))
                return input.every((value) =>
                    outputValidationFunctions["PATCH"]["POSITIVE"](value)
                );

            return (
                (isCustomFunction(input.body) || isBodyType(input.body)) &&
                isHeaderAndStatus(input.semantics)
            );
        },
    },
    PUT: {
        DESTRUCTIVE: (input: any): input is Outputs["PUT"]["DESTRUCTIVE"] => {
            if (!input || typeof input !== "object") return false;

            return Array.isArray(input)
                ? input.every((value) =>
                      outputValidationFunctions["PUT"]["DESTRUCTIVE"](value)
                  )
                : isHeaderAndStatus(input.semantics);
        },
        POSITIVE: (input: any): input is Outputs["PUT"]["POSITIVE"] => {
            if (!input || typeof input !== "object") return false;
            if (Array.isArray(input))
                return input.every((value) =>
                    outputValidationFunctions["PUT"]["POSITIVE"](value)
                );

            return (
                (isCustomFunction(input.body) || isBodyType(input.body)) &&
                isHeaderAndStatus(input.semantics)
            );
        },
    },
};
