import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers } from "../../../common/types/helpers";
import { Literal, isLiteral } from "../../../common/types/literals";
import { isFakerType } from "../../../common/types/fakerTypes";
import { generateFaker } from "../../../common/generation/fakerGen";
import { isCustomFunction } from "../../../common/types/custom";
import { generateCustom } from "../../../common/generation/customGen";
import { isResourceString } from "../../types/resourceString";
import { getFromResource } from "../resourceStringGen";
import { BaseType } from "../../types/helpers";

export async function generateBaseType(
    input: BaseType,
    instance: ResourceInstance,
    helpers: SchemaHelpers
): Promise<Literal> {
    if (isFakerType(input)) return generateFaker(input);
    if (isCustomFunction(input)) return generateCustom(input, helpers);
    if (isResourceString(input)) {
        const value = getFromResource(input, instance);
        if (!isLiteral(value))
            throw new Error(
                `Resource string ${input} resolved to non primitive value`
            );
        return value;
    }
    return input;
}
