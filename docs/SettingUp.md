# Preparing your project

This section covers the steps that you need to take before getting started with Nirikshak.

## Decouple server logic from startup

You need to keep the definition of your API server and the code for starting up your server in separate files. For example,

```javascript
// index.ts
import express from "express";
const app = express();
// ...

// Starting up the server
app.listen(3000);
```

Should be split into:

```typescript
// app.ts
import express from "express";
const app = express();
// ...
export default app;
```

```typescript
// index.ts
import app from "./app";
app.listen(3000);
```

## What if my API is not written in typescript?

You will need to install typescript to run our tests. But you don't need to convert your code to typescript. We are mainly concerned with the server implementation. You can make your own type definitions for that. Split your code as shown above. Afterwards, add a declaration file

```typescript
// app.d.ts
import { Express } from "express";
declare const app: Express;

export default app;
```

Place this file next to your server implementation. So directory structure is something like:

1. `app.js`
2. `app.d.ts`
3. `index.ts`

**_Note_**: Make sure that the server implementation is the default export of the module. If you use commonjs, use `allowSyntheticDefaultImports` and `esModuleInterop` options for typescript compiler.
