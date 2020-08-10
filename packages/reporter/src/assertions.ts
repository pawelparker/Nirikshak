import _ from "lodash";
import { AssertionResult } from "@jest/test-result";
import { isNodeName, ParsedNode, parseNodeName } from "@nirikshak/core";

export type ParsedAssertions = [
    {
        name: "resource";
        children: {
            name: string;
            children: {
                name: string;
                children: { name: string; value: number }[];
            }[];
        }[];
    },
    {
        name: "iteration";
        children: {
            name: string;
            children: {
                name: string;
                children: { name: string; value: number }[];
            }[];
        }[];
    },
    {
        name: "case";
        children: {
            name: string;
            children: {
                name: string;
                children: { name: string; value: number }[];
            }[];
        }[];
    },
    {
        name: "url";
        children: {
            name: string;
            children: {
                name: string;
                children: { name: string; value: number }[];
            }[];
        }[];
    },
    {
        name: "error-message";
        children: {
            name: string;
            children: {
                name: string;
                children: { name: string; value: number }[];
            }[];
        }[];
    },
    {
        name: "method";
        children: {
            name: string;
            children: {
                name: string;
                children: { name: string; value: number }[];
            }[];
        }[];
    }
];

export interface ParsedAssertion extends ParsedNode {
    resource: string;
    iteration: number;
    pathIndex: number;
    errorMessage: string;
}

export function parseAssertion({
    ancestorTitles,
    title,
    failureMessages,
}: AssertionResult): ParsedAssertion {
    if (ancestorTitles.length !== 3)
        throw new Error(
            `Invalid test result format: More than 3 ancestor titles. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter`
        );

    const [resource, index] = ancestorTitles;
    if (Number.isNaN(parseFloat(index)))
        throw new Error(
            `Invalid test result format: Method entry index is not a number. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter`
        );

    const [indexString, node] = title.split("::");
    if (Number.isNaN(parseInt(indexString)))
        throw new Error(
            `Invalid test result format: Entry index in path is not a number. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter`
        );
    if (!isNodeName(node))
        throw new Error(
            `Invalid test result format: Title does not contain a valid graph node. This might happen if a non-nirikshak generated test case is run. Please skip those tests or disable this reporter`
        );

    const parsedNode = parseNodeName(node);

    const [err] = failureMessages[0]?.split("\n    at Object") ?? [""];
    const errorMessage = err.replace("Error:", "").trim();

    return {
        ...parsedNode,
        pathIndex: parseInt(indexString),
        iteration: parseInt(index),
        resource,
        errorMessage,
    };
}

export function insertIntoAssertion(
    o: ParsedAssertions,
    assertion: ParsedAssertion
): void {
    const entries = [
        { title: "resource", value: _.get(assertion, "resource") },
        { title: "iteration", value: _.get(assertion, "iteration") + " " },
        { title: "case", value: _.get(assertion, "caseValue") },
        { title: "url", value: _.get(assertion, "url") },
        { title: "error-message", value: _.get(assertion, "errorMessage") },
        {
            title: "method",
            value:
                _.get(assertion, "method") +
                "-" +
                _.get(assertion, "methodIndex"),
        },
    ];

    for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
        const assertionEntry = o[entryIndex];
        let childrenIndex = assertionEntry.children.findIndex(
            (c) => c.name === entries[entryIndex].value
        );
        if (childrenIndex === -1) {
            childrenIndex = assertionEntry.children.length;
            assertionEntry.children.push({
                name: entries[entryIndex].value.toString(),
                children: [],
            });
        }
        // assertionEntry.children[childrenIndex]
        for (const target of entries) {
            if (target.title === entries[entryIndex].title) continue;

            let innerIndex = assertionEntry.children[
                childrenIndex
            ].children.findIndex((x) => x.name === target.title);
            if (innerIndex === -1) {
                innerIndex =
                    assertionEntry.children[childrenIndex].children.length;
                assertionEntry.children[childrenIndex].children.push({
                    name: target.title,
                    children: [],
                });
            }

            let finalIndex = assertionEntry.children[childrenIndex].children[
                innerIndex
            ].children.findIndex((y) => y.name === target.value);
            if (finalIndex === -1) {
                finalIndex =
                    assertionEntry.children[childrenIndex].children[innerIndex]
                        .children.length;
                assertionEntry.children[childrenIndex].children[
                    innerIndex
                ].children.push({
                    name: target.value.toString(),
                    value: 0,
                });
            }
            assertionEntry.children[childrenIndex].children[innerIndex]
                .children[finalIndex].value++;
        }
    }
}

export function parseAssertions(
    parsedAssertionArray: ParsedAssertion[]
): ParsedAssertions {
    const o: ParsedAssertions = [
        { name: "resource", children: [] },
        { name: "iteration", children: [] },
        { name: "case", children: [] },
        { name: "url", children: [] },
        { name: "error-message", children: [] },
        { name: "method", children: [] },
    ];

    for (const assertion of parsedAssertionArray)
        insertIntoAssertion(o, assertion);

    return o;
}
