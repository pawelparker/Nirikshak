import faker from "faker";
import SuperTest from "supertest";
import {
    SchemaHelpers,
    TraversalHelpers,
    Collection,
    Resource,
    generateResource,
    ResourceInstance,
} from "@nirikshak/core";
import Config from "./config.json";
import { isValidStudent } from "../../src/student";
export const schemaHelpers: SchemaHelpers = {
    async grade() {
        return faker.random.arrayElement(["A", "B", "C"]);
    },
};

export const traversalHelpers: TraversalHelpers = {
    patchMatcher: async (input: any, resourceInstance: ResourceInstance) => {
        if (!isValidStudent(input)) return false;

        for (const key in input) resourceInstance[key] = input[key];
        return true;
    },
};

export async function setup(
    server: SuperTest.SuperTest<SuperTest.Test>,
    collection: Collection,
    resourceJSON: Resource,
    done: (err?: any) => void
): Promise<void> {
    try {
        for (let i = 0; i < Config.setupInstances; i++) {
            const student = await generateResource(resourceJSON, schemaHelpers);
            await server.post("/Student").send(student);
            collection.set(student.id, student);
        }
    } catch (e) {
        done(e);
        return;
    }
    done();
}

export async function cleanup(
    collection: Collection,
    done: () => void
): Promise<void> {
    done();
}
