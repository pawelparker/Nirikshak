export type ResourceString = string;

export function isResourceString(str: any): str is ResourceString {
    return typeof str === "string" && str.startsWith("resource:");
}
