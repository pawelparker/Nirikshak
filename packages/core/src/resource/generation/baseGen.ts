import { Literal } from "../../common/types/literals";
import { isFakerType } from "../../common/types/fakerTypes";
import { isCustomFunction } from "../../common/types/custom";
import { generateCustom } from "../../common/generation/customGen";
import { BaseType } from "../types/helper";
import { generateFaker } from "../../common/generation/fakerGen";
import { SchemaHelpers, Primitives } from "../../common/types/helpers";

// Generating base type entry
export async function generateBaseType(
    input: BaseType,
    Helpers: SchemaHelpers
): Promise<Primitives> {
    if (Array.isArray(input)) {
        return Promise.all(
            (input as (Literal | BaseType)[]).map((entry) =>
                generateBaseType(entry, Helpers)
            )
        );
    }

    if (isFakerType(input)) return generateFaker(input);
    if (isCustomFunction(input)) return generateCustom(input, Helpers);

    return input;
}
