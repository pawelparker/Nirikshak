import {
    WithModifiers,
    BodyType,
    Base,
    isWithModifiersBase,
    BodyInstance,
} from "../../types/helpers";
import { ResourceInstance } from "../../../resource/types/helper";
import { SchemaHelpers, Primitives } from "../../../common/types/helpers";
import faker from "faker";
import { MIN_PLURAL_ENTRIES, MAX_PLURAL_ENTRIES } from "../../../common/Env";
import { generateBase } from "./baseGen";
import { generateBodyType } from "./bodyTypeGen";

export async function generateWithModifiersBase(
    input: WithModifiers<Base>,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<Primitives> {
    if (input.nullable && faker.random.boolean()) return null;

    if (input.plural) {
        const arr: Promise<Primitives>[] = [];

        const length = faker.random.number({
            min: MIN_PLURAL_ENTRIES,
            max: MAX_PLURAL_ENTRIES,
            precision: 1,
        });

        for (let i = 0; i < length; i++)
            arr.push(generateBase(input.type, resource, helpers));

        return Promise.all(arr);
    }

    return generateBase(input.type, resource, helpers);
}

export async function generateWithModifiersBodyType(
    input: WithModifiers<BodyType>,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<BodyInstance | BodyInstance[] | null> {
    if (input.nullable && faker.random.boolean()) return null;

    if (input.plural) {
        const arr: Promise<BodyInstance>[] = [];

        const length = faker.random.number({
            min: MIN_PLURAL_ENTRIES,
            max: MAX_PLURAL_ENTRIES,
            precision: 1,
        });

        for (let i = 0; i < length; i++)
            arr.push(generateBodyType(input.field, resource, helpers));

        return Promise.all(arr);
    }

    return generateBodyType(input.field, resource, helpers);
}

export async function generateWithModifiers<T extends BodyType | Base>(
    input: WithModifiers<T>,
    resource: ResourceInstance,
    helpers: SchemaHelpers
): Promise<
    null | (T extends Base ? Primitives : BodyInstance[] | BodyInstance)
> {
    if (isWithModifiersBase(input))
        return generateWithModifiersBase(input, resource, helpers) as any;
    return generateWithModifiersBodyType(
        input as WithModifiers<BodyType>,
        resource,
        helpers
    ) as any;
}
