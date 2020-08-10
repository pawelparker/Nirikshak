import {
    getResourceDirEntry,
    getResourceName,
} from "../../src/utils/resourceData";

test(`Simple entry`, () => {
    const entry = "student";
    expect(getResourceDirEntry(entry)).toEqual(entry);
    expect(getResourceName(entry)).toEqual(entry);
});

test(`Complex entry`, () => {
    const entry = {
        name: "Lorem",
        dir: "Ipsum/sit/amet",
    };
    expect(getResourceDirEntry(entry)).toEqual(entry.dir);
    expect(getResourceName(entry)).toEqual(entry.name);
});
