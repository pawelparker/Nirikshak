import { URLString, normalizeURLString } from "../types/urlString";
import { ResourceInstance } from "../../resource/types/helper";
import { Literal, isLiteral } from "../../common/types/literals";
import { isFakerString } from "../../common/types/fakerTypes";
import { generateFaker } from "../../common/generation/fakerGen";
import { isCustomFunctionString } from "../../common/types/custom";
import { SchemaHelpers } from "../../common/types/helpers";
import { generateCustom } from "../../common/generation/customGen";
import { getFromResource } from "./resourceStringGen";
import { ResourceString } from "../types/resourceString";

export async function generateURL(
    urlString: URLString,
    instance: ResourceInstance,
    helpers: SchemaHelpers
): Promise<string> {
    const components = normalizeURLString(urlString).split("/");
    const urlArr: Literal[] = [];
    for (const component of components) {
        if (component[0] === "{" && component[component.length - 1] === "}") {
            // Faker or custom or resource
            const slice = component.slice(1, component.length - 1);
            if (isFakerString(slice)) urlArr.push(generateFaker(slice));
            else if (isCustomFunctionString(slice))
                urlArr.push(await generateCustom(slice, helpers));
            else {
                const entry = getFromResource(
                    slice as ResourceString,
                    instance
                );
                if (!isLiteral(entry))
                    throw new Error(
                        `Invalid resource interpolation for url: ${slice}`
                    );
                urlArr.push(entry);
            }
        } else urlArr.push(component);
    }

    return urlArr.join("/");
}
