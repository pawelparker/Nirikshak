import figlet from "../../src/utils/figletWrapper";
describe("Figlet wraper", () => {
    test(`Valid input`, async () => {
        const result = await figlet("Lorem Ipsum");
        expect(result).toMatchSnapshot();
    });

    test(`Invalid input`, async () => {
        expect.hasAssertions();
        try {
            const out = await figlet("Lorem ipsum", {
                font: "Purpose" as any,
            });
            out;
        } catch (e) {
            expect(e).toMatchSnapshot();
        }
    });
});
