import { createServer } from "http";
import {
    Resource,
    SchemaHelpers,
    Description,
    Collection,
    generateResource,
    makeRequest,
    getRandomExistingResource,
    extractStatusFromSemantics,
    extractHeadersFromSemantics,
    extractBodiesFromOutput,
    bodyValidation,
    headersValidation,
    TraversalHelpers,
} from "../../../src";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
import supertest from "supertest";
import { NodeMap, parseNodeName } from "../../../src/endpoints/graph/nodeTypes";
import { generateNodes } from "../../../src/endpoints/graph/generateNodes";
import "../../../src/jestMatchers/index";
import getPort from "get-port";
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
        GET: {
            input: {
                semantics: {},
            },
            url: "/student/{resource:id}",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 200,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                        },
                    },
                    body: "custom:check",
                },
                NEGATIVE: {
                    semantics: {
                        status: 404,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
            },
        },
    },
    {
        GET: {
            input: {
                semantics: {},
            },
            url: "/student/{resource:id}",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 200,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                        },
                    },
                    body: {
                        studentAddresses: "resource:address",
                    },
                },
                NEGATIVE: {
                    semantics: {
                        status: 404,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
            },
        },
    },
    {
        GET: {
            input: {
                semantics: {
                    query: {
                        a: "resource:id",
                    },
                },
            },
            url: "/student/{resource:id}",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 200,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                        },
                    },
                    body: {
                        studentAddresses: "resource:address",
                        query: {
                            a: "resource:id",
                        },
                    },
                },
                NEGATIVE: {
                    semantics: {
                        status: 404,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
            },
        },
    },
    {
        GET: {
            input: {
                semantics: {
                    headers: {
                        callergroup: "custom:bloodGroup",
                    },
                },
            },
            url: "/student/{resource:id}",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 200,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                            callergroup: "custom:bloodGroup",
                        },
                    },
                    body: {
                        studentAddresses: "resource:address",
                    },
                },
                NEGATIVE: {
                    semantics: {
                        status: 404,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
            },
        },
    },
    {
        GET: {
            input: {
                semantics: {
                    query: {
                        a: "resource:id",
                    },
                    headers: {
                        callergroup: "custom:bloodGroup",
                    },
                },
            },
            url: "/student/{resource:id}",
            output: {
                POSITIVE: {
                    semantics: {
                        status: 200,
                        headers: {
                            "content-type": "application/json",
                            "item-id": "resource:id",
                            callergroup: "custom:bloodGroup",
                        },
                    },
                    body: {
                        studentAddresses: "resource:address",
                        query: {
                            a: "resource:id",
                        },
                    },
                },
                NEGATIVE: {
                    semantics: {
                        status: 404,
                        headers: {
                            "item-id": "resource:id",
                        },
                    },
                },
            },
        },
    },
];

const collection: Collection = new Map();
const server = createServer((req, res) => {
    if (req.method === "GET" && req.url?.startsWith("/student")) {
        const [, , id, query] = req.url.split(/\?|\//);
        res.setHeader("item-id", id);
        if (collection.has(id)) {
            res.statusCode = 200;
            res.setHeader("content-type", "application/json");
            const { callergroup: group } = req.headers;
            const o: Record<string, any> = {
                studentAddresses: collection.get(id)!.address,
            };

            if (query) {
                const [key, value] = query.split("=");
                o.query = {
                    [key]: value,
                };
            }

            if (group) {
                res.setHeader("callerGroup", group);
            }
            res.write(JSON.stringify(o));
        } else {
            res.statusCode = 404;
        }
        res.end();
    }
});

describe(`Get method`, () => {
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
                        ? getRandomExistingResource(collection)
                        : await generateResource(resourceSchema, schemaHelpers);
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
            });
        afterAll((done) => server.close(done));
    });
});
