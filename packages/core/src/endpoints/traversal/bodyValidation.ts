import {
    BodyType,
    BaseType,
    isBaseType,
    Base,
    WithModifiers,
    OneOfEntries,
    isBase,
    isWithModifiersBodyType,
    isWithModifiersBase,
} from "../types/helpers";
import { ResourceInstance, isOneOfEntries } from "../../resource/types/helper";
import { SchemaHelpers, isPrimitives } from "../../common/types/helpers";
import { ResourceString, isResourceString } from "../types/resourceString";
import { getFromResource } from "../generation/resourceStringGen";
import _ from "lodash";
import { isLiteral } from "../../common/types/literals";
import { generateBaseType } from "../generation/helpers/baseTypeGen";
import { isFakerType } from "../../common/types/fakerTypes";
import {
    isCustomFunction,
    CustomFunctionType,
} from "../../common/types/custom";
import { HeaderAndStatus } from "../types";
import {
    TraversalHelpers,
    validateWithTraversalHelpers,
} from "./traversalHelpers";
import { NodeEntry, ParsedNode } from "../graph/nodeTypes";
import { Collection } from "./collection";
import { InputInstance } from ".";

export function matchResourceString(
    input: any,
    resourceString: ResourceString,
    resource: ResourceInstance
): boolean {
    return _.isEqual(input, getFromResource(resourceString, resource));
}

