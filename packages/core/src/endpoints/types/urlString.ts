import { isFakerString } from "../../common/types/fakerTypes";
import { isCustomFunctionString } from "../../common/types/custom";
import { isResourceString } from "./resourceString";

export type URLString = string;

export function isURLString(input: any): input is URLString {
    if (typeof input !== "string") return false;

    const components = input.split("/");

    return components.every((component) => {
        if (component[0] == "{" && component[component.length - 1] == "}") {
            const slice = component.slice(1, component.length - 1);
            return (
                isFakerString(slice) ||
                isCustomFunctionString(slice) ||
                isResourceString(slice)
            );
        } else return true;
    });
}

export function normalizeURLString(input: URLString): URLString {
    if (input[0] !== "/") return "/" + input;
    return input;
}
