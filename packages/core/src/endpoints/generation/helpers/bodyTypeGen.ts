import faker from "faker";
import {
    BodyInstance,
    BodyType,
    isBase,
    isWithModifiers,
    isOneOfEntries,
} from "../../types/helpers";
import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers } from "../../../common/types/helpers";
import { generateBase } from "./baseGen";
import { generateWithModifiers } from "./withModifiersGen";
import { generateOneOfEntries } from "./oneOfGen";
import { isResourceString } from "../../types/resourceString";
import { getFromResource } from "../resourceStringGen";

export async function generateBodyType(
    input: BodyType,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<BodyInstance> {
    const o: BodyInstance = {};

    for (const key in input) {
        const entry = input[key];
        if (isResourceString(entry)) {
            try {
                o[key] = getFromResource(entry, resource);
            } catch {
                continue;
            }
        } else if (isBase(entry))
            o[key] = await generateBase(entry, resource, helpers);
        else if (isWithModifiers(entry)) {
            if (entry.optional && faker.random.boolean()) continue;

            o[key] = await generateWithModifiers(entry, resource, helpers);
        } else if (isOneOfEntries(entry)) {
            const selectedValue = generateOneOfEntries(entry);

            if (isWithModifiers(selectedValue.selection)) {
                if (selectedValue.selection.optional && faker.random.boolean())
                    continue;
                o[key] = await generateWithModifiers(
                    selectedValue.selection,
                    resource,
                    helpers
                );
            } else if (isBase(selectedValue.selection))
                o[key] = await generateBase(
                    selectedValue.selection,
                    resource,
                    helpers
                );
            else
                o[key] = await generateBodyType(
                    selectedValue.selection,
                    resource,
                    helpers
                );
        } else {
            o[key] = await generateBodyType(entry, resource, helpers);
        }
    }

    return o;
}
