import {
    HeaderAndQueryInstance,
    generateHeaderAndQuery,
} from "../../generation/input/headerAndQuery";
import { Inputs } from "../..";
import { ResourceInstance, SchemaHelpers } from "../../..";

export interface GetInput {
    semantics: HeaderAndQueryInstance;
}

// Generate input from an resource
export async function generateGetInput(
    input: Inputs["GET"],
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<GetInput> {
    return {
        semantics: await generateHeaderAndQuery(
            input.semantics,
            resource,
            helpers
        ),
    };
}
