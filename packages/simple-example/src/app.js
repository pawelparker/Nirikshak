import express from "express";

const app = express();
import get from "./get";
import deleteRouter from "./delete";
import post from "./post";
import patch from "./patch";
import put from "./put";

app.use(get);
app.use(deleteRouter);
app.use(post);
app.use(patch);
app.use(put);

export default app;
