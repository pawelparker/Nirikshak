import faker from "faker";
import { ResourceInstance } from "../../../../src/resource/types/helper";
import { ResourceString } from "../../../../src/endpoints/types/resourceString";
import { matchResourceString } from "../../../../src/endpoints/traversal/bodyValidation";

const ValidResource: ResourceInstance = {
  created: true,
  id: faker.random.uuid(),
  args: [1, 2, 3, [false], true, "strstr", null],
  addresses: [{ zipCode: "370432" }, { zipCode: "232344" }],
  fallacies: faker.random.word(),
  places: {
    to: {
      be: {
        miles: {
          to: {
            go: {
              before: 23,
            },
          },
        },
      },
    },
  },
};

const Entries: {
  input: any;
  resourceString: ResourceString;
  output: boolean;
}[] = [
  {
    input: true,
    resourceString: "resource:created",
    output: true,
  },
  {
    input: false,
    resourceString: "resource:args[3][0]",
    output: true,
  },
  {
    input: [{ zipCode: "370432" }, { zipCode: "232344" }],
    resourceString: "resource:addresses",
    output: true,
  },
  {
    input: ValidResource.id,
    resourceString: "resource:id",
    output: true,
  },
  {
    input: 23,
    resourceString: "resource:places.to.be.miles.to.go.before",
    output: true,
  },
  {
    input: {
      to: {
        go: {
          before: 23,
        },
      },
    },
    resourceString: "resrouce:places.to.be.miles",
    output: true,
  },
  {
    input: false,
    resourceString: "resource:created",
    output: false,
  },
  {
    input: {
      go: {
        before: 23,
      },
    },
    resourceString: "resrouce:places.to.be.miles",
    output: false,
  },
  {
    input: faker.random.uuid(),
    resourceString: "resource:id",
    output: false,
  },
];

const InvalidEntry = {
  input: null,
  resourceString: "resource:addresses[7][0]",
};
describe(`Resource strings match`, () => {
  test.each(Entries)(`Matching resource string: %#`, (entry) =>
    expect(
      matchResourceString(entry.input, entry.resourceString, ValidResource)
    ).toBe(entry.output)
  );

  test(`Invalid resource match`, () =>
    expect(() =>
      matchResourceString(
        InvalidEntry.input,
        InvalidEntry.resourceString,
        ValidResource
      )
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid resource instance path: addresses[7][0]"`
    ));
});
