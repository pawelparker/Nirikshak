# Installing Nirikshak

Nirikshak comes with a suite of peer dependencies. That is because we treat the components in our framework as plug and play. For example, we use jest to run the tests. But that is plugged in and can be replaced with mocha or jasmine or some other test runner in the future.

# Step 1: Installing jest with typescript

We prefer babel to run jest with typescript. You can alternatively use [ts-jest](https://github.com/kulshekhar/ts-jest).

```shell
npm i -D jest typescript babel-jest @babel/core @babel/preset-env @babel/preset-typescript
```

After that, we need to set babel to parse typescript. For that, add a babel configuration file. That file is usually under the name `babel.config.js`.

```js
// babel.config.js
module.exports = {
    presets: [
        ["@babel/preset-env", { targets: { node: "current" } }],
        "@babel/preset-typescript",
    ],
};
```

# Step 2: Installing other peer dependencies

Other than jest, we have 3 peer dependencies:

1. [faker](https://github.com/marak/Faker.js/) : The library to produce mock data for testing.
2. [supertest](https://github.com/visionmedia/supertest) : The library to make HTTP assertions
3. [get-port](https://github.com/sindresorhus/get-port#readme) : A simple package to get an available port randomly

```shell
npm i -D faker supertest get-port
```

You will also need typings for supertest. You can run tests without them if you use babel jest. But for better typescript support, we suggest that you add the typings

```shell
npm i -D @types/supertest
```

# Step 3: Installing Nirikshak packages

We ship 3 packages. They can be installed using below command

```shell
npm i -D @nirikshak/core @nirikshak/reporter @nirikshak/cli
```

That is it. Now we are ready to get started.
