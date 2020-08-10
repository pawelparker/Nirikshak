// Utility entities

import { WithModifiers } from "../../src/endpoints/types/helpers";


// Modifiers for WithModifiers HOT
export const ValidModifiers: Omit<WithModifiers<any>, "type">[] = [
    {},
    {
        nullable: true,
    },

    {
        nullable: true,
        plural: true,
    },
    {
        nullable: true,
        plural: true,
        optional: true,
    },
    {
        nullable: true,
        plural: true,
        optional: false,
    },
    {
        nullable: true,
        plural: false,
    },
    {
        nullable: true,
        plural: false,
        optional: true,
    },
    {
        nullable: true,
        plural: false,
        optional: false,
    },
    {
        nullable: false,
    },
    {
        nullable: false,
        plural: true,
    },
    {
        nullable: false,
        plural: true,
        optional: true,
    },
    {
        nullable: false,
        plural: true,
        optional: false,
    },
    {
        nullable: false,
        plural: false,
    },
    {
        nullable: false,
        plural: false,
        optional: true,
    },
    {
        nullable: false,
        plural: false,
        optional: false,
    },
];

export const InvalidModifiers: { [key: string]: any } = [
    {
        nullable: 12,
    },

    {
        nullable: false,
        plural: [["Plurals"]],
    },
    {
        nullable: null,
        plural: true,
        optional: true,
    },
    {
        nullable: 4213312,
        plural: true,
        optional: undefined,
    },
    {
        nullable: [],
        plural: [[]],
    },
];
