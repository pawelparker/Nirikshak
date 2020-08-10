import { MethodType, Cases } from "../../../src";
import { NodeName, isNodeName } from "../../../src/endpoints/graph/nodeTypes";
import faker from "faker";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";
const method: MethodType[] = ["DELETE", "GET", "PATCH", "POST", "PUT"];
const cases: Cases[] = ["DESTRUCTIVE", "NEGATIVE", "POSITIVE"];

function generateRandomNode(): NodeName {
    return `${faker.random.arrayElement(method)};;${faker.random.number({
        min: 0,
        max: 10,
        precision: 1,
    })};;${`${faker.random.word()}/${faker.random.word()}/${faker.random.word()}/{resource:id}`};;${faker.random.arrayElement(
        cases
    )}`;
}

const InvalidUrlStrings: any[] = [
    false,
    faker.lorem.lines(1),
    `${faker.random.word()};;${faker.random.word()};;${faker.random.word()};;${faker.random.word()}`,
    `${faker.random.arrayElement(
        method
    )};;${faker.random.word()};;${faker.random.word()};;${faker.random.word()}`,
    `${faker.random.arrayElement(method)};;${faker.random.number({
        min: 0,
        max: 10,
        precision: 1,
    })};;${faker.random.word()};;${faker.random.word()}`,
    `${faker.random.arrayElement(method)};;${faker.random.number({
        min: 0,
        max: 10,
        precision: 1,
    })};;${
        faker.random.word() + "/" + faker.random.word()
    };;${faker.random.word()}`,
    `${faker.random.arrayElement(method)};;${faker.random.number({
        min: 0,
        max: 10,
        precision: 1,
    })};;${
        faker.random.word() + "/" + faker.random.word()
    };;${faker.random.arrayElement(cases)};;${faker.random.word()}`,
];

describe(`Node name type validation`, () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++) {
        test(`Node name: ${i}`, () =>
            expect(isNodeName(generateRandomNode())).toBe(true));

        test.each(InvalidUrlStrings)(
            `Invalid node name: %#, iteration: ${i}`,
            (entry) => expect(isNodeName(entry)).toBe(false)
        );
    }
});
