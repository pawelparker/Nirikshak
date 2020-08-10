import {
    HeaderAndQueryInstance,
    generateHeaderAndQuery,
} from "../../generation/input/headerAndQuery";
import { BodyInstance, Outputs, Inputs } from "../../types";
import { ResourceInstance, SchemaHelpers } from "../../..";
import { generateBodyType } from "../..";

export interface PatchInput {
    semantics: HeaderAndQueryInstance;
    body: BodyInstance;
}

// Generate input from an resource
export async function generatePatchInput(
    caseValue: keyof Outputs["PATCH"],
    input: Inputs["PATCH"],
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<PatchInput> {
    if (caseValue === "DESTRUCTIVE" && !input.destructiveBody)
        throw new Error(
            `Did not find a destructive body description. Cannot make destrcutive post request`
        );
    return {
        semantics: await generateHeaderAndQuery(
            input.semantics,
            resource,
            helpers
        ),
        body: await generateBodyType(
            caseValue === "DESTRUCTIVE" ? input.destructiveBody! : input.body,
            resource,
            helpers
        ),
    };
}
