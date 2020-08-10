import { Description, MethodType, Cases } from "../types";
import { NodeMap, serializeNodeName } from "./nodeTypes";
import { OutputSemantics, OutputBodies, Outputs } from "../types/output";

export function generateNodes(description: Description): NodeMap {
    const nodeMap: NodeMap = new Map();
    for (const method in description) {
        const entry = description[method as MethodType];
        const methodArr = Array.isArray(entry) ? entry : [entry];

        for (let i = 0; i < methodArr.length; i++) {
            const methodEntry = methodArr[i];
            for (const caseValue in methodEntry?.output) {
                const caseArr = (Array.isArray(
                    methodEntry!.output[caseValue as keyof Outputs[MethodType]]
                )
                    ? methodEntry!.output[
                          caseValue as keyof Outputs[MethodType]
                      ]
                    : [
                          methodEntry!.output[
                              caseValue as keyof Outputs[MethodType]
                          ],
                      ]) as (OutputSemantics & Partial<OutputBodies>)[];
                nodeMap.set(
                    serializeNodeName(
                        method as MethodType,
                        i,
                        methodEntry!.url,
                        caseValue as Cases
                    ),
                    {
                        input: methodEntry!.input,
                        url: methodEntry!.url,
                        output: caseArr,
                    }
                );
            }
        }
    }

    return nodeMap;
}
