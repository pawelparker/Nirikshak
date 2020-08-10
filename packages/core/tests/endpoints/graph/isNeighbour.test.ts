import { MethodType, Outputs, Cases } from "../../../src";
import { NodeName } from "../../../src/endpoints/graph/nodeTypes";
import faker from "faker";
import { isNeighbour } from "../../../src/endpoints/graph/makeGraph";

function makeNode(method: MethodType, cases: Cases): NodeName {
    return `${method};;${faker.random.number({
        min: 0,
        max: 10,
        precision: 1,
    })};;${`${faker.random.word()}/${faker.random.word()}/${faker.random.word()}/{resource:id}`};;${cases}`;
}

const nodes: {
    [method in MethodType]: {
        [caseValue in keyof Outputs[method]]: NodeName;
    };
} = {
    DELETE: {
        NEGATIVE: makeNode("DELETE", "NEGATIVE"),
        POSITIVE: makeNode("DELETE", "POSITIVE"),
    },
    GET: {
        NEGATIVE: makeNode("GET", "NEGATIVE"),
        POSITIVE: makeNode("GET", "POSITIVE"),
    },
    PATCH: {
        DESTRUCTIVE: makeNode("PATCH", "DESTRUCTIVE"),
        NEGATIVE: makeNode("PATCH", "NEGATIVE"),
        POSITIVE: makeNode("PATCH", "POSITIVE"),
    },
    POST: {
        DESTRUCTIVE: makeNode("POST", "DESTRUCTIVE"),
        NEGATIVE: makeNode("POST", "NEGATIVE"),
        POSITIVE: makeNode("POST", "POSITIVE"),
    },
    PUT: {
        DESTRUCTIVE: makeNode("PUT", "DESTRUCTIVE"),
        POSITIVE: makeNode("PUT", "POSITIVE"),
    },
};

function adjacencyTest(
    sourceKey: MethodType,
    sourceCase: Cases,
    targetKey: MethodType,
    targetCase: Cases
): boolean {
    switch (sourceKey) {
        case "GET":
            switch (sourceCase) {
                case "POSITIVE":
                    return (
                        (targetKey === "GET" && targetCase === "POSITIVE") ||
                        (targetKey === "DELETE" && targetCase === "POSITIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" && targetCase === "NEGATIVE") ||
                        (targetKey === "PATCH" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE"))
                    );
                case "NEGATIVE":
                    return (
                        (targetKey === "GET" && targetCase === "NEGATIVE") ||
                        (targetKey === "DELETE" && targetCase === "NEGATIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "PATCH" && targetCase === "NEGATIVE")
                    );
            }
            return false;
        case "DELETE":
            switch (sourceCase) {
                case "POSITIVE":
                    return (
                        (targetKey === "GET" && targetCase === "NEGATIVE") ||
                        (targetKey === "DELETE" && targetCase === "NEGATIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "PATCH" && targetCase === "NEGATIVE")
                    );
                case "NEGATIVE":
                    return (
                        (targetKey === "GET" && targetCase === "NEGATIVE") ||
                        (targetKey === "DELETE" && targetCase === "NEGATIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "PATCH" && targetCase === "NEGATIVE")
                    );
            }
            return false;
        case "PUT":
            switch (sourceCase) {
                case "POSITIVE":
                    return (
                        (targetKey === "GET" && targetCase === "POSITIVE") ||
                        (targetKey === "DELETE" && targetCase === "POSITIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" && targetCase === "NEGATIVE") ||
                        (targetKey === "PATCH" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE"))
                    );
            }
            return false;
        case "PATCH":
            switch (sourceCase) {
                case "POSITIVE":
                    return (
                        (targetKey === "GET" && targetCase === "POSITIVE") ||
                        (targetKey === "DELETE" && targetCase === "POSITIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" && targetCase === "NEGATIVE") ||
                        (targetKey === "PATCH" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE"))
                    );
                case "NEGATIVE":
                    return (
                        (targetKey === "GET" && targetCase === "NEGATIVE") ||
                        (targetKey === "DELETE" && targetCase === "NEGATIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "PATCH" && targetCase === "NEGATIVE")
                    );
            }
            return false;
        case "POST":
            switch (sourceCase) {
                case "POSITIVE":
                    return (
                        (targetKey === "GET" && targetCase === "POSITIVE") ||
                        (targetKey === "DELETE" && targetCase === "POSITIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" && targetCase === "NEGATIVE") ||
                        (targetKey === "PATCH" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE"))
                    );
                case "NEGATIVE":
                    return (
                        (targetKey === "GET" && targetCase === "POSITIVE") ||
                        (targetKey === "DELETE" && targetCase === "POSITIVE") ||
                        (targetKey === "PUT" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE")) ||
                        (targetKey === "POST" && targetCase === "NEGATIVE") ||
                        (targetKey === "PATCH" &&
                            (targetCase === "POSITIVE" ||
                                targetCase === "DESTRUCTIVE"))
                    );
            }
            return false;
    }
}

describe(`Adjacency test`, () => {
    for (const sourceKey in nodes)
        for (const sourceCase in nodes[sourceKey])
            for (const targetKey in nodes)
                for (const targetCase in nodes[targetKey]) {
                    test(`Source: ${sourceKey}-${sourceCase}, Target: ${targetKey}-${targetCase}`, () => {
                        expect(
                            isNeighbour(
                                nodes[sourceKey][sourceCase],
                                nodes[targetKey][targetCase]
                            )
                        ).toBe(
                            adjacencyTest(
                                sourceKey as MethodType,
                                sourceCase as Cases,
                                targetKey as MethodType,
                                targetCase as Cases
                            )
                        );
                    });
                }
});
