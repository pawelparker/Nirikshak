import { Inputs } from "../../types/input";
import { SchemaHelpers } from "../../../common/types/helpers";
import Supertest from "supertest";
import { ResourceInstance } from "../../../resource/types/helper";
import { URLString } from "../../types/urlString";
import { generateURL } from "../../generation/urlStringGen";
import { HeadersInstance } from "../../generation/helpers/headerMapGen";
import { Collection } from "../collection";
import { generatePostInput, PostInput } from "./input";

export async function makePositivePostRequest(
    server: Supertest.SuperTest<Supertest.Test>,
    url: URLString,
    input: Inputs["POST"],
    helpers: SchemaHelpers,
    resourceInstance: ResourceInstance,
    collection: Collection
): Promise<{
    status: number;
    headers: HeadersInstance;
    body: any;
    input: PostInput;
}> {
    const i = await generatePostInput(
        "POSITIVE",
        input,
        resourceInstance,
        helpers
    );
    const { semantics, body: b } = i;
    const urlValue = await generateURL(url, resourceInstance, helpers);

    const { status, header, body } = await server
        .post(urlValue)
        .query(semantics.query ?? {})
        .set(semantics.headers ?? {})
        .send(b);
    if (!collection.has(resourceInstance.id))
        collection.set(resourceInstance.id, resourceInstance);
    else
        throw new Error(
            `Cannot create already existing resource in collection`
        );

    return { status, headers: header, body,  input: i };
}
