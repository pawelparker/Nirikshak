import { Base } from "../../types/helpers";
import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers, Primitives } from "../../../common/types/helpers";
import { generateBaseType } from "./baseTypeGen";

export function generateBase(
    input: Base,
    instance: ResourceInstance,
    helpers: SchemaHelpers
): Promise<Primitives> {
    if (Array.isArray(input)) {
        return Promise.all(
            (input as Base[]).map((entry) =>
                generateBase(entry, instance, helpers)
            )
        );
    }

    return generateBaseType(input, instance, helpers);
}
