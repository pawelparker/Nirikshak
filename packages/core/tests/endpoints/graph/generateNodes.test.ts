import faker from "faker";
import { Inputs, Outputs, Description, MethodType, Cases } from "../../../src";
import { URLString } from "../../../src/endpoints/types/urlString";
import { generateNodes } from "../../../src/endpoints/graph/generateNodes";
import { serializeNodeName } from "../../../src/endpoints/graph/nodeTypes";
const ValidInputs: Inputs = {
    DELETE: {
        semantics: {
            headers: {
                applicationContent: true,
            },
            query: {
                sample: 15,
            },
        },
    },
    GET: {
        semantics: {
            query: {
                names: ["faker:random.name", "faker:random.name"],
            },
        },
    },
    PUT: {
        semantics: {
            headers: {
                Authorization: "Bearer 123123123432",
            },
        },
        body: {
            id: "resource:id",
            name: "faker:random.name",
            age: {
                types: ["faker:random.number", { function: "custom:age" }],
            },
        },
    },
    PATCH: {
        semantics: {
            headers: {
                "x-poweredBy": "google",
                version: "v1.0.0",
            },
            query: {
                version: 1,
                useful: false,
            },
        },
        body: {
            id: "resource:id",
            name: {
                type: "resource.name",
                optional: true,
            },
            age: {
                type: "resource.age",
                optional: true,
            },
        },
    },
    POST: {
        semantics: {},
        body: {
            class: "resource.class",
            ages: {
                type: "custom:age",
                plural: true,
            },
        },
        destructiveBody: {
            id: "resource:id",
            name: {
                type: "resource.name",
                optional: true,
            },
            age: {
                type: "resource.age",
                optional: true,
            },
        },
    },
};

const urls: URLString[] = [
    "/Students",
    "Professors/{resource:id}",
    "/{resource:id}/name/{faker:random.uuid}",
    "{custom:urlSlug}/students",
    "{faker:address.city}",
];

const ValidOutputs: Outputs = {
    DELETE: {
        NEGATIVE: {
            semantics: {
                status: 200,
            },
        },
        POSITIVE: [
            {
                semantics: {
                    status: 404,
                    headers: {
                        message: "not found value",
                    },
                },
                body: {
                    name: "resource:name",
                    age: {
                        types: [1, 2, 3, 4, "free", "butter free"],
                    },
                },
            },
            {
                semantics: {
                    status: 400,
                },
                body: {
                    id: "resource:id",
                    addresses: "resource:addresses",
                    age: { class: "faker:random.number" },
                },
            },
        ],
    },
    GET: {
        POSITIVE: [
            {
                semantics: {
                    status: 200,
                    headers: {
                        "content-type": `Application/JSON`,
                    },
                },
                body: {
                    id: "resource:id",
                    addresses: "resource:addresses",
                    age: { class: "faker:random.number" },
                    pieces: "custom:word",
                    parts: {
                        plump: {
                            type: { function: "faker:lorem.lines", args: [3] },
                            nullable: true,
                            optional: true,
                            plural: true,
                        },
                    },
                },
            },
            {
                semantics: {
                    status: 201,
                },
                body: {
                    id: "resource:id",
                },
            },
        ],
        NEGATIVE: {
            semantics: {
                status: 404,
            },
        },
    },
    PUT: {
        DESTRUCTIVE: {
            semantics: {
                status: 500,
                headers: {
                    messsage: "Invalid fields value",
                },
            },
        },
        POSITIVE: [
            {
                body: {
                    id: "resource:id",
                    name: "resource:name",
                    classes: "resource.classes",
                },
                semantics: {
                    status: 200,
                },
            },
            {
                body: {
                    id: "resource:id",
                    name: "resource:name",
                    classes: "resource.classes",
                },
                semantics: {
                    status: 201,
                },
            },
        ],
    },
    POST: {
        DESTRUCTIVE: {
            semantics: {
                status: 500,
            },
        },
        NEGATIVE: {
            semantics: {
                status: 404,
            },
        },
        POSITIVE: {
            semantics: { status: 201 },
            body: {
                name: "resource:name",
                generationID: "custom:getGenerationID",
            },
        },
    },
    PATCH: {
        DESTRUCTIVE: [
            { semantics: { status: 501 } },
            { semantics: { status: 500, headers: { application: "chrome" } } },
        ],
        NEGATIVE: {
            semantics: {
                status: 404,
            },
        },
        POSITIVE: {
            semantics: {
                status: 200,
            },
            body: {
                name: "resource:name",
                age: "resource:age",
            },
        },
    },
};

