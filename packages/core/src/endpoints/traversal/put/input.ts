import {
    HeaderAndQueryInstance,
    generateHeaderAndQuery,
} from "../../generation/input/headerAndQuery";
import { BodyInstance, Inputs, Outputs } from "../../types";
import { ResourceInstance, SchemaHelpers } from "../../..";
import { generateBodyType } from "../..";

export interface PutInput {
    semantics: HeaderAndQueryInstance;
    body: BodyInstance;
}

// Generate input from an resource
export async function generatePutInput(
    caseValue: keyof Outputs["PUT"],
    input: Inputs["PUT"],
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<PutInput> {
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
