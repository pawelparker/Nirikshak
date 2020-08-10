import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import Supertest from "supertest";
import { ResourceInstance } from "../../../resource/types/helper";
import { URLString } from "../../types/urlString";
import { generateURL } from "../../generation/urlStringGen";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { generateGetInput, GetInput } from "./input";

export async function makeNegativeGetRequest(
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["GET"],
    helpers: SchemaHelpers,
    resourceInstance: ResourceInstance
): Promise<{
    status: number;
    headers: HeadersInstance;
    input: GetInput;
}> {
    const i = await generateGetInput(
        input,
        resourceInstance,
        helpers
    );
    const { semantics } = i;
    const urlValue = await generateURL(url, resourceInstance, helpers);

    const { status, header } = await server
        .get(urlValue)
        .query(semantics.query ?? {})
        .set(semantics.headers ?? {});
    return { status, headers: header, input: i };
}
