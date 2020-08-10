import Supertest from "supertest";
import { URLString } from "../../types/urlString";
import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { Outputs } from "../../types/output";
import { makePositiveDeleteRequest } from "./positive";
import { makeNegativeGetRequest } from "./negative";
import { ResourceInstance } from "../../../resource";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { Collection } from "../collection";
import { DeleteInput } from "./input";

export async function makeDeleteRequest(
    key: keyof Outputs["DELETE"],
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["GET"],
    resourceInstance: ResourceInstance,
    helpers: SchemaHelpers,
    collection: Collection
): Promise<{
    status: number;
    headers?: HeadersInstance;
    body?: any;
    input: DeleteInput;
}> {
    switch (key) {
        case "POSITIVE":
            return makePositiveDeleteRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance,
                collection
            );
        case "NEGATIVE":
            return makeNegativeGetRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance
            );
    }
}
