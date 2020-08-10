import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import { URLString } from "../../types/urlString";
import { ResourceInstance } from "../../../resource/types/helper";
import Supertest from "supertest";
import { generateURL } from "../../generation/urlStringGen";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { generatePatchInput, PatchInput } from "./input";

export async function makeNegativePatchRequest(
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["PATCH"],
    helpers: SchemaHelpers,
    resourceInstance: ResourceInstance
): Promise<{
    status: number;
    headers?: HeadersInstance;
    input: PatchInput;
}> {
    const i = await generatePatchInput(
        "NEGATIVE",
        input,
        resourceInstance,
        helpers
    );
    const { semantics, body } = i;
    const urlValue = await generateURL(url, resourceInstance, helpers);

    const { status, header } = await server
        .patch(urlValue)
        .query(semantics.query ?? {})
        .set(semantics.headers ?? {})
        .send(body);
    return { status, headers: header, input: i };
}
