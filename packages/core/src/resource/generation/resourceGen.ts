import { ResourceBase, Resource } from "../types/resource";
import {
    ResourceInstance,
    isBaseType,
    isWithModifiers,
    isOneOfEntries,
    isWithModifiersBaseType,
    isWithModifiersResource,
    ResourceInstanceBase,
} from "../types/helper";
import { generateBaseType } from "./baseGen";
import faker from "faker";
import { generateWithModifiers } from "./withModifiersGen";
import { generateOneOfEntries } from "./oneOfEntries";
import { SchemaHelpers } from "../../common/types/helpers";

export async function generateResourceBase(
    input: ResourceBase,
    Helpers: SchemaHelpers
): Promise<ResourceInstanceBase> {
    const o: ResourceInstanceBase = {};
    for (const key in input) {
        // For each key value pair of resource base description
        const entry = input[key];

        if (isBaseType(entry)) {
            // Base type
            o[key] = await generateBaseType(entry, Helpers);
        } else if (isWithModifiers(entry)) {
            // With modifiers
            // If the entry is optional, skip this key
            if (entry.optional && faker.random.boolean()) continue;
            o[key] = await generateWithModifiers(entry, Helpers);
        } else if (isOneOfEntries(entry)) {
            // Selecting from oneof
            const actualEntry = generateOneOfEntries(entry);

            // Generating data
            switch (actualEntry.type) {
                case "base type":
                    // If base type, with modifiers
                    if (isWithModifiersBaseType(actualEntry.selection)) {
                        o[key] = await generateWithModifiers(
                            actualEntry.selection,
                            Helpers
                        );
                    }
                    // Simply base type
                    else
                        o[key] = await generateBaseType(
                            actualEntry.selection,
                            Helpers
                        );
                    break;
                case "resource base":
                    // If with modifiers, resource base
                    if (isWithModifiersResource(actualEntry.selection)) {
                        o[key] = await generateWithModifiers(
                            actualEntry.selection,
                            Helpers
                        );
                    }
                    // Simply resource base
                    else
                        o[key] = await generateResourceBase(
                            actualEntry.selection,
                            Helpers
                        );
                    break;
            }
        }
        // Resource base
        else o[key] = await generateResourceBase(entry, Helpers);
    }

    return o;
}

export async function generateResource(
    input: Resource,
    Helpers: SchemaHelpers
): Promise<ResourceInstance> {
    return {
        // Generate resource base. This also includes id
        ...(await generateResourceBase(input, Helpers)),
        // Overriding any other id defs with the main one
        id: (await generateBaseType(input.id, Helpers)) as string | number,
    };
}
