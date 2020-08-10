import {
    NodeName,
    ParsedNode,
    serializeNodeName,
    parseNodeName,
} from "../../../src/endpoints/graph/nodeTypes";
import { MethodType, Cases } from "../../../src";
import faker from "faker";
import { RANDOMNESS_ITERATIONS } from "../../../src/common/Env";

const method: MethodType[] = ["DELETE", "GET", "PATCH", "POST", "PUT"];
const cases: Cases[] = ["DESTRUCTIVE", "NEGATIVE", "POSITIVE"];

describe(`Node name parsing and serializing`, () => {
    for (let i = 1; i <= RANDOMNESS_ITERATIONS; i++) {
        test(`Serialize node name`, () => {
            faker.seed(123 * i);
            const methodName = faker.random.arrayElement(method);
            const methodIndex = faker.random.number({
                min: 0,
                max: 10,
                precision: 1,
            });
            const url = `${faker.random.word()}/${faker.random.word()}/${faker.random.word()}/{resource:id}`;
            const caseValue = faker.random.arrayElement(cases);

            const o: ParsedNode = {
                caseValue,
                method: methodName,
                url,
                methodIndex,
            };
            faker.seed(123 * i);
            expect(
                serializeNodeName(o.method, o.methodIndex, o.url, o.caseValue)
            ).toBe(
                `${faker.random.arrayElement(method)};;${faker.random.number({
                    min: 0,
                    max: 10,
                    precision: 1,
                })};;${`${faker.random.word()}/${faker.random.word()}/${faker.random.word()}/{resource:id}`};;${faker.random.arrayElement(
                    cases
                )}`
            );
        });

        test(`Parse node name`, () => {
            faker.seed(123 * i);

            const nodeName: NodeName = `${faker.random.arrayElement(
                method
            )};;${faker.random.number({
                min: 0,
                max: 10,
                precision: 1,
            })};;${`${faker.random.word()}/${faker.random.word()}/${faker.random.word()}/{resource:id}`};;${faker.random.arrayElement(
                cases
            )};;${faker.random.number({
                min: 0,
                max: 10,
                precision: 1,
            })}`;

            faker.seed(123 * i);
            const methodName = faker.random.arrayElement(method);
            const methodIndex = faker.random.number({
                min: 0,
                max: 10,
                precision: 1,
            });
            const url = `${faker.random.word()}/${faker.random.word()}/${faker.random.word()}/{resource:id}`;
            const caseValue = faker.random.arrayElement(cases);

            const o: ParsedNode = {
                caseValue,
                method: methodName,
                url,
                methodIndex,
            };
            expect(parseNodeName(nodeName)).toEqual(o);
        });

        test(`Parse and serialize: Identity - ${i}`, () => {
            const nodeName: NodeName = `${faker.random.arrayElement(
                method
            )};;${faker.random.number({
                min: 0,
                max: 10,
                precision: 1,
            })};;${`${faker.random.word()}/${faker.random.word()}/${faker.random.word()}/{resource:id}`};;${faker.random.arrayElement(
                cases
            )}`;

            const o = parseNodeName(nodeName);
            const s = serializeNodeName(
                o.method,
                o.methodIndex,
                o.url,
                o.caseValue
            );
            expect(s).toBe(nodeName);
        });
    }
});
