import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { URLString } from "../../types/urlString";
import { ResourceInstance } from "../../../resource/types/helper";
import Supertest from "supertest";
import { generateURL } from "../../generation/urlStringGen";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { generatePutInput, PutInput } from "./input";

export async function makeDestructivePutRequest(
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["PUT"],
    helpers: SchemaHelpers,
    resourceInstance: ResourceInstance
): Promise<{
    status: number;
    headers?: HeadersInstance;
    input: PutInput;
}> {
    const i = await generatePutInput(
        "DESTRUCTIVE",
        input,
        resourceInstance,
        helpers
    );
    const { semantics, body } = i;
    const urlValue = await generateURL(url, resourceInstance, helpers);

    const { status, header } = await server
        .put(urlValue)
        .query(semantics.query ?? {})
        .set(semantics.headers ?? {})
        .send(body);
    return { status, headers: header, input: i };
}
