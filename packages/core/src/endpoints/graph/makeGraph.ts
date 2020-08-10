import { NodeMap, NodeName, parseNodeName } from "./nodeTypes";
import Graph from "graph-data-structure";

export function isNeighbour(source: NodeName, target: NodeName): boolean {
    const { method: sourceMethod, caseValue: sourceCase } = parseNodeName(
        source
    );
    const { method: targetMethod, caseValue: targetCase } = parseNodeName(
        target
    );

    switch (sourceMethod) {
        case "GET":
            switch (sourceCase) {
                case "POSITIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "POSITIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
                case "NEGATIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "NEGATIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
            }
        // eslint-disable-next-line no-fallthrough
        case "DELETE":
            switch (sourceCase) {
                case "POSITIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "NEGATIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
                case "NEGATIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "NEGATIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
            }
        // eslint-disable-next-line no-fallthrough
        case "PUT":
            switch (sourceCase) {
                case "POSITIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "POSITIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
                default:
                    return false;
            }
        case "POST":
            switch (sourceCase) {
                case "POSITIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "POSITIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
                case "NEGATIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "POSITIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
                default:
                    return false;
            }
        case "PATCH":
            switch (sourceCase) {
                case "POSITIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "POSITIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
                case "NEGATIVE":
                    if (
                        (targetMethod === "GET" && targetCase === "NEGATIVE") ||
                        (targetMethod === "DELETE" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" && targetCase === "POSITIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "POSITIVE") ||
                        (targetMethod === "PATCH" &&
                            targetCase === "NEGATIVE") ||
                        (targetMethod === "PUT" &&
                            targetCase === "DESTRUCTIVE") ||
                        (targetMethod === "POST" &&
                            targetCase === "DESTRUCTIVE")
                    )
                        return true;
                    return false;
                default:
                    return false;
            }
    }
}

export function makeGraph(nodeMap: NodeMap): ReturnType<typeof Graph> {
    const graph = Graph();

    const keys = Array.from(nodeMap.keys());
    for (const source of keys) {
        for (const target of keys) {
            graph.addNode(source);
            graph.addNode(target);
            graph.addEdge(source, target, isNeighbour(source, target) ? 1 : 0);
        }
    }

    return graph;
}
