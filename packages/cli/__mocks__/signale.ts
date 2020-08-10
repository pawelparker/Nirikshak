const signale: any = jest.genMockFromModule("signale");
signale.info = jest.fn();
signale.error = jest.fn();
signale.success = jest.fn();
export default signale;
