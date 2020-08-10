import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { URLString } from "../../types/urlString";
import { ResourceInstance } from "../../../resource/types/helper";
import Supertest from "supertest";
import { generateURL } from "../../generation/urlStringGen";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { generateDeleteInput, DeleteInput } from "./input";

export async function makeNegativeGetRequest(
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["DELETE"],
    helpers: SchemaHelpers,
    resourceInstance: ResourceInstance
): Promise<{
    status: number;
    headers?: HeadersInstance;
    input: DeleteInput;
}> {
    const i = await generateDeleteInput(
        input,
        resourceInstance,
        helpers
    );
    const { semantics } = i;
    const urlValue = await generateURL(url, resourceInstance, helpers);

    const { status, header } = await server
        .delete(urlValue)
        .query(semantics.query ?? {})
        .set(semantics.headers ?? {});
    return { status, headers: header, input: i };
}
