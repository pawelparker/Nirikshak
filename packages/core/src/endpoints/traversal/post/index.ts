import Supertest from "supertest";
import { URLString } from "../../types/urlString";
import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { Outputs } from "../../types/output";
import { makePositivePostRequest } from "./positive";
import { makeNegativePostRequest } from "./negative";
import { ResourceInstance } from "../../../resource";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { Collection } from "../collection";
import { makeDestructivePostRequest } from "./destructive";
import { PostInput } from "./input";

export async function makePostRequest(
    key: keyof Outputs["POST"],
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["POST"],
    resourceInstance: ResourceInstance,
    helpers: SchemaHelpers,
    collection: Collection
): Promise<{
    status: number;
    headers?: HeadersInstance;
    body?: any;
    input: PostInput;
}> {
    switch (key) {
        case "POSITIVE":
            return makePositivePostRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance,
                collection
            );
        case "NEGATIVE":
            return makeNegativePostRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance
            );
        case "DESTRUCTIVE":
            return makeDestructivePostRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance
            );
    }
}
