import { URLString, isURLString } from "../types/urlString";
import { MethodType, Cases } from "..";
import { isMethodType, isCaseType,  } from "../types/helpers";
import { InputSemantics, InputBodies } from "../types/input";
import { OutputSemantics, OutputBodies } from "../types/output";

export type NodeName = string;

export function isNodeName(str: any): str is NodeName {
    if (typeof str !== "string") return false;

    const parts = str.split(";;");
    return (
        parts.length === 4 &&
        isMethodType(parts[0]) &&
        !isNaN(parseInt(parts[1])) &&
        isURLString(parts[2]) &&
        isCaseType(parts[3])
    );
}

export interface NodeEntry {
    url: URLString;
    input: InputSemantics & Partial<InputBodies>;
    output: (OutputSemantics & Partial<OutputBodies>)[];
}

export interface ParsedNode {
    method: MethodType;
    methodIndex: number;
    url: URLString;
    caseValue: Cases;
}

export function serializeNodeName(
    method: MethodType,
    methodIndex: number,
    url: URLString,
    caseValue: Cases
): NodeName {
    return `${method};;${methodIndex};;${url};;${caseValue}`;
}

export function parseNodeName(str: NodeName): ParsedNode {
    const parts = str.split(";;");
    return {
        method: parts[0],
        methodIndex: parseInt(parts[1]),
        url: parts[2],
        caseValue: parts[3],
    } as ParsedNode;
}

export type NodeMap = Map<NodeName, NodeEntry>;
