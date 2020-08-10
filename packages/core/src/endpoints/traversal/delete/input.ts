import {
    HeaderAndQueryInstance,
    generateHeaderAndQuery,
} from "../../generation/input/headerAndQuery";
import { Inputs } from "../..";
import { ResourceInstance, SchemaHelpers } from "../../..";

export interface DeleteInput {
    semantics: HeaderAndQueryInstance;
}

// Generate input from an resource
export async function generateDeleteInput(
    input: Inputs["DELETE"],
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<DeleteInput> {
    return {
        semantics: await generateHeaderAndQuery(
            input.semantics,
            resource,
            helpers
        ),
    };
}
