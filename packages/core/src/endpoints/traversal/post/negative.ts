import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { URLString } from "../../types/urlString";
import { ResourceInstance } from "../../../resource/types/helper";
import Supertest from "supertest";
import { generateURL } from "../../generation/urlStringGen";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { generatePostInput, PostInput } from "./input";
export async function makeNegativePostRequest(
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["POST"],
    helpers: SchemaHelpers,
    resourceInstance: ResourceInstance
): Promise<{
    status: number;
    headers?: HeadersInstance;
    input: PostInput;

}> {
    const i = await generatePostInput(
        "NEGATIVE",
        input,
        resourceInstance,
        helpers
    );
    const { semantics, body: b } = i;

    const urlValue = await generateURL(url, resourceInstance, helpers);

    const { status, header } = await server
        .post(urlValue)
        .query(semantics.query ?? {})
        .set(semantics.headers ?? {})
        .send(b);
    return { status, headers: header, input: i };
}
