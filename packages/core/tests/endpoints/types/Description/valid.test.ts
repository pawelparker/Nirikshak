import { Inputs } from "../../../../src/endpoints/types/input";
import { Outputs } from "../../../../src/endpoints/types/output";
import { MethodType, Cases } from "../../../../src/endpoints/types/helpers";
import {
    isDescription,
    Description,
} from "../../../../src/endpoints/types/description";
import { URLString } from "../../../../src/endpoints/types/urlString";
import faker from "faker";
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
            name: "faker:random.name",
            age: {
                types: ["faker:random.number", { function: "custom:age" }],
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

const ComplexCases: Description[] = [
    {},
    {
        GET: {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["GET"],
            output: {},
        },

        POST: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["POST"],
                output: {},
            },
        ],
    },
    {
        GET: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["GET"],
                output: {
                    NEGATIVE: ValidOutputs["GET"]["NEGATIVE"],
                },
            },
        ],
        POST: {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["POST"],
            output: {
                DESTRUCTIVE: ValidOutputs["POST"]["DESTRUCTIVE"],
                POSITIVE: ValidOutputs["POST"]["POSITIVE"],
            },
        },
    },
    {
        DELETE: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["DELETE"],
                output: {
                    POSITIVE: ValidOutputs["DELETE"]["POSITIVE"],
                },
            },
        ],
        POST: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["POST"],
                output: { NEGATIVE: ValidOutputs["POST"]["NEGATIVE"] },
            },
        ],
        PATCH: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["PATCH"],
                output: { DESTRUCTIVE: ValidOutputs["PATCH"]["DESTRUCTIVE"] },
            },
        ],
    },
    {
        GET: {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["GET"],
            output: ValidOutputs["GET"],
        },

        DELETE: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["DELETE"],
                output: ValidOutputs["DELETE"],
            },
        ],
        POST: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["POST"],
                output: ValidOutputs["POST"],
            },
        ],
        PATCH: {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["PATCH"],
            output: ValidOutputs["PATCH"],
        },

        PUT: [
            {
                url: faker.random.arrayElement(urls),
                input: ValidInputs["PUT"],
                output: ValidOutputs["PUT"],
            },
        ],
    },
    {
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
        ],
        DELETE: {
            url: faker.random.arrayElement(urls),
            input: ValidInputs["DELETE"],
            output: {
                POSITIVE: ValidOutputs["DELETE"]["POSITIVE"],
            },
        },
    },
    {
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
    },
];

describe("Valid descriptions", () => {
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
                expect(
                    isDescription({
                        [method]: [
                            {
                                url: faker.random.arrayElement(urls),
                                input: ValidInputs[method],
                                output: outputs,
                            },
                        ],
                    })
                ).toBe(true);
            });
        })
    );

    ComplexCases.forEach((entry, index) =>
        test(`Complex case: ${index}`, () =>
            expect(isDescription(entry)).toBe(true))
    );
});
