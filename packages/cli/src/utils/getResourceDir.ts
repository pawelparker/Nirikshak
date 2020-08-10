import { CliArgs } from "./types";
import path from "path";
import { getResourceDirEntry } from "./resourceData";
export function getResourceDirectory(
    resource: CliArgs["configuration"]["resources"][0],
    rootDir: CliArgs["configuration"]["dir"]
): string {
    return path.join(
        rootDir,
        getResourceDirEntry(resource)
    );
}
