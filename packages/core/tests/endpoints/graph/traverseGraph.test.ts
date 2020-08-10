import _ from "lodash";
import Graph from "graph-data-structure";
import { traverseGraph } from "../../../src/endpoints/graph/traverseGraph";
import { NodeName } from "../../../src/endpoints/graph/nodeTypes";

const graph = Graph();
graph.addNode("s");
graph.addNode("a");
graph.addNode("b");
graph.addNode("c");
graph.addNode("d");
graph.addNode("t");
graph.addEdge("s", "a", 1);
graph.addEdge("s", "b", 1);
graph.addEdge("a", "a", 1);
graph.addEdge("a", "b", 1);
graph.addEdge("a", "c", 1);
graph.addEdge("a", "d", 1);
graph.addEdge("b", "d", 1);
graph.addEdge("c", "t", 1);
graph.addEdge("d", "c", 1);
graph.addEdge("d", "d", 1);
graph.addEdge("d", "t", 1);

describe(`Graph traversal`, () => {
  test(`Single step`, () => {
    const traversal = traverseGraph(graph, 1);
    const nodes = graph.nodes();
    expect(traversal.length).toBe(nodes.length);
    const nodeEntries = _.flatten(traversal);
    expect(nodeEntries.sort()).toEqual(nodes.sort());
  });

  test(`Three step`, () => {
    const twoStepNodes: NodeName[][] = [
      ["s", "a", "a"],
      ["s", "a", "b"],
      ["s", "a", "c"],
      ["s", "a", "d"],
      ["s", "b", "d"],
      ["a", "a", "a"],
      ["a", "a", "b"],
      ["a", "a", "c"],
      ["a", "a", "d"],
      ["a", "b", "d"],
      ["a", "c", "t"],
      ["a", "d", "c"],
      ["a", "d", "d"],
      ["a", "d", "t"],
      ["b", "d", "c"],
      ["b", "d", "d"],
      ["b", "d", "t"],
      ["c", "t"],
      ["d", "c", "t"],
      ["d", "d", "c"],
      ["d", "d", "d"],
      ["d", "d", "t"],
      ["d", "t"],
      ["t"],
    ];
    const traversal = traverseGraph(graph, 3);
    expect(traversal.length).toBe(twoStepNodes.length);

    const sortFn = (a: string[], b: string[]): number => a.length - b.length;
    traversal.sort(sortFn);
    twoStepNodes.sort(sortFn);
    expect(traversal).toEqual(twoStepNodes);
  });

  test(`Invalid steps`, () => {
    expect(() => traverseGraph(graph, 0)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid number of steps for traversal: 0"`
    );
    expect(() => traverseGraph(graph, -1)).toThrowErrorMatchingInlineSnapshot(
      `"Invalid number of steps for traversal: -1"`
    );
  });
});
