import Config from "./config.json";
import {
    Collection,
    isResource,
    isDescription,
    generateNodes,
    makeGraph,
    traverseGraph,
    parseNodeName,
    ResourceInstance,
    getRandomExistingResource,
    makeRequest,
    extractStatusFromSemantics,
    extractHeadersFromSemantics,
    headersValidation,
    extractBodiesFromOutput,
    bodyValidation,
    statusValidation,
    generateResource,
} from "@nirikshak/core";
import "@nirikshak/core/lib/jestMatchers";
import ResourceJSON from "./resource.json";
import EndpointsJSON from "./endpoints.json";
import { setup, cleanup, schemaHelpers, traversalHelpers } from "./helpers";
import app from "/home/yash/Desktop/nirikshak/packages/complex-example/src/app";
import { Server } from "http";
import supertest from "supertest";
import getPort from "get-port";
import faker from "faker";

if (!isResource(ResourceJSON)) throw new Error(`Invalid resource schema`);
if (!isDescription(EndpointsJSON))
    throw new Error(`Invalid endpoint description`);

describe("students", () => {
    let server: Server | null = null;
    const nodeMap = generateNodes(EndpointsJSON);
    const graph = makeGraph(nodeMap);
    const traversal = traverseGraph(graph, Config.steps);
    for (let i = 0; i < Config.iterations; i++)
        describe(`${i + 1}`, () => {
            for (const path of traversal)
                describe(path.join("--"), () => {
                    const collection: Collection = new Map();
                    let instance: ResourceInstance | null = null;
                    let prevPass = true;
                    beforeAll(async (done) => {
                        // @ts-expect-error
                        server = app.listen(await getPort(), async (err) => {
                            if (err) done(err);
                            await setup(
                                supertest(server),
                                collection,
                                ResourceJSON,
                                done
                            );
                        });
                    });

                    for (let i = 0; i < path.length; i++) {
                        const node = path[i];
                        test(`${i}::${node}`, async () => {
                            if (!prevPass) return;
                            const parsedNode = parseNodeName(node);
                            if (!instance) {
                                if (
                                    (parsedNode.method === "GET" &&
                                        parsedNode.caseValue === "NEGATIVE") ||
                                    (parsedNode.method === "DELETE" &&
                                        parsedNode.caseValue === "NEGATIVE") ||
                                    (parsedNode.method === "PATCH" &&
                                        parsedNode.caseValue === "NEGATIVE") ||
                                    (parsedNode.method === "POST" &&
                                        parsedNode.caseValue === "POSITIVE") ||
                                    (parsedNode.method === "PUT" &&
                                        faker.random.boolean())
                                )
                                    instance = await generateResource(
                                        ResourceJSON,
                                        schemaHelpers
                                    );
                                else
                                    instance = getRandomExistingResource(
                                        collection
                                    );
                            }

                            const entry = nodeMap.get(node);

                            if (!entry)
                                throw new Error(
                                    `Node map did not have the node : ${node}`
                                );

                            const response = await makeRequest(
                                entry.url,
                                parsedNode.method,
                                parsedNode.caseValue,
                                supertest(server),
                                entry.input,
                                instance,
                                schemaHelpers,
                                collection
                            );

                            const statuses = extractStatusFromSemantics(
                                entry.output
                            );
                            prevPass =
                                prevPass &&
                                statusValidation(response.status, statuses);
                            expect(response.status).toMatchStatus(statuses);

                            if ("headers" in response) {
                                const headers = extractHeadersFromSemantics(
                                    entry.output
                                );
                                const result = await headersValidation(
                                    response.headers,
                                    headers,
                                    instance,
                                    schemaHelpers
                                );
                                prevPass = prevPass && result;
                                expect(result).toMatchHeaders(true);
                            }

                            if ("body" in response) {
                                const bodies = extractBodiesFromOutput(
                                    entry.output
                                );
                                const result = await bodyValidation(
                                    response.body,
                                    bodies,
                                    instance,
                                    schemaHelpers,
                                    traversalHelpers,
                                    entry,
                                    collection,
                                    response.input,
                                    parsedNode
                                );
                                prevPass = prevPass && result;
                                expect(result).toMatchBody(true);
                            }
                        });
                    }

                    afterAll(async (done) => {
                        server?.close((err) =>
                            err ? done(err) : cleanup(collection, done)
                        );
                    });
                });
        });
});
