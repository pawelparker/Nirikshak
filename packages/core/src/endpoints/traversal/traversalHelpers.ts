import { ResourceInstance } from "../../resource/types/helper";
import { SchemaHelpers } from "../../common/types/helpers";
import {
    CustomFunctionType,
    normalizeCustomFunction,
} from "../../common/types/custom";
import _ from "lodash";
import { NodeEntry, ParsedNode } from "../graph/nodeTypes";
import { Collection } from "./collection";
import { InputInstance } from ".";
export interface TraversalHelperFunctions {
    (
        input: any,
        resourceInstance: ResourceInstance,
        helpers: SchemaHelpers,
        nodeEntry: NodeEntry,
        collection: Collection,
        inputInstance: InputInstance,
        parsedNode: ParsedNode,
        ...args: any[]
    ): Promise<boolean>;
}

export type TraversalHelpers = Record<string, TraversalHelperFunctions>;

export async function validateWithTraversalHelpers(
    input: any,
    customFunction: CustomFunctionType,
    resource: ResourceInstance,
    schemaHelpers: SchemaHelpers,
    traversalHelpers: TraversalHelpers,
    nodeEntry: NodeEntry,
    collection: Collection,
    inputInstance: InputInstance,
    parsedNode: ParsedNode
): Promise<boolean> {
    const object = normalizeCustomFunction(customFunction);
    const path = object.function.slice(7);
    if (!_.has(traversalHelpers, path))
        throw new Error(
            `Could not find traversal helper function: ${
                object.function
            }, args: ${object.args.join(",")}`
        );
    const value = await _.get(traversalHelpers, path)(
        input,
        resource,
        schemaHelpers,
        nodeEntry,
        collection,
        inputInstance,
        parsedNode,
        ...object.args
    );
    if (typeof value !== "boolean")
        throw new Error(
            `function: ${object.function}, args: ${object.args.join(
                ","
            )} did not return a boolean value`
        );
    return value;
}
