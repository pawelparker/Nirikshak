import getPort from "get-port";
import { createServer } from "http";
import {
    Resource,
    SchemaHelpers,
    Description,
    Collection,
    generateResource,
    makeRequest,
    extractStatusFromSemantics,
    extractHeadersFromSemantics,
    extractBodiesFromOutput,
    bodyValidation,
    headersValidation,
    TraversalHelpers,
    getRandomExistingResource,
} from "../../../../src";
import { RANDOMNESS_ITERATIONS } from "../../../../src/common/Env";
import supertest from "supertest";
import {
    NodeMap,
    parseNodeName,
} from "../../../../src/endpoints/graph/nodeTypes";
import { generateNodes } from "../../../../src/endpoints/graph/generateNodes";
import "../../../../src/jestMatchers/index";

const resourceSchema: Resource = {
    id: "faker:random.uuid",
    name: ["faker:name.firstName", "faker:name.lastName"],
    age: "faker:random.number",
    address: {
        types: [{ type: "faker:zipCode", plural: true }],
        fields: [
            {
                field: {
                    zipCode: "faker:addresss.zipCode",
                    city: "faker:address.city",
                },
                plural: true,
            },
        ],
    },
    bloodGroup: {
        type: { function: "custom:bloodGroup", args: ["O+"] },
        optional: true,
    },
};

const schemaHelpers: SchemaHelpers = {
    async bloodGroup(preferred?: string) {
        return preferred ?? "A+";
    },
};

const traversalHelpers: TraversalHelpers = {
    async check() {
        return true;
    },
};

const descriptions: Description[] = [
    {
        POST: {
            input: {
                semantics: {
                    headers: {
                        "content-type": "application/json",
                    },
                },
                body: {
                    id: "resource:id",
                },
            },
            url: "/student",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 201,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                        },
                    },
                    body: "custom:check",
                },
                NEGATIVE: {
                    semantics: {
                        status: 409,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
            },
        },
    },
    {
        POST: {
            input: {
                semantics: {
                    headers: {
                        "content-type": "application/json",
                    },
                    query: {
                        a: "10",
                    },
                },
                body: {
                    id: "resource:id",
                },
                destructiveBody: {
                    age: "resource:age",
                },
            },
            url: "/student",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 201,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                        },
                    },
                    body: {
                        id: "resource:id",
                        a: "10",
                    },
                },
                NEGATIVE: {
                    semantics: {
                        status: 409,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
                DESTRUCTIVE: {
                    semantics: {
                        status: 400,
                    },
                },
            },
        },
    },
    {
        POST: {
            input: {
                semantics: {},
                body: {
                    id: "resource:id",
                },
                destructiveBody: {
                    age: "resource:age",
                },
            },
            url: "/student",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 201,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                        },
                    },
                    body: {
                        id: "resource:id",
                    },
                },
                NEGATIVE: {
                    semantics: {
                        status: 409,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
                DESTRUCTIVE: {
                    semantics: {
                        status: 400,
                    },
                },
            },
        },
    },
];

const collection: Collection = new Map();
const server = createServer((req, res) => {
    if (req.method === "POST" && req.url?.startsWith("/student")) {
        let data = "";

        req.on("data", (chunk) => {
            data += chunk;
        });

        req.on("end", () => {
            const body = JSON.parse(data);

            if (!("id" in body)) {
                res.statusCode = 400;
                res.end();
                return;
            }
            res.setHeader("item-id", body.id);
            if (collection.has(body.id)) {
                res.statusCode = 409;
                res.end();
                return;
            }

            const [, , query] = req.url!.split(/\?|\//);
            const o: Record<string, any> = {
                id: body.id,
            };

            if (query) {
                const [key, value] = query.split("=");
                o[key] = value;
            }
            res.statusCode = 201;
            res.setHeader("content-type", "application/json");
            res.write(JSON.stringify(o));
            res.end();
        });
    }
});

describe(`Post method`, () => {
    describe.each(descriptions)(`Description: %#`, (description) => {
        beforeAll(async (done) => {
            for (let i = 0; i < RANDOMNESS_ITERATIONS; i++) {
                const newResource = await generateResource(
                    resourceSchema,
                    schemaHelpers
                );
                collection.set(newResource.id, newResource);
            }

            server.listen(await getPort(), done);
        });
        const nodeMap: NodeMap = generateNodes(description);

        for (const [key, entry] of nodeMap.entries())
            test(key, async () => {
                const parsedNode = parseNodeName(key);
                const instance =
                    parsedNode.caseValue !== "NEGATIVE"
                        ? await generateResource(resourceSchema, schemaHelpers)
                        : getRandomExistingResource(collection);
                const app = supertest(server);
                const response = await makeRequest(
                    entry.url,
                    parsedNode.method,
                    parsedNode.caseValue,
                    app,
                    entry.input,
                    instance,
                    schemaHelpers,
                    collection
                );

                const statuses = extractStatusFromSemantics(entry.output);
                expect(response.status).toMatchStatus(statuses);

                if ("headers" in response) {
                    const headers = extractHeadersFromSemantics(entry.output);
                    expect(
                        await headersValidation(
                            response.headers,
                            headers,
                            instance,
                            schemaHelpers
                        )
                    ).toMatchHeaders(true);
                }

                if ("body" in response) {
                    const bodies = extractBodiesFromOutput(entry.output);
                    expect(
                        await bodyValidation(
                            response.body,
                            bodies,
                            instance,
                            schemaHelpers,
                            traversalHelpers,
                            entry,
                            collection,
                            response.input,
                            parsedNode
                        )
                    ).toMatchBody(true);
                }
                if (parsedNode.caseValue !== "DESTRUCTIVE")
                    expect(collection.has(instance.id)).toBe(true);
            });
        afterAll((done) => server.close(done));
    });
});
