import { CustomFunctionType, normalizeCustomFunction } from "../types/custom";
import _ from "lodash";
import { Literal, isLiteral } from "../types/literals";
import { SchemaHelpers } from "../types/helpers";

// Function to extract the custom function from helper and generate value
export async function generateCustom(
    input: CustomFunctionType,
    helpers: SchemaHelpers
): Promise<Literal> {
    const object = normalizeCustomFunction(input);
    let value: Promise<any>;
    try {
        value = _.get(helpers, object.function.slice(7))(...object.args);
    } catch (e) {
        throw new Error(
            `function: ${object.function}, args: ${object.args.join(",")}`
        );
    }

    const resolvedValue = await value;
    if (!isLiteral(resolvedValue))
        throw new Error(`Non literal type value from ${object.function}`);
    return resolvedValue;
}
