/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-namespace */
import { toMatchStatus } from "./statusMatchers";
import { toMatchHeaders } from "./headerMatchers";
import { toMatchBody } from "./bodyMatchers";

expect.extend({
    toMatchStatus,
    toMatchHeaders,
    toMatchBody,
});

declare global {
    namespace jest {
        interface Matchers<R> {
            toMatchStatus(expected: number[]): R;
            toMatchHeaders(expected: boolean): R;
            toMatchBody(expected: boolean): R;
        }
    }
}
