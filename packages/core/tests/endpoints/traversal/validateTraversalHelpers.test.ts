import {
    ResourceInstance,
    SchemaHelpers,
    TraversalHelpers,
    Collection,
    InputInstance,
    getRandomExistingResource,
} from "../../../src";
import faker from "faker";
import _ from "lodash";
import { validateWithTraversalHelpers } from "../../../src/endpoints/traversal/traversalHelpers";
import { NodeEntry, ParsedNode } from "../../../src/endpoints/graph/nodeTypes";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
import { CustomFunctionType } from "../../../src/common/types/custom";

const resource: ResourceInstance = {
    id: faker.random.uuid(),
    ages: {
        classes: {
            places: [{ a: 12 }, { b: 13 }],
        },
    },
    purpose: [1, 2, 4],
    lorem: [{ ipsum: 4 }, { ipsum: 5 }],
};

const schemaHelpers: SchemaHelpers = {
    word: async (): Promise<string> => faker.random.word(),
};

const sortFn = (a: ResourceInstance, b: ResourceInstance): number =>
    (a.age as number) - (b.age as number);
const collection: Collection = new Map();

for (let i = 0; i < RANDOMNESS_ITERATIONS; i++) {
    const id = faker.random.uuid();
    collection.set(id, { ...resource, id, age: faker.random.number(10) });
}
const input = Array.from(collection.values()).sort(sortFn);

const traversalHelpers: TraversalHelpers = {
    valid: async (
        _input: any,
        resourceInstance: ResourceInstance,
        helpers: SchemaHelpers,
        nodeEntry: NodeEntry,
        collection: Collection,
        inputInstance: InputInstance,
        parsedNode: ParsedNode
    ) => {
        if (parsedNode.method !== "GET") return false;
        if (!collection.has(resourceInstance.id)) return false;
        const randomWord = await helpers.word();
        if (randomWord === "") return false;
        if (!Array.isArray(_input)) return false;
        if (_input.length !== RANDOMNESS_ITERATIONS) return false;
        if (!nodeEntry.input.semantics.query?.sort) return false;
        if (!inputInstance.semantics.query?.sort) return false;
        return _.isEqual(input, _input);
    },

    invalid: async () => 12 as any,
};

const inputInstance: InputInstance = {
    semantics: {
        query: {
            sort: true,
        },
    },
};

const parsedNode: ParsedNode = {
    caseValue: "POSITIVE",
    method: "GET",
    methodIndex: 0,
    url: "loremIpsumDolorSitAmet",
};

const getNodeEntry = (status: number, body: CustomFunctionType): NodeEntry => ({
    url: parsedNode.url,
    input: {
        semantics: {
            query: {
                sort: true,
            },
        },
    },
    output: [
        {
            semantics: { status: status },
            body,
        },
    ],
});

describe(`Traversal helpers`, () => {
    test(`Non existent function`, () => {
        expect(
            validateWithTraversalHelpers(
                input,
                "custom:nonExistent",
                getRandomExistingResource(collection),
                schemaHelpers,
                traversalHelpers,
                getNodeEntry(200, "custom:nonExistent"),
                collection,
                inputInstance,
                parsedNode
            )
        ).rejects.toMatchInlineSnapshot(
            `[Error: Could not find traversal helper function: custom:nonExistent, args: ]`
        );
    });
    test(`Invalid function`, () => {
        expect(
            validateWithTraversalHelpers(
                input,
                "custom:invalid",
                getRandomExistingResource(collection),
                schemaHelpers,
                traversalHelpers,
                getNodeEntry(200, "custom:invalid"),
                collection,
                inputInstance,
                parsedNode
            )
        ).rejects.toMatchInlineSnapshot(
            `[Error: function: custom:invalid, args:  did not return a boolean value]`
        );
    });

    test(`Valid input`, () => {
        expect(
            validateWithTraversalHelpers(
                input,
                "custom:valid",
                getRandomExistingResource(collection),
                schemaHelpers,
                traversalHelpers,
                getNodeEntry(200, "custom:valid"),
                collection,
                inputInstance,
                parsedNode
            )
        ).resolves.toBe(true);
    });

    test(`Invalid input`, () => {
        expect(
            validateWithTraversalHelpers(
                input[0],
                "custom:valid",
                getRandomExistingResource(collection),
                schemaHelpers,
                traversalHelpers,
                getNodeEntry(200, "custom:valid"),
                collection,
                inputInstance,
                parsedNode
            )
        ).resolves.toBe(false);
    });
});
