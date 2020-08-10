import { ResourceInstance } from "../../resource/types/helper";
import faker from "faker";
export type Collection = Map<ResourceInstance["id"], ResourceInstance>;

// Getting an existing resource
export function getRandomExistingResource(
    collection: Collection
): ResourceInstance {
    if (!collection.size)
        throw new Error(
            `Collection is empty. Cannot get any existing resource from it.`
        );

    const randomKey = faker.random.arrayElement(Array.from(collection.keys()));

    return collection.get(randomKey)!;
}
