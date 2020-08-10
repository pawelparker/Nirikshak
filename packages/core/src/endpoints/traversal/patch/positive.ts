import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import Supertest from "supertest";
import { ResourceInstance } from "../../../resource/types/helper";
import { URLString } from "../../types/urlString";
import { generateURL } from "../../generation/urlStringGen";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { generatePatchInput, PatchInput } from "./input";
import { Collection } from "../collection";

export async function makePositivePatchRequest(
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["PATCH"],
    helpers: SchemaHelpers,
    resourceInstance: ResourceInstance,
    collection: Collection
): Promise<{
    status: number;
    headers: HeadersInstance;
    body: any;
    input: PatchInput;
}> {
    const i = await generatePatchInput(
        "POSITIVE",
        input,
        resourceInstance,
        helpers
    );
    const { semantics, body: b } = i;
    const urlValue = await generateURL(url, resourceInstance, helpers);

    const { status, header, body } = await server
        .patch(urlValue)
        .query(semantics.query ?? {})
        .set(semantics.headers ?? {})
        .send(b);
    if (!collection.has(resourceInstance.id))
        throw new Error(`Cannot update non existing resource in collection`);

    return { status, headers: header, body, input: i };
}
