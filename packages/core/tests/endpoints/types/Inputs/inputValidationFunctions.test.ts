import {
    HeaderMap,
    BodyType,
    MethodType,
} from "../../../../src/endpoints/types/helpers";
import {
    Query,
    HeaderAndQuery,
    inputValidationFunctions,
} from "../../../../src/endpoints/types/input";

const ValidHeader: HeaderMap = {
    "content-type": "faker:system:mimetype",
    Authorization: "faker:random.alphaNumeric",
    identity: false,
    resource: "resource:id",
    count: 4,
};

const InvalidHeader: any = {
    purple: "color",
    color: "purple",
    application: [1, 3, false, null],
};

const ValidQuery: Query = {
    clicks: [2, 7, 8],
    picks: { function: "faker:lorem.lines", args: [1] },
    attributes: true,
    classes: "custom:classNameArr",
};

const InvalidQuery: any = {
    name: "faker:name.firstName",
    versioning: true,
    apps: 4,
    id: [1, 2, 3, [4]],
};

const ValidBody: BodyType = {
    plurals: true,
    parrots: {
        type: "custom:colors",
        plural: true,
        optional: true,
    },
    fradulency: [
        1,
        5.3,
        "agatha",
        null,
        null,
        ["faker:random.invalidFunction", "flip-flip"],
    ],
    address: {
        fields: [
            { zipCode: "faker:random.zipCode" },
            {
                street: {
                    types: [
                        { function: "faker:address.streetName" },
                        "faker:address:streetAddress",
                    ],
                },
            },
        ],
    },
};

const InvalidBody: any = {
    plurals: true,
    parrots: {
        type: "custom:colors",
        plural: true,
        optional: true,
    },
    fradulency: [
        1,
        5.3,
        "agatha",
        null,
        null,
        ["faker:random.invalidFunction", "flip-flip", [[[undefined]]]],
    ],
    address: {
        fields: [
            { zipCode: "faker:random.zipCode" },
            {
                street: {
                    types: [
                        { function: "faker:address.streetName" },
                        "faker:address:streetAddress",
                    ],
                },
            },
        ],
    },
};

const ValidHeaderAndQueries: HeaderAndQuery[] = [
    {},
    {
        headers: ValidHeader,
    },
    { query: ValidQuery },
    { headers: ValidHeader, query: ValidQuery },
];
const InvalidHeaderAndQueries: any[] = [
    { headers: InvalidHeader },
    { query: InvalidQuery },
    { headers: ValidHeader, query: InvalidQuery },
    { headers: InvalidHeader, query: ValidQuery },
    { headers: InvalidHeader, query: InvalidQuery },
];

const ValidHeaderAndQueriesAndBodies: {
    semantics: HeaderAndQuery;
    body: BodyType;
}[] = ValidHeaderAndQueries.map((vhq) => ({ semantics: vhq, body: ValidBody }));

const ValidHeaderAndQueriesAndBodiesAndDescBodies: {
    semantics: HeaderAndQuery;
    body: BodyType;
    destructiveBody: BodyType;
}[] = ValidHeaderAndQueries.map((vhq) => ({
    semantics: vhq,
    body: ValidBody,
    destructiveBody: ValidBody,
}));

const InvalidHeaderAndQueriesAndBodies: {
    semantics: HeaderAndQuery;
    body: BodyType;
}[] = [];

InvalidHeaderAndQueriesAndBodies.push(
   ...ValidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: InvalidBody,
    }))
);

InvalidHeaderAndQueriesAndBodies.push(
    ...InvalidHeaderAndQueries.map((vhq) => ({ semantics: vhq, body: ValidBody }))
);

InvalidHeaderAndQueriesAndBodies.push(
    ...InvalidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: InvalidBody,
    }))
);

const InvalidHeaderAndQueriesAndBodiesAndDestructive: {
    semantics: HeaderAndQuery;
    body: BodyType;
    destructiveBody: BodyType;
}[] = [];

InvalidHeaderAndQueriesAndBodiesAndDestructive.push(
    ...ValidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: InvalidBody,
        destructiveBody: ValidBody,
    }))
);
InvalidHeaderAndQueriesAndBodiesAndDestructive.push(
    ...ValidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: ValidBody,
        destructiveBody: InvalidBody,
    }))
);
InvalidHeaderAndQueriesAndBodiesAndDestructive.push(
    ...ValidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: InvalidBody,
        destructiveBody: InvalidBody,
    }))
);

InvalidHeaderAndQueriesAndBodiesAndDestructive.push(
    ...InvalidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: ValidBody,
        destructiveBody: ValidBody,
    }))
);

InvalidHeaderAndQueriesAndBodiesAndDestructive.concat(
    InvalidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: ValidBody,
        destructiveBody: InvalidBody,
    }))
);

InvalidHeaderAndQueriesAndBodiesAndDestructive.push(
    ...InvalidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: InvalidBody,
        destructiveBody: InvalidBody,
    }))
);

InvalidHeaderAndQueriesAndBodiesAndDestructive.push(
    ...InvalidHeaderAndQueries.map((vhq) => ({
        semantics: vhq,
        body: InvalidBody,
        destructiveBody: ValidBody,
    }))
);

const NonObjectEntries: any = [1, null, "false", 31231.2, undefined, true];

describe("Input validation", () => {
    (["GET", "DELETE", "PUT", "PATCH", "POST"] as MethodType[]).forEach(
        (method) => {
            NonObjectEntries.forEach((entry, index) =>
                test(`Non object entry - ${method}: ${index}`, () => {
                    expect(inputValidationFunctions[method](entry)).toBe(false);
                })
            );
        }
    );

    (["GET", "DELETE"] as MethodType[]).forEach((method) => {
        // No headers
        ValidHeaderAndQueries.forEach((entry, index) =>
            test(`Valid header and query - ${method}: ${index}`, () =>
                expect(
                    inputValidationFunctions[method]({ semantics: entry })
                ).toBe(true))
        );

        InvalidHeaderAndQueries.forEach((entry, index) =>
            test(`Invalid header and query - ${method}: ${index}`, () =>
                expect(
                    inputValidationFunctions[method]({ semantics: entry })
                ).toBe(false))
        );
    });

    (["PUT", "PATCH", "POST"] as MethodType[]).forEach((method) => {
        ValidHeaderAndQueriesAndBodies.forEach((entry, index) =>
            test(`Valid header, body and query - ${method}: ${index}`, () =>
                expect(inputValidationFunctions[method](entry)).toBe(true))
        );

        InvalidHeaderAndQueriesAndBodies.forEach((entry, index) =>
            test(`Invalid header, body and query - ${method}: ${index}`, () =>
                expect(inputValidationFunctions[method](entry)).toBe(false))
        );

        ValidHeaderAndQueriesAndBodiesAndDescBodies.forEach((entry, index) =>
            test(`Valid header, input and destructive body and query - ${method}: ${index}`, () =>
                expect(inputValidationFunctions[method](entry)).toBe(true))
        );

        InvalidHeaderAndQueriesAndBodiesAndDestructive.forEach((entry, index) =>
            test(`Invalid header, input and destructive body and query - ${method}: ${index}`, () =>
                expect(inputValidationFunctions[method](entry)).toBe(false))
        );
    });
});
