import SuperTest from "supertest";
import {
    SchemaHelpers,
    TraversalHelpers,
    Collection,
    Resource,
    generateResource,
} from "@nirikshak/core";
import Config from "./config.json";
export const schemaHelpers: SchemaHelpers = {};

export const traversalHelpers: TraversalHelpers = {};

export async function setup(
    server: SuperTest.SuperTest<SuperTest.Test>,
    collection: Collection,
    resourceJSON: Resource,
    done: (err?: any) => void
): Promise<void> {
    try {
        for (let i = 0; i < Config.setupInstances; i++) {
            const resource = await generateResource(resourceJSON, schemaHelpers);
            // Add resource to application here
            collection.set(resource.id, resource);
        }
    } catch (e) {
        done(e);
        return;
    }
    done();
}

export async function cleanup(collection: Collection, done: () => void): Promise<void> {
    // Remove resource from application here
    done();
}

