import {
    HeaderAndStatus,
    BodyType,
    extractBodiesFromOutput,
} from "../../../../src";
import {
    CustomFunctionType,
    isCustomFunction,
} from "../../../../src/common/types/custom";

const Semantics: HeaderAndStatus[] = [
    {
        status: 200,
        headers: {
            "x-powered-by": "express",
        },
    },
    {
        status: 404,
    },
    {
        status: 201,
        headers: {
            allergies: true,
            cured: false,
            sad: true,
            version: "faker:random.semver",
        },
    },
];

const Bodies: (BodyType | CustomFunctionType)[] = [
    "custom:body",
    {
        id: "resource:id",
        bases: {
            types: [
                1,
                2,
                3,
                4,
                5,
                {
                    function: "faker:random.number",
                    args: [{ min: 6, max: 10, precision: 1 }],
                },
            ],
            fields: [
                {
                    x: "a",
                },
                {
                    field: {
                        age: "faker:random.word",
                    },
                    nullable: true,
                    plural: true,
                    optional: true,
                },
            ],
        },
    },
    { function: "custom:function", args: [1, 2, 3, 4] },
    {
        a: "1",
        b: "2",
        c: "3",
        d: "4",
        e: "5",
        f: {
            g: {
                h: {
                    i: [1, 2, 3, 4, 5, "faker:random.name"],
                },
            },
        },
    },
];

const ComplexEntries: {
    semantics: HeaderAndStatus;
    body?: BodyType | CustomFunctionType;
}[] = [
    {
        semantics: Semantics[0],
    },
    {
        semantics: Semantics[0],
        body: Bodies[1],
    },
    { semantics: Semantics[2], body: Bodies[1] },
    {
        semantics: Semantics[1],
    },
    {
        semantics: Semantics[1],
    },
    {
        semantics: Semantics[1],
        body: Bodies[0],
    },
    {
        semantics: Semantics[0],
        body: Bodies[2],
    },
    {
        semantics: Semantics[2],
        body: Bodies[0],
    },
    {
        semantics: Semantics[1],
        body: Bodies[3],
    },
    {
        semantics: Semantics[2],
    },
];

describe(`Extract bodies from output`, () => {
    test(`Empty array`, () => {
        expect(extractBodiesFromOutput([])).toEqual([]);
        expect(
            extractBodiesFromOutput(Semantics.map((s) => ({ semantics: s })))
        ).toEqual([]);
    });

    for (let i = 0; i < Semantics.length; i++)
        for (let j = 0; j < Bodies.length; j++)
            test(`Semantics-${i}, Bodies-${j}`, () => {
                expect(
                    extractBodiesFromOutput([
                        {
                            semantics: Semantics[i],
                            body: Bodies[j],
                        },
                    ])
                ).toEqual([
                    {
                        type: isCustomFunction(Bodies[j])
                            ? "custom function"
                            : "body type",
                        value: Bodies[j],
                    },
                ]);
            });
    test(`Complex case`, () => {
        expect(extractBodiesFromOutput(ComplexEntries)).toEqual(
            ComplexEntries.filter((entry) => "body" in entry).map((entry) => ({
                type: isCustomFunction(entry.body!)
                    ? "custom function"
                    : "body type",
                value: entry.body!,
            }))
        );
    });
});