export async function matchBaseType(
    input: any,
    baseType: BaseType,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<boolean> {
    return (
        isLiteral(input) &&
        (isFakerType(baseType) ||
        isCustomFunction(baseType) ||
        isResourceString(baseType)
            ? typeof input ===
              typeof (await generateBaseType(baseType, resource, helpers))
            : input === baseType)
    );
}

export async function matchBase(
    input: any,
    base: Base,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<boolean> {
    if (isBaseType(base)) return matchBaseType(input, base, resource, helpers);
    if (!Array.isArray(input) || input.length !== base.length) return false;

    for (let i = 0; i < base.length; i++)
        if (!(await matchBase(input[i], base[i], resource, helpers)))
            return false;
    return true;
}

export async function matchWithModifiersBase(
    input: any,
    schema: WithModifiers<Base>,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<boolean> {
    // Optional is considered before invoking this function

    if (schema.nullable && input === null) return true;
    if (schema.plural) {
        if (!Array.isArray(input)) return false;
        // Fire up matching for every entry
        const promiseArr: Promise<boolean>[] = input.map((entry) =>
            matchBase(entry, schema.type, resource, helpers)
        );
        // Wait for all to be resolved
        const resolved = await Promise.all(promiseArr);
        // Return the verdict
        return resolved.every((returnValue) => returnValue === true);
    }

    // Neither plural, nor nullable
    return matchBase(input, schema.type, resource, helpers);
}

export async function matchWithModifiersBodyType(
    input: any,
    schema: WithModifiers<BodyType>,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<boolean> {
    // Optional is considered before invoking this function

    if (schema.nullable && input === null) return true;
    if (schema.plural) {
        if (!Array.isArray(input)) return false;
        // Fire up matching for every entry
        const promiseArr: Promise<boolean>[] = input.map((entry) =>
            matchBody(entry, schema.field, resource, helpers)
        );
        // Wait for all to be resolved
        const resolved = await Promise.all(promiseArr);
        // Return the verdict
        return resolved.every((returnValue) => returnValue === true);
    }

    // Neither plural, nor nullable
    return matchBody(input, schema.field, resource, helpers);
}

export async function matchOneOfEntries(
    input: any,
    schema: OneOfEntries,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<boolean> {
    // If an optional entry is provided
    if (input === undefined) {
        if ("types" in schema)
            for (const type of schema.types)
                if (isWithModifiersBase(type) && type.optional) return true;
        if ("fields" in schema)
            for (const field of schema.fields)
                if (isWithModifiersBodyType(field) && field.optional)
                    return true;
        return false;
    }

    // If a null entry is provided
    if (input === null) {
        if ("types" in schema)
            for (const type of schema.types)
                if (
                    (isWithModifiersBase(type) && type.nullable) ||
                    type === null
                )
                    return true;
        if ("fields" in schema)
            for (const field of schema.fields)
                if (isWithModifiersBodyType(field) && field.nullable)
                    return true;
        return false;
    }

    // Input is not null or undefined

    if (isPrimitives(input)) {
        // Primitive can only be generated from schema.types
        if ("types" in schema)
            for (const type of schema.types)
                if (isBase(type)) {
                    if (await matchBase(input, type, resource, helpers))
                        return true;
                } else if (
                    await matchWithModifiersBase(input, type, resource, helpers)
                )
                    return true;
    } else if ("fields" in schema) {
        for (const field of schema.fields) {
            if (isWithModifiersBodyType(field)) {
                if (
                    await matchWithModifiersBodyType(
                        input,
                        field,
                        resource,
                        helpers
                    )
                )
                    return true;
            } else if (await matchBody(input, field, resource, helpers))
                return true;
        }
    }

    return false;
}

export async function matchBody(
    body: any,
    bodySchema: BodyType,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<boolean> {
    if (!body || typeof body !== "object") return false;

    let value = true;
    for (const key in bodySchema) {
        const entry = bodySchema[key];
        if (isResourceString(entry)) {
            if (body[key] === undefined) {
                try {
                    getFromResource(entry, resource);
                    value = false;
                } catch {
                    continue;
                }
            }
            value = matchResourceString(body[key], entry, resource);
            void value;
        } else if (isBase(entry))
            value = await matchBase(body[key], entry, resource, helpers);
        else if (isWithModifiersBase(entry))
            value =
                entry.optional && body[key] === undefined
                    ? true
                    : await matchWithModifiersBase(
                          body[key],
                          entry,
                          resource,
                          helpers
                      );
        else if (isWithModifiersBodyType(entry))
            value =
                entry.optional && body[key] === undefined
                    ? true
                    : await matchWithModifiersBodyType(
                          body[key],
                          entry,
                          resource,
                          helpers
                      );
        else if (isOneOfEntries(entry))
            value = await matchOneOfEntries(
                body[key],
                entry,
                resource,
                helpers
            );
        else value = await matchBody(body[key], entry, resource, helpers);

        if (!value) return false;
    }

    return value;
}

export function extractBodiesFromOutput(
    input: {
        semantics: HeaderAndStatus;
        body?: BodyType | CustomFunctionType;
    }[]
): (
    | { type: "body type"; value: BodyType }
    | { type: "custom function"; value: CustomFunctionType }
)[] {
    const bodyArr: (
        | { type: "body type"; value: BodyType }
        | { type: "custom function"; value: CustomFunctionType }
    )[] = [];
    input.forEach(
        (entry) =>
            "body" in entry &&
            bodyArr.push(
                isCustomFunction(entry.body)
                    ? { type: "custom function", value: entry.body }
                    : { type: "body type", value: entry.body as BodyType }
            )
    );
    return bodyArr;
}

export async function bodyValidation(
    body: any,
    bodyArr: (
        | { type: "body type"; value: BodyType }
        | { type: "custom function"; value: CustomFunctionType }
    )[],
    resource: ResourceInstance,
    schemaHelpers: SchemaHelpers,
    traversalHelpers: TraversalHelpers,
    nodeEntry: NodeEntry,
    collection: Collection,
    input: InputInstance,
    parsedNode: ParsedNode
): Promise<boolean> {
    return (
        !bodyArr.length ||
        (
            await Promise.all(
                bodyArr.map((b) =>
                    b.type === "body type"
                        ? matchBody(body, b.value, resource, schemaHelpers)
                        : validateWithTraversalHelpers(
                              body,
                              b.value,
                              resource,
                              schemaHelpers,
                              traversalHelpers,
                              nodeEntry,
                              collection,
                              input,
                              parsedNode
                          )
                )
            )
        ).some((val) => val)
    );
}
