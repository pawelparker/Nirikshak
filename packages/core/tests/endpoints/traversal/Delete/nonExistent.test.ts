import getPort from "get-port";
import { createServer } from "http";
import {
    Resource,
    SchemaHelpers,
    Collection,
    generateResource,
    makeRequest,
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

const description = {
    DELETE: {
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
        },
    },
};
const collection: Collection = new Map();
const server = createServer((req, res) => {
    if (req.method === "DELETE" && req.url?.startsWith("/student")) {
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

describe(`Deleting already deleted resource`, () => {
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
            expect.hasAssertions();
            const parsedNode = parseNodeName(key);
            const app = supertest(server);

            try {
                await makeRequest(
                    entry.url,
                    parsedNode.method,
                    parsedNode.caseValue,
                    app,
                    entry.input,
                    await generateResource(resourceSchema, schemaHelpers),
                    schemaHelpers,
                    collection
                );
            } catch (e) {
                expect(e).toMatchSnapshot();
            }
        });
    afterAll((done) => server.close(done));
});
