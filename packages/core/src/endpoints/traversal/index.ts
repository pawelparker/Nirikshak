import Supertest from "supertest";
import { MethodType, Inputs, Outputs, Cases, BodyInstance } from "../types";
import { URLString } from "../types/urlString";
import { ResourceInstance } from "../../resource";
import { SchemaHelpers } from "../../common";
import { Collection } from "./collection";
import { HeadersInstance } from "../generation/helpers/headerMapGen";
import { makeGetRequest } from "./get";
import { makeDeleteRequest } from "./delete";
import { makePatchRequest } from "./patch";
import { makePostRequest } from "./post";
import { makePutRequest } from "./put";
import { InputSemantics, InputBodies } from "../types/input";
import { HeaderAndQueryInstance } from "../generation/input/headerAndQuery";
export type InputInstance = {
    semantics: HeaderAndQueryInstance;
    body?: BodyInstance;
};
export { extractBodiesFromOutput, bodyValidation } from "./bodyValidation";
export { TraversalHelpers, TraversalHelperFunctions } from "./traversalHelpers";
export { Collection, getRandomExistingResource } from "./collection";
export {
    extractHeadersFromSemantics,
    extractStatusFromSemantics,
    statusValidation,
    headersValidation,
} from "./semanticsValidation";
export async function makeRequest(
    url: URLString,
    method: MethodType,
    caseValue: Cases,
    server: Supertest.SuperTest<Supertest.Test>,
    input: InputSemantics & Partial<InputBodies>,
    resource: ResourceInstance,
    helpers: SchemaHelpers,
    collection: Collection
): Promise<{
    status: number;
    headers?: HeadersInstance;
    body?: any;
    input: InputInstance;
}> {
    switch (method) {
        case "GET":
            return makeGetRequest(
                caseValue as keyof Outputs["GET"],
                server,
                url,
                input,
                resource,
                helpers
            );
        case "DELETE":
            return makeDeleteRequest(
                caseValue as keyof Outputs["DELETE"],
                server,
                url,
                input,
                resource,
                helpers,
                collection
            );
        case "PATCH":
            return makePatchRequest(
                caseValue,
                server,
                url,
                input as Inputs["PATCH"],
                resource,
                helpers,
                collection
            );
        case "POST":
            return makePostRequest(
                caseValue,
                server,
                url,
                input as Inputs["PATCH"],
                resource,
                helpers,
                collection
            );
        case "PUT":
            return makePutRequest(
                caseValue as keyof Outputs["PUT"],
                server,
                url,
                input as Inputs["PUT"],
                resource,
                helpers,
                collection
            );
    }
}
