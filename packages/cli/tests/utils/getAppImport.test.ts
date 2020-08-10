import path from "path";
import { getAppImport } from "../../src/utils/getAppImport";
const p1 = path.resolve(__dirname, "app.ts");
const p2 = path.resolve(__dirname, "app.js");
const p3 = path.resolve(__dirname, "app");

test(`Getting import path for app`, () => {
    expect(getAppImport(p1)).toEqual(p3);
    expect(getAppImport(p2)).toEqual(p3);
    expect(getAppImport(p3)).toEqual(p3);
});
