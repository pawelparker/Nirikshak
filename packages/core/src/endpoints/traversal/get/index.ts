import Supertest from "supertest";
import { URLString } from "../../types/urlString";
import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { Outputs } from "../../types/output";
import { makePositiveGetRequest } from "./positive";
import { makeNegativeGetRequest } from "./negative";
import { ResourceInstance } from "../../../resource";

import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { GetInput } from "./input";
export async function makeGetRequest(
    key: keyof Outputs["GET"],
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["GET"],
    resourceInstance: ResourceInstance,
    helpers: SchemaHelpers
): Promise<{
    status: number;
    headers?: HeadersInstance;
    body?: any;
    input: GetInput;
}> {
    switch (key) {
        case "POSITIVE":
            return makePositiveGetRequest(
                server,
                url,
                input,
                helpers,
                resourceInstance
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
