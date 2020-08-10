import path from "path";
import fs from "fs-extra";
import { Configuration } from "../utils/types";
import { getResourceName } from "../utils/resourceData";
import { getResourceDirectory } from "../utils/getResourceDir";
export default async function removeDirectory(
    configuration: Configuration,
    name: string
): Promise<void> {
    const entry = configuration.resources.find(
        (r) => getResourceName(r) === name
    )!;

    return fs.remove(
        path.resolve(getResourceDirectory(entry, configuration.dir))
    );
}
