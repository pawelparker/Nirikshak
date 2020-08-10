import Supertest from "supertest";
import { URLString } from "../../types/urlString";
import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { Outputs } from "../../types/output";
import { makePositivePutRequest } from "./positive";
import { ResourceInstance } from "../../../resource";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { Collection } from "../collection";
import { makeDestructivePutRequest } from "./destructive";
import { PutInput } from "./input";

export async function makePutRequest(
    key: keyof Outputs["PUT"],
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["PUT"],
    resourceInstance: ResourceInstance,
    helpers: SchemaHelpers,
    collection: Collection
): Promise<{
    status: number;
    headers?: HeadersInstance;
    body?: any;
    input: PutInput;
}> {
    switch (key) {
        case "POSITIVE":
            return makePositivePutRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance,
                collection
            );
        case "DESTRUCTIVE":
            return makeDestructivePutRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance
            );
    }
}
