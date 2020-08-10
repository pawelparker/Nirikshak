import { Configuration } from "./types";

export const getResourceName = (
    resource: Configuration["resources"][0]
): string => (typeof resource === "string" ? resource : resource.name);
export const getResourceDirEntry = (
    resource: Configuration["resources"][0]
): string => (typeof resource === "string" ? resource : resource.dir);
