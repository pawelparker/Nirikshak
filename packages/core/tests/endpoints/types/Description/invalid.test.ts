import { isDescription } from "../../../../src/endpoints/types/description";
import { URLString } from "../../../../src/endpoints/types/urlString";
import faker from "faker";
const ValidUrls: URLString[] = [
    "/Students",
    "Professors/{resource:id}",
    "/{resource:id}/name/{faker:random.uuid}",
    "{custom:urlSlug}/students",
    "{faker:address.city}",
];

const InvalidUrls: any[] = [
    undefined,
    12,
    "str/{resource.id}",
    "/str/{faker.random.number}",
    "str/{faker:random.number}/{faker:random.name}",
    "/str/{custom.username}",
];

const InvalidDescriptions: any[] = [
    // arg is falsy
    undefined,
    null,
    // arg is not an object
    "stringles",
    // arg with non method keys
    [1, 2, 34],
    // Completely valid desc but invalid key: Non method
    {
        purple: [
            {
                url: faker.random.arrayElement(ValidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
                output: {
                    DESTRUCTIVE: [
                        { semantics: { status: 501 } },
                        {
                            semantics: {
                                status: 500,
                                headers: { application: "chrome" },
                            },
                        },
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
            },
        ],
    },
    // Missing URL
    {
        GET: [
            {
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
                output: {
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
            },
        ],
    },
    // Invalid url
    {
        GET: [
            {
                url: faker.random.arrayElement(InvalidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
                output: {
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
            },
        ],
    },
    // Input missing
    {
        GET: [
            {
                url: faker.random.arrayElement(ValidUrls),
                output: {
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
            },
        ],
    },
    // Output missing
    {
        GET: [
            {
                url: faker.random.arrayElement(ValidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
            },
        ],
    },
    // Falsy output
    {
        GET: {
            url: faker.random.arrayElement(ValidUrls),
            input: {
                semantics: {
                    headers: {
                        applicationContent: true,
                    },
                    query: {
                        sample: 15,
                    },
                },
            },
            output: null,
        },
    },
    // Non object output
    {
        GET: [
            {
                url: faker.random.arrayElement(ValidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
                output: "outputs",
            },
        ],
    },
    // Invalid Input
    {
        GET: {
            url: faker.random.arrayElement(ValidUrls),
            input: {
                semantics: {
                    headers: {
                        applicationContent: [true],
                    },
                    query: {
                        sample: 15,
                    },
                },
            },
            output: {
                NEGATIVE: [
                    { semantics: { status: 501 } },
                    {
                        semantics: {
                            status: 500,
                            headers: { application: "chrome" },
                        },
                    },
                ],
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
        },
    },
    // Invalid output
    {
        GET: {
            url: faker.random.arrayElement(ValidUrls),
            input: {
                semantics: {
                    headers: {
                        applicationContent: true,
                    },
                    query: {
                        sample: 15,
                    },
                },
            },
            output: {
                NEGATIVE: {
                    semantics: {
                        status: false,
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
        },
    },
    // Invalid output key
    {
        GET: [
            {
                url: faker.random.arrayElement(ValidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
                output: {
                    DESTRUCTIVE: [
                        { semantics: { status: 501 } },
                        {
                            semantics: {
                                status: 500,
                                headers: { application: "chrome" },
                            },
                        },
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
            },
        ],
    },
    // Mixture of valid and invalid entries
    {
        POST: {
            url: faker.random.arrayElement(InvalidUrls),
            input: {
                semantics: {
                    headers: {
                        applicationContent: true,
                    },
                    query: {
                        sample: 15,
                    },
                },
                body: {
                    name: "resource:name",
                    age: "resource:age",
                },
            },
            output: {
                DESTRUCTIVE: [
                    { semantics: { status: 501 } },
                    {
                        semantics: {
                            status: 500,
                            headers: { application: "chrome" },
                        },
                    },
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
        },

        GET: [
            {
                url: faker.random.arrayElement(InvalidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
                output: {
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
            },
        ],
    },
    {
        PATCH: [
            {
                url: faker.random.arrayElement(InvalidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                    body: {
                        name: "resource:name",
                        age: "resource:age",
                    },
                },
                output: {
                    DESTRUCTIVE: [
                        { semantics: { status: 501 } },
                        {
                            semantics: {
                                status: 500,
                                headers: { application: "chrome" },
                            },
                        },
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
            },
        ],
        DELETE: [
            {
                url: faker.random.arrayElement(ValidUrls),
                input: {
                    semantics: {
                        headers: {
                            applicationContent: true,
                        },
                        query: {
                            sample: 15,
                        },
                    },
                },
                output: {
                    NEGATIVE: [
                        {
                            semantics: {
                                status: 404,
                            },
                        },
                        {
                            semantics: {
                                status: 400,
                            },
                        },
                        {
                            semantics: {
                                status: 409,
                            },
                        },
                        {
                            semantics: {
                                status: 200,
                            },
                        },
                        {
                            semantics: {
                                status: 500,
                            },
                        },
                        {
                            semantics: {
                                status: 201,
                            },
                        },
                        {
                            semantics: {
                                status: null,
                            },
                        },
                        {
                            semantics: {
                                status: 501,
                            },
                        },
                    ],
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
            },
        ],
    },
];

describe("Invalid descriptions", () => {
    InvalidDescriptions.forEach((desc, index) => {
        test(`Invalid entry: ${index}`, () =>
            expect(isDescription(desc)).toBe(false));
    });
});