const ComplexCase: Description = {
    GET: [
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["GET"],
            output: {},
        },
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["GET"],
            output: {
                NEGATIVE: ValidOutputs["GET"]["NEGATIVE"],
            },
        },
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["GET"],
            output: ValidOutputs["GET"],
        },
    ],
    POST: [
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["POST"],
            output: {},
        },
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["POST"],
            output: {
                DESTRUCTIVE: ValidOutputs["POST"]["DESTRUCTIVE"],
                POSITIVE: ValidOutputs["POST"]["POSITIVE"],
            },
        },
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["POST"],
            output: { NEGATIVE: ValidOutputs["POST"]["NEGATIVE"] },
        },
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["POST"],
            output: ValidOutputs["POST"],
        },
    ],
    DELETE: [
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["DELETE"],
            output: {
                POSITIVE: ValidOutputs["DELETE"]["POSITIVE"],
            },
        },
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["DELETE"],
            output: ValidOutputs["DELETE"],
        },
    ],
    PATCH: [
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["PATCH"],
            output: { DESTRUCTIVE: ValidOutputs["PATCH"]["DESTRUCTIVE"] },
        },
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["PATCH"],
            output: ValidOutputs["PATCH"],
        },
    ],
    PUT: [
        {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["PUT"],
            output: ValidOutputs["PUT"],
        },
    ],
};

describe(`Node map generation`, () => {
    const methods: MethodType[] = ["GET", "PUT", "POST", "PATCH", "DELETE"];
    const casesCombination: Cases[][] = [
        ["DESTRUCTIVE", "NEGATIVE", "POSITIVE"],
        ["NEGATIVE", "POSITIVE"],
        ["NEGATIVE", "DESTRUCTIVE"],
        ["DESTRUCTIVE", "POSITIVE"],
        ["DESTRUCTIVE"],
        ["NEGATIVE"],
        ["POSITIVE"],
    ];

    methods.forEach((method) =>
        casesCombination.forEach((combination) => {
            const outputs = {};

            combination.forEach(
                (caseValue) =>
                    caseValue in ValidOutputs[method] &&
                    (outputs[caseValue] = ValidOutputs[method][caseValue])
            );

            if (!Object.keys(outputs).length) return;

            test(`Basic entry: ${method}: ${combination.join(", ")}`, () => {
                const url = faker.random.arrayElement(urls);
                const map = generateNodes({
                    [method]: {
                        url,
                        input: ValidInputs[method],
                        output: outputs,
                    },
                });

                let nodes = 0;
                Object.keys(outputs).forEach(() => nodes++);

                expect(map.size).toBe(nodes);

                for (const key in outputs) {
                    const outArr = Array.isArray(outputs[key])
                        ? outputs[key]
                        : [outputs[key]];

                    const nodename = serializeNodeName(
                        method,
                        0,
                        url,
                        key as Cases
                    );
                    expect(map.has(nodename)).toBe(true);
                    expect(map.get(nodename)).toEqual({
                        url,
                        input: ValidInputs[method],
                        output: outArr,
                    });
                }
            });
        })
    );

    test(`Complex case`, () => {
        const map = generateNodes(ComplexCase);

        for (const method in ComplexCase) {
            const inputArr: Extract<
                Description[MethodType],
                Array<any>
            > = Array.isArray(ComplexCase[method])
                ? ComplexCase[method]
                : [ComplexCase[method]];

            for (let j = 0; j < inputArr.length; j++) {
                const outputs = inputArr[j].output;
                for (const key in outputs) {
                    const outArr = Array.isArray(outputs[key])
                        ? outputs[key]
                        : [outputs[key]];

                    const nodename = serializeNodeName(
                        method as MethodType,
                        j,
                        inputArr[j].url,
                        key as Cases
                    );
                    expect(map.has(nodename)).toBe(true);
                    expect(map.get(nodename)).toEqual({
                        url: inputArr[j].url,
                        input: inputArr[j].input,
                        output: outArr,
                    });
                }
            }
        }
    });
});
